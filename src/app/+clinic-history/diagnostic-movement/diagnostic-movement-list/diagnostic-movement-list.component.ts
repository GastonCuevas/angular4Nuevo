import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { ToastyMessageService } from '../../../+core/services';
import { DiagnosticMovementService } from '../diagnostic-movement.service';
import { DiagnosticMovement } from '../../../models';

@Component({
    selector: 'diagnostic-movement-list',
    templateUrl: './diagnostic-movement-list.component.html',
})
export class DiagnosticMovementListComponent {

    @Input() readOnly = false;
    @Output() actionClick = new EventEmitter<any>();
    @Output() onDiagnosticListEE = new EventEmitter<boolean>();

    diagnosticMovement: DiagnosticMovement;
    openModalDeleteSubject = new Subject();

    constructor(
        private toastyMessageService: ToastyMessageService,
        public diagnosticMovementService: DiagnosticMovementService
    ) {
    }

    onDiagnosticActionClick(event: any) {
        switch (event.action) {
            case 'new':
            case 'edit':
            case 'detail':
                this.actionClick.emit(event);
                break;
            case 'delete':
                this.diagnosticMovement = event.item;
                this.openModalDeleteSubject.next();
                break;
            default:
                break;
        }
    }

    deleteDiagnostic() {
        this.diagnosticMovementService.delete(this.diagnosticMovement);
        this.onDiagnosticListEE.emit();
        this.toastyMessageService.showSuccessMessagge('Se elimino el diagnóstico.');
    }

}
