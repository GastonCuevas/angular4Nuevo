import { Component, Input, Output, OnInit, EventEmitter , ViewChild } from '@angular/core';
// import { Observable, Subject } from 'rxjs/Rx';
import { FormGroup } from '@angular/forms';
import { MaterializeAction } from 'angular2-materialize';

import { ToastyMessageService } from '../../+core/services';
import { PatientService } from '../../+patient/patient.service';
import { IColumn, Sort, IService, FilterType } from '../../+shared/util';
import { PaginatorComponent } from '../../+shared';

import * as Rx from 'rxjs';

@Component({
    selector: 'app-input-search',
    templateUrl: './input-search.component.html',
    styleUrls: ['./input-search.component.scss']
})
export class InputSearchComponent implements OnInit {

    @Input() form: FormGroup;
    @Input() formControlNameIS: string;
    @Input() label: string;

    @Input() columns: Array<IColumn> = [
		{ header: 'Nombre', property: 'name', searchProperty: 'patientAccount.name', filterType: 'name' },
		{ header: 'Documento', property: 'cuit', searchProperty: 'patientAccount.cuit', filterType: 'text' },
		{ header: 'Dirección', property: 'address', searchProperty: 'patientAccount.address', filterType: 'text', hideInMobile: true }
	];
    @Input() dataSource: Array<any> = new Array<any>();
    @Input() sort: Sort = new Sort();
    @Input() service: any;
    @Input() nameMethod = 'getAll';
    @Input() displayPropertyName: string = 'name';
    @Input() valuePropertyName: string = 'number';
    @Input() requiredIS: boolean = false;
    @Input() disabledIS: boolean = false;
    @Input() readonlyIS: boolean = false;
    @Input() readonlyValue: string;

    // @Output() actionClick: EventEmitter<any> = new EventEmitter<any>();

    @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;

    isLoading: boolean = true;
    isLoadingInput: boolean = false;
    valueAux: string = '';
    private objectAux: any = {};
    currentRow: number;
    selected: any;
    private filterBy: string = '';

    invalidClass: boolean = false;
    validClass: boolean = false;
    showFilters: boolean = true;
    filter: any = new Object();
    filterAux: any = new Object({'filterType':'text','value':''});
    private executionStack: any;

    modalActions: EventEmitter<string | MaterializeAction> = new EventEmitter<string | MaterializeAction>();
    constructor(
        private toastyService: ToastyMessageService,
        private patientService: PatientService
    ) {
    }

    ngOnInit() {
        this.initValues();
        this.debounce();
    }

    private initValues() {
        if (!this.service) this.service = this.patientService;
        this.setOrderByDefault();
        this.initFilter();
        if (this.readonlyValue) {
            this.selected = true;
            this.valueAux = this.readonlyValue;
        }
    }

    private initFilter() {
        this.columns.forEach(c => {
            if (c.filterType) this.filter[c.property] = '';
        });
    }

    private debounce() {
        this.executionStack = new Rx.Subject();
        this.executionStack = this.executionStack.debounceTime(650);
        this.executionStack.subscribe((res: any) => {
            this.paginatorComponent.paginator.currentPage = 1;
            this.loadTable();
        });
    }

    private loadTable(showLoading?: boolean) {
        if (showLoading) this.isLoading = true;
        this.filterBy = this.generateFilterOr();
        this.service[this.nameMethod](this.paginatorComponent.paginator, this.filterBy, this.sort)
            .finally(() => {
                this.isLoading = false
                this.showOrHideFilters();                   
            })
            .subscribe((response: any) => {
                this.paginatorComponent.loadPaginator(response.itemsCount);
                this.dataSource = response.model;
                this.selected = null;
                this.currentRow = -1;
            },
            (error: any) => {
                this.toastyService.showErrorMessagge('Ocurrió un error al cargar los datos');
            }
        );
    }

    loadInputIfOne(showLoading?: boolean){
        if (showLoading) this.isLoading = true;
        this.filterBy = this.generateFilterOr();
        this.isLoadingInput = true;
        this.service[this.nameMethod](this.paginatorComponent.paginator, this.filterBy, this.sort)
            .finally(() => {
                this.isLoading = false;
                this.isLoadingInput = false;
                this.showOrHideFilters();                   
            })
            .subscribe((response: any) => {
                this.paginatorComponent.loadPaginator(response.itemsCount);
                this.dataSource = response.model;
                this.selected = response.itemsCount == 1 ? response.model[0] : null;
                this.currentRow = -1;

                if (!this.selected)
                    this.modalActions.emit({action:"modal",params:['open']});
                else
                    this.onAgree();
            },
            (error: any) => {
                this.toastyService.showErrorMessagge('Ocurrió un error al cargar los datos');
            }
        );
    }

    openSearch() {
        this.assignValueFilter(this.filterAux.value);
        this.loadInputIfOne(true);
        //this.loadTable(true);
    }

    closeModal() {
        if (!this.form.value[this.formControlNameIS]) this.selected = null;
        this.modalActions.emit({action:"modal",params:['close']});
        this.initFilter();
        this.filterAux.value = '';
    }

    onAgree() {
        this.valueAux = this.selected[this.displayPropertyName];
        this.objectAux[this.formControlNameIS] = this.selected[this.valuePropertyName];
        this.form.patchValue(this.objectAux);
        this.setClass();
        this.modalActions.emit({action:"modal",params:['close']});
        this.valueChange.emit();
    }

