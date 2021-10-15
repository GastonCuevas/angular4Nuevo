import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';

import { ToastyMessageService, UtilityService, CommonService, LoadingGlobalService } from '../../+core/services';
import { IntelligentReportComponent, GenericControl, InputAutoComplete } from '../../+shared/';

import * as moment from 'moment';
import { MaterializeAction } from 'angular2-materialize';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PharmacyService } from '../pharmacy.service';
import { PharmacyPatient, PharmacyScheme, PharmacySchemeDetail, PharmacyDelivery } from '../util/models';
import { PharmacyPatientsComponent } from '../pharmacy-patients/pharmacy-patients.component';
import { IColumn } from '../../+shared/util';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-pharmacy-list',
    templateUrl: './pharmacy-list.component.html',
    styleUrls: ['./pharmacy-list.component.scss']
})
export class PharmacyListComponent implements OnInit {

    @ViewChild(PharmacyPatientsComponent) pharmacyPatientsComponent: PharmacyPatientsComponent;
    @ViewChild('iReport') iReport: IntelligentReportComponent;
    @ViewChild('articlesIAC') articlesIAC: InputAutoComplete;

    isActive = true;
    enableStock = true;
    isOpenModal = false;
    isSaving = false;
    reloadingSummary: boolean;
    reloadingDataSource = false;
    reloadingArtclesReturned = false;
    loadingArticles = false;
    state: number;
    isSummaryActive = false;
    // days: number
    isDev = false;
    isSos = false;
    patientSelected = new PharmacyPatient();
    // pharmacyPatients = new Array<PharmacyPatient>();
    pharmacySchemeSelected = new PharmacyScheme();
    pharmacySchemeDetails = new Array<PharmacySchemeDetail>();
    articles: Array<PharmacySchemeDetail>;
    allArticles = new Array<any>();
    selectedDate: string;

    modal: number;
    pharmacySchemeDetail = new PharmacySchemeDetail();
    form: FormGroup;
    // modalDiscardSubject: Subject<any> = new Subject();
    modalActions = new EventEmitter<string | MaterializeAction>();


    columns: Array<IColumn> = [
        { header: 'Codigo', property: 'articleCode', disableSorting: true },
        { header: 'Descripcion', property: 'articleName', disableSorting: true },
        { header: 'Cantidad', property: 'quantity', width: '120px', disableSorting: true }
    ];
    constructor(
        private fb: FormBuilder,
        private loadingGlobalService: LoadingGlobalService,
        private commonService: CommonService,
        private utilityService: UtilityService,
        private toastyMessageService: ToastyMessageService,
        public pharmacyService: PharmacyService
    ) { }

    ngOnInit() {
        this.pharmacyService.resetService();
        this.state = 1;
    }

    private isValid() { return !!this.pharmacyService.pharmacyPatientList.length && this.pharmacyService.days > 0; }

    hasItems() { 
        return this.pharmacyService.pharmacySchemes.some(x => x.schemeDetail.length > 0);
     }

    // isPatientSelected() { return !!this.patientSelected.patMovId && this.state == 1; }

    onChangeOfSelection() { this.isValid(); }

    getPharmacySchemes() {
        if(this.state == 2) {
            this.state--;
            this.reset();
            return;
        }
        this.loadingGlobalService.showLoading('Cargando Datos...');
        this.pharmacyService.getSchemes()
            .subscribe(
                response => {
                    this.pharmacyService.pharmacySchemes = response.model;
                    this.initPharmacySummaryTable();
                    this.pharmacySchemeDetails = [];
                    this.state++;
                },
                error => {
                    this.toastyMessageService.showToastyError(error, 'Ocurrio un error al consultar los esquemas');
                    this.loadingGlobalService.hideLoading();
                });
    }

