import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { InternmentService } from '../internment.service';
import { CommonService, ToastyMessageService, UtilityService } from '../../+core/services';
import { Internment } from '../../models';
import * as moment from 'moment';

@Component({
    selector: 'app-internment-detail',
    templateUrl: './internment-detail.component.html',
    styleUrls: ['./internment-detail.component.scss']
})

export class InternmentDetailComponent implements OnInit {

    internment: Internment;
    isLoaded: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private toastyService: ToastyMessageService,
        private commonService: CommonService,
        private utilityService: UtilityService,
        private internmentService: InternmentService,
    ) {
    }

    ngOnInit() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        this.getInternment(Number(id));
    }

    private getInternment(id: number) {
        this.internmentService.get(id)
            .finally(() => this.isLoaded = true)
            .subscribe(
            result => {
                this.internment = result.model;
                this.internment.admissionDate = moment(this.internment.admissionDate).format('DD/MM/YYYY');
                this.internment.time = this.internment.time.substr(0, 5);
            },
            error => {
                this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al obtener los datos de la internación.');
            });
    }

}