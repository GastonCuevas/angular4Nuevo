import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { ToastyMessageService, UtilityService } from '../../+core/services';
import { HolidayService } from '../holiday.service';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { FilterType, EventDynamicTable, IColumn } from '../../+shared/util';
import { DynamicTableComponent, GenericControl } from '../../+shared';

@Component({
    selector: 'app-holiday-list',
    templateUrl: './holiday-list.component.html',
    styleUrls: ['./holiday-list.component.scss']
})
export class HolidayListComponent implements OnInit {

    @ViewChild(DynamicTableComponent) dtComponent: DynamicTableComponent;

    holidayId: number;
    deleteModalSubject = new Subject<any>();
    columns: Array<IColumn> = [
      { header: "Fecha", property: "date", type: 'date' },
      { header: "Descripción", property: "description" }
    ];

    controlsToFilter: Array<GenericControl> = [
        { key: 'date', label: 'Fecha', type: 'date', class: 'col s12 m6' },
        { key: 'description', label: 'Descripcion', type: 'text', class: 'col s12 m6' }
    ];
    
    constructor(
        private utilityService: UtilityService,
        private toastyMessageService: ToastyMessageService,
        public holidayService: HolidayService,
    ) {}

    ngOnInit() {}

    onActionClick(event: EventDynamicTable) {
        switch(event.action){
            case 'new':
                this.utilityService.navigate('archivos/feriados/formulario');
                break;
            case 'edit':
                this.utilityService.navigate(`archivos/feriados/formulario/${event.item.number}`);
                break;
            case 'delete':
                this.holidayId = event.item.number;
                if(this.holidayId) this.deleteModalSubject.next();
                break;
            default:
                break;
        }
    }

    onDeleteConfirm() {
        this.holidayService.delete(this.holidayId)
            .subscribe(
            resp => {
                this.toastyMessageService.showSuccessMessagge('Se elimino correctamente.');
                this.dtComponent.updateTable();
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'No se pudo eliminar.');
            });
    }

}