    formSosDev(type: string) {
        this.loadingGlobalService.showLoading('Cargando Datos...');
        this.pharmacyService.getSchemes()
            .subscribe(
                response => {
                    this.pharmacyService.pharmacySchemes = response.model;
                    this.pharmacyService.pharmacySchemes.forEach(x  => x.schemeDetail = []);
                    this.initPharmacySummaryTable();
                    this.pharmacySchemeDetails = [];
                    this.state++;
                    this.isSos = type === 'sos';
                    this.isDev = type !== 'sos';
                },
                error => {
                    this.toastyMessageService.showToastyError(error, 'Ocurrio un error al consultar los esquemas');
                    this.loadingGlobalService.hideLoading();
                });
    }

    sendPharmacyRecords() {
        this.loadingGlobalService.showLoading('Guardando Datos...');
        let pharmacyDelivery = new PharmacyDelivery();
        pharmacyDelivery.checkedDate = moment().format('YYYY-MM-DD');
        pharmacyDelivery.date = this.selectedDate ? this.utilityService.formatDateBE(this.selectedDate,'DD/MM/YYYY') : pharmacyDelivery.checkedDate;
        pharmacyDelivery.days = this.pharmacyService.days;
        this.pharmacyService.pharmacySchemes.forEach(x => {
            x.medicines = x.schemeDetail;
            x.hcId = x.evolutionId;
        });
        pharmacyDelivery.pharmacySchemes = this.pharmacyService.pharmacySchemes;
        pharmacyDelivery.type = this.isDev ? 'Devolucion' : this.isSos ? 'SOS' : 'Farmacia';
        pharmacyDelivery.enableStock = this.enableStock;
        this.pharmacyService.sendPharmacyRecords(pharmacyDelivery).finally(() => this.loadingGlobalService.hideLoading())
            .subscribe(
                response => {
                    this.closeModal();
                    this.toastyMessageService.showSuccessMessagge('Se registro correctamente la entrega');
                    this.reset();
                    this.printReport(response.model);
                },
                error => { this.toastyMessageService.showToastyError(error, 'Ocurrio un error al consultar los esquemas'); }
            );
    }

    printReport(model: PharmacyDelivery) {
        model.printDate = moment(new Date()).format('L HH:mm');
        model.dateFrom = moment(model.date).add(1, 'days').format('DD/MM/YYYY');
        model.dateTo = moment(model.date).add(model.days, 'days').format('DD/MM/YYYY');
        model.checkedDate = this.utilityService.formatDateFE(model.checkedDate);
        model.date = this.utilityService.formatDateFE(model.date);
        let id = 7000;
        switch (model.type?model.type.toLowerCase():'') {
            case 'sos': 
                id = 7002;
                break;
            case 'farmacia':
                id = 7000;
                break;
            case 'devolucion':
                id = 7004
            break;
        }
        this.iReport.generateReportWithData(model, id, true);
    }

    initPharmacySummaryTable() {
        this.pharmacyService.getPharmacySummary()
            .finally(() => {
                this.isActive = false;
                this.loadingGlobalService.hideLoading();
            }).subscribe(
                response => {
                    this.pharmacyService.pharmacySummary = response.model;
                },
                error => {
                    this.toastyMessageService.showToastyError(error, 'Ocurrio un error al cargar la sumatoria');
                });
    }

    // onChangeDays(days: number) { this.days = days; }
    onChangeDate(date: any) { this.selectedDate = date || this.utilityService.getNow(); }
    onReloadingSummary(isReloading: boolean) { this.reloadingSummary = isReloading }


    /** buttom */
    getTextBtnSubmit() { return this.isActive ? 'Continuar' : 'Volver'; }

    reset() {
        this.isActive = true;
        this.pharmacyService.days = 1;
        this.state = 1;
        this.patientSelected = new PharmacyPatient();
        this.pharmacyService.resetService();
        this.onChangeOfSelection();
        this.isDev = false;
        this.isSos = false;
        // this.reloadingDataSource = true;
    }

    /** pharmacy-schemes */
    selectedChange(item: PharmacyScheme) {
        this.pharmacySchemeSelected = item;
        this.pharmacySchemeDetails = item.schemeDetail;
    }

