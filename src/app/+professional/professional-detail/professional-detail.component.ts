import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProfessionalService } from '../professional.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { CommonService } from '../../+core/services/common.service';
import { UtilityService } from '../../+core/services/utility.service';

@Component({
    selector: 'app-professional-detail',
    templateUrl: './professional-detail.component.html',
    styleUrls: ['./professional-detail.component.css']
})

export class ProfessionalDetailComponent implements OnInit {
    public professional: any;
    public province: string;
    public isLoaded: boolean = false;
    public src: any = require("../../images/default-image-profile.jpg");

    constructor(
        private _professionalService: ProfessionalService,
        private _toastyService: ToastyMessageService,
        private _route: ActivatedRoute,
        private _commonService: CommonService,
        private _utilityService: UtilityService,
    ) {
    }

    ngOnInit() {
        const id = this._route.snapshot.paramMap.get('id');
        this.getProfessional(id);
    }

    getProfessional(id: any) {
        this._professionalService.getProfessional(id)
            .finally(() => this.isLoaded = true)
            .subscribe(
            result => {
				this.professional = result.model;
				this.professional.professionalAccount.birthDate = this._utilityService.formatDate(result.model.professionalAccount.birthDate, "", "DD/MM/YYYY");
				this.professional.professionalAccount.highDate = this._utilityService.formatDate(result.model.professionalAccount.highDate, "", "DD/MM/YYYY");
                this.getProvince();
            },
			error => {
				this._toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al obtener los datos del profesional");
            });
        this._commonService.getImageAccount(+id)
            .subscribe(
            response => {
				if (!!response.model.file) this.src = `data:image/jpeg;base64,${response.model.file}`;
            },
			error => {
				this._toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al cargar la imagen");
            });
    }

    getProvince() {
        this._commonService.getProvince(this.professional.professionalAccount.loc.province).subscribe(
            response => {
                this.province = response.model.name;
            },
			error => {
				this._toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al cargar las provincias");
            });
    }
}