import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import 'rxjs/Rx';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { FilterType } from '../../+shared/util';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from '../../+core/services/utility.service';
import { CommonService } from '../../+core/services/common.service';
import { ValidationService } from './../../+shared/forms/validation.service';
import { ControlBase } from '../../+shared/forms';
import { IPaginator } from "../../interface/paginator.inteface";
import { TextboxControl, ControlDropdown } from '../../+shared/forms/controls';
import { IntellReportUserService } from '../intellReport-finalUser.service';
import { PatientService } from '../../+patient/patient.service';
import { NavBarService } from '../../+core/services/navbar.service';
import { EntryType } from '../../models/entryType.model';
import { ExportationEntry } from '../../models/exportationEntry.model';

@Component({
    selector: 'app-intell-report-final-user-form',
    templateUrl: './intell-report-final-user-form.component.html',
    styleUrls: ['./intell-report-final-user-form.component.scss'],
    providers: [IntellReportUserService]
})
export class IntellReportFinalUserFormComponent implements OnInit {
    public typeReports: Array<any>;
    public inputsData: Array<any>;
    public exportationDetails: Array<any>;
    public inputDataControls: Array<ControlBase<any>> = [];
    public inputDataControlsAux: Array<ControlBase<any>> = [];

    public loadForm: boolean = true;
    public option: any;
    public isFormLoading: boolean = true;
    public resultQuery: Array<any>;
    public resultQueryAux: Array<any>;
    public select: boolean = false;
    public isLoading: boolean = false;
    public viewReport: boolean = false;
    public isView: boolean = true;
    public dochtml: string;
    public entryTypes: Array<any> = [];
    public query: {} = 0;
    public stringFile: string = '';
    public sourceData: Array<any>;
    public queryPaginator: boolean = false;
    public exportDetail: boolean = true;
    public typeDownload: string;
    public separe: string;
    public subReportSelectValue: any = 0;

    private selectedReportNumber: any;
    public exportationDetailSelect: any;
    public showEetries: boolean = false;
    public enabledSubmitBtn: boolean = true;
    public showBtnToExport: boolean = true;
    public reportView: boolean = false;
    public isChecking: boolean = false;
    public details: any;
    public reportSelectValue: any = 0;
    public code: any;
    public exportationDetailNumber: string = "";
    public disabledCombo : boolean = false;
    public tableName : any;
    public sqlExport : any;

    columns: Array<any> = [];