    /** Modal Devoluciones */
    // selectedPatientChange(item: PharmacyPatient) {
    //     this.patientSelected = item;
    // }
    private addArticle(p: PharmacySchemeDetail) {
        this.validatePush(this.pharmacySchemeSelected.schemeDetail, p);
    }
    private validatePush(list: Array<PharmacySchemeDetail>, p: PharmacySchemeDetail) {
        const index = list.findIndex(x => x.articleCode == p.articleCode);
        if (index === -1) list.push(JSON.parse(JSON.stringify(p)));
        else list[index].quantity = p.quantity;
    }
    processModal() {
        //2 -> SOS 3 -> DEVOLUCION
        this.pharmacyService.articlesTemp.forEach(p => {
            p.depos = 1;
            p.type = p.quantity > 0 ? 2 : 3;
            this.addArticle(p);
        });
        this.pharmacySchemeDetails = this.pharmacySchemeSelected.schemeDetail;
        this.loadingGlobalService.hideLoading();
        this.closeModal();
    }

    openModal() {
        this.isOpenModal = true;
        this.createForm();
        this.loadArticles();
        this.modalActions.emit({ action: 'modal', params: ['open'] });
    }

    private loadArticles() {
        this.loadingArticles = true;
        this.pharmacyService.getAllArticles()
        .finally(() => this.loadingArticles = false)
        .subscribe(response => { this.articles = response.model; },
        error => { this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : 'Error al cargar el combo de articulos'); });
    };

    private createForm() {
        this.form = this.fb.group({
            id: [this.pharmacySchemeDetail.id = 0],
            articleCode: [this.pharmacySchemeDetail.articleCode, Validators.required],
            quantity: [this.pharmacySchemeDetail.quantity = 1],
        });
    };

    loadArticleDev() {
        this.formatQuantity();
        const psd = this.pharmacySchemeSelected.schemeDetail;
        const detail = psd && psd.find(x => x.articleCode == this.pharmacySchemeDetail.articleCode);
        Object.assign(this.pharmacySchemeDetail, { id: detail ? detail.id : 0, hcSchemeId: this.pharmacySchemeSelected.id, quantity: this.form.value.quantity, date: moment().format(), type: this.form.value.quantity > 0 ? 2 : 3 });
        this.pharmacyService.updateArticleTemp(this.pharmacySchemeDetail);
        this.articlesIAC.clearInput();
    }

    formatQuantity() {
        if (this.isDev) this.form.value.quantity = (Math.abs(this.form.value.quantity) * -1) || -1;
        if (this.isSos) this.form.value.quantity = Math.abs(this.form.value.quantity) || 1;
    }

    closeModal() {
        this.pharmacyService.articlesTemp = new Array<PharmacySchemeDetail>();
        this.modalActions.emit({ action: 'modal', params: ['close'] });
        this.isOpenModal = false;
    }

    onChangeIAC(event: any) {
        if (!event.id && !event.name) return;
        this.pharmacySchemeDetail.articleCode = event.id;
        this.pharmacySchemeDetail.articleName = event.name;
    }

    onActionClick(event: any) {
        switch (event.action) {
            case 'delete':
                this.pharmacyService.deleteArticleTemp(event.item);
                break;
            default:
                break;
        }
    }

    isDisabled() {
        return !this.pharmacyService.articlesTemp.length;
    }


    getTitleModal() {
        if (this.isSos) return `Devolucion de Medicamentos - ${this.pharmacySchemeSelected.patientName}`;
        if ( this.isDev) return `Entrega de Medicamentos S.O.S.- ${this.pharmacySchemeSelected.patientName}`;
        return '';
    }

    getTitleTableModal() {
        if (this.isDev) return 'Medicamentos para devolucion';
        if (this.isSos) return `Medicamentos S.O.S.`;
        return '';
    }



    // getValuePropertyName() {
    //     switch (this.modal) {
    //         case 1: return 'articleCode';
    //         case 2: return 'id';
    //         default: return 'id';
    //     }
    // }
}
