import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { Observable } from 'rxjs/Observable';
import { ToastyMessageService, CommonService } from '../../../+core/services';
import { ItemCombo } from '../../util';

// @Component({
//   selector: 'app-iac-remote-data',
//   templateUrl: './iac-remote-data.component.html',
//   styleUrls: ['./iac-remote-data.component.scss']
// })
export class IACRemoteData implements OnInit {

    @Input() form: FormGroup;
    @Input() formControlNameIAC: string;
    @Input() label: string;
    @Input() requiredIAC: boolean = false;
    @Input() displayPropertyName: string = 'name';
    @Input() valuePropertyName: string = 'number';
    @Input() placeholder: string = '';
    @Input() maxNumList: number = 10;
    @Input() disabledIAC: boolean = false;

    @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

    // functionForData: Observable<any>;
    isLoading: boolean = false;
    noMatchFoundText: string = 'No encontrado...';
    valueIAC: any = '';
    selectedValue: ItemCombo | null;
    focus: boolean = false;
    invalidClass: boolean = false;
    validClass: boolean = false;

    private objectAux: any = {};
    private updatedValue: boolean = false;

    constructor (
        private commonService: CommonService,
        private toastyService: ToastyMessageService) {
    }

    ngOnInit() {
        // this.loadDataSource();
        this.loadRequired();
    }

    // ngOnChanges(changes: SimpleChanges) {
    //     const source: SimpleChange = changes.source;
    //     if(source && !source.firstChange) {
    //         this.updateDataSource(source.currentValue);
    //     }
    // }

    // private loadDataSource() {
    //     if (this.functionForData) {
    //         this.noMatchFoundText = 'Cargando...';
    //         this.functionForData
    //             .finally(() => this.isLoading = false)
    //             .subscribe(
    //             result => {
    //                 this.source = result.model || [];
    //                 this.setStringList();
    //                 // this.loadInitialValue();
    //                 // this.valueChange.emit();
    //                 if (this.form.value[this.formControlNameIAC]) {
    //                     const found = this.source.find((item: any) => {
    //                         return item[this.valuePropertyName] === +this.form.value[this.formControlNameIAC];
    //                     });
    //                     if (found) {
    //                         this.valueAuxIAC = found[this.displayPropertyName];
    //                         this.valueChange.emit();
    //                     } else {
    //                         this.valueAuxIAC = '';
    //                         this.objectAux[this.formControlNameIAC] = null;
    //                         this.form.patchValue(this.objectAux);
    //                     }
    //                 }
    //                 this.noMatchFoundText = 'No encontrado...';
    //             },
    //             error => {
    //                 this.source = [];
    //                 this.toastyService.showErrorMessagge(error.success ? error.errorMessage : `Ocurrio un error al cargar el combo de ${this.label}.`);
    //             });
    //     } else {
    //         if (this.source === undefined) {
    //             this.source = [];
    //             this.isLoading = true;
    //             this.noMatchFoundText = 'Cargando...';
    //         }
    //         else {
    //             this.setStringList();
    //             this.loadInitialValue();
    //             this.isLoading = false;
    //         }
    //     }
    // }

    private loadInitialValue() {
        // if (this.form.value[this.formControlNameIAC]) {
        //     const found = this.source.find((item: any) => {
        //         if(typeof item[this.valuePropertyName] === 'string') {
        //             return item[this.valuePropertyName] === this.form.value[this.formControlNameIAC];
        //         } else {
        //             return item[this.valuePropertyName] === +this.form.value[this.formControlNameIAC];
        //         }
        //     });
        //     if (found) this.valueAuxIAC = found[this.displayPropertyName];
        // }
    }

    private loadRequired() {
        const abstractControl = this.form.get(this.formControlNameIAC);
        if (abstractControl && abstractControl.errors) {
            if (abstractControl.errors.hasOwnProperty('required')) this.requiredIAC = true;
        }
    }

