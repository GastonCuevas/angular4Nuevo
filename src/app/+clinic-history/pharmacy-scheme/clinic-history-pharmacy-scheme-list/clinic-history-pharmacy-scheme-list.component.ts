import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { ClinicHistoryPharmacySchemeService } from '../clinic-history-pharmacy-scheme.service';
import { ToastyMessageService } from '../../../+core/services/toasty-message.service';
import { IntelligentReportComponent } from '../../../+shared';

@Component({
    selector: 'clinic-history-pharmacy-scheme-list',
    templateUrl: 'clinic-history-pharmacy-scheme-list.component.html',
    styleUrls: ['clinic-history-pharmacy-scheme-list.component.scss']
})

export class ClinicHistoryPharmacySchemeListComponent {
    chSchemeId: string;
    modalDeleteSubject: Subject<any> = new Subject();
    medicineScheme: any;

    @Input() readOnly: boolean;
    @Output() actionClick = new EventEmitter<any>();
    @ViewChild('iReport') iReport: IntelligentReportComponent;

    constructor(
        public chPharmacySchemeService: ClinicHistoryPharmacySchemeService,
        private _toastyService: ToastyMessageService
    ) {
    }

    ngOnInit() {
        this.chPharmacySchemeService.getAllMedicineScheme().subscribe((result: any) => {
            this.medicineScheme = result.model;
        });
    }

    onActionClick(action: any, item: any, index: any) {
        switch (action) {
            case 'new':
            case 'edit':
                this.actionClick.emit({ action: action, item: item, index: index });
                break;
            case 'detail': break;
            case 'delete':
                this.chSchemeId = index;
                if (!!item) this.modalDeleteSubject.next();
                break;
            default:
                break;
        }
    }

    deleteScheme() {
        const result = this.chPharmacySchemeService.deleteMedicineScheme(this.chSchemeId);
        let message: string;
        if (result) {
            message = 'Se elimino el esquema correctamente';
            this.chSchemeId = '';
        } else message = 'No se pudo eliminar el esquema';
        this._toastyService.showSuccessMessagge(message);
    }

    printReportSicknesses() {
        this.iReport.generateReport(0, 4000);
    }
}