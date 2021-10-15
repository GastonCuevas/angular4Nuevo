import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { Subject } from 'rxjs';

import { ToastyMessageService, CommonService, LoadingGlobalService } from '../../+core/services';
import { ProfessionalService } from "./../professional.service";
import { GenericControl, DynamicTableComponent } from '../../+shared';
import { EventDynamicTable } from '../../+shared/util';

@Component({
    selector: 'app-professional-list',
    templateUrl: './professional-list.component.html',
    styleUrls: ['./professional-list.component.css']
})

export class ProfessionalListComponent implements OnInit {

    @ViewChild(DynamicTableComponent) dtComponent: DynamicTableComponent;

    openModalDeleteSubject = new Subject();
    controlsToFilter: Array<GenericControl> = [
        { key: 'name', label: 'Apellido y/o Nombre', type: 'name', class: 'col s12 m6', searchProperty: 'professionalAccount.name' },
        { key: 'address', label: 'Direccion', type: 'text', class: 'col s12 m6', searchProperty: 'professionalAccount.address' },
        { key: 'enrollment', label: 'Matricula', type: 'number', class: 'col s12 m6', searchProperty: 'enrollment' },
        { key: 'email', label: 'Email', type: 'text', class: 'col s12 m6', searchProperty: 'professionalAccount.mail' },
    ];
	columns = [
        { header: "Apellido y Nombre", property: "name", searchProperty: "professionalAccount.name" },
        { header: "Direccion", property: "address", searchProperty: "professionalAccount.address" },
        { header: "Matricula", property: "enrollment", searchProperty: "enrollment" },
        { header: "E-mail", property: "email", searchProperty: "professionalAccount.mail" },
    ];

    private profesionalId: 0;

    constructor(
        public _profesionalService: ProfessionalService,
        private _router: Router,
        private _toastyService: ToastyMessageService,
        public commonService: CommonService,
        private loadingGlobalService: LoadingGlobalService,
    ) { }

    ngOnInit() {}

    onActionClick(event: EventDynamicTable) {
        switch (event.action) {
            case 'new':
                this._router.navigate(['/gestionProfesionales/profesionales/formulario'])
                break;
            case 'edit':
                this._router.navigate([`/gestionProfesionales/profesionales/formulario/${event.item.number}`])
                break;
            case 'delete':
                this.profesionalId = event.item.number;
                if (this.profesionalId) this.openModalDeleteSubject.next();
                break;
            case 'detail':
                this._router.navigate([`/gestionProfesionales/profesionales/detalle/${event.item.number}`])
                break;
            default:
                break;
        }
    }

    private deleteProfessional() {
        this.loadingGlobalService.showLoading('Eliminando Profesional...');
        this._profesionalService.delete(this.profesionalId)
            .finally(() => this.loadingGlobalService.hideLoading())
            .subscribe(
            result => {
                this.profesionalId = 0;
                this.dtComponent.updateTable();
                this._toastyService.showSuccessMessagge("Se elimino correctamente");
            },
            error => {
				this._toastyService.showToastyError(error, 'Ocurrio un error al intentar eliminar el profesional.');
            });
    }

}
