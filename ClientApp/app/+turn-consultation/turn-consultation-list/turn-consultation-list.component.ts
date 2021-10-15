import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

import { ToastyMessageService, UtilityService, CommonService, NavBarService } from '../../+core/services';
import { TurnConsultationService } from './../turn-consultation.service';

import { TurnModelForList } from '../../+turn-management/util';
import { GenericControl, IntelligentReportComponent } from '../../+shared';
import { IColumn, EventDynamicTable } from '../../+shared/util';
import { Subject } from 'rxjs';
import { DetailAssistedTurn } from '../../+turn-management/util/detail-assisted-turn.model';
import { Router } from '@angular/router';
import { PatientMovement } from '../../models/patient-movement.model';
import { TableExport } from 'tableexport';
import { ExportDataXLSX, ExportDataXLSX2 } from '../../+cube/util/util';

@Component({
    selector: 'app-turn-consultation-list',
    templateUrl: './turn-consultation-list.component.html',
    styleUrls: ['./turn-consultation-list.component.scss']
})
export class TurnConsultationListComponent implements OnInit {

    //
    codAut: string;
    coinsurancePay: number;
    //
    openModalUpdateStateSubject = new Subject<number>();
    openModalObservationSubject = new Subject<string>();
    modalActionsDetailTurn = new EventEmitter<string | MaterializeAction>();
    dataSource = new Array<TurnModelForList>();
    detailTurn = new DetailAssistedTurn();
    patientMovement = new PatientMovement();
    newTurnState = { id: 0, name: '', titleModal: '' };
    obs: string;
    controlsToFilter: Array<GenericControl> = [
        { key: 'specialty', label: 'Especialidad', type: 'autocomplete', class: 'col s12 m4', functionForData: this.commonService.getSpecialties(), searchProperty: 'specialtyNumber' },
        { key: 'professional', label: 'Profesional', type: 'name', class: 'col s12 m4', searchProperty: 'patMov.proContract.prof.professionalAccount.name' },
        { key: 'medicalInsurance', label: 'Obra Social', type: 'text', class: 'col s12 m4', searchProperty: 'patMov.miContract.os.medicalInsuranceAccount.name' },
        { key: 'patient', label: 'Paciente', type: 'name', class: 'col s12 m4', searchProperty: 'patMov.patient.patientAccount.name' },
        { key: 'practice', label: 'Práctica', type: 'text', class: 'col s12 m4', searchProperty: 'patMov.inosPractice.description' },
        { key: 'state', label: 'Estado', type: 'autocomplete', class: 'col s7 m4', searchProperty: 'turnState.number', functionForData: this.commonService.getAllTurnStates() },
        { key: 'dateFrom', label: 'Fecha Desde', type: 'date', class: 'col s5 m6', parameter: true },
        { key: 'dateTo', label: 'Fecha Hasta', type: 'date', class: 'col s5 m6', parameter: true }
    ];

    columns: Array<IColumn> = [
        { header: 'Fecha', property: 'date', type: 'date' },
        { header: 'Hora', property: 'time' },
        { header: 'Nº H.C.', property: 'clinicHistoryNumber', searchProperty: 'patMov.patient.patientAccount.clinicHistoryNumber' },
        { header: 'Paciente', property: 'pacient', searchProperty: 'patMov.patient.patientAccount.name' },
        { header: 'O.S.', property: 'medicalInsurance', searchProperty: 'patMov.MIContract.os.medicalInsuranceAccount.name' },
        { header: 'Profesional', property: 'professional', searchProperty: 'patMov.proContract.prof.professionalAccount.name'},
        { header: 'Especialidad', property: 'specialty', disableSorting: true },
        { header: 'Práctica', property: 'practice', searchProperty: 'patMov.inosPractice.description' },
        { header: "Estado", property: 'turnState', searchProperty: 'turnState.name' },
        { header: "Sobreturno", property: 'uponTurnText', disableSorting: true },
        {
            header: '', property: '', type: 'button',
            btns: [
                { label: 'Asistir', action: 'assist', color: '', propHide: 'disableBtnAssist' },
                { label: 'Suspender', action: 'suspend', color: 'red', tooltip: 'Suspender a pedido del Paciente' },
                { label: 'Anular', action: 'annul', color: 'orange', tooltip: 'Anular a pedido del Profesional' }
            ],
            propHideBtns: 'hideBtns', disableSorting: true, classes: 'center-align'
        }
    ];

    private item: any;
    private currentTurn: TurnModelForList;
    @ViewChild('iReport') iReport: IntelligentReportComponent;

    constructor(
        private toastyMessageService: ToastyMessageService,
        private utilityService: UtilityService,
        public commonService: CommonService,
        private navBarService: NavBarService,
        public turnConsultationService: TurnConsultationService,
        private router: Router
    ) {
        //
        this.codAut = "";
    }


