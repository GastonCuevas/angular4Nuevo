import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PatientResponsibleService } from './../../+patient-responsible/patient-responsible.service';
import { UtilityService } from '../../+core/services/utility.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { CommonService } from '../../+core/services/common.service';

@Component({
    selector: 'selector-name',
    templateUrl: 'patient-responsible-detail.component.html'
})

export class PatientResponsibleDetailComponent implements OnInit {
    patientResponsible: any;
    isLoaded: boolean = false;
    public province: string;
    
    constructor(
        private patienteResponsibleService: PatientResponsibleService,
        private route: ActivatedRoute,
        private utilityService: UtilityService,
        private toastyService: ToastyMessageService,
        private commonService: CommonService,
    ) { }
   
    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.getPatientResponsible(id);
    }

    getPatientResponsible(id: any) {
        this.patienteResponsibleService.get(id)
            .finally(() => this.isLoaded = true)
            .subscribe(
            result => {
                this.patientResponsible = result.model;
				this.patientResponsible.birthDate = this.utilityService.formatDate(result.model.birthDate, "", "DD/MM/YYYY");
                this.getProvince();
            },
            error => {
				this.toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al obtener los datos del responsable");
            });
    }

    getProvince() {
        this.commonService.getProvince(this.patientResponsible.loc.province).subscribe(
            response => {
                this.province = response.model.name;
            });
    }
}