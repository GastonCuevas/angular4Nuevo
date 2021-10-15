import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { PatientService } from '../patient.service';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { FilterType } from '../../+shared/util';
import { IColumn } from '../../interface/index';
import { GenericControl } from '../../+shared';
import { CommonService, UtilityService } from '../../+core/services';

@Component({
    selector: 'his-patient-list',
    templateUrl: './patient-list.component.html',
    styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
    patientId: 0;
    openModalSubject: Subject<any> = new Subject();
    reloadingDataSource = false;

    controlsToFilter: Array<GenericControl> = [
        { key: 'name', label: 'Apellido y/o Nombre', type: 'name', class: 'col s12 m6', searchProperty: 'patientAccount.name' },
        { key: 'cuit', label: 'Documento', type: 'text', class: 'col s12 m3', searchProperty: 'patientAccount.cuit' },
        { key: 'clinicHistoryNumber', label: 'Número  de H.C.', type: 'text', class: 'col s12 m3', searchProperty: 'clinicHistoryNumber' },
        { key: 'medicalEnsurance', label: 'Obra social', type: 'autocomplete', class: 'col s12 m6', functionForData: this.commonService.getMedicalInsurances(), searchProperty: 'medicalInsuranceNumber' },
        { key: 'address', label: 'Direccion', type: 'text', class: 'col s12 m6', searchProperty: 'patientAccount.address' },
    ];

    columns: Array<IColumn> = [
        { header: "Apellido y Nombre", property: "name", searchProperty: "patientAccount.name" },
        { header: 'Nº H.C.', property: "clinicHistoryNumber", searchProperty: "clinicHistoryNumber" },
        { header: "Documento", property: "cuit", searchProperty: "patientAccount.cuit" },
        { header: "Fecha de Nac.", property: "birthdate", searchProperty: "birthdate", type: 'date' },
        { header: "Edad", property: "years", disableSorting:true},
        { header: "Direccion", property: "address", searchProperty: "patientAccount.address" }
    ];

    constructor(
        public patientService: PatientService,
        private router: Router,
        private toastyService: ToastyMessageService,
        public commonService: CommonService,
    ) { }

    ngOnInit() {
    }

    onActionClick(event: any) {
        switch (event.action) {
            case 'new':
                this.router.navigate(['archivos/pacientes/formulario'])
                break;

            case 'edit':
                this.router.navigate([`archivos/pacientes/formulario/${event.item.number}`])
                break;

            case 'delete':
                this.patientId = event.item.number;
                if (this.patientId) this.openModalSubject.next();
                break;

            case 'detail':
                this.router.navigate([`archivos/pacientes/detalle/${event.item.number}`])
                break;

            default:
                break;
        }
    }

    onAgree() {
        this.patientService.delete(this.patientId).subscribe(
            result => {
                this.patientId = 0;
                this.reloadingDataSource = true;
                this.toastyService.showSuccessMessagge("Se elimino correctamente");
            },
            error => {
                this.toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error inesperado");
            });
    }

}
