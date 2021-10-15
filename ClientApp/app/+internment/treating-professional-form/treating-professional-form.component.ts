import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastyMessageService, CommonService } from '../../+core/services';

import { ItemCombo } from '../../+shared/util';
import { Patient } from '../../models/patient.model';

import { TreatingProfessionalService } from '../treating-professional.service';
import { TreatingProfessional } from '../../models/treating-professional.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'treating-professional-form',
  templateUrl: './treating-professional-form.component.html',
  styleUrls: ['./treating-professional-form.component.scss']
})
export class TreatingProfessionalFormComponent implements OnInit {

    treatingProfessional: TreatingProfessional = new TreatingProfessional();
    isLoading = false;
    isSaving = false;
    form: FormGroup;
    professionals: Array<ItemCombo>;
    loadingProfessionalIAC = false;

    patient = new Patient();
    openModalDiscardSubject = new Subject();
    deleteModalSchemeSubject = new Subject();
    readonlyCH: boolean;

    @Input() isNewProfessional: boolean = true;
    @Input() id: number;
    @Input() readonly: boolean = false;

    @Output() closeClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private fb: FormBuilder,
        private commonService: CommonService,
        private toastyMessageService: ToastyMessageService,
        public activatedRoute: ActivatedRoute,
        public treatingProfessionalService: TreatingProfessionalService
    ) {
    }

    ngOnInit() {
        this.getProfessionals(this.treatingProfessionalService.medicalInsuranceId);
        this.loadForm();
    }

    private loadForm() {
        if (this.isNewProfessional) {
            this.createForm();
        }
        else this.getTreatingProfessional();
    }

    private createForm() {
        this.form = this.fb.group({
            professionalId: [this.treatingProfessional.professionalId, Validators.required]
        });
    }

    getTreatingProfessional() {
        this.treatingProfessional = this.treatingProfessionalService.treatingProfessional;
        this.createForm();
    }

    private getProfessionals(medicalInsuranceId: number) {
        this.loadingProfessionalIAC = true;
        this.commonService.getProfessionals(medicalInsuranceId)
            .finally(() => this.loadingProfessionalIAC = false)
            .subscribe(
                response => {
                    this.professionals = response.model;
                },
                error => {
                    this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de Profesionales');
                });
    }

    onChangeProfessional() {
    }

    save() {
        this.isSaving = true;
        let treatingProfessional = Object.assign(this.treatingProfessional, this.form.value);
        treatingProfessional.professionalName = this.getProfessionalName(treatingProfessional.professionalId);
        if (this.treatingProfessionalService.exists(treatingProfessional)) { this.toastyMessageService.showErrorMessagge("Ya existe el profesional"); this.isSaving = false; return; }

        const result = this.treatingProfessionalService.save(treatingProfessional);
        console.log(this.treatingProfessionalService.treatingProfessionalList);

        if (result) {
            this.toastyMessageService.showSuccessMessagge(`El professional ha sido ${this.isNewProfessional ? "agregado" : "modificado"}`);
        } else {
            this.toastyMessageService.showErrorMessagge(`Error al cargar evolucion`);
        }

        this.closeClick.emit();
    }

    private getProfessionalName(professionalId: number) {
        const professional = this.professionals.find((d: any) => d.number == professionalId);
        return !professional ? '' : professional.name;
    }

    discardChanges() {
        this.closeClick.emit();
    }
}
