import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';

import { ToastyMessageService, UtilityService, CommonService } from '../../+core/services';
import { MedicalInsuranceLiquidationService } from '../medical-insurance-liquidation.service';
import { DynamicTableComponent } from '../../+shared';
import { EventDynamicTable } from '../../+shared/util';
import { PracticeToLiquidate } from '../util/models';

@Component({
    selector: 'app-practices-to-liquidate',
    templateUrl: './practices-to-liquidate.component.html',
    styleUrls: ['./practices-to-liquidate.component.scss']
})
export class PracticesToLiquidateComponent implements OnInit {

    @ViewChild(DynamicTableComponent) dtComponent: DynamicTableComponent;
    @Output() selectionEE = new EventEmitter<any>();
    @Output() filterChange = new EventEmitter<string>();

    isLoading = true;

    constructor(
        private toastyMessageService: ToastyMessageService,
        private utilityService: UtilityService,
        private commonService: CommonService,
        public miLiquidationService: MedicalInsuranceLiquidationService,
    ) { }

    ngOnInit() { }

    onActionClick(event: EventDynamicTable<PracticeToLiquidate>) {
        switch (event.action) {
            case 'checkbox':
                this.miLiquidationService.updatePracticeToLiquidate(event.item);
                this.selectionEE.emit();
                break;
            default:
                break;
        }
    }

    selectAll(event: { property: string, checked: boolean, dataSource: Array<PracticeToLiquidate> }) {
        this.miLiquidationService.updatePracticesToLiquidate(event.dataSource, event.checked, event.property === 'reLiquidate');
        this.selectionEE.emit();
    }

    onFilterChange() {
        this.filterChange.emit();
    }
}
