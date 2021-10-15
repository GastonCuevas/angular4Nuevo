import { Component, OnInit, ViewChild, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ClinicHistoryPharmacySchemeService } from '../clinic-history-pharmacy-scheme.service';
import { DynamicTableComponent } from '../../../+shared/dynamic-table/dynamic-table.component';
import { IColumn, EventDynamicTable } from '../../../+shared/util';
import { GenericControl } from '../../../+shared';

@Component({
	selector: 'medication-to-check',
	templateUrl: './medication-to-check.component.html',
	styleUrls: ['./medication-to-check.component.scss']
})
export class MedicationToCheckComponent implements OnInit, OnChanges {

    @ViewChild(DynamicTableComponent) dtComponent: DynamicTableComponent;
    @Output() selectionEE = new EventEmitter<any>();

    columns: Array<IColumn> = [
        { header: 'Medicamento', property: 'description', searchProperty: 'Description',  width: '100%' },
        { header: 'Seleccionado', property: "selected", type:'checkbox', width: '10%', disableSorting: true, hideColumnBy: 'added', defaultValue: 'Seleccionada' },
      ];
    
    isLoading = true;

    controlsToFilter: Array<GenericControl> = [
        { key: 'description', label: 'Medicamento', type: 'text', class: 'col s12 m12', searchProperty: 'Description' }
      ];
    
	constructor(
        public chPharmacySchemeService: ClinicHistoryPharmacySchemeService
	) {}

    ngOnInit() {}

    ngOnChanges() {
    }
    
	onActionClick(event: EventDynamicTable) {
		switch (event.action) {
            case 'checkbox':
                this.selectionEE.emit();
				break;
			default:
				break;
		}
	}

    selectAll(event: {property: string, checked: boolean, dataSource: Array<any>}) {
        //this.contractProfessionalMedicalInsuranceService.selectedAll(event.checked);
        this.selectionEE.emit();
    }
}
