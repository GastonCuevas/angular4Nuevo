import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Observable } from 'rxjs/Observable';
import { ToastyMessageService } from '../../+core/services';

@Component({
    selector: 'iac-color',
    templateUrl: './iac-color.component.html',
    styleUrls: ['./iac-color.component.scss']
})
export class IACColorComponent implements  OnInit, OnChanges {

    @Input() form: FormGroup;
    @Input() formControlNameIAC: string;
    @Input() label: string;
    @Input() requiredIAC = false;
    @Input() readonlyIAC = false;
    @Input() readonlyValue: string;

    @Input() source = new Array<ItemComboColor>();
    @Input() functionForData: Observable<ItemComboColor[]>;
    @Input() isLoading = true;
    @Input() textForNoMatches = 'No encontrado...';
    @Input() textForNoResults = 'Sin resultados...';
    @Input() placeholder = '';
    @Input() maxNumList = 10;
    @Input() disabledIAC = false;

    @Output() valueChange = new EventEmitter<ItemComboColor>();

    valueAuxIAC = '';
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
                        this.source = result || [];
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
            }
        }
    }

    private loadInputValue() {
        this.valueAuxIAC = '';
        const formControlvalueIAC = this.form.value[this.formControlNameIAC];
        if (formControlvalueIAC) {
            const found = this.source.find(item => {
                return item.name === formControlvalueIAC;
            });
            if (found) this.valueAuxIAC = found.name;
            else {
                this.form.controls[this.formControlNameIAC].setValue(null);
                this.valueAuxIAC = 'El valor no se encontro';
            }
        }
    }

    private updateDataSource(newDataSource: Array<ItemComboColor>) {
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
            if( formControlvalueIAC != found.name) {
                this.valueAuxIAC = found.name;
                this.setNewValueControl(found);
            }
        } else {
            if (formControlvalueIAC) this.setNewValueControl(new ItemComboColor());
            else {
                this.valueAuxIAC = '';
                this.setClass();
            }
        }
    }

    private setNewValueControl(item: ItemComboColor) {
        this.form.controls[this.formControlNameIAC].setValue(item.name);
        this.setClass(item);
        this.valueChange.emit(item);
    }

    private setClass(item?: ItemComboColor) {
        if (this.valueAuxIAC) {
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
        this.setNewValueControl(new ItemComboColor());
    }

    autocompleListFormatter = (item: string) => {
        let html: string = `<span style='font-family: "${item}";'> ${item}</span>`;
        return this.domSanitizer.bypassSecurityTrustHtml(html);
    }

}

export class ItemComboColor {
    code: number;
    name: string;
}