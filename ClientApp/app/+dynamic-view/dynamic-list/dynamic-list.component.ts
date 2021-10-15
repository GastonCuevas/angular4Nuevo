import { Component, OnInit, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { NavBarService } from '../../+core/services/navbar.service';
import { Observable } from 'rxjs/Rx';
import { Navbar } from '../../models/navbar/navbar.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Item } from '../../models/navbar/item.model';

import { DynamicViewService } from '../dynamic-view.service';
import { IPaginator } from '../../interface/paginator.inteface';
import { Subject } from 'rxjs/Subject';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';

import { ISort } from '../../interface/';
import * as Rx from 'rxjs';
import { CommonService } from '../../+core/services/common.service';
import { PermissionService } from '../../+core/services/permission.service';

@Component({
    selector: 'app-dynamic-list',
    templateUrl: 'dynamic-list.component.html',
    styleUrls: ['dynamic-list.component.scss']
})

export class DynamicListComponent implements OnInit {

    modalActions = new EventEmitter<string | MaterializeAction>();
    isLoading: boolean;
    codigo: any;
    item: Item = new Item()
    edited: boolean = false;
    objectStructure: Array<Node>;
    openModalDeleteSubject: Subject<any> = new Subject();
    openModalEditSubject: Subject<any> = new Subject();
    openModalNewSubject: Subject<any> = new Subject();
    openModalAcceptChange: Subject<any> = new Subject();
    openModalDiscardChange: Subject<any> = new Subject();
    openModalDiscardChangeInEdit: Subject<any> = new Subject();
    adjacentPagesCount = 2;
    genericObject: any;
    auxGenericObject: any;
    auxNewGenericObject: any;
    fields: Array<Node> = new Array<Node>();
    listObject: Array<any> = new Array<any>();
    selectedRow: number = NaN;
    selectedObject: any;
    pages: Array<any>;
    paginator: IPaginator = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 100
    }

    sort: ISort = {
        sortBy: '',
        ascending: true
    };

    auxEditObject: any;
    auxEditRow: any;
    colorButtonAdd: any;
    tableName: any;

    disabledNew: boolean;
    disabledEdit: boolean;
    disabledDelete: boolean;
    disabledPrint: boolean;

    private executionStack: any;
    public filterByPropertyName: string = '';
    public newGeneric = false;
    private numeroItemDelete: any;

    constructor(
        private permissionService: PermissionService,
        private _toastyService: ToastyMessageService,
        private _navbarService: NavBarService,
        protected _dynamicViewService: DynamicViewService,
        private _route: ActivatedRoute,
        private _router: Router,
        private commonService: CommonService
    ) {
        this.pages = new Array<any>();
        this.objectStructure = new Array<Node>();
        this.isLoading = true;
    }

    debounce() {
        this.executionStack = new Rx.Subject();
        this.executionStack = this.executionStack.debounceTime(650);
        this.executionStack.subscribe((val: any) => {
          this.updateTable();
        });
    }

    getPropByString(obj: any, propString: string): any {
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

        return obj[props[i]];
    }

    setPropByString(obj: any, propString: string, value?: any, edited?: boolean): any {
        if (edited) {
            this.edited = true;
        }
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
        return obj[props[i]] = value;
    }

    public getColorButtonAdd() {
        return this.colorButtonAdd;
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
            let node = nodes.filter((element) => {
                return element.property == property
            });
            if (node.length != 0) {
                if (node[0].value) {
                    return `"${node[0].value}"`;
                } else {
                    return '""';
                }

            } else {
                return '""';
            }
        }
    }

    private converterToObject(items: Array<any[]>): any {
        for (let x in items) {
            let auxI = items[x][0].split('.');
            for (let y in auxI) {
                let n;
                if (y == '0') {
                    n = new Node(auxI[y], '', items[x][1]);
                } else {
                    n = new Node(auxI[y], auxI[+y - 1], items[x][1]);
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
        const json = this.formatJSON(this.objectStructure, '');
        return JSON.parse(json);

    }

    inputType(value: string): string {
        switch (value.toLowerCase()) {
            case 'numero': {
                return 'number';
            };
            case 'nombre': {
                return 'text'
            };

        }
        return "";
    }

    renderElements() {
        let auxArray = new Array<string[]>();
        this.item.parame.split(',').forEach((element) => {
            let array = new Array<string>();
            array.push(element.split('=')[0]);
            array.push(element.split('=')[1]);

            auxArray.push(array);
        });
        // console.log(auxArray);
        this.genericObject = this.converterToObject(auxArray);
        this.fields = this.objectStructure.filter((element) => {
            return element.property.toLowerCase().includes('campo') && element.value != "Numero";
        });
        this.sort.sortBy = this.fields[0].value;
        // console.log(this.fields[0]);
        this.tableName = this.genericObject['Clase'].split('.')[1];
        this.updateTable();
    }

    updateTable() {
        if (this.genericObject) {
            this._dynamicViewService.getAll(this.genericObject['Clase'].split('.')[1], this.paginator, this.filterByPropertyName, this.sort).subscribe(
                (res) => {
                    this.paginator.totalItems = res.itemsCount;
                    this.listObject = res.model;
                    this.calculatePages();
                },
                (error) => {
                    this._toastyService.showMessageToast("ERROR", "Ocurrió un error", "error");
                }
            );
        }
    }

    getProperty(t: string): string {
        switch (t.toLowerCase()) {
            case 'nombre': return 'name';
            case 'numero': return 'number';
            default: return '';
        }
    }

    selectRow(i: number, item: any) {
        if (this.edited) {
            this.auxEditObject = JSON.parse(JSON.stringify(item));
            this.auxEditRow = i;
            this.openModalAcceptChange.next();
        } else {
            this.auxGenericObject = JSON.parse(JSON.stringify(item));
            this.selectedRow = i;
        }
    }

    discardChanges() {
        this.edited = false;
        this.auxGenericObject = this.auxEditObject;
        this.selectedRow = this.auxEditRow;
    }

    cancel() {
        if(this.edited) {
            this.openModalAcceptChange.next();
        } else {
            this.edited = false;
            this.selectedRow = NaN;
        }
    }

    ngOnInit() {
        this.filterByPropertyName = '';
        this.debounce();
        this.initPage();
        // this._router.events.subscribe(event => {
        //     if (event instanceof NavigationEnd) {
        //         this.isLoading = true;
        //         this.initPage();
        //     }
        // });
    }

    initPage() {
        this.clearElements();
        this._navbarService.getNavbars().subscribe(
            (res) => {
                if (res.length != 0) {
                    this.codigo = this._route.snapshot.paramMap.get('codigo');
                    this.managePermissions();
                    this.isLoading = false;
                    this.item = this._navbarService.findItem(null, this.codigo);
                    if (this.item) {
                        this.renderElements()
                    }
                }
            }
        );
    }

    clearElements() {
        this.selectedRow = NaN;
        this.auxGenericObject = {};
        this.filterByPropertyName = '';
    }

    showDialogNew() {
        this.newGeneric = true;
        this.edited = false;
        this.clearElements();
        let newObject = Array<Node>();
        let fields: Array<any> = this.objectStructure.filter((element) => {
            return element.property.toLowerCase().includes('campo')
        });
        fields.forEach((element) => {
            newObject.push(new Node(element['value'], "", ''));
        });
        this.auxNewGenericObject = JSON.parse(this.formatJSON(newObject, ""));
        this.modalActions.emit({ action: "modal", params: ['open'] });
    }

    addItem() {
        // this.openModalNewSubject.next();
        let arrayProperty = new Array<Node>();

        Object.keys(this.auxNewGenericObject).forEach((item) => {
            let n = new Node(this.getProperty('' + item), "", this.getPropByString(this.auxNewGenericObject, '' + item));
            arrayProperty.push(n);
        });
        let auxObject = JSON.parse(this.formatJSON(arrayProperty, ""));
        this.setPropByString(auxObject, "number", 0);
        this._dynamicViewService.add(
            this.genericObject['Clase'].split('.')[1],
            this.codigo,
            auxObject).subscribe(
            (res) => {
                this.updateTable();
                this._toastyService.showSuccessMessagge(this.getPropByString(this.genericObject, 'Titulo') + ' creado exitosamente.');
                this.newGeneric = false;
            },
            (error) => {
                this._toastyService.showMessageToast("ERROR", "Ocurrió un error", "error");
            },
            () => {
                this.modalActions.emit({ action: "modal", params: ['close'] });
            });
    }

    editCommit() {
        let arrayProperty = new Array<Node>();

        Object.keys(this.auxGenericObject).forEach((item) => {
            let n = new Node(this.getProperty('' + item), "", this.getPropByString(this.auxGenericObject, '' + item));
            arrayProperty.push(n);
        });

        this._dynamicViewService.update(
            this.genericObject['Clase'].split('.')[1],
            this.codigo,
            this.auxGenericObject.numero,
            JSON.parse(this.formatJSON(arrayProperty, ''))).subscribe(
            (res) => {
                this.edited = false;
                this.selectedRow = NaN;
                this.updateTable();
                this._toastyService.showSuccessMessagge('Edición Completada.');
            },
            (error) => {
                this._toastyService.showMessageToast("ERROR", "Ocurrió un error", "error");
            });
    }

    deleteCommit() {
        this._dynamicViewService.delete(
            this.genericObject['Clase'].split('.')[1],
            this.codigo,
            this.numeroItemDelete).subscribe(
            (res) => {
                this.updateTable();
                this._toastyService.showSuccessMessagge('Eliminación Completada.');
            },
            (error) => {
                this._toastyService.showMessageToast("ERROR", "Ocurrió un error", "error");
            });
    }

    saveCommit() {
        let arrayProperty = new Array<Node>();

        Object.keys(this.auxNewGenericObject).forEach((item) => {
            let n = new Node(this.getProperty('' + item), "", this.getPropByString(this.auxNewGenericObject, '' + item));
            arrayProperty.push(n);
        });
        let auxObject = JSON.parse(this.formatJSON(arrayProperty, ""));
        this.setPropByString(auxObject, "number", 0);
        this._dynamicViewService.add(
            this.genericObject['Clase'].split('.')[1],
            this.codigo,
            auxObject).subscribe(
            (res) => {
                this.updateTable();
                this._toastyService.showSuccessMessagge(this.getPropByString(this.genericObject, 'Titulo') + ' creado exitosamente.');
            },
            (error) => {
                this._toastyService.showMessageToast("ERROR", "Ocurrió un error", "error");
            },
            () => {
                this.modalActions.emit({ action: "modal", params: ['close'] });
            });
    }

    showDialog(type: any, item?: any) {
        switch (type) {
            case 'delete': {
                this.numeroItemDelete = item.numero;
                this.openModalDeleteSubject.next();
            } break;
            case 'edit': {
                this.openModalEditSubject.next();
            } break;
        }
    }

    cancelModalNew(formValid: boolean) {
        if(formValid) {
            this.openModalDiscardChange.next();
        } else {
            this.modalActions.emit({ action: "modal", params: ['close'] });
            this.newGeneric = false;
        }
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
        this.updateTable();
    }

    nextPage() {
        if (this.paginator.currentPage == this.pages.length)
            return;
        this.paginator.currentPage++;
        this.updateTable();
    }

    selectPage(page: any) {
        if (this.paginator.currentPage == page)
            return;
        this.paginator.currentPage = page;
        this.updateTable();
    }

    selectPageSize() {
        this.paginator.currentPage = 1;
        this.updateTable();
    }

    /*validate(): boolean {
        if (this.auxNewGenericObject) {
            let flags = Array<boolean>();
            this.fields.forEach(element => {
                if (this.getPropByString(this.auxNewGenericObject, element.value)) {
                    flags.push(true);
                } else {
                    flags.push(false)
                }
            });
            let expression: string = '';
            for (let index = 0; index < flags.length; index++) {
                if (index == 0) {
                    expression =+ flags[index].;
                } else {

                }
                const element = array[index];

            }
            return flag;
        } else {
            return false
        }
    }*/

    changeInput() {
        this.executionStack.next('');
    }

    // Change sorting
    changeSorting(columnName: any) {
        if(this.listObject.length > 0) {
            if (this.sort.sortBy == columnName) {
                this.sort.ascending = !this.sort.ascending;
                this.updateTable();
            } else {
                this.sort.sortBy = columnName;
                this.sort.ascending = true;
                this.updateTable();
            }
        }
    }

    // select classes for the ordination
    selectedClass(columnName: any): string {
        if(this.listObject.length <= 0 ) {
            return '';
        }
        return columnName == this.sort.sortBy ? 'sortable sort-' + this.sort.ascending : 'sortable';
    }

    // show or hide filters
    showFilters(): boolean {
        if (this.listObject.length <= 0 && this.filterByPropertyName === '' ) {
            return false;
        }
        return true;
    }

    discardChangesInNew() {
        this.modalActions.emit({ action: "modal", params: ['close'] });
        this.newGeneric = false;
    }

    discardChangesInEdit() {
        this.edited = false;
        this.selectedRow = NaN;
    }
  
    managePermissions() {
        const permissions = this.permissionService.getPermissions(this.codigo);
        this.disabledNew =  !permissions.canAdd;
        this.disabledEdit =  !permissions.canEdit;
        this.disabledDelete =  !permissions.candDelete;
        this.disabledPrint =  !permissions.canPrint;
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