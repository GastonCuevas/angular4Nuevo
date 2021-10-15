import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BedCard } from '../../models/bed-card.model';
import { BedMovementService } from '../bed-movement.service';
import { ToastyMessageService, UtilityService } from '../../+core/services';

import * as moment from 'moment';

@Component({
    selector: 'bed-movement-card-detail',
    templateUrl: './bed-movement-card-detail.component.html',
    styleUrls: ['./bed-movement-card-detail.component.scss']
})
export class BedMovementCardDetailComponent implements OnInit {

    bedCard: BedCard = new BedCard();
    id: any;
    isLoaded: boolean = false;
    // isEdit: boolean;
    form: FormGroup;

    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private utilityService: UtilityService,
      private toastyMessageService: ToastyMessageService,
      public bedMovementService: BedMovementService
    ) {
      this.id = this.route.snapshot.paramMap.get('camaId');
      // this.isEdit = !!this.id;
    }

    ngOnInit() {
        this.loadForm();
    }

    loadForm() {
        this.getBedMovementDetail();
    }

    createForm() {
        this.form = this.fb.group({
            name: [this.bedCard.name, null],
            typeName: [this.bedCard.typeName, null],
            wardName: [this.bedCard.wardName, null],
            patientName: [this.bedCard.patientName, null],
            patientAge: [this.bedCard.patientAge, null],
            admissionDate: [this.bedCard.admissionDate, null],
            hospitalizedDays: [this.bedCard.hospitalizedDays, null]
        });
    }

    getBedMovementDetail() {
        this.bedMovementService.getBedCardById(this.id)
            .finally(() => this.isLoaded = true)
            .subscribe(
            response => {
                this.bedCard = response.model;
                this.bedCard.admissionDate = moment(this.bedCard.admissionDate).format('DD/MM/YYYY');
                this.createForm();
            },
            error => {
                this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al obtener los datos');
            });
    }

    goBack() {
        this.utilityService.navigateToBack();
    }

}
