import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ElementFilter } from './element-filter.model';

import * as Rx from 'rxjs';
import { FilterType } from '../util/constant';
import { ISort, IColumn, IPaginator } from '../../interface/';
import { CommonService } from '../../+core/services/common.service';
import { UtilityService } from '../../+core/services/utility.service';
import * as moment from 'moment';
import { GenericControl } from '../forms/controls';
import { PermissionService } from '../../+core/services/permission.service';
import { AbstractServiceBase } from '../util/index';
import { DynamicFilterComponent } from '../../+shared';
import { IconCustom } from '../util/icon-custom';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent implements OnInit, OnChanges {

    @ViewChild(DynamicFilterComponent) dfComponent: DynamicFilterComponent;

  @Input() title: string = "";
  @Input() columns: Array<IColumn>;
  @Input() controlsToFilter: GenericControl[];
  @Input() filterWithSubmit: false;
  @Input() initialFilter: string;
  @Input() isLoading = true;
  @Input() sourceData = new Array<any>();
  @Input() paginator: IPaginator = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 10
  };
  @Input() sourceService: AbstractServiceBase | any;
  @Input() methodNameForList = 'getAll';
  @Input() viewReport: boolean = false;

  @Output() actionClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() pageChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkboxChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadingChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() hideActions: boolean = false;
  @Input() hideFilters = false;
  @Input() refreshedAllowed = true;

  @Input() disabledEdit?: boolean;
  @Input() disabledDelete?: boolean;
  @Input() disabledDetail?: boolean;
  @Input() disabledNew?: boolean;
  @Input() disabledObs?: boolean;
  @Input() enabledClone?: boolean;
  @Input() enabledPrint: boolean;
  @Input() enableExportXml: boolean;
  @Input() enableExportJson: boolean;
  @Input() disableButtonFloating?: boolean;
  @Input() filterForm: boolean;

  @Input() reloadingData  = false;
  @Output() reloadingDataChange = new EventEmitter<any>();
  @Output() datePickerChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() allSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() allSelectEE = new EventEmitter<any>();
  @Output() itemSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() showSelected?: boolean = false;
  @Input() allSelected: boolean = false;
  @Input() selectedEnabled: boolean = false;
  @Input() permissionCode: string;
  @Input() sort: ISort = {
    sortBy: '',
    ascending: false
  };

  @Input() reloadingDataSource  = false;
  @Output() reloadingDataSourceChange = new EventEmitter<boolean>();
  @Output() filterChange = new EventEmitter<string>();
  @Input() iconCustom = new Array<IconCustom>();
  firstInit: boolean = false;
  pages: Array<any> = [];
  adjacentPagesCount = 2
  genericObject: any;
  properties: Array<any>;
  objectStructure: Array<Node>;
  private executionStack: any;
  colorButtonAdd: any = 'cyan';
  fromDateOptions = this.getDatePickerOptions('dateFrom');
  toDateOptions = this.getDatePickerOptions('dateTo');
  dateOptions = this.getDatePickerOptions('date');
  admissionDateOptions = this.getDatePickerOptions('admissionDate');
  birthDateOptions = this.getDatePickerOptions('birthdate');
  currentRow: number;
  isFiltering: boolean;

  constructor(
    private commonService: CommonService,
    private permissionService: PermissionService,
    public utilityService: UtilityService) {
    this.objectStructure = new Array<Node>();
    this.properties = new Array<any>();
    this.columns = new Array<IColumn>();
  }

  private formatJSON(nodes: Array<Node>, property?: string): string {
    let nP = nodes.filter((element) => {
      return element.parent == property
    });
    if (nP.length != 0) {
      let cad = new Array<string>();
      let result: string = '';

      for (let i in nP) {
        let nH = nodes.filter((element) => {
          return element.parent == nP[i].property
        });
        let stProperty = '"' + nP[i].property + '": ' + this.formatJSON(nodes, nP[i].property);
        cad.push(stProperty);
      }
      for (let i in cad) {
        if (+i == (cad.length - 1)) {
          result += cad[i];
        } else {
          result += cad[i] + ',';
        }
      }
      return result = '{' + result + '}';

    } else {
      return '""';
    }
  }

  private converterToObject(items: Array<any>): any {
    for (let x in items) {
      let auxI = items[x].split('.');
      for (let y in auxI) {
        let n;
        if (y == '0') {
          n = new Node(auxI[y], '');
        } else {
          n = new Node(auxI[y], auxI[+y - 1]);
        }
        this.objectStructure.push(n);
      }
    }
    let aux = this.objectStructure.filter((element) => {
      return element.parent == ''
    });
    let auxDelete: Array<any> = new Array<{ property: string, quantity: number }>();

    for (let i in aux) {
      if (auxDelete.filter((element) => { return element.property == aux[i].property }).length == 0) {
        let r = aux.filter((element) => {
          return element.property == aux[i].property
        });
        if (r.length != 1) {
          auxDelete.push({ property: r[0].property, quantity: r.length - 1 });
        }
      }

    }

    for (let i in auxDelete) {
      const cant = auxDelete[i].quantity;
      const property = auxDelete[i].property;
      for (let i = 0; i < cant; i++) {
        let index = this.objectStructure.findIndex((element) => {
          return element.property == property
        });
        this.objectStructure.splice(index, 1);
      }
    }
    return JSON.parse(this.formatJSON(this.objectStructure, ''));

  }

  private createObject(): any {
    if (this.columns) {
      for (let i in this.columns) {
        if (this.columns[i].elementFilter) {
          this.properties.push(this.columns[i].property);
        }
      }
      return this.converterToObject(this.properties);
    }
    return null;
  }

  public getColorButtonAdd() {
    return this.colorButtonAdd;
  }

  containsFilter(f: any) {
    return f.elementFilter != undefined ? true : false;
  }

  changeInput(event: any, property: string) {
    let value = event['srcElement']['value'];
    if (!(value === this.getPropByString(this.genericObject, property))) {
      this.executionStack.next(this.getPropByString(this.genericObject, property, value));
    }
  }

  debounce() {
    this.executionStack = new Rx.Subject();
    this.executionStack = this.executionStack.debounceTime(650);
    this.executionStack.subscribe((val: any) => {
      this.paginator.currentPage = 1;
      this.paginator.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10
      this.updateTable();
    });
  }

    private queryGenerator(): string {
    const arrayAux = new Array<any>();
    let result: string = '';

    for (let c in this.columns) {
      if (this.columns[c].elementFilter != undefined) {
        arrayAux.push(this.columns[c]);
      }
    }
    let addItem = 0;
    for (let x in arrayAux) {
      const property = arrayAux[x].searchProperty || arrayAux[x].property;
      const value = this.getPropByString(this.genericObject, arrayAux[x].property);
      const type = (arrayAux[x].elementFilter as ElementFilter).typeFilter;
      if (value !== "") {
        switch (type) {
        case FilterType.NAME:
            var words: string[] = value.replace(/,/g, '').toLowerCase().split(' ');
            var firstWord = true;
            result += (addItem == 0 ? '' : ' and ') + words.reduce((res, w) => {
                if (!w) return res;
                res += (firstWord ? '' : ' and ') + `${property}.toLower().contains("${w}")`;
                if (firstWord) firstWord = false;
                return res;
            }, '');
            break;
          case FilterType.TEXT: {
            result += (addItem == 0 ? '' : ' and ') + property + '.toLower().contains("' + value.toLowerCase() + '")';
          } break;
          case FilterType.NUMBER: {
            result += (addItem == 0 ? '' : ' and ') + property + '.toString().contains("' + value + '")';
          } break;
          case FilterType.DATE:
            result += (addItem == 0 ? '' : ' and ') + property + this.getSignByProperty(property) + '"' + value + '"';
            break;
        }
        addItem++;
      }
    }

    if (result != '') {
      return result;
    } else {
      return '';
    }
  }

  objectToCheckbox: any = {};
  ngOnInit() {
    for (let i = 0; i < this.columns.length; i++) {
      if (!this.columns[i].disableSorting) {
        const property: string = this.columns[i].searchProperty || this.columns[i].property;
        if (!this.sort.sortBy) {
          this.sort.sortBy = property;
          this.sort.ascending = true;
        }
        break;
      }
    }
    this.setObjectToCheckbox();
    this.objectStructure = new Array<Node>();
    this.properties = new Array<any>();
    this.genericObject = this.createObject();
    this.paginator.currentPage = 1;
    this.paginator.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10
    this.debounce();
    this.firstInit = true;

    this.initComponentValues();
    if (!this.controlsToFilter) {
        if (this.sourceService) {
          this.updateTable(this.initialFilter);
        } else {
          this.calculatePages();
              }
    }
    this.fromDateOptions.max = false;
    this.toDateOptions.max = false;
    this.managePermissions();
  }

  private initComponentValues() {
    if (this.sourceService instanceof AbstractServiceBase) {
      if (this.sourceService.columns) this.columns = this.sourceService.columns;
      if (this.sourceService.controlsToFilter) this.controlsToFilter = this.sourceService.controlsToFilter;
    }
  }

  private setObjectToCheckbox() {
    this.columns.forEach(c => {
      if (c.type == 'checkbox') this.objectToCheckbox[c.property] = false;
    });
  }

  private getDatePickerOptions(property: any) {
    return {
      format: 'dd/mm/yyyy',
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      today: 'Hoy',
      clear: 'Borrar',
      close: 'Cerrar',
      selectYears: 100,
      selectMonths: true,
      max: true,
      labelMonthNext: 'Próximo mes',
      labelMonthPrev: 'Mes anterior',
      labelMonthSelect: 'Selecciona un mes',
      labelYearSelect: 'Selecciona un año',
      closeOnSelect: true,
      formatSubmit: 'yyyy/mm/dd',
      // hiddenPrefix: 'lowDate',
      hiddenName: true,
      onSet: (value: any) => {
        var eventDate: any = {
          srcElement: {
            value: ''
          },
        };

        if (value.select) {
          var selectedDate = "/Date(" + value.select + ")/";
          var formatDate: string = moment("/Date(" + value.select + ")/").format("MM/DD/YYYY");
          eventDate.srcElement.value = formatDate;
          this.changeInput(eventDate, property);
        } else {
          if (value.clear === null) {
            eventDate.srcElement.value = '';
            this.changeInput(eventDate, property);
          }
        }
      }
    }
  }

  ngAfterViewInit(): void {
    // this.commonService.mySubject.subscribe((x: any) => {
    //   this.colorButtonAdd = x.colorBackgroundHeader;
    // });
  }

  getSignByProperty(property: any) {
    let sign: any = "";
    switch (property) {
      case 'dateFrom':
        sign = ">=";
        break;
      case 'dateTo':
        sign = "<=";
        break;
      case 'birthdate':
        sign = "=";
      default:
        sign = "=";
        break;
    }
    return sign;
  }

  updateTable(filterBy?: string) {
    let query: string;
    if (filterBy) query = filterBy;
    else if (this.initialFilter) query = this.initialFilter;
      else query = this.queryGenerator();
    this.isFiltering = true;
    if (this.sourceService) {
      if (query != '') {
        this.sourceService[this.methodNameForList](this.paginator, query, this.sort)
            .finally(() => { this.isFiltering = false; this.isLoading = false; })
          .subscribe((result: any) => {
            this.sourceData = result.model;
            this.paginator.totalItems = result.itemsCount;
            this.calculatePages();
            this.updateLoading(false);
            this.reloadingDataChange.emit({ value: false });
            this.reloadingDataSourceChange.emit(false);
            if (this.refreshedAllowed) this.refresh(this.sourceData);
            this.onAllSelect(this.allSelected);
            this.setChecksToSelectAll();
          })
      } else {
        this.sourceService[this.methodNameForList](this.paginator, null, this.sort)
          .finally(() => { this.isFiltering = false; this.isLoading = false; })
          .subscribe((result: any) => {
            this.sourceData = result.model;
            this.paginator.totalItems = result.itemsCount;
            this.calculatePages();
            this.updateLoading(false);
            this.reloadingDataChange.emit({ value: false });
            this.reloadingDataSourceChange.emit(false);
            if (this.refreshedAllowed) this.refresh(this.sourceData);
            this.onAllSelect(this.allSelected);
            this.setChecksToSelectAll();
          })
      }
    }
  }

  private refresh(list: any) {
    for (let i in list) {
      const head = Object.keys(list[i]);
      for (let e in head) {
        switch (head[e]) {
          case "dateFrom":
            list[i][head[e]] = this.utilityService.formatDateFE(list[i][head[e]]) || "Sin definir";
            break;
          case "dateTo":
            list[i][head[e]] = this.utilityService.formatDateFE(list[i][head[e]]) || "Sin definir";
            break;
          //deprecated
          // case "date":
          //       list[i][head[e]] = this.utilityService.formatDateFE(list[i][head[e]]) || list[i][head[e]];
          //   break;
          case "expirationDate":
            list[i][head[e]] = this.utilityService.formatDateFE(list[i][head[e]]) || "Sin definir";
            break;
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.firstInit && this.sourceService && this.reloadingData) {
      this.updateTable(this.initialFilter);
    }
    if (this.reloadingDataSource) this.updateTable(this.initialFilter);
  }

  getPropByString(obj: any, propString: string, value?: any): any {
    if (!propString)
      return obj;

    var prop, props = propString.split('.');

    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i];

      var candidate = obj[prop];
      if (candidate !== undefined) {
        obj = candidate;
      } else {
        break;
      }
    }

    if (value || (value === "")) {
      obj[props[i]] = value;
    }
    return obj[props[i]];
  }

  // Actions Events
  onActionClick(action: string, item?: any) {
    // this.actionClick.emit({ action: action, item: item, prueba: this.initialFilter, prueba2: this.arraydegeneric })
    this.actionClick.emit({ action: action, item: item })
  }

  onCheckboxChange(item: any, c: IColumn, checked: boolean) {
    item[c.property] = checked;
    // this.checkboxChange.emit({ item, checked });
    this.actionClick.emit({ action: 'checkbox', item: item })
    this.setCheckToSelectAll(c);
  }

  private setCheckToSelectAll(column: IColumn) {
    let checked = true;
    let quantityElements = 0;
    this.sourceData.forEach(i => {
      if (column.hideColumnBy) {
        if (!i[column.hideColumnBy]) {
          quantityElements++;
          if (!i[column.property]) checked = false;
        }
      } else {
        quantityElements++;
        if (!i[column.property]) checked = false;
      }
    });
    this.objectToCheckbox[column.property] = quantityElements == 0 ? false : checked;
  }

  private setChecksToSelectAll() {
    this.columns.forEach(c => {
      if (c.type == 'checkbox') this.setCheckToSelectAll(c);
    });
  }

  selectAll(column: IColumn, checked: boolean, sourceData: Array<any>) {
    this.sourceData.forEach(item => item[column.property] = checked);
    this.setCheckToSelectAll(column);
    // $(`.checkbox-${property}`).prop( 'checked', checked);
    this.allSelectEE.emit({ property: column.property, checked: checked, dataSource: sourceData });
  }

  // Pagination Events
  selectPageSize() {
    this.paginator.currentPage = 1;
    this.emitChange();
  }

  calculatePages() {
    let pagesCount = Math.ceil(this.paginator.totalItems / this.paginator.pageSize);
    this.pages = [];
    for (var i = 1; i <= pagesCount; i++)
      this.pages.push(i);
  }
  previousPage() {
    if (this.paginator.currentPage == 1)
      return;
    this.paginator.currentPage--;
    this.emitChange();
  }
  nextPage() {
    if (this.paginator.currentPage == this.pages.length)
      return;
    this.paginator.currentPage++;
    this.emitChange();
  }
  selectPage(page: any) {
    if (this.paginator.currentPage == page)
      return;
    this.paginator.currentPage = page;
    this.emitChange();
  }

  showActions() {
    return !this.disabledEdit || !this.disabledDelete || !this.disabledNew || !this.disabledDetail;
  }

  emitChange() {
    if (this.sourceService) {
      this.updateTable(this.initialFilter);
    } else {
      this.pageChange.emit(this.paginator);
    }
  }

  // selectedAllChange() {
  //   if (this.showSelected) $(".checkbox-selected-item").prop( "checked", this.allSelected);
  // }

  updateLoading(newValue: boolean) {
    this.isLoading = newValue;
    this.loadingChange.emit({ value: newValue });
  }

  getProperty(propString: string): any {
    const props = propString.split('.');
    return props[props.length - 1];
  }

  changeSorting(column: IColumn) {
    const property: string = column.searchProperty || column.property;
    if (!column.disableSorting && this.sourceData.length > 0) {
      if (this.sort.sortBy == property) {
        this.sort.ascending = !this.sort.ascending;
      } else {
        this.sort.sortBy = property;
        this.sort.ascending = true;
        // this.updateTable();
      }
      this.updateTable(this.initialFilter);
    }
  }

  selectedClass(column: IColumn): string {
    const property: string = column.searchProperty || column.property;
    if (column.disableSorting || this.sourceData.length <= 0) {
      return '';
    }
    return property == this.sort.sortBy ? 'sortable sort-' + this.sort.ascending : 'sortable';
  }

  // show or hide filters
  showFilters(): boolean {
    if (this.sourceData.length <= 0 && this.queryGenerator() === '') {
      return false;
    }
    return true;
  }

  onFilterChange(filterBy: string) {
    this.paginator.currentPage = 1;
    this.initialFilter = filterBy;
      this.updateTable(filterBy);
      this.filterChange.emit();
  }

  onItemSelect(data: any, checked: boolean) {
    this.itemSelect.emit({ data, checked });
  }

  onAllSelect(checked: boolean) {
    this.allSelected = checked;
    $(".checkbox-selected-item").prop("checked", checked);
    this.allSelect.emit(checked);
  }

  select(index: number, item: any) {
    this.currentRow = index;
    this.selectedChange.emit(item);
  }

  managePermissions() {
    const permissions = this.permissionService.getPermissions(this.permissionCode);
    this.disabledNew = this.disabledNew || !permissions.canAdd;
    this.disabledEdit = this.disabledEdit || !permissions.canEdit;
    this.disabledDelete = this.disabledDelete || !permissions.candDelete;
    this.disableButtonFloating = this.disableButtonFloating || !permissions.canPrint;
    this.enabledClone = this.enabledClone && permissions.canAdd;
    this.enabledPrint = this.enabledPrint && permissions.canPrint;
  }

  getTextIcon(key : string){
    const element = this.iconCustom.find(x => x.key == key);
    switch(key){
      case 'edit': return (element && element.icon) || 'fa fa-pencil';
      case 'delete': return (element && element.icon) || 'fa fa-trash';
      case 'detail': return (element && element.icon) || 'fa fa-search-plus';
      case 'copy': return (element && element.icon) || 'fa fa-clone';
      case 'print': return (element && element.icon) || 'fa fa-print';
      case 'exportXml': return (element && element.icon) || 'fa fa-cloud-download';
      case 'exportJson': return (element && element.icon) || 'fa fa-cloud-download';
      case 'obs': return (element && element.icon) || 'fa fa-info-circle';
    }
  }

  getTextTooltip(key : string){
    const element = this.iconCustom.find(x => x.key == key);
    switch(key){
      case 'edit': return (element && element.tooltip) || 'Editar';
      case 'delete': return (element && element.tooltip) || 'Eliminar';
      case 'detail': return (element && element.tooltip) || 'Detalle';
      case 'copy': return (element && element.tooltip) || 'Clonar';
      case 'print': return (element && element.tooltip) || 'Imprimir';
      case 'exportXml': return (element && element.tooltip) || 'Exportar a Xml';
      case 'exportJson': return (element && element.tooltip) || 'Exportar a Json';
      case 'obs': return (element && element.tooltip) || 'Observación';
    }
  }
}

class Node {
  property: string;
  parent: string;
  value: any;
  constructor(property: string, parent: string, value?: any) {
    this.property = property;
    this.parent = parent;
    this.value = value ? value : null;
  }
}