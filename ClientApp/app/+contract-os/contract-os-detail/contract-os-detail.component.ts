import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ContractOs } from './../../models/contract-os.model';
import { ContractOsPractice } from './../../models/contract-os-practice.model';
import { ContractOsService } from './../contract-os.service';
import { ContractOsPracticeService } from './../../+contract-os/contract-os-practice.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from '../../+core/services/utility.service';
import { CommonService } from './../../+core/services/common.service';
import * as jquery from 'jquery';

@Component({
    selector: 'app-contract-os-detail',
    templateUrl: 'contract-os-detail.component.html'
})

export class ContractOsDetailComponent implements OnInit, AfterViewChecked {
	public contractOs: any;
	public isLoaded: boolean = false;

	constructor(
		public contractOsService: ContractOsService,
		public contractOsPracticeService: ContractOsPracticeService,
		private toastyMessageService: ToastyMessageService,
		private utilityService: UtilityService,
		private commonService: CommonService,
		private activatedRoute: ActivatedRoute
	) { }

	ngOnInit() {
		const id = this.activatedRoute.snapshot.paramMap.get('id');
		this.getContractOS(id);
		this.contractOsPracticeService.contractNumber = parseInt(id || '0');
	}

	ngAfterViewChecked() {
        $('#description').trigger('autoresize');
        $('#observation').trigger('autoresize');
    }

	getContractOS(id: any) {
		this.contractOsService.get(id)
			.finally(() => this.isLoaded = true)
			.subscribe(
			response => {
				this.contractOs = response.model;
				this.contractOs.dateFrom = this.utilityService.formatDate(response.model.dateFrom, '', 'DD/MM/YYYY');
				this.contractOs.dateTo = this.utilityService.formatDate(response.model.dateTo, '', 'DD/MM/YYYY');
				setTimeout(() => $('.materialize-textarea').trigger('autoresize'));
			},
			error => {
				this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al obtener los datos");
			});
	}
}