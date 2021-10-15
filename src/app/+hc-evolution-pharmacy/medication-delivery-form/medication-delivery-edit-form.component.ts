import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Article } from '../../models/article.model';
import { PharmacyScheme } from '../../models/pharmacy-scheme.model';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { CommonService, ToastyMessageService } from '../../+core/services';
import { PharmacySchemeItemService } from '../pharmacy-scheme-item.service';

@Component({
    selector: 'medication-delivery-edit-form',
    templateUrl: './medication-delivery-edit-form.component.html',
    styleUrls: ['./medication-delivery-edit-form.component.scss']
})
export class MedicationDeliveryEditFormComponent implements OnInit {

    form: FormGroup;
    modalConfirmSubject: Subject<any> = new Subject();
    modalCancelSubject: Subject<any> = new Subject();

    @Output() close = new EventEmitter<any>();
    @Input() pharmacyScheme: PharmacyScheme;

    constructor(
        public pharmacySchemeItemService: PharmacySchemeItemService,
        private fb: FormBuilder,
        private _toastyService: ToastyMessageService,
    ) {
    }

    ngOnInit() {
        this.loadForm();
    }

    private loadForm() {
        this.createForm();
    }

    private createForm() {
        this.form = this.fb.group({
            articleCode: [this.pharmacyScheme.articleCode, Validators.required],
            articleName: [this.pharmacyScheme.articleName, null],
            quantity: [this.pharmacyScheme.quantity, Validators.min(1)]
        });
    }

    save() {
        this.modalConfirmSubject.next();
    }

    saveConfirm() {
        const pharmacyScheme: PharmacyScheme = Object.assign({}, this.pharmacyScheme, this.form.value);
        this.pharmacySchemeItemService.update(pharmacyScheme.id, pharmacyScheme).subscribe(response => {
            this._toastyService.showSuccessMessagge(`El esquema ha sido modificado`);
            this.confirmCloseForm()
        },
            error => {
                this._toastyService.showErrorMessagge('No se pudo modificar el item');
            }
        );
    }

    cancel() {
        this.modalCancelSubject.next();
    }

    confirmCloseForm() {
        this.close.emit();
    }
}
