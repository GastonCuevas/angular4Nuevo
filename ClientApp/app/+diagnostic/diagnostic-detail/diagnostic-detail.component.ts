import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ToastyMessageService } from '../../+core/services';
import { DiagnosticService } from '../diagnostic.service';
import { Diagnostic } from '../../models';

@Component({
    selector: 'his-diagnostic-detail',
    templateUrl: './diagnostic-detail.component.html'
})

export class DiagnosticDetailComponent implements OnInit {

    diagnostic: Diagnostic;
    isLoad = false;

    constructor(
        private _diagnosticService: DiagnosticService,
        private _activatedRoute: ActivatedRoute,
        private _toastyService: ToastyMessageService
    ) {
    }

    ngOnInit() {
        const id = Number(this._activatedRoute.snapshot.paramMap.get('id'));
        this.getDiagnostic(id);
    }

    private getDiagnostic(id: number) {
        this._diagnosticService.getById(id)
            .finally(() => this.isLoad = true)
            .subscribe(
            result => {
                this.diagnostic = result.model;
            },
            error => {
                this._toastyService.showToastyError(error, "Ocurrio un error al obtener los datos");
            });
    }
}
