import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { ControlBase } from '../controls';
import { FormControlService } from '../form-control.service';
import { BoundCallbackObservable } from 'rxjs/observable/BoundCallbackObservable';
import { forEach } from '@angular/router/src/utils/collection';
import { concat } from 'rxjs/observable/concat';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  providers: [FormControlService],
  encapsulation: ViewEncapsulation.None
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() public controls: Array<ControlBase<any>> = [];
  @Input() public btnTextSubmit = 'Aceptar';
  @Input() public btnText = '';
  @Input() public formClass = 'col s12';
  @Output() public formsubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() public formreturn: EventEmitter<any> = new EventEmitter<any>();

  @Input() public validatorFn: ValidatorFn | undefined;
  @Input() public isLoading: boolean ;
  @Input() public errorSumary: string  = "";
  @Input() public isDetail : boolean = false;

  @Input() enabledSubmitBtn: boolean = true;

  public form: FormGroup;

  constructor(private controlService: FormControlService) { }

  ngOnInit() {
    const sortedControls = this.controls.sort((a, b) => a.order - b.order);
    this.form = this.controlService.toControlGroup(sortedControls, this.validatorFn);
  }

  ngOnChanges() {
  }

  public onSubmit() {
    this.formsubmit.emit(this.form.value);
  }

  public onReturn(){
    this.formreturn.emit();
  }

}
