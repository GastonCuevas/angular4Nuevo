import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { DiagnosticService } from '../diagnostic.service';
import { Diagnostic } from '../../models';
import { ToastyMessageService, UtilityService } from '../../+core/services';

@Component({
    selector: 'his-diagnostic-form',
    templateUrl: './diagnostic-form.component.html',
    styleUrls: ['./diagnostic-form.component.scss']
})
export class DiagnosticFormComponent implements OnInit {

    diagnostic = new Diagnostic();
    isLoading = false;
    isSaving = false;
    form: FormGroup;
    openModalDiscardSubject = new Subject();
    id: number;

    constructor(
        private fb: FormBuilder,
        private _diagnosticService: DiagnosticService,
        private _activatedRoute: ActivatedRoute,
        private _utilityService: UtilityService,
        private _toastyService: ToastyMessageService
    ) {
        this.id = Number(this._activatedRoute.snapshot.paramMap.get('id'));
    }

    ngOnInit() {
        this.loadForm();
    }

    private loadForm() {
        if (this.id) this.getDiagnostic();
        else this.createForm();
    }

    private createForm() {
        this.form = this.fb.group({
            code: [this.diagnostic.code, Validators.required],
            name: [this.diagnostic.name, Validators.required]
        });
    }

    saveDiagnostic() {
        this.isSaving = true;
        Object.assign(this.diagnostic, this.form.value);
        const result = this.id ? this._diagnosticService.update(this.diagnostic) : this._diagnosticService.insert(this.diagnostic);

        result
            .finally(() => { this.isSaving = false; })
            .subscribe(
            result => {
                this._toastyService.showSuccessMessagge("Se guardaron los cambios");
                this._utilityService.navigate("archivos/diagnosticos");
            },
            error => {
                this._toastyService.showToastyError(error, "Ocurrio un error al guardar los datos");
            });
    }

    private getDiagnostic() {
        this.isLoading = true;
        this._diagnosticService.getById(this.id)
            .finally(() => this.isLoading = false)
            .subscribe(
            result => {
                this.diagnostic = result.model;
                this.createForm();
            },
            error => {
                this._toastyService.showToastyError(error, "Ocurrio un error al obtener los datos.");
            });
    }

    onCancelButton() {
        this.openModalDiscardSubject.next();
    }

    discardChanges() {
        this._utilityService.navigate("/archivos/diagnosticos");
    }
}
