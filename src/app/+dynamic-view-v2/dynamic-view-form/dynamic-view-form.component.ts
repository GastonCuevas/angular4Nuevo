import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { Observable, Subject } from 'rxjs';

import { DynamicViewService } from '../dynamic-view.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';

import { ControlBase, AutocompleteControl, ControlDropdown } from '../../+shared/forms/controls';
import { GenericObject, Property, ControlType, Parameter, ControlOptions } from '../util';
import { ContentModal } from '../../+shared/util';

@Component({
    selector: 'dynamic-view-form',
    templateUrl: './dynamic-view-form.component.html',

    styleUrls: ['./dynamic-view-form.component.scss'],
    providers: [DynamicViewService],
})
export class DynamicViewFormComponent implements OnInit {

    @Input() initSubject: Subject<any>;
    @Output() reloadingData: EventEmitter<any> = new EventEmitter<any>();

    titleModal: string;
    isSaving: boolean = false;
    showForm: boolean = false;
    btnTextSubmit: string = 'Guardar';
    inputDataControls: Array<ControlBase<any>> = [];
    mainModalActions = new EventEmitter<string | MaterializeAction>();
    openModalDiscardChange: Subject<any> = new Subject();
    activeModalDiscardChange: boolean;
    contentModalDiscardChange: ContentModal = {
        msg: '¿ Desea descartar los cambios realizados ?',
        primaryBtnTxt: 'Si',
        secondaryBtnTxt: 'No',
        centered: true
    };

    private genericObject: GenericObject = new GenericObject();
    private isEditing: boolean = false;
    private idItemValue: number;
    private idItemProperty: string;


    constructor(
        private dynamicViewService: DynamicViewService,
        private toastyMessageService: ToastyMessageService
    ) {
    }

    ngOnInit() {
        this.initSubject.subscribe( (event: Parameter) => {
            this.loadComponentValues(event);
          });
    }

    private loadComponentValues(parameter: Parameter) {
        this.titleModal = parameter.title;
        this.idItemProperty = parameter.idItemProperty.toLowerCase();
        this.setGenericObject(parameter);
    }

    private setGenericObject(parameter: Parameter) {
        this.genericObject.tableName = parameter.tableName;
        this.genericObject.useCase = parameter.useCaseCode;
        for (let ept of parameter.entityProperties) {
            let property = new Property(ept);
            this.genericObject.entityProperties.push(property);
        }
    }

    openModal(item?: any) {
        this.loadModalValues(item);
        this.mainModalActions.emit({ action: "modal", params: ['open'] });
    }

    private loadModalValues(item?: any) {
        this.isEditing = item ? true : false;
        this.idItemValue = item ? item[this.idItemProperty] : 0;
        // this.titleModal = item ? 'Modificar ' + this.titleModal : 'Nuevo ';
        this.btnTextSubmit = item ? 'Modificar' : 'Guardar';
        this.setInputDataControls(item);
        this.showForm = true;
    }

    private setInputDataControls(item?: any) {
        const totalItems = this.genericObject.entityProperties.length;
        for (let p of this.genericObject.entityProperties) {
            if (p.foraignTable) {
                if (p.controlType === ControlType.AUTOCOMPLETE) {
                    const control = new AutocompleteControl(this.getOptions(p, item, totalItems));
                    this.inputDataControls.push(control);
                } else {
                    const control = new ControlDropdown(this.getOptions(p, item, totalItems));
                    this.inputDataControls.push(control);
                }
            } else {
                if (p.name.toLowerCase() != this.idItemProperty) {
                    const control = new ControlBase<any>(this.getOptions(p, item, totalItems));
                    this.inputDataControls.push(control);
                }
            }
        }
    }

    private getOptions(p: Property, item: any, total: number): ControlOptions {
        let controlOptions: ControlOptions = new ControlOptions();
        controlOptions.key = p.name;
        controlOptions.label = p.label;
        controlOptions.value = item ? item[p.name] : null;
        controlOptions.order = p.order;
        controlOptions.type = p.controlType;
        controlOptions.class = p.class ? p.class : total === 2 ? 'offset-m3 col s12 m6' : 'col s12 m6';
        controlOptions.required = p.required;
        controlOptions.source = p.foraignTable ? this.getFunctionForData(p) : null;
        return controlOptions;
    }

    private getFunctionForData(p: Property): Observable<any> {
        return this.dynamicViewService.getComboBy(p.foraignTable, p.foraignKey, p.foraignField)
            .map ((res) => {
                return res.model
            })
            .catch((error: any) => {
                this.toastyMessageService.showErrorMessagge('Error al cargar datos para ' + p.name);
                return Observable.throw ( 'Error del Servidor');
            });
    }

    cancelModal() {
        this.openModalDiscardChange.next();
        this.activeModalDiscardChange = true;
    }

    discardChanges() {
        this.mainModalActions.emit({ action: "modal", params: ['close'] });
        this.activeModalDiscardChange = false;
        this.resetValues();
    }

    private resetValues() {
        this.showForm = false;
        this.inputDataControls = [];
    }

    onSubmit(formValue: any) {
        this.isSaving = true;
        this.genericObject.entityProperties.forEach( p => {
            p.value = p.name === this.idItemProperty ? this.idItemValue : formValue[p.name];
            p.modified = this.isEditing ? true : false;
        });
        if (!this.isEditing) this.addItem();
        else this.updateItem();
    }

    private addItem() {
        this.dynamicViewService.add(this.genericObject)
            .finally(() => this.isSaving = false)
            .subscribe(
                result => {
                    this.onSuccessCommit('Se guardo exitosamente.');
                },
                error => {
                    this.toastyMessageService.showErrorMessagge(error.message || "Ocurrio un error al guardar los datos");
                });
    }

    private updateItem() {
        this.dynamicViewService.update(this.genericObject, this.idItemValue)
            .finally(() => this.isSaving = false)
            .subscribe(
                result => {
                    this.onSuccessCommit('Se actualizo exitosamente.');
                },
                error => {
                    this.toastyMessageService.showErrorMessagge(error.message || "Ocurrio un error al actualizar los datos");
                });
    }

    private onSuccessCommit(msg: string) {
        this.mainModalActions.emit({ action: "modal", params: ['close'] });
        this.resetValues();
        this.reloadingData.next();
        this.toastyMessageService.showSuccessMessagge(msg);
    }

}