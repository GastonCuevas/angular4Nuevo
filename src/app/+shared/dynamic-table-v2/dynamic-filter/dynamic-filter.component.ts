import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { GenericControl, FormControlService } from '../../forms';
import { UtilityService } from '../../../+core/services';
import { FilterType } from '../../util';

import * as moment from 'moment';
import * as Rx from 'rxjs';

@Component({
    selector: 'app-dynamic-filter',
    templateUrl: './dynamic-filter.component.html',
    styleUrls: ['./dynamic-filter.component.scss'],
    providers: [FormControlService],
})
export class DynamicFilterComponent implements OnInit {

    @Input() show = true;
    @Input() formClass = '';
    @Input() withSubmit: false;
    @Input() controls: GenericControl[] = [];
    @Output() controlsChange = new EventEmitter<GenericControl[]>();
    @Output() filterChange = new EventEmitter<string>();
    @Output() invalidFilter = new EventEmitter<boolean>();

    form: FormGroup;
    showFilterForm = true;
    executionStack: any;

    constructor(
        private controlService: FormControlService,
        private utilityService: UtilityService) {
    }

    ngOnInit() {
        this.loadForm();
        this.debounce();
    }

    private loadForm() {
        this.controls.forEach(c => {
            if (c.type === FilterType.DATE) {
                if (!c.datePickerOptions) c.datePickerOptions = this.utilityService.getDatePickerOptions();
                c.datePickerOptions.max = false;
                c.datePickerOptions['onSet'] = (value: any) => {
                    if (value.select) this.onFilterChange();
                    else if (value.clear === null) this.onFilterChange();
                }
            }
        });
        this.form = this.controlService.toFormGroup(this.controls);
        this.onSubmit();
    }

    private debounce() {
        this.executionStack = new Rx.Subject();
        this.executionStack = this.executionStack.debounceTime(650);
        this.executionStack.subscribe((res: any) => {
            this.onFilterChange();
        });
    }

    onFilterChange() {
        if (this.withSubmit) return;
        this.onSubmit();
    }

    onSubmit() {
        if (this.form.invalid) { setTimeout(() => this.invalidFilter.emit(false)); return; }
        const filterBy = this.generateFilter();
        this.updateControls();
        this.filterChange.emit(filterBy);
    }

    changeInput() {
        if (!this.withSubmit) this.executionStack.next('');
    }

    private generateFilter(): string {
        let result = '';
        let firstFilter = true;
        let parameters = '';
        for (let c of this.controls) {
            if (this.form.value[c.key]) {
                const type: string = c.filterType || c.type;
                const property: string = c.searchProperty || c.key;
                switch (type) {
                    case FilterType.NAME:
                        var words = this.clearString(this.form.value[c.key]).replace(/,/g, '').toLowerCase().split(' ');
                        var firstWord = true;
                        result += (firstFilter ? '' : ' and ') + words.reduce((res, w) => {
                            if (!w) return res;
                            res += (firstWord ? '' : ' and ') + `${property}.toLower().contains("${w}")`;
                            if (firstWord) firstWord = false;
                            return res;
                        }, '');
                        break;
                    case FilterType.TEXT:
                        if (c.parameter) parameters += `&${property}=${this.form.value[c.key]}`;
                        else result += (firstFilter ? '' : ' and ') + `${property}.toLower().contains("${this.clearString(this.form.value[c.key]).toLowerCase()}")`;
                        break;
                    case FilterType.NUMBER:
                        result += (firstFilter ? '' : ' and ') + `${property}.toString().contains("${this.form.value[c.key]}")`;
                        break;
                    case FilterType.DATE:
                        if (c.parameter) parameters += `&${property}=${this.utilityService.formatDate(this.form.value[c.key], 'DD/MM/YYYY')}`;
                        else result += (firstFilter ? '' : ' and ') + `${property}${c.sign || this.getSignByProperty(c.key)}"${this.utilityService.formatDate(this.form.value[c.key], 'DD/MM/YYYY')}"`;
                        break;
                    case FilterType.SELECT:
                    case FilterType.AUTOCOMPLETE:
                        if (c.parameter) parameters += `&${property}=${this.form.value[c.key]}`;
                        else {
                            let value = this.form.value[c.key];
                            if (typeof value === 'string') value = `"${value}"`;
                            result += (firstFilter ? '' : ' and ') + `${property}=${value == -1 ? 0 : value}`;}
                        break;
                    case FilterType.CHECKBOX:
                        result += (firstFilter ? '' : ' and ') + `${property}=${this.form.value[c.key]}`;
                        break;
                    case FilterType.CUSTOM:
                        result += (firstFilter ? '' : ';') + `${property}=${this.form.value[c.key]}`;
                        break;
                }
                if (firstFilter && result) firstFilter = false;
            }
        }

        return result + parameters;
    }

    private clearString(str: string): string {
        let result = '';
        result = str.replace(/"/g, '');
        result = result.replace(/\\/g, '');
        return result;
    }

    private getSignByProperty(property: string) {
        let sign: string = '=';
        switch (property) {
            case 'dateFrom':
                sign = '>=';
                break;
            case 'dateTo':
                sign = '<=';
                break;
        }
        return sign;
    }

    private updateControls() {
        for (let c of this.controls) {
            const value = this.form.value[c.key];
            if (value) {
                if (c.type == FilterType.TEXT) c.value = this.clearString(value);
                else c.value = value;
            }
        }
        this.controlsChange.emit(this.controls);
    }

}
