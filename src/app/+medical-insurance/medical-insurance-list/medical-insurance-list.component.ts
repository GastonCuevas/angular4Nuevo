import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { MedicalInsuranceService } from './../medical-insurance.service';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { FilterType } from '../../+shared/util';
import { GenericControl } from '../../+shared';
import { CommonService } from '../../+core/services';

@Component({
	selector: 'app-medical-insurance-list',
	templateUrl: './medical-insurance-list.component.html',
	styleUrls: ['./medical-insurance-list.component.scss']
})
export class MedicalInsuranceListComponent implements OnInit {
	medicalInsurancesId: number = 0;
	deleteModalSubject: Subject<any> = new Subject();
	reloadingDataSource = false;

	controlsToFilter: Array<GenericControl> = [
		{ key: 'name', label: 'Razón Social', type: 'text', class: 'col s12 m4', searchProperty: 'medicalInsuranceAccount.name' },
		{ key: 'province', label: 'Provincia', type: 'autocomplete', class: 'col s12 m4', functionForData: this.commonService.getProvinces(), searchProperty: 'medicalInsuranceAccount.loc.province' },
		{ key: 'locality', label: 'Localidad', type: 'text', class: 'col s12 m4', searchProperty: 'medicalInsuranceAccount.loc.name' },
	];

	columns = [
		{ header: "Razón Social", property: "medicalInsuranceAccount.name", elementFilter: new ElementFilter(FilterType.TEXT) },
		{ header: "Provincia", property: "medicalInsuranceAccount.loc.provinceEntity.name", elementFilter: new ElementFilter(FilterType.TEXT) },
		{ header: "Localidad", property: "medicalInsuranceAccount.loc.name", elementFilter: new ElementFilter(FilterType.TEXT) }
	];

	constructor(
		public medicalInsuranceService: MedicalInsuranceService,
		private router: Router,
		private toastyService: ToastyMessageService,
		public commonService: CommonService
	) { }

	ngOnInit() {
	}

	onActionClick(event: any) {
		switch (event.action) {
			case 'new':
				this.router.navigate(['archivos/obraSocial/formulario']);
				break;

			case 'edit':
				this.router.navigate([`archivos/obraSocial/formulario/${event.item.accountNumber}`]);
				break;

			case 'delete':
				this.medicalInsurancesId = event.item.accountNumber;
				if (this.medicalInsurancesId) this.deleteModalSubject.next();
				break;

			case 'detail':
				this.router.navigate([`archivos/obraSocial/detalle/${event.item.accountNumber}`]);
				break;

			default:
				break;
		}
	}

	onDeleteConfirm() {
		this.medicalInsuranceService.delete(this.medicalInsurancesId).subscribe(
			result => {
				this.medicalInsurancesId = 0;
				this.reloadingDataSource = true;
				this.toastyService.showSuccessMessagge("Se elimino correctamente");
			},
			error => {
				this.toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error inesperado");
			});
	}

}
