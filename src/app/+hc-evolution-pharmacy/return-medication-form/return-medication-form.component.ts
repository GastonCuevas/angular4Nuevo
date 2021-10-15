import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Article } from '../../models/article.model';
import { PharmacyScheme } from '../../models/pharmacy-scheme.model';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { CommonService, ToastyMessageService } from '../../+core/services';
import { HcEvolutionPharmacyService } from '../hc-evolution-pharmacy.service';
import { ReturnMedicationService } from '../return-medication.service';

@Component({
  selector: 'return-medication-form',
  templateUrl: './return-medication-form.component.html',
  styleUrls: ['./return-medication-form.component.scss']
})
export class ReturnMedicationFormComponent implements OnInit {

  form: FormGroup;
  modalDiscardSubject: Subject<any> = new Subject();
  articles: Array<Article>;
  loadingArticles = false;

  @Output() close = new EventEmitter<any>();
  @Input() pharmacyScheme: PharmacyScheme;

  constructor(
      public hcEvolutionPharmacyService: HcEvolutionPharmacyService,
      public returnMedicationService: ReturnMedicationService,
      private fb: FormBuilder,
      private _toastyService: ToastyMessageService,
      private _commonService: CommonService
  ) {
  }

  ngOnInit() {
      this.loadForm();
  }

  ngAfterViewChecked() {
      $('#observation').trigger('autoresize');
  }

  private loadForm() {
      this.createForm();
  }

  private createForm() {
      this.form = this.fb.group({
          articleCode: [this.pharmacyScheme.articleCode, Validators.required],
          articleName: [this.pharmacyScheme.articleName, null],
          quantity: [this.pharmacyScheme.quantity, [Validators.min(1), Validators.max(this.pharmacyScheme.quantityWithOutChanges)]]
      });
  }

  save() {
      const pharmacyScheme: PharmacyScheme = Object.assign({}, this.pharmacyScheme, this.form.value);
      const result = this.returnMedicationService.update(pharmacyScheme);
      let message: string;
      if (result) {
          message = `El esquema ha sido ${this.hcEvolutionPharmacyService.isNew ? 'agregado' : 'modificado'}`;
          this.close.emit();
          this._toastyService.showSuccessMessagge(message);
      } else this._toastyService.showErrorMessagge('No se pudo modificar el item');
  }

  private getArticleName(articleCode: string) {
      const article = this.articles.find((d: Article) => d.code === articleCode);
      return !article ? '' : article.description;
  }

  cancel() {
      this.modalDiscardSubject.next();
  }

  closeForm() {
      this.close.emit();
  }

}
