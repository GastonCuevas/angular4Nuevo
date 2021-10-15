import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { DynamicTableComponent } from '../../+shared';
import { EventDynamicTable, IColumn } from '../../+shared/util';

import { PharmacyService } from '../pharmacy.service';
import { PharmacyPatient, PharmacySchemeView, PharmacyScheme } from '../util/models';

@Component({
    selector: 'app-pharmacy-schemes',
    templateUrl: './pharmacy-schemes.component.html',
    styleUrls: ['./pharmacy-schemes.component.scss']
})
export class PharmacySchemesComponent implements OnInit {

    @Input() isActive = true;
    @Input() schemes = [];
    @Output() selectedChange = new EventEmitter<PharmacyScheme>();

    isLoading = true;

    columns: Array<IColumn> = [
        { header: 'Nro Esq.', property: 'id', width: '80px', disableSorting: true },
        { header: 'Paciente', property: 'patientName', disableSorting: true },
        { header: 'Fecha', property: 'dateIni', type: 'date', disableSorting: true },
        { header: 'Observación', property: 'observation', width: '120px', disableSorting: true }
        // { header: 'Profesional', property: 'professionalName', disableSorting: true },
    ];

    constructor(public pharmacyService: PharmacyService) { }

    ngOnInit() { }
    
    selectChange(event: PharmacyScheme) {
        this.selectedChange.emit(event);
    }
}
