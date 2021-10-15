import { Component, OnInit, ViewChild, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';

import { GenericControl, DynamicTableComponent } from '../../+shared';
import { IColumn, EventDynamicTable } from '../../+shared/util';
import { ContractProfessionalMedicalInsuranceService } from '../contract-professional-medical-insurance.service';

@Component({
	selector: 'practices-to-check',
	templateUrl: './practices-to-check.component.html',
	styleUrls: ['./practices-to-check.component.scss']
})
export class PracticesToCheckComponent implements OnInit, OnChanges {

    @ViewChild(DynamicTableComponent) dtComponent: DynamicTableComponent;
    @Output() selectionEE = new EventEmitter<any>();
    @Input() osId: number = 0;

    columns: Array<IColumn> = [
        { header: 'Práctica', property: 'name', searchProperty: 'inosPractice.Description' },
        { header: 'Seleccionado', property: "selected", type:'checkbox', width: '120px', disableSorting: true, hideColumnBy: 'added', defaultValue: 'Seleccionada' },
      ];
    
    isLoading = true;

    controlsToFilter: Array<GenericControl> = [
        { key: 'practice', label: 'Práctica', type: 'text', class: 'col s12 m12', searchProperty: 'inosPractice.Description' }
      ];
    
	constructor(
        public contractProfessionalMedicalInsuranceService: ContractProfessionalMedicalInsuranceService
	) {}

    ngOnInit() {}

    ngOnChanges() {
        this.contractProfessionalMedicalInsuranceService.osId = this.osId;
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
        this.contractProfessionalMedicalInsuranceService.selectedAll(event.checked);
        this.selectionEE.emit();
    }
}
