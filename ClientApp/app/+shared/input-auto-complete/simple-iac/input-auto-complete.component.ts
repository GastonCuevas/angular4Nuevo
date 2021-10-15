import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { Observable } from 'rxjs/Observable';
import { ToastyMessageService } from '../../../+core/services';

@Component({
    selector: 'input-auto-complete',
    templateUrl: './input-auto-complete.component.html',
    styleUrls: ['./input-auto-complete.component.scss']
})
export class InputAutoComplete implements OnInit, OnChanges {

    @Input() form: FormGroup;
    @Input() formControlNameIAC: string;
    @Input() label: string;
    @Input() requiredIAC = false;
    @Input() readonlyIAC = false;
    @Input() readonlyValue: string;
    @Input() source = new Array<any>();
    @Input() functionForData: Observable<any>;
    @Input() isLoading: boolean;
    @Input() displayPropertyName = 'name';
    @Input() valuePropertyName = 'number';
    @Input() textForNoMatches = 'No encontrado...';
    @Input() textForNoResults = 'Sin resultados...';
    @Input() placeholder = '';
    @Input() maxNumList = 10;
    @Input() disabledIAC = false;

    @Output() valueChange = new EventEmitter<any>();

    valueAuxIAC = '';
    focus = false;
    invalidClass = false;
    validClass = false;
    noMatchFoundText = 'No encontrado...';
    stringList = new Array<any>();

    private notTouched: boolean;
    private objectAux: any = {};
    private updatedValue = false;

    constructor (private toastyService: ToastyMessageService) {}

    ngOnInit() {
        this.loadDataSource();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.readonlyIAC) {
            const source: SimpleChange = changes.source;
            const isLoading: SimpleChange = changes.isLoading;
            if(source && !source.firstChange) this.updateDataSource(source.currentValue);
            if(isLoading && !isLoading.firstChange && isLoading.currentValue) this.resetValues();
        }
    }

    private resetValues() {
        this.source = [];
        this.stringList = [];
        this.valueAuxIAC = '';
        this.form.controls[this.formControlNameIAC].setValue(null);
        this.setClass();
    }

    private loadDataSource() {
        if (!this.readonlyIAC) {
            if (this.functionForData) {
                this.isLoading = true;
                this.functionForData
                    .finally(() => this.isLoading = false)
                    .subscribe(
                    result => {
                        this.source = result.model || [];
                        this.setStringList();
                        this.loadInputValue();
                    },
                    error => {
                        this.toastyService.showToastyError(error, `Ocurrio un error al cargar el combo de ${this.label}.`);
                    });
            } else if (!this.source) {
                this.source = [];
                this.notTouched = true;
            } else {
                this.setStringList();
                this.loadInputValue();
                // this.isLoading = false;
            }
        }
    }

    private loadInputValue() {
        this.valueAuxIAC = '';
        if (this.form.value[this.formControlNameIAC]) {
            const found = this.source.find((item: any) => {
                if(typeof item[this.valuePropertyName] === 'string') {
                    return item[this.valuePropertyName] === this.form.value[this.formControlNameIAC];
                } else {
                    return item[this.valuePropertyName] === +this.form.value[this.formControlNameIAC];
                }
            });
            if (found) this.valueAuxIAC = found[this.displayPropertyName];
            else {
                this.objectAux[this.formControlNameIAC] = null;
                this.form.patchValue(this.objectAux);
            }
        }
    }

    private updateDataSource(newDataSource: Array<any>) {
        this.source = newDataSource;
        this.setStringList();
        this.isLoading = false;
        this.loadInputValue();
        if (this.notTouched) this.notTouched = false;
        else this.setClass();
    }

    private setStringList() {
        this.stringList = [];
        this.source.forEach((item) => {
            this.stringList.push(item[this.displayPropertyName]);
        });
        if (this.stringList.length == 0) this.noMatchFoundText = this.textForNoResults;
        else this.noMatchFoundText = this.textForNoMatches;
    }

    onChangeSelection(value: string) {
        // const strValue = '' + value;
        this.replaceValues(value);
        this.updatedValue = true;
    }

    validateInput(value: string) {
        if (!this.updatedValue) this.replaceValues(value);
        else this.updatedValue = false;
        this.focus = false;
    }

    private replaceValues(value: string) {
        const found = this.source.find((item: any) => {
            return item[this.displayPropertyName].toLowerCase() == value.toLowerCase();
        });

        if (found) {
            if(this.form.value[this.formControlNameIAC] != found[this.valuePropertyName]) {
                this.valueAuxIAC = found[this.displayPropertyName];
                this.setNewValueControl(found);
            }
        } else {
            if (this.form.value[this.formControlNameIAC]) this.setNewValueControl(null);
            else {
                this.valueAuxIAC = '';
                this.setClass();
            }
        }
    }

    private setNewValueControl(item: any) {
        if (!item) {
            let xObject: any = {};
            xObject[this.valuePropertyName] = null;
            xObject[this.displayPropertyName] = null;
            item = xObject;
        }
        // this.objectAux[this.formControlNameIAC] = item ? item[this.valuePropertyName] : null;
        this.objectAux[this.formControlNameIAC] = item[this.valuePropertyName];
        this.form.patchValue(this.objectAux);
        this.setClass();
        this.valueChange.emit(item);
    }

    private setClass() {
        if (this.valueAuxIAC) {
            this.invalidClass = false;
            this.validClass = true;
        } else {
            if (this.requiredIAC) this.invalidClass  = true;
            this.validClass  = false;
        }
    }

    activateLabel(): boolean {
        return this.form.value[this.formControlNameIAC] || this.focus || this.placeholder;
    }

    clearInput() {
        this.valueAuxIAC = '';
        this.setNewValueControl(null);
    }


    //deprecated
    updateValue(value: any) {
        const strValue = '' + value;
        const found = this.source.find((item: any) => {
            return item[this.displayPropertyName].toLowerCase() == strValue.toLowerCase();
        });
        this.valueAuxIAC = '';
        if (found) {
            if(this.form.value[this.formControlNameIAC] != found[this.valuePropertyName]) {
                this.valueAuxIAC = found[this.displayPropertyName];
                this.setNewValueControl(found[this.valuePropertyName]);
            }
        } else {
            if (this.form.value[this.formControlNameIAC]) this.setNewValueControl(null);
        }
        this.updatedValue = true;
    }
    
    //deprecated
    updateSource(newSource: Array<any>, noMatchFoundText?: string) {
        this.source = newSource;
        this.stringList = [];
        this.setStringList();
    }

}