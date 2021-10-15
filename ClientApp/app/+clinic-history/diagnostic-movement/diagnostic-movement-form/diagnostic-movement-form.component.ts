import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { ToastyMessageService } from '../../..//+core/services';
import { DiagnosticService } from '../../../+diagnostic/diagnostic.service';
import { DiagnosticMovement, Diagnostic } from '../../../models';
import { DiagnosticMovementService } from '../diagnostic-movement.service';
import { IColumn } from '../../../+shared/util';
import { InputSearchComponent } from '../../../+shared';

@Component({
    selector: 'diagnostic-movement-form',
    templateUrl: './diagnostic-movement-form.component.html',
})
export class DiagnosticMovementFormComponent implements OnInit {

    @Input() patientMovementId: number;
    @Output() close = new EventEmitter<any>();
    @ViewChild('diagnosticIS') diagnosticIS: InputSearchComponent;

    columnsForIS: Array<IColumn> = [
        { header: "Codigo", property: "code", filterType: 'text' },
        { header: "Descripción", property: "name", searchProperty: "description", filterType: 'text' }
    ];
    form: FormGroup;
    diagnosticMovement = new DiagnosticMovement();
    openModalDiscardSubject = new Subject();

    constructor(
        private fb: FormBuilder,
        private toastyMessageService: ToastyMessageService,
        public diagnosticService: DiagnosticService,
        public diagnosticMovementService: DiagnosticMovementService
    ) {
    }

    ngOnInit() {
        this.loadForm();
    }

    private loadForm() {
        if (!this.diagnosticMovementService.isNew) this.diagnosticMovement = this.diagnosticMovementService.diagnosticMovement;
        this.createForm();
    }

    private createForm() {
        this.form = this.fb.group({
            diagnosticId: [this.diagnosticMovement.diagnosticId, Validators.required],
            hierarchy: [this.diagnosticMovement.hierarchy, Validators.required]
        });
    }

    saveDiagnostic() {
        const diagnonsticMovement: DiagnosticMovement = Object.assign({}, this.diagnosticMovement, this.form.value);
        diagnonsticMovement.patientMovementId = this.patientMovementId;
        diagnonsticMovement.name = this.diagnosticIS.valueAux;

        if (this.diagnosticMovementService.exists(diagnonsticMovement)) {
            this.toastyMessageService.showErrorMessagge('Ya existe el diagnostico.');
            return;
        }
        let message: string;
        const result = this.diagnosticMovementService.save(diagnonsticMovement);
        if (result) {
            message = `El diagnostico ha sido ${this.diagnosticMovementService.isNew ? 'agregegado.' : 'modificado.'}`;
            this.close.emit();
        } else message = 'No se pudo guardar los gambios';
        this.toastyMessageService.showSuccessMessagge(message);
    }

    onCancelBtnDiagnostic() {
        this.openModalDiscardSubject.next();
    }

    discardChanges() {
        this.close.emit();
    }

}
