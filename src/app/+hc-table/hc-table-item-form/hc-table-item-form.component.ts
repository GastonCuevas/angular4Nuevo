import { Component, OnInit } from '@angular/core';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from '../../+core/services/utility.service';
import { CommonService } from '../../+core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HcTableItemService } from '../hc-table-item.service';
import { HcTableItem } from '../../models/hc-table-item.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-hc-table-item-form',
  templateUrl: './hc-table-item-form.component.html',
  styleUrls: ['./hc-table-item-form.component.scss']
})
export class HcTableItemFormComponent implements OnInit {

  isEdit: boolean = false;
  isLoading: boolean = false;
  form: FormGroup;
  hcTableItem: HcTableItem = new HcTableItem();
  title: string = "Nuevo Item de tabla de Historia Clinica";
  isNew: boolean = false;
  openModalSubject: Subject<any> = new Subject();

  constructor(
    public toastyMessageService: ToastyMessageService,
    public utilityService: UtilityService,
    public commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private fbp: FormBuilder,
    private router: Router,
    public hcTableItemService: HcTableItemService
  ) { }


  createForm() {
    this.form = this.fb.group({
      name: [this.hcTableItem.name, null],
      description: [this.hcTableItem.description, null]
    })
  }

  ngOnInit() {
    this.loadForm();
  }

  getItemTableHc(id: any) {
    this.isEdit = true;
    this.title = "Editar Item de Tabla de Historia Clinica";
    this.isLoading = true;
    this.hcTableItemService.get(id).finally(() => this.isLoading = false).subscribe(response => {
      this.hcTableItem = response.model;
      this.createForm();
    }, error => {
      this.toastyMessageService.showErrorMessagge();
    })
  }

  loadForm() {
    const itemId = this.activatedRoute.snapshot.paramMap.get('itemId');
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.hcTableItem.hcTableNumber = id ? parseInt(id) : 0;
    if (itemId) {
      this.getItemTableHc(itemId);
    } else this.createForm()
  }

  onAgree() {
    this.utilityService.navigate(`archivos/tablasHc/formulario/${this.hcTableItem.hcTableNumber}`);
  }

  onCancel() {
    this.isNew = false;
  }

  onCancelButton(): void {
    this.openModalSubject.next();
  }

  onSubmit($event: any) {
    let itemId = this.activatedRoute.snapshot.paramMap.get('itemId');
    const hcTableItem = Object.assign({}, this.hcTableItem, this.form.value);
    if (!itemId) {
      this.hcTableItemService.add(hcTableItem).subscribe(response => {
        this.toastyMessageService.showSuccessMessagge("Alta exitosa de item de tabla de historia clinica");
        this.utilityService.navigate(`archivos/tablasHc/formulario/${hcTableItem.hcTableNumber}`);
      },
        error => {
          this.toastyMessageService.showErrorMessagge("Ocurrió un error al dar el alta");
        })
    } else {
      this.hcTableItemService.update(itemId, hcTableItem).subscribe(response => {
        this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
        this.utilityService.navigate(`archivos/tablasHc/formulario/${hcTableItem.hcTableNumber}`);
      },
        error => {
          this.toastyMessageService.showErrorMessagge("Ocurrió un error al dar el alta");
        })
    }
  }
}
