import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Observable } from 'rxjs/Observable';
import { ToastyMessageService } from '../../../+core/services';
import { ValidatedItemCombo } from '../../util';

@Component({
    selector: 'iac-with-validation',
    templateUrl: './iac-with-validation.component.html',
    styleUrls: ['./iac-with-validation.component.scss']
})
export class IACWithValidation implements OnInit, OnChanges {

    @Input() form: FormGroup;
    @Input() formControlNameIAC: string;
    @Input() label: string;
    @Input() requiredIAC = false;
    @Input() readonlyIAC = false;
    @Input() readonlyValue: string;

    @Input() source = new Array<ValidatedItemCombo>();
    @Input() functionForData: Observable<any>;
    @Input() isLoading = true;
    @Input() textForNoMatches = 'No encontrado...';
    @Input() textForNoResults = 'Sin resultados...';
    @Input() errorForInvalidItem = 'Elemento seleccionado inválido.';
    @Input() isDependent = false;
    @Input() msgForDependent = '';
    @Input() placeholder = '';
    @Input() maxNumList = 10;
    @Input() disabledIAC = false;
    @Input() legendValidState = '';
    @Input() legendInvalidState = '';

    @Output() valueChange = new EventEmitter<any>();

    valueAuxIAC = '';
    selectedItemInvalid = false;
    focus = false;
    invalidClass = false;
    validClass = false;
    noMatchFoundText = 'No encontrado...';
    stringList = new Array<string>();

    private notTouched: boolean;
    private updatedValue = false;

    constructor (
        private toastyService: ToastyMessageService,
        private domSanitizer: DomSanitizer
    ) {}

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
        this.selectedItemInvalid = false;
        this.noMatchFoundText = this.textForNoResults;
        this.setClass();
    }

    private loadDataSource() {
        if (!this.readonlyIAC) {
            if (this.functionForData) {
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
                this.isLoading = true;
                this.notTouched = true;
            } else {
                this.setStringList();
                this.loadInputValue();
                this.isLoading = false;
            }
        }
    }

    private loadInputValue() {
        this.valueAuxIAC = '';
        const formControlvalueIAC = this.form.value[this.formControlNameIAC];
        if (formControlvalueIAC) {
            const found = this.source.find(item => {
                return item.number === formControlvalueIAC;
            });
            if (found) {
                this.valueAuxIAC = found.name;
                this.selectedItemInvalid = !found.valid;
                if (!found.valid) {
                    this.form.controls[this.formControlNameIAC].setValue(null);
                    this.setClass();
                }
            }
            else {
                this.form.controls[this.formControlNameIAC].setValue(null);
                this.valueAuxIAC = 'El valor no se encontro';
            }
        }
    }

    private updateDataSource(newDataSource: Array<ValidatedItemCombo>) {
        if (newDataSource.length == 0) { this.resetValues(); return; }
        this.source = newDataSource;
        this.setStringList();
        this.isLoading = false;
        this.loadInputValue();
        if (this.notTouched) this.notTouched = false;
        else this.setClass();
    }

    private setStringList() {
        this.stringList = [];
        this.source.forEach(item => this.stringList.push(item.name));
        if (this.stringList.length == 0) this.noMatchFoundText = this.textForNoResults;
        else this.noMatchFoundText = this.textForNoMatches;
    }

    onChangeSelection(value: string) {
        this.replaceValues(value);
        this.updatedValue = true;
    }

    validateInput(value: string) {
        if (!this.updatedValue) this.replaceValues(value);
        else this.updatedValue = false;
        this.focus = false;
    }

    private replaceValues(value: string) {
        const found = this.source.find(item => {
            return item.name.toLowerCase() == value.toLowerCase();
        });
        const formControlvalueIAC = this.form.value[this.formControlNameIAC];
        if (found) {
            if( formControlvalueIAC != found.number) {
                this.valueAuxIAC = found.name;
                if (found.valid) {
                    this.selectedItemInvalid = false;
                    this.setNewValueControl(found);
                }
                else {
                    this.selectedItemInvalid = true;
                    this.setNewValueControl(new ValidatedItemCombo());
                }
            }
        } else {
            this.selectedItemInvalid = false;
            if (formControlvalueIAC) this.setNewValueControl(new ValidatedItemCombo());
            else {
                this.valueAuxIAC = '';
                this.setClass();
            }
        }
    }

    private setNewValueControl(item: ValidatedItemCombo) {
        this.form.controls[this.formControlNameIAC].setValue(item.number);
        this.setClass(item);
        this.valueChange.emit(item);
    }

    private setClass(item?: ValidatedItemCombo) {
        if (this.valueAuxIAC && item && item.valid) {
            this.invalidClass = false;
            this.validClass = true;
        } else {
            if (this.requiredIAC) this.invalidClass = true;
            this.validClass = false;
        }
    }

    activateLabel(): boolean {
        return this.focus || !!this.placeholder || !!this.valueAuxIAC;
    }

    clearInput() {
        this.valueAuxIAC = '';
        this.selectedItemInvalid = false;
        this.setNewValueControl(new ValidatedItemCombo());
    }

    autocompleListFormatter = (item: string) => {
        const found = this.source.find(i => {
            return i.name.toLowerCase() == item.toLowerCase();
        });
        let html = item;
        if (found) {
            html = `${item} <span class='state ${found.valid ? 'valid' : 'invalid'}'>
                    ${found.valid ? this.legendValidState : this.legendInvalidState}</span>`;
        }
        return this.domSanitizer.bypassSecurityTrustHtml(html);
    }

}