import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { PatientResponsibleService } from './../patient-responsible.service';
import { GenericControl } from '../../+shared';
import { CommonService } from '../../+core/services';

@Component({
	selector: 'app-patient-responsible-list',
	templateUrl: 'patient-responsible-list.component.html'
})

export class PatientResponsibleListComponent implements OnInit {
	patientResponsibleId: 0;
	deleteModalSubject: Subject<any> = new Subject();
	reloadingData: boolean = false;
	
	controlsToFilter: Array<GenericControl> = [
		{ key: 'name', label: 'Nombre', type: 'text', class: 'col s12 m6', searchProperty: 'responsible.name' },
		{ key: 'address', label: 'Direccion', type: 'text', class: 'col s12 m6', searchProperty: 'responsible.address' },
		{ key: 'phone', label: 'Telefono', type: 'text', class: 'col s12 m6', searchProperty: 'responsible.phone' },
		{ key: 'patientName', label: 'Paciente', type: 'text', class: 'col s12 m6', searchProperty: 'patient.PatientAccount.Name' }
    ];
	columns = [
		{ header: "Nombre", property: "responsible.name" },
		{ header: "Domicilio", property: "responsible.address" },
		{ header: "Telefono", property: "responsible.phone" },
		{ header: "Paciente", property: "patientName" }
	];

	constructor(
		public patientResponsibleService: PatientResponsibleService,
		private router: Router,
		private toastyService: ToastyMessageService,
		public commonService: CommonService,
	) { }

	ngOnInit() {
	}

	onActionClick(event: any) {
		switch (event.action) {
			case 'new':
				this.router.navigate(['archivos/pacientesResponsable/formulario'])
				break;

			case 'edit':
				this.router.navigate([`archivos/pacientesResponsable/formulario/${event.item.responsibleId}`])
				break;

			case 'delete':
				this.patientResponsibleId = event.item.responsibleId;
				if (this.patientResponsibleId) this.deleteModalSubject.next();
				break;

			case 'detail':
				this.router.navigate([`archivos/pacientesResponsable/detalle/${event.item.responsibleId}`]);
				break;

			default:
				break;
		}
	}

	onDeleteConfirm() {
		this.patientResponsibleService.delete(this.patientResponsibleId).subscribe(
			() => {
				this.patientResponsibleId = 0;
				this.reloadingData = true;
				this.toastyService.showSuccessMessagge("Se elimino correctamente");
			},
			error => {
				this.toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error inesperado");
			});
	}

	updateReloadingData(event: any) {
		this.reloadingData = event.value;
	}
}