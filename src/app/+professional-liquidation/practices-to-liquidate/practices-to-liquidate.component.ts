import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';

import { ToastyMessageService, UtilityService, CommonService } from '../../+core/services';
import { ProfessionalLiquidationService } from '../professional-liquidation.service';
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
        public professionalLiquidationService: ProfessionalLiquidationService,
    ) { }

    ngOnInit() { }

    onActionClick(event: EventDynamicTable<PracticeToLiquidate>) {
        switch (event.action) {
            case 'checkbox':
                this.professionalLiquidationService.updatePracticeToLiquidate(event.item);
                this.selectionEE.emit();
                break;
            default:
                break;
        }
    }

    selectAll(event: { property: string, checked: boolean, dataSource: Array<PracticeToLiquidate> }) {
        this.professionalLiquidationService.updatePracticesToLiquidate(event.dataSource, event.checked);
        this.selectionEE.emit();
    }

    onFilterChange() {
        this.filterChange.emit();
    }
}
