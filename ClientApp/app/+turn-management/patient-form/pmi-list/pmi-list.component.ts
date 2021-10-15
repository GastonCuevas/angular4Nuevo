import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { Subject, Observable } from 'rxjs';

import { ToastyMessageService } from '../../../+core/services';
import { TurnManagementService } from '../../turn-management.service';
import { PatientMedicalInsurance } from '../../util';

@Component({
    selector: 'pmi-list',
    templateUrl: 'pmi-list.component.html',
    styleUrls: ['pmi-list.component.scss']
})
export class PMIListComponent implements OnInit {

    dataSource: Array<PatientMedicalInsurance> = new Array<PatientMedicalInsurance>();
    openModalDeleteSubject: Subject<any> = new Subject();

    private idPMIToRemove: number;

    @Output() newOrEditEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() dataSourceChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private toastyMessageService: ToastyMessageService,
        private turnManagementService: TurnManagementService,
    ) {
    }

    ngOnInit() {
        this.loadDataSource();
    }

    private loadDataSource() {
        this.dataSource = this.turnManagementService.getAllPMI();
        this.dataSourceChange.emit();

    }

    onActionClick(action: string, item?: PatientMedicalInsurance) {
        switch (action) {
            case 'new':
                this.newOrEditEvent.emit(null);
                break;
            case 'edit':
                // this.turnManagementService.sf.idTurn = item.numInt;
                this.newOrEditEvent.emit(item);
                break;
            case 'delete':
                if (item) this.idPMIToRemove = item.id;
                this.openModalDeleteSubject.next();
                break;
            case 'detail':
                break;
            default:
                break;
        }
    }

    deleteItem() {
        this.turnManagementService.deletePMI(this.idPMIToRemove);
        this.toastyMessageService.showSuccessMessagge("Se elimino exitosamente.");
        this.loadDataSource();
    }

    reloadData() {
        // this.updateTable();
    }

}
