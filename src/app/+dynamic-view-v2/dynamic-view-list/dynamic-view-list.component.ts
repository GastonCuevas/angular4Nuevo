import { Component, OnInit, EventEmitter , ViewChild, AfterViewInit } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { NavBarService } from '../../+core/services/navbar.service';
import { Observable } from 'rxjs/Rx';
import { Navbar } from '../../models/navbar/navbar.model';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';

import { DynamicViewService } from '../dynamic-view.service';
import { DynamicViewFormComponent } from '../dynamic-view-form/dynamic-view-form.component';
import { Subject } from 'rxjs/Subject';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';

import * as Rx from 'rxjs';

// ---------------------------------------
import { Item } from '../../models/navbar/item.model';
import { Column, Sort, ElementFilter, EntityPropertyTable, GenericObject, Property, Parameter } from '../util';
import { FilterType, ContentModal, Paginator } from '../../+shared/util';
import { PermissionService } from '../../+core/services/permission.service';

@Component({
    selector: 'app-dynamic-view-list',
    templateUrl: 'dynamic-view-list.component.html',
    styleUrls: ['dynamic-view-list.component.scss']
})

export class DynamicViewListComponent implements OnInit, AfterViewInit {

    private item: Item;
    private idItemToRemove: number;
    public isLoading: boolean = true;

