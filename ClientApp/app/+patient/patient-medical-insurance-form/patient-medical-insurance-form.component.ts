import { PatientMedicalInsurance } from './../../models/patient-medical-insurance.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PatientMedicalInsuranceService } from '../patient-medical-insurance.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilityService } from '../../+core/services/utility.service';
import { Subject } from 'rxjs';
import * as jquery from 'jquery';
import { CommonService } from '../../+core/services/common.service';
import * as moment from 'moment';
import { select } from '@ngrx/core';


@Component({
    selector: 'patient-medical-insurance-form',
    templateUrl: 'patient-medical-insurance-form.component.html',
	styleUrls: ['./patient-medical-insurance-form.component.css']
})

export class PatientMedicalInsuranceFormComponent implements OnInit {
    isEdit: boolean = false;
    form: FormGroup;
    openModalSubject: Subject<any> = new Subject<any>();
    datePickerOptions: any;
    medicalInsurances: Array<any> = new Array<any>(); 
    isLoadingMedicalInsurance: boolean;
    defaultMedicalInsurance: boolean = false;
    @Input() patientMedicalInsurance: PatientMedicalInsurance;
    @Input() isPatientEdit: boolean;
    @Output() cancelClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() saveClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public patientMedicalInsuranceService: PatientMedicalInsuranceService,
        public toastyMessageService: ToastyMessageService,
        public activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        public utilityService: UtilityService,
        public commonService: CommonService
    ) { }

    ngOnInit() {
        this.datePickerOptions = this.utilityService.getDatePickerOptions();
        this.datePickerOptions.max = false;
        this.loadForm();
    }

    loadMedicalInsurances() {
        this.isLoadingMedicalInsurance = true;
        this.commonService.getMedicalInsurancesWithContract()
            .finally(() => this.isLoadingMedicalInsurance = false)
            .subscribe(response => {
                this.medicalInsurances = response.model;
                this.defaultMedicalInsurance = this.patientMedicalInsurance.medicalInsuranceName == "PARTICULAR";
                this.createForm();
            },
            error => {
                this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrió un error al cargar el combo de OS");
            });
    }

    loadForm() {
        if (this.isPatientEdit) this.getPatientMedicalInsurance(this.patientMedicalInsuranceService.number);
        else this.loadMedicalInsurances();
    }

    createForm() {
        this.form = this.fb.group({
            socialNumber: [this.patientMedicalInsurance.socialNumber, Validators.required],
            carnetNumber: [this.patientMedicalInsurance.carnetNumber, null],
            expirationDate: [this.patientMedicalInsurance.expirationDate, null],
            byDefault: [this.patientMedicalInsurance.byDefault, null],
        })
    }

    onCancelClick() {
        this.cancelClick.emit();
    }

    onChangeMedicalInsurance() {
        this.defaultMedicalInsurance = this.patientMedicalInsurance.medicalInsuranceName == "PARTICULAR";

        let a = this.medicalInsurances.find((e: any) => {
            return e.number == this.form.value.socialNumber;
        })

        if (a) {
            this.patientMedicalInsurance.socialNumber = a.number;
            this.patientMedicalInsurance.medicalInsuranceName = a.name;
        }
    }

    getPatientMedicalInsurance(id: any) {
        this.isEdit = true;
        this.loadMedicalInsurances();
    }

    onSubmit($event: any) {
        this.patientMedicalInsurance.patientNumber = this.patientMedicalInsuranceService.patientNumber;
        const patientMedicalInsurance = Object.assign({}, this.patientMedicalInsurance, this.form.value);
        patientMedicalInsurance.expirationDate = this.utilityService.formatDate(patientMedicalInsurance.expirationDate, "DD/MM/YYYY");
        

        if (this.isPatientEdit) {
            if (this.patientMedicalInsuranceService.isNewPatientMedicalInsurance) {
                this.patientMedicalInsuranceService.add(patientMedicalInsurance).subscribe(
                    response => {
                        this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios.");
                        this.saveClick.emit();
                    },
                    error => {
                        this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrió un error al guardar los cambios");
                    });
            } else {
                this.patientMedicalInsuranceService.update(patientMedicalInsurance.number, patientMedicalInsurance).subscribe(
                    response => {
                        this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
                        this.saveClick.emit();
                    },
                    error => {
                        this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrió un error al guardar los cambios");
                    });
            }
        } else {
            if (this.validateSameMedicalInsurance(patientMedicalInsurance)) {
                this.toastyMessageService.showMessageToast("Obra social ya ingresada", "El paciente ya tiene asignado esa OS", "warning");
            } else {
                    if (this.patientMedicalInsuranceService.isNewPatientMedicalInsurance) {
                        this.patientMedicalInsuranceService.addArray(patientMedicalInsurance).subscribe(
                            response => {
                                this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios.");
                                this.saveClick.emit();
                            },
                            error => {
                                this.toastyMessageService.showErrorMessagge(error.message || "Ocurrio un error al guardar los datos");
                            });
                    } else {
                        this.patientMedicalInsuranceService.updateArray(patientMedicalInsurance.number, patientMedicalInsurance).subscribe(
                            response => {
                                this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
                                this.saveClick.emit();
                            },
                            error => {
                                this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrió un error al guardar los cambios");
                            });
                    }
            }
        }
    }   

    validateSameMedicalInsurance(patientMedicalInsurance: PatientMedicalInsurance) {
        let medicalInsuranceFound = this.patientMedicalInsuranceService.newPatientMedicalInsurances.find((e: any) => {
            return e.socialNumber == patientMedicalInsurance.socialNumber && e.number != patientMedicalInsurance.number;
        })
        return medicalInsuranceFound;
    }

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onAgree() {
        this.cancelClick.emit();
    }
}