    private updateDataSource(newDataSource: Array<any>, loading?: boolean, error?: boolean) {
        // this.isLoading = loading || false;
        // this.source = newDataSource;
        // this.setStringList();
        // this.noMatchFoundText = loading ? 'Cargando...' : error ? 'Error al cargar los datos...' : 'No encontrado...';

        // if (this.form.value[this.formControlNameIAC]) {
        //     const found = this.source.find((item: any) => {
        //         return item[this.valuePropertyName] === +this.form.value[this.formControlNameIAC];
        //     });
        //     if (found) {
        //         this.valueAuxIAC = found[this.displayPropertyName];
        //         this.valueChange.emit();
        //     } else {
        //         this.valueAuxIAC = '';
        //         this.objectAux[this.formControlNameIAC] = null;
        //         this.form.patchValue(this.objectAux);
        //     }
        // } else { this.valueAuxIAC = ''; }
        // this.setClass();
    }

    // private setStringList() {
    //     this.stringList = [];
    //     this.source.forEach((item) => {
    //         this.stringList.push(item[this.displayPropertyName]);
    //     })
    // }

    updateValue(value: number) {
        console.log('en updateValue');
        if(this.form.value[this.formControlNameIAC] != value) this.setNewValueControl(value);
        // this.replaceValues(value);
        this.updatedValue = true;
    }

    validateSelection(value: string) {
        // console.log('en validateSelection');
        // if (!this.updatedValue) {
        //     if (this.selectedValue) {
        //         if (this.selectedValue.name.toLowerCase() != value.toLowerCase()) {
        //             this.commonService.getPatientsBy(value)
        //                 .subscribe(response => {
        //                     let source: Array<Combo> = response.model;
        //                     const found = source.find((item) => {
        //                         return item.name.toLowerCase() == value.toLowerCase();
        //                     });
        //                     this.replaceValues(found);

        //                 });
        //         }
        //     } else {
        //         this.commonService.getPatientsBy(value)
        //                 .subscribe(response => {
        //                     let source: Array<Combo> = response.model;
        //                     const found = source.find((item) => {
        //                         return item.name.toLowerCase() == value.toLowerCase();
        //                     });
        //                     this.replaceValues(found);

        //                 });
        //     }
        // } else {
        //     this.updatedValue = false;
        // }
        // this.focus = false;
    }

    private replaceValues(found: any) {
        if (found) {
            if(this.form.value[this.formControlNameIAC] != found[this.valuePropertyName]) {
                // this.valueAuxIAC = found[this.displayPropertyName];
                this.setNewValueControl(found[this.valuePropertyName]);
            }
        } else {
            if (this.form.value[this.formControlNameIAC]) {
                this.valueIAC = '';
                this.selectedValue = null;
                this.setNewValueControl(null);
            } else {
                this.valueIAC = '';
                this.setClass();
            }
        }
    }

    private setNewValueControl(value: any) {
        this.objectAux[this.formControlNameIAC] = value;
        this.form.patchValue(this.objectAux);
        this.setClass();
        this.valueChange.emit();
    }

    private setClass() {
        console.log('en setClass');
        this.loadRequired();
        if (this.valueIAC) {
            this.invalidClass = false;
            this.validClass = true;
        } else {
            if (this.requiredIAC) this.invalidClass  = true;
            this.validClass  = false;
        }
    }

    activateLabel(): boolean {
        return this.form.value[this.formControlNameIAC] || this.focus;
    }

    clearInput() {
        this.valueIAC = '';
        this.selectedValue = null;
        this.objectAux[this.formControlNameIAC] = null;
        this.form.patchValue(this.objectAux);
        this.setClass();
        this.valueChange.emit();
    }

    observableSource(keyword: any): Observable<any[]> {
        if (keyword) {
            this.isLoading = true;
            // return this.commonService.getPatientsBy(keyword)
            //     .map(response => {
            //         this.isLoading = false;
            //         return response.model;
            //     });
            return Observable.of([]);
        } else {
            return Observable.of([]);
        }
    }

    onChangeInput(event: any) {
        console.log('event, ', event);
        // if(event instanceof Patientmod)
        if (event.number) {
            console.log('seleccionado ' + event)
            this.updateValue(event.number);
            this.selectedValue = event;
        }
        this.valueIAC = event;
      }

}