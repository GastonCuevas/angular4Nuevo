import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractOsService } from './../contract-os.service';
import { ContractOsPracticeService } from './../contract-os-practice.service'
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { FilterType } from '../../+shared/util';
import { GenericControl } from '../../+shared';
import { CommonService } from '../../+core/services';

@Component({
	selector: 'app-contract-os',
	templateUrl: 'contract-os-list.component.html'
})

export class ContractOsListComponent implements OnInit {
	reloadingData: boolean = false;

	controlsToFilter: Array<GenericControl> = [
        { key: 'medicalEnsurance', label: 'Obra social', type: 'autocomplete', class: 'col s12 m4', functionForData: this.commonService.getMedicalInsurances(), searchProperty: 'medicalInsuranceNumber' },
		{ key: 'dateFrom', label: 'Período Desde', type: 'date', class: 'col s6 m4', searchProperty: 'DateFrom'},
        { key: 'dateTo', label: 'Período Hasta', type: 'date', class: 'col s6 m4', searchProperty: 'DateTo'},
	];

	columns = [
		{ header: "Obra Social", property: 'medicalInsuranceName', searchProperty: 'os.medicalInsuranceAccount.name', elementFilter: new ElementFilter(FilterType.TEXT) },
		{ header: "Período Desde", property: "dateFrom", elementFilter: new ElementFilter(FilterType.DATE) },
		{ header: "Período Hasta", property: "dateTo", elementFilter: new ElementFilter(FilterType.DATE) }
	];

	constructor(
		public contractOsService: ContractOsService,
		public contractOsPracticeService: ContractOsPracticeService,
		private router: Router,
		public commonService: CommonService,
	) { }

	ngOnInit() {
		this.contractOsService.routeList = "archivos/contratosOs";
	}

	onActionClick(event: any) {
		switch (event.action) {
			case 'new':
				this.router.navigate(['archivos/contratosOs/formulario']);
				break;
			case 'edit':
				this.contractOsPracticeService.isNewPractice = false;
				this.router.navigate([`archivos/contratosOs/formulario/${event.item.number}`]);
				break;
			case 'detail':
				this.contractOsPracticeService.isNewPractice = false;
				this.router.navigate([`archivos/contratosOs/detalle/${event.item.number}`]);
				break;
			case 'copy':
				this.router.navigate([`archivos/contratosOs/formulario/${event.item.number}/clone`]);
				break;
			default:
				break;
		}
	}

	updateReloadingData(event: any) {
		this.reloadingData = event.value;
	}
}