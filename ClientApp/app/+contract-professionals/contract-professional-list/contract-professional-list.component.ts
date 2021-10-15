import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ContractProfessionalService } from "./../contract-professional.service";
import { ProfessionalService } from "../../+professional/professional.service";
import { ToastyMessageService, UtilityService } from '../../+core/services';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { FilterType } from '../../+shared/util';
import { IntelligentReportComponent } from '../../+shared';
import { ModelForReport } from '../util/model-for-report';
import { ContractProfessional } from '../../models/contract-professional.model';

@Component({
	selector: 'app-contract-professional-list',
	templateUrl: './contract-professional-list.component.html',
	styleUrls: ['./contract-professional-list.component.scss']
})

export class ContractProfessionalListComponent implements OnInit {
	professional: any;
    @ViewChild('iReport') iReport: IntelligentReportComponent;

    columns = [
        { header: "Profesional", property: "professionalName", searchProperty: "prof.professionalAccount.name", elementFilter: new ElementFilter(FilterType.NAME) },
		{ header: "Valido desde", property: "dateFrom", elementFilter: new ElementFilter(FilterType.DATE) },
		{ header: "Valido hasta", property: "dateTo", elementFilter: new ElementFilter(FilterType.DATE) }
	];

    private professionalId: number;

    private modelForReport: ModelForReport;
    contractProfessional = new ContractProfessional();

	constructor(
		public contractProfessionalService: ContractProfessionalService,
		public professionalService: ProfessionalService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _toastyService: ToastyMessageService,
		private utilityService: UtilityService
	) {
		this.professionalId = Number(this._route.snapshot.paramMap.get('profesionalId'));
		this.contractProfessionalService.professionalId = this.professionalId;
	}

	ngOnInit() {
		if (this.professionalId) this.loadProfessionalContracts();
		else {
			this.contractProfessionalService.professionalName = "";
			this.contractProfessionalService.routeList = "gestionProfesionales/contratos";
		}
	}

	loadProfessionalContracts() {
		this.professionalService.getProfessional(this.contractProfessionalService.professionalId)
			.subscribe(
			result => {
				this.professional = result.model;
				this.contractProfessionalService.professionalName = this.professional.professionalAccount.name;
				this.contractProfessionalService.routeList = `gestionProfesionales/contratos/${this.professional.account}`;
			},
			error => {
				this._toastyService.showToastyError(error, "Ocurrio un error al obtener los datos del contrato");
			});
	}

	onActionClick(event: any) {
		switch (event.action) {
			case 'new':
				this._router.navigate([`gestionProfesionales/contratos/${this.contractProfessionalService.professionalId}/formulario`])
				break;
			case 'edit':
				this._router.navigate([`gestionProfesionales/contratos/${event.item.professionalNumber}/formulario/${event.item.number}`])
				break;
			//case 'detail':
			//    this._router.navigate([`gestionProfesionales/contratos/detalle/${event.item.number}`]);
			//    break;
			case 'copy':
				this._router.navigate([`gestionProfesionales/contratos/${event.item.professionalNumber}/clone/${event.item.number}`])
                break;
            case 'print':
                /*var professional;
                this.professionalService.getProfessional(event.item.professionalNumber)
                    .subscribe(
                        result => {
                            professional = result.model;
                            this.setModelForReport(result.model, event.item.number);
                            this.printReport();
                        },
                        error => {
                            this._toastyService.showToastyError(error, "Ocurrio un error al imprimir");
                        });*/
                    this.contractProfessionalService.get(event.item.number)
                    .subscribe(
                        response => {
                            this.setModelForReport(response.model);
                            this.printReport();
                        },
                        error => {
                            this._toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al obtener los datos del contrato');
                        });
                break;
			default:
				break;
		}
	}

	onReturn() {
        this.utilityService.navigate(`/gestionProfesionales/profesionales/formulario/${this.professionalId}`);
	}
    //

    //private setModelForReport(data: any, id: number) {
    private setModelForReport(data: any) {
        this.modelForReport = new ModelForReport();
        var hor = new Array<any>();
        var prac = new Array<any>();
        this.modelForReport.dateTo = this.utilityService.formatDateFE(data.dateFrom);
        this.modelForReport.dateFrom = this.utilityService.formatDateFE(data.dateTo);

        //this.modelForReport.professionalName = data.professionalAccount.name;
        /*this.modelForReport.professionalName = data.professionalAccount.denomination;
        this.modelForReport.observation = data.professionalAccount.observation;

        this.contractProfessionalService.get(id)
            .subscribe(
                response => {
                    this.contractProfessional = response.model;
                },
                error => {
                    this._toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al obtener los datos del contrato');
            });
        hor = this.contractProfessional.schedules;
        prac = this.contractProfessional.medicalInsuranceContracts;
        this.modelForReport.horarios = hor;
        this.modelForReport.practicas = prac;

        this.modelForReport.description = this.contractProfessional.description;
        this.modelForReport.fixedAmount = this.contractProfessional.fixedAmount;
        this.modelForReport.priceHs = this.contractProfessional.priceHs;
        */
        this.modelForReport.professionalName = data.professionalName;
        this.modelForReport.dateFrom = this.utilityService.formatDateFE(data.dateFrom);
        this.modelForReport.dateTo = this.utilityService.formatDateFE(data.dateTo);
        this.modelForReport.observation = data.observation;
        this.modelForReport.description = data.description;
        this.modelForReport.priceHs = data.priceHs;
        this.modelForReport.fixedAmount = data.fixedAmount;
        //hor = data.shedules;
        data.schedules.forEach((sch: any) => {
            hor.push(sch);

        });
        data.medicalInsuranceContracts.forEach((mic: any) => {
            prac.push(mic);

        });
        this.modelForReport.horarios = hor;
        //prac = data.medicalInsuranceContracts;
        this.modelForReport.practicas = prac;
        
       
    }

    private printReport() {
        this.iReport.generateReportWithData(this.modelForReport, 4006, true);
    }
}