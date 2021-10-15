import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MedicalInsuranceService } from '../medical-insurance.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { CommonService } from '../../+core/services/common.service';

@Component({
    selector: 'app-medicalInsurance-detail',
    templateUrl: './medical-insurance-detail.component.html',
    styleUrls: ['./medical-insurance-detail.component.scss']
})

export class MedicalInsuranceDetailComponent implements OnInit {
    public medicalInsurance: any;
    public province: string;
    public isLoaded: boolean = false;

    constructor(
        private _medicalInsurance: MedicalInsuranceService,
        private _toastyService: ToastyMessageService,
        private _route: ActivatedRoute,
        private _commonService: CommonService,
    ) { }

    ngOnInit() {
        const id = this._route.snapshot.paramMap.get('id');
        this.getMedicalInsurance(id);
    }

    getMedicalInsurance(id: any) {
        this._medicalInsurance.get(id)
            .finally(() => this.isLoaded = true)
            .subscribe(
            result => {
                this.medicalInsurance = result.model;
                this.getProvince();
            },
			error => {
				this._toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un erro al obtener los datos de la Obra Social");
            });
    }

    getProvince() {
        this._commonService.getProvince(this.medicalInsurance.medicalInsuranceAccount.loc.province).subscribe(
            response => {
                this.province = response.model.name;
            });
    }
}