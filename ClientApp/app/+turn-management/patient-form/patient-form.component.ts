import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { CommonService, ToastyMessageService, UtilityService } from '../../+core/services';
import { Patient, PatientMedicalInsurance } from '../util';
import { InputAutoComplete } from '../../+shared';
import { TurnManagementService } from '../turn-management.service';
import { MedicalInsuranceService } from '../../+medical-insurance/medical-insurance.service';
import { MedicalInsurance } from '../../models/medical-insurance.model';

@Component({
    selector: 'patient-form',
    templateUrl: 'patient-form.component.html',
    styleUrls: ['./patient-form.component.scss'],
})

export class PatientFormComponent implements OnInit {

    patient: Patient = new Patient();
    // openModalSubject: Subject<any> = new Subject();
    patientForm: FormGroup;
    isLoading: boolean = true;
    identTypeName: string = 'DNI';

    private selectedProvince: number;

    documentTypes: Array<any> = new Array<any>();
    zones: Array<any> = new Array<any>();
    provinces: Array<any> = new Array<any>();
    localities: Array<any> = new Array<any>();
    medicalInsurances: Array<any> = new Array<any>();

    isNewOrEditPMI: boolean = false;

    patientMedicalInsurance: PatientMedicalInsurance;
    defaultMedicalInsurance: MedicalInsurance;

    private formStatus: boolean = false;

    @Output() formChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() listPMIChange: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('localityIAC') localityIAC: InputAutoComplete;

    constructor(
        private fb: FormBuilder,
        private commonService: CommonService,
        private utilityService: UtilityService,
        private toastyMessageService: ToastyMessageService,
        public medicalInsuranceService: MedicalInsuranceService,
        private turnManagementService: TurnManagementService,
    ) { }

    ngOnInit() {
        this.loadCombos();
        this.loadDefaultMedicalInsurance();
        this.loadForm();
    }

    private loadCombos() {
        Observable.forkJoin(
            this.commonService.getIdentifiers(),
            this.commonService.getZones(),
            this.commonService.getProvinces()
        ).subscribe((response: Array<any>) => {
            this.documentTypes = response[0].model || [];
            this.zones = response[1].model || [];
            this.provinces = response[2].model || [];
            this.isLoading = false;
        },
        error => {
            this.toastyMessageService.showErrorMessagge('Ocurrio un error al cargar los combos');
        });
    }


    private loadDefaultMedicalInsurance(){
        this.medicalInsuranceService.getDefault().subscribe(
            response => {
                this.defaultMedicalInsurance = response.model;
                let defaultPMI: PatientMedicalInsurance = new PatientMedicalInsurance();
                defaultPMI.socialNumber = this.defaultMedicalInsurance.accountNumber;
                defaultPMI.socialName = this.defaultMedicalInsurance.medicalInsuranceAccount.name;
                defaultPMI.carnetNumber = '';
                defaultPMI.byDefault = true;
                defaultPMI.isParticular = true;

                this.turnManagementService.addPMI(defaultPMI);
                this.reloadListPMI();
            },
            error => {
                this.toastyMessageService.showErrorMessagge('Error al cargar la O.S. por defecto');
            });
    }

    onChangeDT() {
        const value = this.documentTypes.find(d => d.number == this.patientForm.value.patientIdentifierType);
        this.identTypeName = value.name;
    }

    private loadForm() {
        this.patient.patientIdentifierType = 0;
        this.createForm();
    }

    private createForm() {
        this.patientForm = this.fb.group({
            patientName: [ this.patient.patientName, Validators.required],
            patientIdentifierType: [this.patient.patientIdentifierType, Validators.required],
            patientIdentifier: [this.patient.patientIdentifier, Validators.required],
            zone: [this.patient.zone, Validators.required],
            province: [null, null],
            locality: [this.patient.locality, Validators.required],
            // phone: [this.patient., null],
            // movil: [this.patient., null],
        });
    }

    onChangeProvince() {
        if (this.selectedProvince != this.patientForm.value.province) {
            this.selectedProvince = this.patientForm.value.province;
            this.getLocalities();
        }
    }

    private getLocalities() {
        this.commonService.getLocalities(this.selectedProvince, 1).subscribe(
            response => {
                this.localities = response.model || [];
                this.resetLocalityCombo(this.localities);
            },
            error => {
                this.toastyMessageService.showErrorMessagge('Error al cargar el combo de Localidades');
            });
    }

    private resetLocalityCombo(source: Array<any>) {
        this.localityIAC.updateSource(source);
        this.localityIAC.updateValue(null);
    }

    addOrEditPMI(item: PatientMedicalInsurance) {
        this.patientMedicalInsurance = item;
        this.isNewOrEditPMI = true;
    }

    validateForm() {
        // console.log('en validateForm this.patientForm.valid ---->>> ' + this.patientForm.valid);
        if (this.patientForm.valid != this.formStatus) {
            this.formStatus = this.patientForm.valid;
            const patient: Patient = Object.assign({}, this.patient, this.patientForm.value);
            this.formChange.emit(this.patientForm);
        }
    }

    reloadListPMI() {
        this.listPMIChange.emit();
    }

}