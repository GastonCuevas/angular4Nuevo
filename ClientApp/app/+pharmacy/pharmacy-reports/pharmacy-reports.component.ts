import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { ToastyMessageService, UtilityService, CommonService } from '../../+core/services';
import { DynamicTableComponent, GenericControl, IntelligentReportComponent } from '../../+shared';

import { PharmacyService } from '../pharmacy.service';
import { IColumn } from '../../interface';
import { Observable } from 'rxjs';
import { PharmacyDelivery, PharmacyReport } from '../util/models';
import * as moment from 'moment';
import { IconCustom } from '../../+shared/util/icon-custom';
@Component({
    selector: 'app-pharmacy-reports',
    templateUrl: './pharmacy-reports.component.html',
    styleUrls: ['./pharmacy-reports.component.scss']
})
export class PharmacyReportsComponent implements OnInit {

    @ViewChild('iReport') iReport: IntelligentReportComponent;
    icons: Array<IconCustom> = [
        {key:'detail',icon:'fa fa-list-alt',tooltip:'Listado por esquemas'},
        {key:'print',icon:'fa fa-list',tooltip:'Listado de medicamentos'}
    ];
    columns: Array<IColumn> = [
        { header: 'Nro.', property: 'id', width: '80px' },
        { header: 'Fecha', property: 'date', width: '120px', type: 'date' },
        { header: 'Dias', property: 'days', disableSorting: true, width: '80px' },
        { header: 'Tipo', property: 'type', disableSorting: true, width: '120px' },
        { header: 'Usuario', property: 'username', disableSorting: true },
    ];
    controlsToFilter: Array<GenericControl> = [
        { key: 'patientName', label: 'Paciente', type: 'autocomplete', class: 'col s12 m8', functionForData: this.commonService.getPatients() , searchProperty: "HcScheme.HcEvolution.PatMov.Patient.AccountNumber"},
        { key: 'sectorId', label: 'Sector', type: 'autocomplete', class: 'col s12 m2', functionForData: this.commonService.getWardSectors(), searchProperty: "SectorId", parameter: true },
        { key: 'id', label: 'Nro Proceso', type: 'number',filterType: 'custom', class: 'col s12 m2', searchProperty: "PharmacyHistoryId" },
        { key: 'number', label: 'Medicación', type: 'autocomplete', class: 'col s12 m7', functionForData: this.commonService.getArticlesBis(), searchProperty: "ArticleCode"},
        { key: 'dateFrom', label: 'Fecha Desde', type: 'date', class: 'col s12 m2', searchProperty: "PharmacyHistory.Date" },
        { key: 'dateTo', label: 'Fecha Hasta', type: 'date', class: 'col s12 m2', searchProperty: "PharmacyHistory.Date" },
        { key: 'state', label: 'Tipo', type: 'select', class: 'col s12 m1', options: [{ number: 1, name: 'Farmacia' }, { number: 2, name: 'SOS' }, { number: 3, name: 'Devolucion' }], searchProperty: "DetailType.Number", value: 1 }
        // { key: 'medicalInsuranceNumber', label: 'Obra Social', type: 'autocomplete', class: 'col s12 m8', functionForData: this.commonService.getMedicalInsurances(), searchProperty: "PatMov.MIContract.MedicalInsuranceNumber"},
    ];
    constructor(
        private toastyMessageService: ToastyMessageService,
        private utilityService: UtilityService,
        private commonService: CommonService,
        public pharmacyService: PharmacyService,
    ) { }

    ngOnInit() { }
    onActionClick(event: any) {
		switch (event.action) {
            case 'detail':
                this.setModelForReport(event.item.id,true);
            break;
            case 'print':
                this.setModelForReport(event.item.id,false);
                break;
			default:
				break;
		}
    }
    
    setModelForReport(id: number, byScheme: boolean) {
        this.pharmacyService.getPharmacyReportById(id, byScheme)
        .subscribe(
            response => {
                this.printReport(response.model, byScheme);
            },
            error => {
                this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : `Ocurrio un error al obtener los datos para el reporte ${id}`);
            });
    }

    printReport(model: PharmacyReport, byScheme: boolean) {
        model.printDate = moment(new Date()).format('L HH:mm');
        model.dateFrom = moment(model.date).add(1,'days').format('DD/MM/YYYY');
        model.dateTo = moment(model.date).add(model.days,'days').format('DD/MM/YYYY');
        model.date = this.utilityService.formatDateFE(model.date);
        model.checkedDate = this.utilityService.formatDateFE(model.checkedDate);
        let id = 7000;
        switch (model.type?model.type.toLowerCase():'') {
            case 'sos': 
                id = byScheme ? 7003 : 7002;
                break;
            case 'farmacia':
                id = byScheme ? 7001 : 7000;
                break;
            case 'devolucion':
                id = byScheme ? 7005 : 7004;
            break;
        }
        this.iReport.generateReportWithData(model, id, true);
    }
}
