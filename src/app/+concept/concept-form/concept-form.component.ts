import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../+core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../+core/services/utility.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { Subject } from 'rxjs';
import { Concept } from '../../models/concept.model';
import { ConceptService } from '../concept.service';

@Component({
  selector: 'app-concept-form',
  templateUrl: './concept-form.component.html',
  styleUrls: ['./concept-form.component.scss']
})
export class ConceptFormComponent implements OnInit {

  public concept: Concept = new Concept();
  public conceptTypes: Array<any>;
  public conceptTypeName: string = '';
  public form: FormGroup;
  public id: any;
  public isLoading: boolean = false;
  public isEdit: boolean = false;
  public openModalSubject: Subject<any> = new Subject();
  public title: string = "Nuevo Concepto";
  public isNewConcept: boolean = false;
  public isLoadedConceptType: boolean = false;
  public isLoadedConcept: boolean = false;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private toastyService: ToastyMessageService,
    public conceptService: ConceptService
  ) { }

  ngOnInit() {
    this.loadForm();
  }

  createForm() {
    this.form = this.fb.group({
      code: [this.concept.code, Validators.required],
      description: [this.concept.description, Validators.required],
      price: [this.concept.price, Validators.required],
      type: [this.concept.type, Validators.required]
    });
  }

  getConcept() {
    this.title = "Editar Concepto";
    this.isLoading = true;
    this.conceptService.getById(this.id)
      .finally(() => this.isLoading = false)
      .subscribe(
        result => {
          this.concept = result.model;
          this.createForm();
        },
        error => {
          this.toastyService.showErrorMessagge("Ocurrio un error al obtener los datos.");
        });
  }

  loadForm() {
    this.loadConceptTypes();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) this.getConcept();
    else this.createForm();
  }

  onSubmit() {
    Object.assign(this.concept, this.form.value);
    var result = !!this.id ? this.conceptService.update(this.concept) : this.conceptService.insert(this.concept);

    result.subscribe(
      result => {
        this.toastyService.showSuccessMessagge("Se guardaron los cambios.");
        this.utilityService.navigate("/sisarchivos/conceptos");
      },
      err => {
        this.toastyService.showErrorMessagge("Ocurrio un error al guardar los datos");
      });
  }

  onCancelButton(): void {
    this.openModalSubject.next();
  }

  onAgree() {
    this.utilityService.navigate("/sisarchivos/conceptos");
  }

  loadConceptTypes() {
    this.conceptTypes = [
      {number: 1, name: "Para Contrato Profesional"},
      {number: 0, name: "Para Liquidacion"}
    ];
  }
}
