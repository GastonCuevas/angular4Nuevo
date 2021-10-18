import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

import { ControlBase } from '../controls';
import { GenericControl } from '../../index';

@Component({
  selector: 'app-dynamic-form-control',
  templateUrl: './dynamic-form-control.component.html',
  styleUrls: ['./dynamic-form-control.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicFormControlComponent implements OnInit {
  @Input() public control: ControlBase<string | boolean> | GenericControl;
  @Input() public form: FormGroup;
  @Input() public isDetail: boolean = false;

  constructor() { }
  ngOnInit() {
  }
  get valid() {
    return this.form.controls[this.control.key].valid;
  }

  get invalid() {
    return !this.form.controls[this.control.key].valid && this.form.controls[this.control.key].touched;
  }
}