    paginator = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 100
    }

    constructor(
        private fb: FormBuilder,
        public _intellReportUserService: IntellReportUserService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _utilityService: UtilityService,
        private commonService: CommonService,
        private _toastyService: ToastyMessageService,
        public navBarService: NavBarService
    ) { }

    ngOnInit() {
        this.reportSelectValue = 0;
        this.subReportSelectValue = 0;
        this.isFormLoading = false;
        this.getEntryTypes();
        this.code = this._route.snapshot.paramMap.get('code');
        this.tableName = this._route.snapshot.paramMap.get('tableName');
        if (this.code) {
            this.loadCombos();
        } else {
            this.loadTypesReport();
            this.disabledCombo = false;
        }
    }

    loadCombos() {
        this._intellReportUserService.getAllTypesReport().subscribe(
            response => {
                this.typeReports = response.model;
                this._intellReportUserService.getByIdExportationDetail(this.code).subscribe(response => {
                    this.details = response.model;
                    if (this.details != null) {
                        this.disabledCombo = true;
                        this.reportSelectValue = this.details.expedientNumber;
                        this.onChangeReports(this.reportSelectValue);
                        this.subReportSelectValue = this.details.number;
                        this.onChangeSubReports(this.subReportSelectValue);
                    }
                })
            },
            error => {
                console.log(<any>error);
                this._toastyService.showErrorMessagge("Ocurrio un error al cargar el combo");
            });

    }

    loadTypesReport() {
        this._intellReportUserService.getAllTypesReport().subscribe(
            response => {
                this.typeReports = response.model;
            },
            error => {
                console.log(<any>error);
                this._toastyService.showErrorMessagge("Ocurrio un error al cargar el combo");
            });
    }

    getEntryTypes() {
        this._intellReportUserService.getEntryTypes().subscribe(
            response => {
                this.entryTypes = response;
            },
            error => {
                console.log(<any>error);
            })
    }

    onChangeReports(selectedCategory: any) {
        this.subReportSelectValue = 0;
        this.selectedReportNumber = selectedCategory;
        this.select = false;

        for (let i in this.typeReports) {
            if (this.typeReports[i].number == selectedCategory) {
                this.exportationDetails = this.typeReports[i].exportationDetails;
            }
        }
        if (this.exportationDetails && this.exportationDetails.length > 0) {
            this.loadForm = false;
        } else {
            this.loadForm = true;
            this._toastyService.showMessageToast('', 'No hay subreportes que mostrar. Eliga otra opción.', 'warning');
        }
    }

    onChangeSubReports(selected: any) {
        this.select = false;
        this.option = selected;
        this.exportationDetailSelect = this.exportationDetails.find(d => d.number == +this.option);
        this.dochtml = this.exportationDetailSelect.docHtml;
        this.typeDownload = this.exportationDetailSelect.type;
        this.separe = this.exportationDetailSelect.separa;

        if (this.exportationDetails) {
            this._intellReportUserService.getInputData(this.selectedReportNumber).subscribe(
                response => {
                    this.inputsData = response.model;
                    this.updateInputDataForm(this.inputsData);
                    this.select = true;
                    this.showEetries = true;
                },
                error => {
                    console.log(<any>error);
                });
        }
    }

    createInputDataForm(inputs: Array<any>) {
        this.inputDataControlsAux = [];
        for (let i = 0; inputs.length > i; i++) {
            this.addControl(inputs[i], i);
        }
        this.inputDataControls = this.inputDataControlsAux;
     }

    updateInputDataForm(inputs: Array<any>) {
        this.inputDataControlsAux = [];
        for (let i = 0; inputs.length > i; i++) {
            if (this.exportationDetailSelect.sql) {
                if (this.exportationDetailSelect.sql.search('@' + inputs[i].key) != -1) {
                    this.addControl(inputs[i], i);
                }
            }
        }
        this.enabledSubmitBtn = true;
        if (!this.exportationDetailSelect.sql) this.enabledSubmitBtn = false;
        this.inputDataControls = this.inputDataControlsAux;
    }

    private setQuery(parameters: any) {
        this.sqlExport = this.tableName ? this.exportationDetailSelect.sql.replace("TABLAGENERICA", this.tableName) : this.exportationDetailSelect.sql;
        this.query = {
            sql: this.sqlExport,
            parameters: parameters,
        }
    }

    private addControl(input: ExportationEntry, order: number) {
        const type: EntryType = this.entryTypes.find(d => d.number === +input.type);
        if (type.name === 'autocomplete' || type.name === 'select') {
            const control = new ControlDropdown({
                key: input.key,
                label: input.name,
                order: order,
                type: type.name,
                class: 'col s6',
                required: true,
                source: this.commonService.getGenericCombo(input.tableFo)
                    // .map((res) => {
                    //     return res.model
                    // })
                    // .catch((error: any) => {
                    //     this._toastyService.showErrorMessagge('Error al cargar el combo para ' + input.name);
                    //     return Observable.throw('Error del Servidor');
                    // })
            });
            this.inputDataControlsAux.push(control);
        } else {
            const control = new TextboxControl({
                key: input.key,
                label: input.name,
                order: order,
                type: type.name,
                class: 'col s6',
                required: true
            });
            this.inputDataControlsAux.push(control);
        }
    }

    generateView(inpData: any) {
        this.isChecking = true;
        let parameters: Array<any> = [];

        for (let key in inpData) {
            parameters.push({ 'key': key, 'value': inpData[key] })
        }

        this.setQuery(parameters);

        if (this.dochtml) {
            this._intellReportUserService.getResultQuery(this.query).subscribe(
                response => {
                    this.resultQuery = response.model;
                    this.sourceData = response.model;
                    this.columns = [];
                    if (this.resultQuery && this.resultQuery.length != 0) {
                        const properties = Object.getOwnPropertyNames(response.model[0]);
                        for (var i = 0; properties.length > i; i++) {
                            let a = { header: properties[i], property: properties[i] }
                            this.columns.push(a);
                        }
                        this.showBtnToExport = true;
                    } else {
                        this._toastyService.showMessageToast('', 'No hay ningun resultado para mostrar', 'warning');
                        this.showBtnToExport = false;
                    }
                    this.isView = false;
                    this.reportView = true;
                    this.isLoading = true;
                    this.isChecking = false;
                },
                error => {
                    console.log(<any>error);
                    this._toastyService.showMessageToast('', 'Error al generar el reporte', 'error');
                    this.isChecking = false;
                });
        } else {
            this._intellReportUserService.getAll(this.paginator, null, this.query).subscribe(
                response => {
                    this.resultQuery = response.model;
                    this.sourceData = response.model;
                    this.paginator.totalItems = response.itemsCount;
                    this.paginator.currentPage = response.pageNumber;
                    this.paginator.pageSize = response.pageSize;
                    this.columns = [];

                    if (this.resultQuery && this.resultQuery.length != 0) {
                        const properties = Object.getOwnPropertyNames(response.model[0]);
                        for (var i = 0; properties.length > i; i++) {
                            let a = { header: properties[i], property: properties[i], elementFilter: new ElementFilter(FilterType.TEXT) }
                            this.columns.push(a);
                        }
                        this.queryPaginator = true;
                        this.showBtnToExport = true;
                    } else {
                        this._toastyService.showMessageToast('', 'No hay ningun resultado para mostrar', 'warning');
                        this.showBtnToExport = false;
                    }
                    this.isView = false;
                    this.reportView = true;
                    this.isLoading = true;
                    this.isChecking = false;
                },
                error => {
                    console.log(<any>error);
                    this._toastyService.showMessageToast('', 'Error al generar el reporte', 'error');
                    this.isChecking = false;
                });
        }
    }

    goBack() {
        this._utilityService.navigateToBack();
    }

    showListReports() {
        this.isView = true;
        this.isFormLoading = false;
        this.loadForm = true;
        this.select = false;
    }

}