    onPageChange() {
        this.loadTable();
    }

    // methods for ordination
    private setOrderByDefault() {
        for (let column of this.columns) {
            if (!column.disableSorting) {
                const property: string = column.searchProperty || column.property;
                this.sort.sortBy = property;
                this.sort.ascending = true;
                break;
            }
        }
    }

    selectedClass(column: IColumn): string {
        const property: string = column.searchProperty || column.property;
        if(column.disableSorting || this.dataSource.length === 0 ) {
            return column.hideInMobile ? 'hide-on-small-only' : '';
        }
        let result: string = property == this.sort.sortBy ? 'sortable sort-' + this.sort.ascending : 'sortable';
        result = column.hideInMobile ? result + ' hide-on-small-only' : result;
        return result;
    }

    changeSorting(column: IColumn) {
        const property: string = column.searchProperty || column.property;
        if(!column.disableSorting && this.dataSource.length > 0) {
            if (this.sort.sortBy == property) {
                this.sort.ascending = !this.sort.ascending;
                this.loadTable();
            } else {
                this.sort.sortBy = property;
                this.sort.ascending = true;
                this.loadTable();
            }
        }
    }

    select(index: number, item: any) {
        this.currentRow = index;
        this.selected = item;
    }

    clearInput() {
        this.valueAux = '';
        this.selected = null;
        this.filterAux.value = '';
        this.currentRow = -1;
        this.objectAux[this.formControlNameIS] = null;
        this.form.patchValue(this.objectAux);
        this.initFilter();
        this.setClass();
        this.valueChange.emit();
    }

    onKeydownEnter(event: any) {
        //this.filter[this.displayPropertyName] = this.valueAux;
        this.paginatorComponent.paginator.currentPage = 1;
        this.filterAux.value = this.valueAux;
        this.assignValueFilter(this.valueAux);
        if (!this.selected) this.openSearch();
    }

    validate(value: string) {
        // this.filter[this.displayPropertyName] = this.valueAux;
        this.filterAux.value = this.valueAux;
        if (!this.selected) this.valueAux = '';
        this.setClass();
    }

    private setClass() {
        if (this.selected) {
            this.invalidClass = false;
            this.validClass = true;
        } else {
            if (this.requiredIS) this.invalidClass  = true;
            this.validClass  = false;
        }
    }

    // methods for filters
    private showOrHideFilters() {
        if ((this.dataSource.length === 0 && this.generateFilterOr() === '')) {
            this.showFilters = false;
        }
        this.showFilters = true;
    }

    private generateFilterOr(): string {
        let columnsWithFilter = new Array<IColumn>();
        let result: string = '';
        this.columns.forEach(c =>  { if (c.filterType) columnsWithFilter.push(c); });
        let firstFilter = true;
        for (let c of columnsWithFilter) {
            if (this.filter[c.property] !== '') {
                const property: string = c.searchProperty || c.property;
                switch (c.filterType) {
                    case FilterType.NAME:
                        var words: string[] = this.filter[c.property].replace(/,/g, '').toLowerCase().split(' ');
                        var firstWord = true;
                        result += (firstFilter ? '' : ' and ') + words.reduce((res, w) => {
                            if (!w) return res;
                            res += (firstWord ? '' : ' and ') + `${property}.toLower().contains("${w}")`;
                            if (firstWord) firstWord = false;
                            return res;
                        }, '');
                        break;
                    case FilterType.TEXT:
                        result += (firstFilter ? '' : ' or ') + `${property}.toLower().contains("${this.filter[c.property].toLowerCase()}")`;
                        break;
                    case FilterType.NUMBER:
                        result += (firstFilter ? '' : ' or ') + `${property}.toString().contains("${this.filter[c.property]}")`;
                        break;
                }
                if (firstFilter) firstFilter = false;
            }
        }

        return result;
    }

    /**
     * Method deprecate
     */
    private generateFilter(): string {
        let columnsWithFilter = new Array<IColumn>();
        let result: string = '';

        this.columns.forEach(c =>  { if (c.filterType) columnsWithFilter.push(c); });
        let firstFilter = true;
        for (let c of columnsWithFilter) {
            if (this.filter[c.property] !== '') {
                const property: string = c.searchProperty || c.property;
                switch (c.filterType) {
                    case FilterType.NAME:
                        var words: string[] = this.filter[c.property].replace(/,/g, '').toLowerCase().split(' ');
                        var firstWord = true;
                        result += (firstFilter ? '' : ' and ') + words.reduce((res, w) => {
                            if (!w) return res;
                            res += (firstWord ? '' : ' and ') + `${property}.toLower().contains("${w}")`;
                            if (firstWord) firstWord = false;
                            return res;
                        }, '');
                        break;
                    case FilterType.TEXT:
                        result += (firstFilter ? '' : ' and ') + `${property}.toLower().contains("${this.filter[c.property].toLowerCase()}")`;
                        break;
                    case FilterType.NUMBER:
                        result += (firstFilter ? '' : ' and ') + `${property}.toString().contains("${this.filter[c.property]}")`;
                        break;
                }
                if (firstFilter) firstFilter = false;
            }
        }

        return result;
    }

    changeInput() {
        this.assignValueFilter(this.filterAux.value);
        this.executionStack.next('');
    }

    assignValueFilter(value: any){
        this.columns.forEach(c =>  { 
            this.filter[c.property]=value; 
        });
    }
}
