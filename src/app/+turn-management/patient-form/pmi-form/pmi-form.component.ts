import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { InputAutoComplete } from '../../../+shared';
import { UtilityService, CommonService, ToastyMessageService } from '../../../+core/services/';
import { PatientMedicalInsurance } from '../../util';

import * as jquery from 'jquery';
import * as moment from 'moment';
import { TurnManagementService } from '../../turn-management.service';

@Component({
    selector: 'pmi-form',
    templateUrl: 'pmi-form.component.html',
    styleUrls: ['./pmi-form.component.scss']
})

export class PatientMedicalInsuranceFormComponent implements OnInit {


    itemValue: number = 0;

    isNew: boolean = true;
    form: FormGroup;
    isLoading: boolean = true;
    openModalDiscardSubject: Subject<any> = new Subject<any>();
    datePickerOptions: any;
    medicalInsurances: Array<any> = new Array<any>();

    defaultMedicalInsurance: boolean = false;
    // @Input() patientMedicalInsurance: PatientMedicalInsurance;

    @ViewChild('medicalInsuranceIAC') medicalInsuranceIAC: InputAutoComplete;

    @Input() patientMedicalInsurance: PatientMedicalInsurance;
    @Output() cancelClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() saveClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private fb: FormBuilder,
        public utilityService: UtilityService,
        public commonService: CommonService,
        public toastyMessageService: ToastyMessageService,
        private turnManagementService: TurnManagementService,
    ) { }

    ngOnInit() {
        this.datePickerOptions = this.utilityService.getDatePickerOptions();
        this.datePickerOptions.max = false;
        this.datePickerOptions.min = moment().toDate();
        this.loadMedicalInsurance();
        this.loadForm();
    }

    private loadMedicalInsurance() {
        this.commonService.getMedicalInsurancesWithContract().subscribe(
            response => {
                this.medicalInsurances = response.model;
                this.isLoading = false;
            },
            error => {
                this.toastyMessageService.showErrorMessagge("Error al cargar el combo de O.S.");
            });
    }

    loadForm() {
        if (this.patientMedicalInsurance) this.isNew = false;
        else this.patientMedicalInsurance = new PatientMedicalInsurance();
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            socialNumber: [this.patientMedicalInsurance.socialNumber, Validators.required],
            carnetNumber: [this.patientMedicalInsurance.carnetNumber, Validators.required],
            fDueDate: [this.patientMedicalInsurance.fDueDate, Validators.required],
            byDefault: [this.patientMedicalInsurance.byDefault, null],
        })
    }

    onSubmit() {
        const expirationDate = moment(this.form.value.fDueDate, 'DD/MM/YYYY').toDate();
        this.patientMedicalInsurance.expirationDate = moment(expirationDate).format('YYYY-MM-DD');
        this.patientMedicalInsurance.socialName = this.medicalInsuranceIAC.valueAuxIAC;
        const patientMedicalInsurance = Object.assign({}, this.patientMedicalInsurance, this.form.value);

        if (this.validateSameMedicalInsurance(patientMedicalInsurance)){
            this.toastyMessageService.showMessageToast("Obra social ya ingresada", "No puede asignar la misma obra social al mismo paciente", "warning");
        } else {
            if (this.isNew) {
                this.turnManagementService.addPMI(patientMedicalInsurance);
                this.toastyMessageService.showSuccessMessagge("Se añadio la O.S.");
                this.saveClick.emit();
            } else {
                this.turnManagementService.updatePMI(patientMedicalInsurance);
                this.toastyMessageService.showSuccessMessagge("Se modifico la O.S.");
                this.saveClick.emit();
            }
        }

    }

    // isValidMedicalInsuranceByDefault(patientMedicalInsurance: PatientMedicalInsurance) {
    //     let selectedDefault: boolean = false;
    //     var medicalInsuranceDefect = this.patientMedicalInsuranceService.newPatientMedicalInsurances.filter(
    //         m => m.byDefault == true);

    //     if (medicalInsuranceDefect.length <= 0 && !patientMedicalInsurance.byDefault){
    //         selectedDefault = false;
    //         this.toastyMessageService.showMessageToast("Debe seleccionar obra social por defecto", "Debe seleccionar obra social por defecto", "error");
    //     }else{
    //         if (medicalInsuranceDefect.length >= 1 && patientMedicalInsurance.byDefault){
    //             selectedDefault = false;
    //             this.toastyMessageService.showMessageToast("Debe seleccionar solo una obra social por defecto", "Debe seleccionar solo una obra social por defecto", "error");
    //         }
    //         else
    //         {
    //             selectedDefault = true;
    //         }
    //     }

    //     return selectedDefault;
    // }


    private validateSameMedicalInsurance(medicalInsurance: PatientMedicalInsurance){
        let exist: boolean = false;
        let medicalInsuranceFound = this.turnManagementService.getAllPMI().find((item: PatientMedicalInsurance) => {
            return item.socialNumber == medicalInsurance.socialNumber && item.id != medicalInsurance.id;
        })
        if (medicalInsuranceFound) exist = true;
        return exist;
    }


    onCancelButton(): void {
        this.openModalDiscardSubject.next();
    }

    discardChanges() {
        this.cancelClick.emit();
    }

}

