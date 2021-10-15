import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CommonService, ToastyMessageService } from '../../+core/services';
import { TurnManagementService } from '../turn-management.service';
import { ItemCombo, ValidatedItemCombo } from '../../+shared/util';
import { SelectedFilter } from '../util';

@Component({
    selector: 'filter-form',
    templateUrl: './filter-form.component.html',
    styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnInit {
    isConsulting = false;
    form: FormGroup;
    functionForSpecialties = this.commonService.getSpecialties();
    functionForPractices = this.commonService.getInosPracticesByType(1);
    professionals = new Array<ValidatedItemCombo>();
    loadingProfessionalIAC = false;
    loadingPracticeIAC = false;
    medicalOffices = new Array<any>();
    types = new Array<any>();
    selectedFilter = new SelectedFilter();

    @Output() resetValues = new EventEmitter<any>();
    @Output() formSubmit = new EventEmitter<any>();

    constructor(
        private fb: FormBuilder,
        private commonService: CommonService,
        private toastyMessageService: ToastyMessageService,
        public turnManagementService: TurnManagementService
    ) {}

    ngOnInit() {
        this.loadCombos();
        this.loadForm();
    }

    private loadCombos() {
        this.loadTypes();
    }

    private loadTypes() {
        this.types.push({name: 'Normales', value: 'normal'});
        this.types.push({name: 'Sobreturnos', value: 'uponTurn'});
    }

    private loadForm() {
        this.form = this.fb.group({
            specialty: ['', null],
            practiceNumber: ['', Validators.required],
            professional: ['', Validators.required],
            medicalOffice: ['', null],
            type: ['', null]
        })
    }

    specialtyChange(event: ItemCombo) {
        this.selectedFilter.specialtyName = event.name;
    //     this.getProfessionals();
    //     this.resetMedicalOfficeCombo();
    //    this.resetValues.emit();
    }

    practiceChange(event: ItemCombo) {
        this.selectedFilter.practiceName = event.name;
        this.getProfessionals();
        this.resetMedicalOfficeCombo();
        this.resetValues.emit();
    }

    private getProfessionals() {
        if (!this.form.value.practiceNumber) { this.professionals = []; return; }
        this.loadingProfessionalIAC = true;
        this.commonService.getProfessionalsByPractice(this.form.value.practiceNumber)
            .finally(() => this.loadingProfessionalIAC = false)
            .subscribe(
            response => {
                this.professionals = response.model;
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de Profesionales');
            });
    }

    professionalChange(event: ValidatedItemCombo) {
        this.selectedFilter.professionalName = event.name;
        if (event.number) this.getMedicalOffices();
        else this.resetMedicalOfficeCombo();
        this.resetValues.emit();
    }

    private getMedicalOffices() {
        this.resetMedicalOfficeCombo();
        this.turnManagementService.getAllConsultingRooms(this.form.value.professional).subscribe(
            response => {
            this.medicalOffices = response.model;
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de Consultorios');
            });
    }

    private resetMedicalOfficeCombo() {
        this.form.patchValue({ medicalOffice: null });
        this.medicalOffices = [];
    }

    onSubmit() {
        this.selectedFilter.professional = this.form.value.professional;
        this.selectedFilter.specialty = this.form.value.specialty;
        this.selectedFilter.practice = this.form.value.practiceNumber;
        this.selectedFilter.medicalOffice = this.form.value.medicalOffice;
        this.selectedFilter.type = this.form.value.type;
        this.turnManagementService.sf = this.selectedFilter;
        this.isConsulting = true;
        this.formSubmit.emit();
    }

}


