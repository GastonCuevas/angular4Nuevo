import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { ToastyMessageService, UtilityService, CommonService } from '../../+core/services';
import { DynamicTableComponent, GenericControl } from '../../+shared';
import { EventDynamicTable } from '../../+shared/util';

import { PharmacyService } from '../pharmacy.service';
import { PharmacyPatient } from '../util/models';
import { IColumn } from '../../interface';
import * as moment from 'moment';

@Component({
    selector: 'app-pharmacy-patients',
    templateUrl: './pharmacy-patients.component.html',
    styleUrls: ['./pharmacy-patients.component.scss']
})
export class PharmacyPatientsComponent implements OnInit {

    // @ViewChild(DynamicTableComponent) dtComponent: DynamicTableComponent;
    @Input() isActive = true;
    @Input() reloadingDataSource = false; 
    @Output() selectionEE = new EventEmitter<PharmacyPatient>();
    @Output() filterChange = new EventEmitter<string>();
    @Output() dateChange = new EventEmitter<string>();
    // @Output() selectedChange = new EventEmitter<PharmacyPatient>();
    initDate = this.utilityService.getNow();
    isLoading = true;
    dateFrom: string;
    dateTo: string;
    datePickerOptions: any;

    columns: Array<IColumn> = [
        { header: 'Paciente', property: 'patientName' },
        { header: 'Sector', property: 'sectorName' },
        { header: 'Nro HC', property: 'clinicHistoryNumber' },
        { header: 'Ingreso', property: 'admissionDate', type: 'date' },
        { header: 'Profesional', property: 'professionalName' },
        { header: 'Obra Social', property: 'medicalInsuranceName' },
        { header: 'Seleccionar', property: 'selectedPatient', type: 'checkbox', width: '120px', disableSorting: true }
    ];
    controlsToFilter: Array<GenericControl> = [
        { key: 'medicalInsuranceNumber', label: 'Obra Social', type: 'autocomplete', class: 'col s12 m8', functionForData: this.commonService.getMedicalInsurances(), searchProperty: "PatMov.MIContract.MedicalInsuranceNumber"},
        { key: 'dateTo', label: 'Filtrar Hasta Fecha', type: 'date', class: 'col s12 m2', searchProperty: "PatMov.Date" },
        { key: 'sectorId', label: 'Sector', type: 'autocomplete', class: 'col s12 m2', functionForData: this.commonService.getWardSectors(), parameter: true },
        // { key: 'state', label: 'Tipo de estados ', type: 'select', class: 'col s12 m2', options: [{ number: 2, name: 'Internados' }, { number: 1, name: 'Ambulatorio' }], searchProperty: "PatMov.MovementStateNumber", value: 2 }
    ];
    constructor(
        private toastyMessageService: ToastyMessageService,
        private utilityService: UtilityService,
        private commonService: CommonService,
        public pharmacyService: PharmacyService,
    ) { }

    ngOnInit() {
        if (!this.datePickerOptions) {
            this.datePickerOptions = this.utilityService.getDatePickerOptions();
            this.datePickerOptions.max = false;
            this.datePickerOptions.format = 'dd/mm/yyyy',
                this.datePickerOptions['onSet'] = (value: any) => {
                    if (isNaN(value.select)) {
                        this.onChangeDate(this.utilityService.formatDate(value.select,'DD/MM/YYYY'));
                    }else{
                        this.onChangeDate(moment(value.select).format('YYYY-MM-DD'))
                    }
                }
        }
    }

    onActionClick(event: EventDynamicTable<PharmacyPatient>) {
        switch (event.action) {
            case 'checkbox':
                this.pharmacyService.updatePharmacyPatient(event.item);
                this.selectionEE.emit();
                break;
            default:
                break;
        }
    }

    onChangeDays(event: any){
        this.pharmacyService.days = event.value;
        const d = moment(this.utilityService.formatDate(this.dateFrom,'DD/MM/YYYY'));
        this.dateTo = this.utilityService.formatDateFE(d.add(event.value, 'days').format('YYYY-MM-DD'));

    }

    onChangeDate(event: any){
        const d = moment(event);
        if(!d.isValid()) return;
         this.dateChange.emit(this.utilityService.formatDateFE(event));
         this.dateFrom = this.utilityService.formatDateFE(d.add(1, 'days').format('YYYY-MM-DD'));
         this.dateTo = this.utilityService.formatDateFE(d.add(this.pharmacyService.days, 'days').format('YYYY-MM-DD'));
    }

    selectAll(event: { property: string, checked: boolean, dataSource: Array<PharmacyPatient> }) {
        this.pharmacyService.selectAll(event.dataSource, event.checked);
        this.selectionEE.emit();
    }

    onFilterChange() {
        this.pharmacyService.resetService();
        this.filterChange.emit();
    }

    // selectChange(event: PharmacyPatient) {
    //     this.selectedChange.emit(event);
    // }
}
