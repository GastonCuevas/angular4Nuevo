import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { ToastyMessageService, CommonService, UtilityService } from '../../../+core/services';
import { ClinicHistoryPharmacySchemeService } from '../clinic-history-pharmacy-scheme.service';
import { PharmacyScheme } from '../../../models/pharmacy-scheme.model';

@Component({
    selector: 'clinic-history-pharmacy-scheme-form',
    templateUrl: './clinic-history-pharmacy-scheme-form.component.html'
})

export class ClinicHistoryPharmacySchemeFormComponent implements OnInit {
    pharmacyScheme = new PharmacyScheme();
    form: FormGroup;
    modalDiscardSubject: Subject<any> = new Subject();
    articles: Array<any>;
    loadingArticles = false;
    public datePickerOptions: any;
    public isActiveDate = true;

    @Output() close = new EventEmitter<any>();

    constructor(
        public chPharmacySchemeService: ClinicHistoryPharmacySchemeService,
        private fb: FormBuilder,
        private _toastyService: ToastyMessageService,
        private _commonService: CommonService,
        private _utilityService: UtilityService
    ) {
    }

    ngOnInit() {
        this.loadArticles();
        this.loadForm();
    }

    ngAfterViewChecked() {
        $('#observation').trigger('autoresize');
    }

    private loadArticles() {
        this.loadingArticles = true;
        this.chPharmacySchemeService.getArticles()
            .finally(() => this.loadingArticles = false)
            .subscribe(
            response => {
                this.articles = response.model;
            },
            error => {
                this._toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Error al cargar el combo de artículos');
            });
    }

    private loadForm() {
        this.datePickerOptions = this._utilityService.getDatePickerOptions();
        if (!this.chPharmacySchemeService.isNew) this.pharmacyScheme = this.chPharmacySchemeService.scheme;
        this.createForm();
    }

    private createForm() {
        this.form = this.fb.group({

            articleCode: [this.pharmacyScheme.articleCode, Validators.required],
            quantity: [this.pharmacyScheme.quantity, Validators.required],
            date: [this.pharmacyScheme.date, Validators.required],
            time: [this.pharmacyScheme.time, Validators.required],
            // posology: [this.pharmacyScheme.posology, Validators.required],
            observation: [this.pharmacyScheme.observation, null]
        });
    }

    save() {
        const pharmacyScheme: PharmacyScheme = Object.assign({}, this.pharmacyScheme, this.form.value);
        if (this.chPharmacySchemeService.exists(pharmacyScheme)) { this._toastyService.showErrorMessagge('Ya existe el artículo'); return; }
        pharmacyScheme.articleName = this.getArticleName(pharmacyScheme.articleCode);
        const result = this.chPharmacySchemeService.update(pharmacyScheme);
        let message: string;
        if (result) {
            message = `El esquema ha sido modificado'`;
            this.close.emit();
        } else message = 'No se pudo modificar el esquema';
        this._toastyService.showSuccessMessagge(message);
    }

    private getArticleName(articleCode: string) {
        const article = this.articles.find((d: any) => d.id === articleCode);
        return !article ? '' : article.name;
    }

    cancel() {
        this.modalDiscardSubject.next();
    }

    closeForm() {
        this.close.emit();
    }
}