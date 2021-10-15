import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';

import { Professional } from '../../models/professional.model';
import { ProfessionalService } from '../professional.service';
import { ContractProfessionalService } from '../../+contract-professionals/contract-professional.service';
import { CommonService } from '../../+core/services/common.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from '../../+core/services/utility.service';
import { Options, ImageResult } from 'ngx-image2dataurl';
import { ValidationService } from './../../+shared/forms/validation.service';
import * as jquery from 'jquery';

@Component({
    selector: 'app-professional-form',
    templateUrl: './professional-form.component.html',
    styleUrls: ['./professional-form.component.scss']
})
export class ProfessionalFormComponent implements OnInit {

    public professional: Professional = new Professional();
    public loadingLocalityIAC = false;
    isSaving = false;
    functionForProvinces = this._commonService.getProvinces();
    public localities: Array<any>;
    public provinces: Array<any>;
    public zones: Array<any>;
    functionForAccountPl: Observable<any> = this._commonService.getAccountPlan();
    public categories: Array<any>;
    public identifiers: Array<any>;
    public grossinAliquots: Array<any>;
    public regIvas: Array<any>;
    public regIbrs: Array<any>;
    public isEdit: boolean = false;
    public openModalSubject: Subject<any> = new Subject();
    public fileImage: Blob;
    public cuitLabel: any = "Cuit/Cuil";
    public isLoading: boolean = false;
    public form: FormGroup;
    src: any = require("../../images/default-image-profile.jpg");
    isLoadingImage = false;
    public datePickerOptions: any;
    public intervalId: number = 0;
    public emailPattern = ValidationService.emailPattern;
    public id: any;
    options: Options = {
        resize: {
            maxHeight: 128,
            maxWidth: 128
        },
        allowedExtensions: ['JPG', 'PnG']
    };

    constructor(
        private fb: FormBuilder,
		private _professionalService: ProfessionalService,
		public contractProfessionalService: ContractProfessionalService,
        private _commonService: CommonService,
		private _route: ActivatedRoute,
		private _router: Router,
        private _utilityService: UtilityService,
        private _toastyService: ToastyMessageService
    ) {
        this.id = this._route.snapshot.paramMap.get('id');
        this.isEdit = !!this.id;
    }

    ngOnInit() {
        this.datePickerOptions = this._utilityService.getDatePickerOptions();
        this.loadCombos();
        this.loadForm();
    }

    private loadCombos() {
        Observable.forkJoin(
            this._commonService.getZones(),
            this._commonService.getCategories(),
            this._commonService.getIdentifiers(),
            this._commonService.getGrossinAliquot(),
            this._commonService.getRegIva(),
            this._commonService.getRegibr()
        ).subscribe((response: Array<any>) => {
            this.zones = response[0].model || [];
            this.categories = response[1].model || [];
            this.identifiers = response[2].model || [];
            this.grossinAliquots = response[3].model || [];
            this.regIvas = response[4].model || [];
            this.regIbrs = response[5].model || [];
        }, error => {
            this._toastyService.showErrorMessagge("Ocurrio un error al cargar los combos");
        });
    }

