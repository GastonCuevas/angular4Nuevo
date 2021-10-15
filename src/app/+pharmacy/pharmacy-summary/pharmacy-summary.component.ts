import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { ToastyMessageService, UtilityService, CommonService } from '../../+core/services';
import { DynamicTableComponent, GenericControl } from '../../+shared';

import { PharmacyService } from '../pharmacy.service';
import { IColumn } from '../../interface';

@Component({
    selector: 'app-pharmacy-summary',
    templateUrl: './pharmacy-summary.component.html',
    styleUrls: ['./pharmacy-summary.component.scss']
})
export class PharmacySummaryComponent implements OnInit {

    @ViewChild(DynamicTableComponent) dtComponent: DynamicTableComponent;
    @Input() isActive = true;
    @Input() reloadingDataSource = false;
    isLoading = true;

    columns: Array<IColumn> = [
        { header: 'Cod. Art.', property: 'articleCode', disableSorting: true },
        { header: 'Descripción', property: 'articleName', disableSorting: true },
        { header: 'Total', property: 'quantity', disableSorting: true },
        { header: 'Stock Actual', property: 'stock', disableSorting: true },
        { header: 'Sector', property: 'sectorName', disableSorting: true },
    ];

    constructor(
        public pharmacyService: PharmacyService,
        public commonService: CommonService
    ) { }

    ngOnInit() { }

}
