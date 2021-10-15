import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PatientService } from '../patient.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { CommonService } from '../../+core/services/common.service';
import { UtilityService } from '../../+core/services/utility.service';
import { PatientMedicalInsuranceService } from '../patient-medical-insurance.service';
import { Patient } from '../../models/patient.model';
import { IColumn } from '../../+shared/util';
import { ClinicHistoryService } from '../../+clinic-history/clinic-history.service';

@Component({
	selector: 'app-patient-detail',
	templateUrl: './patient-detail.component.html',
	styleUrls: ['./patient-detail.component.scss']
})

export class PatientDetailComponent implements OnInit {
	public patient: Patient;
	public isLoaded: boolean = false;
	public src: any = require("../../images/default-image-profile.jpg");
    columns: Array<IColumn> = [
        { header: "Obra social", property: "medicalInsuranceName", searchProperty: 'medicalInsurance.medicalInsuranceAccount.name' },
        { header: "Nro de carnet", property: "carnetNumber" },
        { header: "Fecha de Vencimiento", property: "expirationDate" },
        { header: "Por Defecto", property: "yesOrNo" , disableSorting: true },
	];

	private patientId: number;
	constructor(
		public _patientService: PatientService,
		public patientMedicalInsuranceService: PatientMedicalInsuranceService,
		private _toastyService: ToastyMessageService,
		private _route: ActivatedRoute,
		private _commonService: CommonService,
		private _utilityService: UtilityService,
		private clinicHistoryService: ClinicHistoryService
	) { }

	ngOnInit() {
		this.patientId = Number(this._route.snapshot.paramMap.get('id'));
		this._patientService.account = this.patientId;
		this.getPatient(this.patientId);
	}

	getPatient(id: any) {
		this._patientService.get(id)
			.finally(() => this.isLoaded = true)
			.subscribe(
			result => {
				this.patient = result.model;
				this.patient.patientAccount = this.patient.account;
				this.patient.birthdate = this._utilityService.formatDate(result.model.birthdate, "", "DD/MM/YYYY");
				this.patientMedicalInsuranceService.patientNumber = id;
			},
			error => {
				this._toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al obtener los datos del paciente");
			});
		this._commonService.getImageAccount(+id)
			.subscribe(
			response => {
				if (!!response.model.file) this.src = `data:image/jpeg;base64,${response.model.file}`;
			},
			error => {
				this._toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al cargar la imagen");
			});
	}

	showClinicHistory() {
		this.clinicHistoryService.patientName = this.patient.account.name;
		this.clinicHistoryService.setCustomFilters();
		this._utilityService.navigate(`historiaclinica/listado/${this.patientId}`);
	}

}