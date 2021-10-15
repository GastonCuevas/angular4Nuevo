import { OnInit, Component, Input, EventEmitter, Output, ViewChild } from "@angular/core";
import { UtilityService, ToastyMessageService } from "../../+core/services";
import { InternmentService } from '../internment.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Internment } from "../../models";
import { Subject } from "rxjs";
import { MaterializeAction } from "angular2-materialize";

@Component({
    selector: 'internment-high-hospitalization-form',
    templateUrl: './internment-high-hospitalization-form.component.html',
    styleUrls: ['./internment-high-hospitalization-form.component.scss']
})
export class InternmentHighHospitalizationFormComponent implements OnInit {
    
    datePickerOptions: any;
    isSaving = false;
    form: FormGroup;
    highTime: string;
    highDate: Date;
    modalActions = new EventEmitter<string|MaterializeAction>();
    timeOptions = this.getTimePickerOptions('time');
    
    @Input() openModalSubject: Subject<any>;

    @Input() internment: Internment;
    @Output() close: EventEmitter<any> = new EventEmitter<any>();
    
    constructor(
        private fb: FormBuilder,
        private _utilityService: UtilityService,
        public internmentService: InternmentService,
        private toastyService: ToastyMessageService,
        private utilityService: UtilityService
        ) {
    }

    ngOnInit() {
        this.datePickerOptions = this._utilityService.getDatePickerOptions();
        this.datePickerOptions.max = false;
        this.datePickerOptions.format = 'dd/mm/yyyy',
   
        this.createForm();
        this.openModalSubject.subscribe(event => {
            this.onOpenModal();
        });
    }

    onOpenModal() {
        this.modalActions.emit({action:"modal",params:['open']});
    }

    private createForm() {
        this.form = this.fb.group({
            departureDate: [this.internment.departureDate, Validators.required],
            departureTime: [this.internment.departureTime, Validators.required]
        });
    }
    
    onSubmit() {
        const internment = Object.assign({}, this.internment, this.form.value);
        internment.departureDate = this._utilityService.formatDate(internment.departureDate, "DD/MM/YYYY");
        internment.admissionDate = this._utilityService.formatDate(internment.admissionDate, "DD/MM/YYYY");
        this.internmentService.discharge(internment).subscribe(
            () => {
                this.toastyService.showSuccessMessagge("Alta de Internación");
                this.modalActions.emit({action:"modal",params:['close']});
                this.openModalSubject.unsubscribe();
                this.utilityService.navigate('camas/internaciones');
            },
            error => {
                this.toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrió un error al dar el alta');
            });
    }

    onCancel() {
        this.modalActions.emit({action:"modal",params:['close']});
    }

    private getTimePickerOptions(property: any) {
        return {
            donetext: 'Aceptar',
            canceltext: 'Cancelar',
            cleartext: 'Borrar',
            twelvehour: false,
            timeFormat: 'HH:mm',
            onSet: (value: any) => {
                var eventDate: any = {
                    srcElement: {
                        value: ''
                    },
                };


            }
        }
    }
}