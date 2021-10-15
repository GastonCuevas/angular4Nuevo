import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';

import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from '../../+core/services/utility.service';
import { ImportDataField } from '../../models/import-data-field';
import { ImportFieldService } from '../import-field.service';

@Component({
  selector: 'import-data-field-form',
  templateUrl: './import-data-field-form.component.html',
  styleUrls: ['./import-data-field-form.component.scss']
})
export class ImportDataFieldFormComponent implements OnInit {

    public importDataField: ImportDataField = new ImportDataField();
    public isLoading: boolean = false;
    public isEdit: boolean = false;
    public form: FormGroup;
    public openModalSubject: Subject<any> = new Subject();
    public title: string = "Nuevo Campo";
    public id: any;
    public importId: any;
    sourceFields: Observable<any> = this._importFieldService.getByTable(this._importFieldService.tableName);

    constructor(
        private fb: FormBuilder,
        private _importFieldService: ImportFieldService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _utilityService: UtilityService,
        private _toastyService: ToastyMessageService
    ) {
    }

    ngOnInit() {
        this.loadForm();
    }

    loadForm() {
       /*this.id = this._route.snapshot.paramMap.get('fieldid');  */ 
        this.importId = this._route.snapshot.paramMap.get('id');
        this.importDataField.importId = this.importId;
/*        this.isEdit = this._route.snapshot.paramMap.get('detail') == 'true';
         this.getImportData();
        else  */
        
        this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            name: [this.importDataField.name, Validators.required]
        });
    }

    saveField() {
        Object.assign(this.importDataField, this.form.value);
        this.importDataField.importId = this.importId;
        var result = this._importFieldService.add(this.importDataField);

        result.subscribe(() => {
                this._toastyService.showSuccessMessagge("Se guardaron los cambios.");
                this._utilityService.navigateToBack();
            },
            () => {
                this._toastyService.showErrorMessagge("Ocurrio un error al guardar los datos");
            });
    }

  /*   getImportData() {
        this.title = "Editar Campo";
        this.isLoading = true;
        this._importFieldService.get(this.id)
            .finally(() => this.isLoading = false)
            .subscribe(
            result => {
                this.importDataField = result.model;
                this.createForm();
            },
            error => {
                this._toastyService.showErrorMessagge("Ocurrio un error al obtener los datos.");
            });
    } */

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onAgree() {
        if(!this.importId){
            this._utilityService.navigate(`sistema/importData/formulario/`);
        }else{
            this._utilityService.navigate(`sistema/importData/formulario/${this.importId}`);
        }
    }

    onChangeFieldList(event:any){
        this.importDataField = event;
    }
}
