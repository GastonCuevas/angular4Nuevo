import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { Subject, Observable } from 'rxjs';
import { ToastyMessageService, CommonService, UtilityService } from '../../+core/services';
import { InternmentService } from "../internment.service";
import { ElementFilter } from "../../+shared/dynamic-table/element-filter.model";

import { DynamicTableComponent } from '../../+shared/dynamic-table/dynamic-table.component';
import { IColumn } from '../../interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemCombo } from '../../+shared/util';


import { PatientService } from '../../+patient/patient.service';
import { IntelligentReportComponent } from '../../+shared';

@Component({
    selector: 'app-internment-list',
    templateUrl: './internment-list.component.html',
    styleUrls: ['./internment-list.component.scss']
})
export class InternmentListComponent implements OnInit, AfterViewInit {

    @ViewChild('iReport') iReport: IntelligentReportComponent;

    isLoadingCombos: boolean = true;
    isLoading: boolean = true;
    initialFilter = 'occupied=1';
    form: FormGroup;
    beds: Array<ItemCombo>;
    professionals: Array<ItemCombo>;
    patients: Array<ItemCombo>;
    medicalInsurances: Array<ItemCombo> = new Array<ItemCombo>();
    medicalInsurance: number;
    loadingMInsuranceIAC: boolean;
    loadingProfessionalIAC: boolean;
    loadingPatientIAC: boolean;
    loadingBedIAC: boolean;
    practices: Array<ItemCombo> = new Array<ItemCombo>();
    paginator = { currentPage: 1, pageSize: 10, totalItems: 0 }
    public showFilter: boolean = false;
    public datePickerOptions: any;
    public timePickerOptions: any;
    private filterBy: string = '';
    public sortField = {
        sortBy: 'patMov.date',
        ascending: false
    }

    itemId: 0;
    openModalDeleteSubject: Subject<any> = new Subject();

    constructor(
        
        private fb: FormBuilder,
        private router: Router,
        private toastyMessageService: ToastyMessageService,
        private utilityService: UtilityService,
        public internmentService: InternmentService,
        public patientService: PatientService
    ) { }

    ngOnInit() {}

    ngAfterViewInit() {
        if (this.internmentService.idToPrint) this.iReport.generateReport(this.internmentService.idToPrint, 1000);
        this.internmentService.idToPrint = 0;
    }

    onActionClick(event: any) {
        switch (event.action) {
            case 'new':
                this.router.navigate(['/camas/internaciones/formulario'])
                break;
            case 'edit':
                this.internmentService.readonly = false;
                this.router.navigate([`/camas/internaciones/formulario/${event.item.id}`])
                break;
            case 'detail':
                this.utilityService.navigate(`/camas/internaciones/formulario/${event.item!.id}`);
                this.internmentService.readonly = true;
                break;
            case 'print':
                this.iReport.generateReport(event.item.id, 1000);
                break;
            default:
                break;
        }
    }
}
