import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { PharmacySchemeItemService } from '../pharmacy-scheme-item.service';
import { HcEvolutionSchemeService } from '../hc-evolution-scheme.service';

@Component({
    selector: 'hc-evolution-scheme-list',
    templateUrl: 'hc-evolution-scheme-list.component.html',
    styleUrls: ['./hc-evolution-scheme-list.component.scss']
})

export class HcEvolutionSchemeListComponent {
    chSchemeId: string;
    reloadingData = false;
    modalDeleteSubject: Subject<any> = new Subject();

    @Output() actionClick = new EventEmitter<any>();
    @Input() patientMovementId: number;
    @Output() actionSelected = new EventEmitter<any>();

    constructor(
        public hcEvolutionSchemeService: HcEvolutionSchemeService,
        private _toastyService: ToastyMessageService
    ) {
    }

    onActionClick(event: any) {
        switch (event.action) {
            case 'new':
            case 'edit':
            case 'detail':
                this.actionClick.emit(event);
                break;
            case 'delete':
                this.chSchemeId = event.item.idCode;
                if (!!this.chSchemeId) this.modalDeleteSubject.next();
                break;
            default:
                break;
        }
    }

    deleteScheme() {
        const result = this.hcEvolutionSchemeService.delete(this.chSchemeId);
        let message: string;
        if (result) {
            message = 'Se elimino el esquema correctamente';
            this.chSchemeId = '';
            this.reloadingData = true;
        } else message = 'No se pudo eliminar el esquema';
        this._toastyService.showSuccessMessagge(message);
    }

    updateReloadingData(event: any) {
        this.reloadingData = event.value;
    }

    selectedChange(item: any) {
        const last = item.pharmacySchemes.reduce((e: number, scheme: any)=>{ return scheme.id > e ? scheme.id : e; },0);
        this.actionSelected.emit(last);
    }
}