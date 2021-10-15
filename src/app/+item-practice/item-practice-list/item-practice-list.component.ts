import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { FilterType } from '../../+shared/util';
import { Subject } from 'rxjs/Subject';
import { AssignedPracticeTypeService } from '../assigned-practice-type.service';
import { ItemPracticeService } from '../item-practice.service';
import { IColumn } from '../../interface/column.interface';
import { GenericControl } from '../../+shared';
import { LoadingGlobalService } from '../../+core/services';

@Component({
  selector: 'app-item-practice-list',
  templateUrl: './item-practice-list.component.html',
  styleUrls: ['./item-practice-list.component.scss']
})
export class ItemPracticeListComponent implements OnInit {

  itemPracticeId: number;
  deleteModalSubject: Subject<any> = new Subject<any>();
  
  controlsToFilter: Array<GenericControl> = [
    { key: 'name', label: 'Nombre', type: 'text', class: 'col s12 m5', searchProperty: 'name' },
    { key: 'type', label: 'Tipo', type: 'select', class: 'col s12 m3', options: [{number: 0, name: 'Todos'}, {number: 1, name: 'string'}, {number: 2, name: 'memo'}, {number: 3, name: 'decimal'}, {number: 4, name: 'integer'}, {number: 5, name: 'date'}, {number: 6, name: 'time'}, {number: 7, name: 'table'}], value: 0, searchProperty: 'type'},
    { key: 'option', label: 'Opcion ', type: 'select', class: 'col s12 m4', options: [{number: 0, name: 'Todos'}, {number: 1, name: 'Si'}, {number: -1, name: 'No'}], value: -1 },
    { key: 'description', label: 'Descripción', type: 'text', class: 'col s12 m6', searchProperty: 'description' },
    { key: 'default', label: 'Por Defecto', type: 'text', class: 'col s12 m6', searchProperty: 'default' },
  ];
  
  constructor(
    public itemPracticeService: ItemPracticeService,
    public assignedPractice: AssignedPracticeTypeService,
    private router: Router,
    public toastyMessageService: ToastyMessageService,
    private loadingGlobalService: LoadingGlobalService
  ) { }

  ngOnInit() {
  }

  columns: Array<IColumn>  = [
    { header: "Orden", property: "order" },
    { header: "Nombre", property: "name" },
    { header: "Tipo", property: "itemType.name" },
    { header: "Descripción", property: "description" },
    { header: "Por Defecto", property: "default" },
    { header: "Opcion", property: "option", type: 'checkbox', disableSorting: true, disabled: true }
  ]

  paginator = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0
  }

  onActionClick(event: any) {
    switch(event.action){
      case 'new':
        this.router.navigate(['archivos/practicasItems/formulario']);
        break;
      case 'edit':
        this.router.navigate([`archivos/practicasItems/formulario/${event.item.numint}`]);
        break;
      case 'delete':
        this.itemPracticeId = event.item.numint
        if(this.itemPracticeId){
          this.deleteModalSubject.next();
        }
        break;
      case 'assignedPractices':
        this.router.navigate([`"archivos/practicasItems/assignedPractice/formulario/${event.item.numint}`]);
        break;
      default:
        break;
    }
  }

  onDeleteConfirm() {
    this.loadingGlobalService.showLoading('Eliminando Item de Practica...');
    this.itemPracticeService.delete(this.itemPracticeId)
      .finally(() => this.loadingGlobalService.hideLoading())
      .subscribe((resp: any) => {
        this.toastyMessageService.showMessageToast("Exito", "Se elimino correctamente", "success");
      },
      (error: any) => {
        this.toastyMessageService.showErrorMessagge(error.errorMessage);
      });
  }
}
