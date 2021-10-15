import { Component, OnInit } from '@angular/core';
import { PatientMedicalInsurance } from '../../models/patient-medical-insurance.model';
import { PatientMedicalInsuranceService } from '../patient-medical-insurance.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilityService } from '../../+core/services/utility.service';
import { Subject } from 'rxjs';
import * as jquery from 'jquery';
import { CommonService } from '../../+core/services/common.service';
import * as moment from 'moment';


@Component({
    selector: 'patient-medical-insurance-form',
    templateUrl: 'patient-medical-insurance-form.component.html',
    styleUrls: ['./patient-medical-insurance-form.component.css']
})

export class PatientMedicalInsuranceFormComponent implements OnInit {
    patientMedicalInsurance: PatientMedicalInsurance = new PatientMedicalInsurance();
    itemValue: number = 0;
    title: string = "Nueva Obra Social de Paciente";
    isNew: boolean = false;
    isEdit: boolean = false;
    form: FormGroup;
    isLoading: boolean = false;
    openModalSubject: Subject<any> = new Subject<any>();
    datePickerOptions: any;
    medicalInsurances: Array<any> = new Array<any>(); 
    auxListMedicalInsurance: Array<any> = new Array<any>();
    nameMedicalInsurance: string = "";
    isLoadingMedicalInsurance: boolean = false;

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
        this.datePickerOptions.formatSubmit = 'dd/mm/yyyy';
        this.loadForm();
        this.loadMedicalInsurance();
    }

    loadMedicalInsurance() {
        this.commonService.getMedicalInsurances().subscribe(response => {
            this.medicalInsurances = response.model;
            this.auxListMedicalInsurance = new Array<any>();
            this.medicalInsurances.forEach((e) => {
                this.auxListMedicalInsurance.push(e.name);
            })
        })
    }

    loadMedicalInsuranceName(medicalEnsuranceId: any) {
        for (let i in this.medicalInsurances) {
            if (this.medicalInsurances[i].number == medicalEnsuranceId) {
                this.nameMedicalInsurance = this.medicalInsurances[i].name;
                this.isLoadingMedicalInsurance = true;
            }
        }
    }

    getMedicalInsuranceEdit(medicalId: number) {
        this.commonService.getMedicalInsurances().subscribe(response => {
            this.medicalInsurances = response.model;
            this.auxListMedicalInsurance = new Array<any>();
            this.medicalInsurances.forEach((e) => {
                this.auxListMedicalInsurance.push(e.name);
            })
            this.loadMedicalInsuranceName(this.patientMedicalInsurance.socialNumber);
        })
    }

    customCallbackMedical(event: any) {
        this.nameMedicalInsurance = event;
        this.isLoadingMedicalInsurance = true;
        let a = this.medicalInsurances.find((e: any) => {
            return e.name.toLowerCase() == event.toLowerCase();
        })
        if (a) {
            this.patientMedicalInsurance.socialNumber = a.number;
            this.nameMedicalInsurance = a.name;
            this.isLoadingMedicalInsurance = true;
        }
    }

    validateNameMedical(event: any) {
        if (event == "") {
            this.nameMedicalInsurance = "";
            this.patientMedicalInsurance.socialNumber = 0;
            this.isLoadingMedicalInsurance = false;
        } else {
            let a = this.medicalInsurances.find((e: any) => {
                return e.name.toLowerCase() == event.toLowerCase();
            })
            if (!a) {
                this.nameMedicalInsurance = "";
                this.patientMedicalInsurance.socialNumber = 0;
                this.isLoadingMedicalInsurance = false;
            }
        }
    }

    loadForm() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id) this.getPatientMedicalInsurance(id);
        else this.createForm();
    }

    createForm() {
        var a = this.patientMedicalInsurance
        this.form = this.fb.group({
            name: [this.patientMedicalInsurance.patientName, null],
            carnetNumber: [this.patientMedicalInsurance.carnetNumber, Validators.required],
            expirationDate: [this.patientMedicalInsurance.expirationDate, Validators.required],
            byDefault: [this.patientMedicalInsurance.byDefault, null],
        })
    }

    getPatientMedicalInsurance(id: any) {
        this.isEdit = true;
        this.title = "Editar Obra Social de Paciente";
        this.isLoading = true;
        this.patientMedicalInsuranceService.get(id)
            .finally(() => this.isLoading = false)
            .subscribe(response => {
                this.patientMedicalInsurance = response.model;
                if(this.patientMedicalInsurance.expirationDate != null) {
                    var expirationDate = moment(this.patientMedicalInsurance.expirationDate.toString().split(' ')[0],'D/M/YYYY').toDate() ;
                    this.patientMedicalInsurance.expirationDate = moment(expirationDate).format('DD/MM/YYYY');
                }
                
                this.createForm();
                if(this.patientMedicalInsurance.socialNumber) {
                    this.getMedicalInsuranceEdit(+this.patientMedicalInsurance.socialNumber);  
                }
        },
            error => {
                this.toastyMessageService.showErrorMessagge("Ocurrio un error al obtener los datos del responsable");
        })
    }

    onSubmit($event: any) {
        var expirationDate = moment(this.form.value.expirationDate, 'DD/MM/YYYY').toDate();
        this.patientMedicalInsurance.expirationDate = moment(expirationDate).format('YYYY/MM/DD');
        this.patientMedicalInsurance.patientNumber = this.patientMedicalInsuranceService.patientNumber;
        const patientMedicalInsurance = Object.assign({}, this.patientMedicalInsurance, this.form.value);
        
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        if (!id) {
            this.patientMedicalInsuranceService.add(patientMedicalInsurance).subscribe(
                response => {
                    this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios.");
                    this.utilityService.navigate("pacienteObraSocial/obraSocial/"+this.patientMedicalInsurance.patientNumber);
                },
                error => {
                    this.toastyMessageService.showErrorMessagge(error.message || "Ocurrio un error al guardar los datos");
                });
        } else {
            this.patientMedicalInsuranceService.update(id, patientMedicalInsurance).subscribe(
                response => {
                    this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
                    this.utilityService.navigate("pacienteObraSocial/obraSocial/"+this.patientMedicalInsurance.patientNumber);
                },
                error => {
                    this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrió un error al guardar los cambios");
                }
            )
        }
    }   

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onAgree() {
        this.utilityService.navigate("pacienteObraSocial/obraSocial/"+this.patientMedicalInsuranceService.patientNumber);
    }

    
}