    loadForm() {
        if (this.isEdit) this.getPorfessional(this.id);
        else this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            surname: [this.professional.professionalAccount.surname, Validators.required],
            name: [this.professional.professionalAccount.name, Validators.required],
            birthDate: [this.professional.professionalAccount.birthDate, null],
            identi: [this.professional.professionalAccount.identi, Validators.required],
            cuit: [this.professional.professionalAccount.cuit, Validators.required],
            address: [this.professional.professionalAccount.address],
            quarter: [this.professional.professionalAccount.quarter],
            zone: [this.professional.professionalAccount.zone, Validators.required],
            fax: [this.professional.professionalAccount.fax, null],
            phone: [this.professional.professionalAccount.phone, null],
            movil: [this.professional.professionalAccount.movil, null],
            mail: [this.professional.professionalAccount.mail, null],
            www: [this.professional.professionalAccount.www, null],
            enrollment: [this.professional.enrollment, [Validators.min(0), Validators.max(100000000)]],
            matesp: [this.professional.matesp, null],
            repres: [this.professional.professionalAccount.repres, null],
            ivaReg: [this.professional.professionalAccount.ivaReg, Validators.required],
            ibrReg: [this.professional.professionalAccount.ibrReg, Validators.required],
            ingbru: [this.professional.professionalAccount.ingbru, null],
            aliibr: [this.professional.professionalAccount.aliibr, Validators.required],
            category: [this.professional.professionalAccount.category, Validators.required],
            bank: [this.professional.professionalAccount.bank, null],
            cbu: [this.professional.professionalAccount.cbu, null],
            highDate: [this.professional.professionalAccount.highDate, null],
            observation: [this.professional.professionalAccount.observation, null],
            enabled: [this.professional.professionalAccount.enabled, null],
            cause: [this.professional.professionalAccount.cause, null],
            province: [this.professional.professionalAccount.loc.province, Validators.required],
            locality: [this.professional.professionalAccount.locality, Validators.required],
            accountNumber: [this.professional.professionalAccount.accountNumber, Validators.required]
        });
        this.checkDuplicates();
    }

    checkDuplicates() {
        const identiCtrl = this.form.get('identi');
        const cuitCtrl = this.form.get('cuit');
        if (cuitCtrl && identiCtrl) {
            identiCtrl
                .valueChanges
                .switchMap(val => this._professionalService.checkDuplicates(val, cuitCtrl.value, this.id))
                .subscribe(val => {
                    cuitCtrl.setErrors(val.model ? { duplicate: val.model } : null);
                });
            cuitCtrl
                .valueChanges
                .debounceTime(500)
                .switchMap(val => this._professionalService.checkDuplicates(identiCtrl.value, val, this.id))
                .subscribe(val => {
                    cuitCtrl.setErrors(val.model ? { duplicate: val.model } : null);
                });
        }
    }

    saveProfessional() {
        this.isSaving = true;
        const professional = Object.assign({}, this.professional, this.form.value);
        professional.accountModel = Object.assign({}, this.professional.professionalAccount, this.form.value);
        professional.accountModel.birthDate = this._utilityService.formatDate(this.form.value.birthDate, "DD/MM/YYYY");
        professional.accountModel.highDate = this._utilityService.formatDate(this.form.value.highDate, "DD/MM/YYYY");
        professional.accountModel.name = professional.accountModel.surname +', '+ professional.accountModel.name;
        this._professionalService.save(professional).subscribe(
            response => {
                if (this.fileImage) {
                    this._commonService.uploadImage(response.model.account, this.fileImage)
                        .finally(() => { this.isSaving = false; })
                        .subscribe(
                        result => {
                            this._toastyService.showSuccessMessagge("Se guardaron los cambios");
                            this._utilityService.navigate("gestionProfesionales/profesionales");
                        },
                        error => {
                            this._toastyService.showSuccessMessagge("Se guardaron los cambios del formulario");
                            this._toastyService.showToastyError(error, "Error al subir la imagen");
                        });
                } else {
                    this.isSaving = false;
                    this._toastyService.showSuccessMessagge("Se guardaron los cambios");
                    this._utilityService.navigate("gestionProfesionales/profesionales");
                }
            },
            error => {
                this.isSaving = false;
                this._toastyService.showToastyError(error, "Ocurrio un error al guardar los datos");
            });
    }

    getPorfessional(id: number) {
        this.isLoading = true;
        this._professionalService.getProfessional(id)
            .finally(() => this.isLoading = false)
            .subscribe(
                result => {
                    this.professional = result.model;
                    this.professional.professionalAccount.birthDate = this._utilityService.formatDate(result.model.professionalAccount.birthDate, "", "DD/MM/YYYY");
                    this.professional.professionalAccount.highDate = this._utilityService.formatDate(result.model.professionalAccount.highDate, "", "DD/MM/YYYY");
                    this.getLocalities(result.model.professionalAccount.loc.province);
                    this.createForm();
					this.setCuilLabel();
					this.contractProfessionalService.professionalId = id;
					this.contractProfessionalService.routeList = `gestionProfesionales/profesionales/formulario/${id}`;
                },
                error => {
                    this._toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al obtener los datos del profesional");
                });
        this.loadImage();
    }

    private loadImage() {
        this.isLoadingImage = true;
        this._commonService.getImageAccount(this.id)
            .finally(() => this.isLoadingImage = false)
            .subscribe(
                response => {
                    if (!!response.model.file) this.src = `data:image/jpeg;base64,${response.model.file}`;
                },
                error => {
                    this._toastyService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al cargar la imagen");
                });
    }

    selected(event: any) {
        const image = <HTMLInputElement>document.getElementById('imgSRC');
        image.src = URL.createObjectURL(event.target.files[0]);
        this.fileImage = event.target.files[0];
    }

    getLocalities(provinceId: number) {
        this.loadingLocalityIAC = true;
        this._commonService.getLocalities(provinceId, 1)
            .finally(() => this.loadingLocalityIAC = false)
            .subscribe(
            result => {
                this.localities = result.model || [];
            }, error => {
                this._toastyService.showToastyError(error, 'No se pudieron cargar las Localidades.')
            });
    }

    setCuilLabel() {
        clearInterval(this.intervalId);
        if (!this.identifiers) {
            this.intervalId = setInterval(() => this.setCuilLabel(), 500);
            return;
        }
        this.onChangeIdenti();
    }

    onProvinceChange(item: {number: number, name: string}) {
        if (item.number) this.getLocalities(item.number);
        else this.localities = [];
    }

    onChangeIdenti() {
        const value = this.identifiers.find(d => d.number == this.form.value.identi);
        this.cuitLabel = value.name;
    }

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onAgree() {
        this._utilityService.navigate("gestionProfesionales/profesionales");
    }

    onClickFile() {
        (document.getElementById('file-input') as HTMLInputElement).click();
    }

	onActionClick(event: any) {
		switch (event.action) {
			case 'new':
				this._router.navigate([`gestionProfesionales/contratos/${this.id}/formulario`]);
				break;
			case 'edit':
				this._router.navigate([`gestionProfesionales/contratos/${this.id}/formulario/${event.item.number}`]);
				break;
			default:
				break;
		}
	}
}
