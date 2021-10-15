import { Component, OnInit } from '@angular/core';
import { Holiday } from '../../models/holiday.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HolidayService } from '../holiday.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastyMessageService, UtilityService } from '../../+core/services';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-holiday-form',
  templateUrl: './holiday-form.component.html',
  styleUrls: ['./holiday-form.component.scss']
})
export class HolidayFormComponent implements OnInit {

  public holiday: Holiday = new Holiday();
  public isLoading: boolean = false;
  public isEdit: boolean = false;
  public form: FormGroup;
  public openModalSubject: Subject<any> = new Subject();
  public title: string = "Nuevo Feriado";
  public id: any;
  public datePickerOptions: any;

  constructor(
    private fb: FormBuilder,
    private _holidayService: HolidayService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _utilityService: UtilityService,
    private _toastyService: ToastyMessageService
  ) { 
    this.id = this._route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;
  }

  ngOnInit() {
    this.datePickerOptions = this._utilityService.getDatePickerOptions();
    this.datePickerOptions.max = false;
    this.datePickerOptions.format = 'dd/mm/yyyy',
    this.loadForm();
  }

  loadForm() {
    if (this.id) this.getHoliday();
    else this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      date: [this.holiday.date, Validators.required],
      description: [this.holiday.description, Validators.required]
    });
  }

  saveHoliday() {
    const holiday = Object.assign({}, this.holiday, this.form.value);
    holiday.date = moment(holiday.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    let result = !!this.id ? this._holidayService.update(this.id, holiday) : this._holidayService.insert(holiday);

    result.subscribe(
      result => {
        this._toastyService.showSuccessMessagge("Se guardaron los cambios.");
        this._utilityService.navigate("archivos/feriados");
      },
      err => {
        this._toastyService.showErrorMessagge("Ocurrio un error al guardar los datos");
      });
  }

  getHoliday() {
    this.title = "Editar Feriado";
    this.isLoading = true;
    this._holidayService.get(this.id)
      .finally(() => this.isLoading = false)
      .subscribe(
      result => {
        this.holiday = result.model;
        this.holiday.date = this._utilityService.formatDate(result.model.date, "", "DD/MM/YYYY");
        // const date = <string> this.holiday.date;
        // this.holiday.date = moment(date.split(' ')[0], 'D-M-YYYY').format('DD/MM/YYYY');
        this.createForm();
      },
      error => {
        this._toastyService.showErrorMessagge("Ocurrio un error al obtener los datos.");
      });
  }

  onCancelButton(): void {
    this.openModalSubject.next();
  }

  onAgree() {
    this._utilityService.navigate("/archivos/feriados");
  }
}
