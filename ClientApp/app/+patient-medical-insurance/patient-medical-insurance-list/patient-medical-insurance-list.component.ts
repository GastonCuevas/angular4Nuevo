import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MedicalInsurance } from '../../models/medical-insurance.model';
import { PatientMedicalInsuranceService } from '../patient-medical-insurance.service';
import { Subject } from 'rxjs';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { TypeFilter } from '../../+shared/constant';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { PatientMedicalInsurance } from '../../models/patient-medical-insurance.model';
import { PatientService } from '../../+patient/patient.service';

@Component({
    selector: 'patient-medical-insurance-list',
    templateUrl: 'patient-medical-insurance-list.component.html'
})

export class PatientMedicalInsuranceListComponent implements OnInit {
    patientMedicalInsuranceId: number = 0;
    medicalInsurance: MedicalInsurance = new MedicalInsurance();
    reloadingData: boolean = false;
    deleteModalSubject: Subject<any> = new Subject();
    elements: Array<ElementFilter>;
    id: any;
    patient: any;
    patientMedicalInsurance: any;
    patientName: string = "";
    

    columns = [
        { header: "Denominación", property: "medicalInsurance.medicalInsuranceAccount.denomination", elementFilter: new ElementFilter(TypeFilter.TEXT) },
        { header: "Nro de carnet", property: "carnetNumber", elementFilter: new ElementFilter(TypeFilter.NUMBER) },
        { header: "Fecha de Vencimiento", property: "expirationDate"},
        { header: "Por Defecto", property: "default"},  
    ]

    paginator = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0
    }
   
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public patientMedicalInsuranceService: PatientMedicalInsuranceService,
        public toastyMessageService: ToastyMessageService,
        public patientService: PatientService
    ) { 
        
    }

    ngOnInit() { 
        this.patientService.get(this.patientMedicalInsuranceService.patientNumber).subscribe(response => {
            this.patient = response.model;
            if(this.patient.patientAccount.name) {
                this.patientMedicalInsuranceService.patientName = this.patient.patientAccount.name;
            }
        }, error => {
            this.toastyMessageService.showErrorMessagge("Ocurrio un error al traer los datos");
        })
    }

    onActionClick(event: any) {
        switch (event.action) {
            case 'new':
                this.router.navigate(['pacienteObraSocial/obraSocial/'+this.patientMedicalInsuranceService.patientNumber+'/formulario']);
                break;

            case 'edit':
                this.router.navigate([`pacienteObraSocial/obraSocial/`+this.patientMedicalInsuranceService.patientNumber+`/formulario/${event.item.number}`])
                break;

            case 'delete':
                this.patientMedicalInsuranceId = event.item.number;
                if (this.patientMedicalInsuranceId) {
                    this.deleteModalSubject.next();
                }
                break;
            default:
                break;
        }
    }

    onDeleteConfirm(event: any) {
        this.patientMedicalInsuranceService.delete(this.patientMedicalInsuranceId)
            .subscribe((resp: any) => {
                this.toastyMessageService.showMessageToast("Exito", "Se elimino correctamente", "success");
                this.reloadingData = true;
            },
            (error: any) => {
                this.toastyMessageService.showErrorMessagge();
            });
    }

    updateReloadingData(event: any) {
        this.reloadingData = event.value;
    }

    goBack() {
        this.router.navigate(['archivos/pacientes/formulario/'+this.patientMedicalInsuranceService.patientNumber]);
    }
}