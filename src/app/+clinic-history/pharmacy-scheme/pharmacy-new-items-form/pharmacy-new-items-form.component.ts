import { Component, OnInit, Output, EventEmitter, ViewChild, Input, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';

import { ToastyMessageService, UtilityService } from '../../../+core/services';
import { ClinicHistoryPharmacySchemeService } from '../clinic-history-pharmacy-scheme.service';
import { PharmacyScheme, MedicationScheme, Medicine } from '../../../models/pharmacy-scheme.model';
import { DynamicTableComponent, GenericControl, InputAutoComplete } from '../../../+shared';
import * as moment from 'moment';
declare var $: any;

@Component({
    selector: 'pharmacy-new-items-form',
    templateUrl: './pharmacy-new-items-form.component.html',
	styleUrls: ['./pharmacy-new-items-form.component.scss']
})

export class PharmacyNewItemsFormComponent implements OnInit {
    public articleTypes: Array<any>;
    pharmacyScheme: MedicationScheme = new MedicationScheme();
    medicine: any = {};
    form: FormGroup;
    formPharmacyScheme: FormGroup;
    modalDiscardSubject: Subject<any> = new Subject();
    isAnyPracticeSelected: boolean = false;
    @ViewChild(DynamicTableComponent) dtComponent: DynamicTableComponent;
    @ViewChild('articlesIAC') articlesIAC: InputAutoComplete;
    @Input() hcId: number;

    isLoading = true;

    articles: Array<any>;
    loadingArticles = false;

    controlsToFilter: Array<GenericControl> = [
        { key: 'description', label: 'Medicamento', type: 'text', class: 'col s12 m12', searchProperty: 'Description' }
      ];
    
    private filterBy: string = '';
    dataSource = new Array<any>();
    isFiltering = false;
    public datePickerOptionsFrom: any;
    public datePickerOptionsTo: any;
    public isActiveDate = true;

    timeOptions = this.getTimePickerOptions('time');

    @Output() closeView: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public chPharmacySchemeService: ClinicHistoryPharmacySchemeService,
        private fb: FormBuilder,
        private _toastyService: ToastyMessageService,
        private _utilityService: UtilityService,
        private renderer: Renderer2
    ) {
    }

    ngOnInit() {
        this.loadArticles();

        this.loadForm();
        this.loadFormPharmacyScheme();
    }

    deleteMedication (index: any){
        let control = <FormArray>this.formPharmacyScheme.controls.medicines;
        control.removeAt(index);
    }

    addMedications() {
        const medicalGuard = Object.assign({}, this.medicine, this.form.value);
        let timeControl;
        if (this.form.value.type == 2)
            timeControl = [{
                value: '',
                disabled: true,
            }, Validators.required ];
        else 
            timeControl = [this.form.value.time, Validators.required];
        let control = <FormArray>this.formPharmacyScheme.controls.medicines;
        control.push(
            this.fb.group({
                id: 0,
                hcSchemeId: [this.pharmacyScheme.id],
                articleCode: [ this.form.value.articleCode, null ],
                articleName: [ this.form.value.articleName, null ],
                articleNameDetail: [ {
                    value: this.form.value.articleName,
                    disabled: true
                 }, null ],
                type: [this.form.value.type, Validators.required],
                quantity: [this.form.value.quantity, Validators.required],
                time: timeControl
            })
        );
        
        this.chPharmacySchemeService.medicationsSelected.push(medicalGuard);
        this.form.reset();
        this.articlesIAC.clearInput();

    };
    loadArticleTypes() {
        this.articleTypes = [
            {number: 1, name: "General"},
            {number: 2, name: "S.O.S."},
        ];
    }

    private loadArticles() {
        this.loadingArticles = true;
        this.chPharmacySchemeService.getArticles()
            .finally(() => this.loadingArticles = false )
            .subscribe(
                response => {
                    this.articles = response.model;
                },
                error => {
                    this._toastyService.showErrorMessagge(error.success ? error.errorMessage : 'Error al cargar el combo de articulos');
                }
            );
    };
    private loadForm() {
        this.loadArticleTypes();
        this.createForm();
    };
    private loadFormPharmacyScheme() {
        this.datePickerOptionsFrom = this._utilityService.getDatePickerOptions();
        this.datePickerOptionsFrom.min = new Date();
        this.datePickerOptionsFrom.max = false;
        this.datePickerOptionsFrom.formatSubmit = 'dd/mm/yyyy';

        this.datePickerOptionsTo = this._utilityService.getDatePickerOptions();
        this.datePickerOptionsTo.min = new Date();
        this.datePickerOptionsTo.max = false;
        this.datePickerOptionsTo.formatSubmit = 'dd/mm/yyyy';

        if (!this.chPharmacySchemeService.isNew) this.pharmacyScheme = this.chPharmacySchemeService.medicineScheme;

        this.createFormPharmacyScheme();
    };

    private createForm() {
        this.form = this.fb.group({
            id: [this.medicine.id = 0],
            hcSchemeId: [this.medicine.hcSchemeId],
            articleCode: [this.medicine.articleCode, Validators.required],
            articleName: [this.medicine.articleName, Validators.required],
            type: [this.medicine.type, Validators.required],
            quantity: [this.medicine.quantity, Validators.required],
            time: [this.medicine.time, Validators.required]
        });
    };

    // get medications() {
    //     return this.formPharmacyScheme.get('medications') as FormArray;
    // }

    private createFormPharmacyScheme() {
        this.formPharmacyScheme = this.fb.group({
            dateIni: [moment(this.pharmacyScheme.dateIni).format('DD-MM-YYYY'), Validators.required],
            //dateIni: [this.pharmacyScheme.dateIni, Validators.required],
            dateEnd: [moment(this.pharmacyScheme.dateEnd).format('DD-MM-YYYY'), Validators.required],
            //dateEnd: [this.pharmacyScheme.dateEnd, Validators.required],
            observation: [this.pharmacyScheme.observation, null],
            medicines: this.fb.array([])
        });

        if (this.pharmacyScheme && this.pharmacyScheme.medicines) {
            let control = <FormArray>this.formPharmacyScheme.controls.medicines;
            this.pharmacyScheme.medicines.forEach(medicine => {
                let timeControl;
                if (+medicine.type == 2)
                    timeControl = [{
                        value: '',
                        disabled: true,
                    }, Validators.required ];
                else 
                    timeControl = [medicine.time, Validators.required];

                control.push(
                    this.fb.group({
                        id: [medicine.id],
                        hcSchemeId: [medicine.hcSchemeId],
                        articleCode: [ medicine.articleCode, null ],
                        articleName: [ medicine.articleName, null ],
                        articleNameDetail: [ {
                            value: medicine.articleName,
                            disabled: true
                            }, null ],
                        type: [medicine.type, Validators.required],
                        quantity: [medicine.quantity, Validators.required],
                        time: timeControl
                    })
                );
            });
        }
    };
    
    changeDateFrom() {
        var dateIni = moment(this.formPharmacyScheme.value.dateIni, "DD/MM/YYYY").toDate();
        const dateEnd: HTMLInputElement = this.renderer.selectRootElement('#dateEnd');
        $(dateEnd).pickadate('picker').set('min', dateIni);
    }
    changeDateTo() {
        var dateEnd = moment(this.formPharmacyScheme.value.dateEnd, "DD/MM/YYYY").toDate();
        const dateIni: HTMLInputElement = this.renderer.selectRootElement('#dateIni');
        $(dateIni).pickadate('picker').set('max', dateEnd);
    }

    onSelectChange(event: any) {
        let timeControl = this.form.get('time');
        if (timeControl) {
            if (this.form.value.type == 2) {
                timeControl.disable();
                timeControl.reset();
            } else {
                timeControl.enable();
            }
        }
    }
    onSelectTypeChange(event: any, index: any) {
        let medicationsControl = this.formPharmacyScheme.get('medicines') as FormArray; //
        if (medicationsControl) {
            let timeControl = medicationsControl.controls[index].get('time');//.disable()
            let typeControl = medicationsControl.controls[index].get('type');//.disable()
            if (timeControl && typeControl)
                if (typeControl.value == 2) {
                    timeControl.disable();
                    timeControl.reset();
                } else {
                    timeControl.enable();
                }
        }
    }

    savePharmacyScheme() {
        const medicalGuardScheme: MedicationScheme = Object.assign(this.pharmacyScheme, this.formPharmacyScheme.value);
        medicalGuardScheme.dateEnd = moment(medicalGuardScheme.dateEnd, "DD/MM/YYYY").toDate();
        medicalGuardScheme.dateIni = moment(medicalGuardScheme.dateIni, "DD/MM/YYYY").toDate();

        medicalGuardScheme.hcId = +this.hcId;
        
        if (this.chPharmacySchemeService.isNew)
            this.chPharmacySchemeService.addMedicineScheme(medicalGuardScheme);
        else {
            this.chPharmacySchemeService.updateMedicineScheme(medicalGuardScheme)
        }
        
        this._toastyService.showSuccessMessagge("Se guardaron los cambios");
        this.closeView.emit({ action: 'nuevo' });
    }
    onChangeIAC(event: any) {
        this.form.patchValue({
			articleName: event.name,
			articleCode: event.id,
        });
	}








    save() {
        let inputInvalidQuantity = this.chPharmacySchemeService.medicationsSelected
            .filter((medication: any) => medication.selected === true && medication.added == false && medication.quantity == 0);
        if (inputInvalidQuantity.length >= 1) this._toastyService.showErrorMessagge("Ingrese cantidad de item seleccionado");
        else {
            this.chPharmacySchemeService.medicationsSelected = this.chPharmacySchemeService.medicationsSelected
            .filter((medication: any) => medication.selected === true && medication.added == false);
          let professionalPractices: Array<any> = new Array<any>();
          this.chPharmacySchemeService.medicationsSelected.forEach(e => {
            let item = {
              numint: 0,
              hcId: +this.hcId,
              articleCode: e.code,
              articleName: e.description,
              quantity: e.quantity,
              date: e.date,
              time: e.time,
              posology: e.posology
            }
            professionalPractices.push(item);
          });
          this.chPharmacySchemeService.addRange(professionalPractices);
          this._toastyService.showSuccessMessagge("Se guardaron los cambios");
          this.closeView.emit({ action: 'nuevo' });
        }
    }

    cancel() {
        this.modalDiscardSubject.next();
    }

    closeForm() {
        this.closeView.emit();
    }

    onFilterChange(filterBy: string) {
        this.filterBy = filterBy;

        //this.loadMedications();
    }

    private loadMedications() {
        this.isLoading = true;
        this.chPharmacySchemeService.getMedicationsToCheck(null, this.filterBy)
            .finally(() => this.isLoading = false)
            .subscribe(response => {
                this.chPharmacySchemeService.medicationsSelected = response.model;

                // this.chPharmacySchemeService.medicationsSelected.forEach(item => {
                //     let practiceAdded = this.chPharmacySchemeService.schemesList.find(
                //         practice => { return practice.articleCode === item.code});
                //     item.added = !!practiceAdded;
                //     item.selected = item.added;
                //     item.quantity = practiceAdded ? practiceAdded.quantity : 0;
                //     item.date = practiceAdded ? practiceAdded.date : '';
                //     item.time = practiceAdded ? practiceAdded.time : '';
                //     item.posology = practiceAdded ? practiceAdded.posology : 0;                    
                // });
                response.model = this.chPharmacySchemeService.medicationsSelected;                
            },
                () => {
                    this._toastyService.showErrorMessagge('Ocurrio un error al obtener los datos.');
                });
    }

    onCheckboxChange() {
    }

    changeInput(event: any) {
         console.log(event);
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