    ngOnInit() {
        this.navBarService.getNavbars().subscribe(
            (res) => {
                this.item = this.navBarService.findItem(this.router.url, null);
            }
        );
    }

    onActionClick(event: EventDynamicTable) {
        switch (event.action) {
            case 'new':
                break;
            case 'edit':
                this.turnConsultationService.isDetail = false;
                this.utilityService.navigate(`/archivos/turnos-consulta/formulario/${event.item.numInt}`)
                break;
            case 'detail':
                this.turnConsultationService.isDetail = true;
                this.utilityService.navigate(`/archivos/turnos-consulta/formulario/${event.item.numInt}`)
                break;
            case 'delete':
                break;
            case 'assist':
                this.currentTurn = event.item;
                this.setNewTurnState(event.action);
                this.assistTurn();
                break;
            case 'suspend':
            case 'annul':
                this.currentTurn = event.item;
                this.setNewTurnState(event.action);
                this.openModalUpdateStateSubject.next();
                break;
            case 'obs':
                this.obs = event.item.observation;
                this.openModalObservationSubject.next();
                break;
            case 'print': 
                this.currentTurn = event.item;
                this.iReport.generateReport(this.currentTurn.numInt, 4000);
                break;
            default:
                break;
        }
    }

    printTurnConsultations() {
        if (this.item.config) {
            let turns = this.turnConsultationService.turnConsultations;
            this.iReport.generateReportWithData({ turns: turns }, this.item.config, true);
        }
    }

    private updateTurnState() {
        this.turnConsultationService.updateState(this.currentTurn.numInt, this.newTurnState.id).subscribe(
            response => {
                this.toastyMessageService.showSuccessMessagge('Se actualizo correctamente');
                this.currentTurn.hideBtns = true;
                this.currentTurn.turnState = this.newTurnState.name;
                this.currentTurn.action.edit = false;
            }, error => {
                this.toastyMessageService.showToastyError(error, `Ocurrió un error al ${this.newTurnState.titleModal} turno`);
            });
    }

    private setNewTurnState(action: string) {
        switch (action) {
            case 'annul': this.newTurnState = { id: 2, name: 'Anulado', titleModal: 'Anular' }; break;
            case 'assist': this.newTurnState = { id: 4, name: 'Asistido', titleModal: 'Asistir' }; break;
            case 'suspend': this.newTurnState = { id: 5, name: 'Suspendido', titleModal: 'Suspender' }; break;
        }
    }

    private assistTurn() {
        this.turnConsultationService.assistTurn(this.currentTurn.numInt).subscribe(
            response => {
                // this.toastyMessageService.showSuccessMessagge('Se actualizo correctamente');
                this.currentTurn.hideBtns = true;
                this.currentTurn.turnState = this.newTurnState.name;
                this.currentTurn.action.edit = false;
                this.detailTurn = response.model;
                const percentage = (this.detailTurn.price * this.detailTurn.medicalCoverage) / 100;
                this.detailTurn.total = Math.ceil(this.detailTurn.price - percentage + this.detailTurn.coinsurance);
                this.modalActionsDetailTurn.emit({ action: "modal", params: ['open'] });
                this.codAut = this.detailTurn.authorizationCode;
            }, error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrió un error al asistir turno.');
            });
    }

    closeModalDetailTurn() {
        const sendUpdate = !!this.codAut || !!this.detailTurn.coinsurance;
        if(!!this.codAut){ this.patientMovement.authorizationCode = this.codAut; }
        if(!!this.detailTurn.coinsurance){ this.patientMovement.coinsurancePaymented = this.detailTurn.coinsurance; }
        if(sendUpdate){
            this.turnConsultationService.updatePatienMov(this.currentTurn.numInt, this.patientMovement).subscribe(
                response => {
                    
                 }
                , error => {
                    this.toastyMessageService.showToastyError(error, 'Ocurrió un error al actualizar cod. de autorizacíon o Coseguro.');
            });
        }
        this.iReport.generateReport(this.currentTurn.numInt, 4000);
        this.modalActionsDetailTurn.emit({action:"modal",params:['close']});
    }
    updateTotal(event:any) {
        const newCoisurance = event || this.detailTurn.coinsurance;
        const percentage = (this.detailTurn.price * this.detailTurn.medicalCoverage) / 100;
        this.detailTurn.total = Math.ceil(this.detailTurn.price - percentage + newCoisurance);
    }
    onAceptObs(){
    }
    downloadReportXLSX() {
        // $('table.pvtTable:first').attr('id', 'pvtTableExport');
        let tableHTMLElement = <HTMLElement> document.getElementById('table');
        console.log(tableHTMLElement)
        let instance: any = new TableExport(tableHTMLElement, {
            formats: ['xlsx'],
            filename: 'Listado-de-turnos',
            exportButtons: false
        });
        //                                                               ["id" of selector]  [format]
        const exportData = (instance.getExportData() as ExportDataXLSX2)['table']['xlsx'];;
        instance.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);
    }
}
