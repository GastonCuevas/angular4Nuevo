import { Component, OnInit, Output, EventEmitter, ViewChild, Input, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';


import * as moment from 'moment';
import { ToastyMessageService, UtilityService, CommonService } from '../../+core/services';
import { PharmacySchemeDetail } from '../util/models';
import { PharmacyService } from '../pharmacy.service';

@Component({
    selector: 'app-pharmacy-scheme-detail',
    templateUrl: './pharmacy-scheme-detail.component.html',
	styleUrls: ['./pharmacy-scheme-detail.component.scss']
})

export class PharmacySchemeDetailComponent implements OnInit {
    @Input() isActive = true;
    @Input() detail = new Array<PharmacySchemeDetail>();
    @Output() sendReloading = new EventEmitter<boolean>();
    deposits: Array<any>;
    isLoading = false;
    loadingArticles = false;

    constructor(
        public pharmacyService: PharmacyService,
        private _toastyService: ToastyMessageService,
        private _utilityService: UtilityService,
        private _commonServices: CommonService
    ) { }

    ngOnInit() {
        this.loadDeposits();
     }

    private getClassInput(detail: PharmacySchemeDetail) {
        return detail.quantity != detail.quantityWithOutChanges ? 'txt-quantity' : '';
    }

    updateSumatory(detail: PharmacySchemeDetail){
        this.isLoading = true;
        this.pharmacyService.getPharmacySummaryUpdate()
        .finally(() => { this.isLoading = false })
        .subscribe(
            response => {
                this.pharmacyService.pharmacySummary = response.model;
                this.sendReloading.emit(true);
            },
            error => {
                this._toastyService.showToastyError(error, 'Ocurrio un error al cargar la sumatoria');
            });
    }

    loadDeposits() {
        this._commonServices.getDeposits().subscribe(
          response => {
            this.deposits = response.model || [];
          },
          error => this._toastyService.showErrorMessagge("No se pudo obtener las especialidades")
        )
      }
}