    private executionStack: any;
    public pages: Array<number> = new Array<number>();
    public adjacentPagesCount = 2;
    public paginator: Paginator = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 100
    }
    public sort: Sort = new Sort();


    private entityProperties: Array<EntityPropertyTable>;
    public columns: Array<Column> = new Array<Column>();
    public useCaseCode: any;
    private tableName: string;
    public title: string;
    private idItemProperty: string = 'number';

    public genericObject: GenericObject = new GenericObject();
    public genericCombo: any = new Object();
    public filter: any = new Object();
    showFilters: boolean = true;
    public dataSource: Array<any> = new Array<any>();

    @ViewChild(DynamicViewFormComponent) dynamicViewFormComponent: DynamicViewFormComponent;
    initSubject: Subject<any> = new Subject();
    openModalDeleteSubject: Subject<any> = new Subject();
    contentModalDelete: ContentModal;
    disabledNew: boolean;
    disabledEdit: boolean;
    disabledDelete: boolean;
    disabledPrint: boolean;

    constructor(
        private toastyMessageService: ToastyMessageService,
        private navbarService: NavBarService,
        private dynamicViewService: DynamicViewService,
        private activatedRoute: ActivatedRoute,
        private permissionService: PermissionService
    ) {
    }

    ngOnInit() {
        this.debounce();
        this.initPage();
    }

    ngAfterViewInit() {
    }

    debounce() {
        this.executionStack = new Rx.Subject();
        this.executionStack = this.executionStack.debounceTime(650);
        this.executionStack.subscribe((res: any) => {
          this.updateTable();
        });
    }

    async initPage() {
        this.navbarService.getNavbars().subscribe(
            (res) => {
                if (res.length != 0) {
                    this.useCaseCode = this.activatedRoute.snapshot.paramMap.get('codigo');
                    this.managePermissions();
                    this.isLoading = false;
                    this.item = this.navbarService.findItem(null, this.useCaseCode);
                    if (this.item) {
                        this.prepareObjects();
                    }
                }
            }
        );
    }

    private prepareObjects() {
        this.setTableName();
        this.setTitle();
        this.setContentModalDelete();
        this.dynamicViewService.getEntityPropertiesBy(this.tableName).subscribe(
            (res) => {
                this.entityProperties = res.model;
                this.loadColumns();
                this.setOrderByDefault();
                this.setIdItemProperty();
                this.initSubject.next(this.getParameter());
                this.updateTable();
            },
            (error) => {
                this.toastyMessageService.showMessageToast("ERROR", "Ocurrió un error", "error");
            }
        );
    }

    private setContentModalDelete() {
        this.contentModalDelete = {
            title: 'Eliminar ' + this.title,
            msg: '¿ Seguro que desea eliminar el elemento seleccionado ?',
            primaryBtnTxt: 'Si',
            secondaryBtnTxt: 'No',
            centered: true,
            width: '40%'
        };
    }

    private setTableName() {
        this.tableName = this.item.parame.split(',')[0].split('.')[1].toUpperCase();
    }

    private setTitle() {
        this.title = this.item.label;
    }

    private setIdItemProperty() {
        for (let ept of this.entityProperties) {
            if (ept.order === 1) this.idItemProperty = ept.propertyName.toLowerCase();
        }
    }

    private getParameter(): Parameter {
        let parameter: Parameter = new Parameter();
        parameter.entityProperties = this.entityProperties;
        parameter.tableName = this.tableName;
        parameter.useCaseCode = this.useCaseCode;
        parameter.title = this.title;
        parameter.idItemProperty = this.idItemProperty;
        return parameter;
    }

    private loadColumns() {
        for (let i = 1; i < this.entityProperties.length; i++) {
            if (!this.entityProperties[i].hideInTable) {
                let column: Column = new Column();
                //changed
                column.header = this.entityProperties[i].propertyName;
                if (this.entityProperties[i].foraignTable) {
                    column.property = (this.entityProperties[i].foraignField + this.entityProperties[i].foraignTable).toLowerCase();
                    column.disableSorting = true;
                    column.disableFilter = true;
                } else {
                    column.property = this.entityProperties[i].propertyName.toLowerCase();
                    if (this.entityProperties[i].type === 'int')  this.filter[column.property] = new ElementFilter(FilterType.NUMBER);
                    if (this.entityProperties[i].type === 'string')  this.filter[column.property] = new ElementFilter(FilterType.TEXT);
                }
                this.columns.push(column);
            }
        }
    }

    updateTable() {
        const filterBy: string = this.generateFilter();
        if (true) {
            this.dynamicViewService.getAll(this.tableName, this.paginator, filterBy, this.sort).subscribe(
                (res) => {
                    this.paginator.totalItems = res.itemsCount;
                    this.dataSource = res.model;
                    this.calculatePages();
                    this.showOrHideFilters();
                },
                (error) => {
                    this.toastyMessageService.showMessageToast("ERROR", "Ocurrió un error al cargar los datos", "error");
                }
            );
        }
    }

    // methods for ordination
    private setOrderByDefault() {
        for (let column of this.columns) {
            if (!column.disableSorting) {
                this.sort.sortBy = column.header;
                this.sort.ascending = true;
                break;
            }
        }
    }

    selectedClass(column: Column): string {
        if(column.disableSorting || this.dataSource.length === 0 ) {
            return '';
        }
        return column.header == this.sort.sortBy ? 'sortable sort-' + this.sort.ascending : 'sortable';
    }

    changeSorting(column: Column) {
        if(!column.disableSorting && this.dataSource.length > 0) {
          if (this.sort.sortBy == column.header) {
            this.sort.ascending = !this.sort.ascending;
            this.updateTable();
          } else {
            this.sort.sortBy = column.header;
            this.sort.ascending = true;
            this.updateTable();
          }
        }
    }

    // methods for filters
    private generateFilter(): string {
        let columnsWithFilter = new Array<Column>();
        let result: string = '';

        this.columns.forEach(c =>  { if (!c.disableFilter) columnsWithFilter.push(c); });

        let firstFilter = true;
        for (let c of columnsWithFilter) {
          if (this.filter[c.property].value !== '') {
            switch (this.filter[c.property].typeFilter) {
              case FilterType.TEXT: {
                result += (firstFilter ? '' : ' and ') + `${this.tableName}.${c.property} CONTAINING '${this.filter[c.property].value}'`;
              } break;
              case FilterType.NUMBER: {
                result += (firstFilter ? '' : ' and ') + `${this.tableName}.${c.property} CONTAINING '${this.filter[c.property].value}'`;
              } break;
            }
            if (firstFilter) firstFilter = false;
          }
        }

        return result;
    }

    changeInput() {
        this.executionStack.next('');
    }

    // show or hide filters
    showOrHideFilters() {
        if ((this.dataSource.length === 0 && this.generateFilter() === '')) {
            this.showFilters = false;
        }
        this.showFilters = true;
    }

    // methods for paging
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
        this.updateTable();
    }

    nextPage() {
        if (this.paginator.currentPage == this.pages.length)
            return;
        this.paginator.currentPage++;
        this.updateTable();
    }

    selectPage(page: number) {
        if (this.paginator.currentPage == page)
            return;
        this.paginator.currentPage = page;
        this.updateTable();
    }

    selectPageSize() {
        this.paginator.currentPage = 1;
        this.updateTable();
    }

    // ****************************************************** /
    private showModal(item?: any) {
        this.dynamicViewFormComponent.openModal(item);
    }

    onActionClick(action: string, item?: any) {
        switch (action) {
            case 'new':
                this.showModal();
                break;
            case 'edit':
                this.showModal(item);
                break;
            case 'delete':
                this.idItemToRemove = item['numero'];
                this.openModalDeleteSubject.next();
                break;
            case 'detail':
                break;
            default:
                break;
        }
    }

    deleteItem() {
        this.dynamicViewService.delete(this.tableName, this.useCaseCode, this.idItemToRemove).subscribe(
            result => {
                this.toastyMessageService.showSuccessMessagge("Se elimino exitosamente.");
                this.updateTable();
            },
            error => {
                this.toastyMessageService.showErrorMessagge(error.message || "Ocurrio un error al eliminar");
            });
    }

    reloadData() {
        this.updateTable();
    }

    managePermissions() {
        const permissions = this.permissionService.getPermissions(this.useCaseCode);
        this.disabledNew = !permissions.canAdd;
        this.disabledEdit = !permissions.canEdit;
        this.disabledDelete = !permissions.candDelete;
        this.disabledPrint = !permissions.canPrint;
    }

}
