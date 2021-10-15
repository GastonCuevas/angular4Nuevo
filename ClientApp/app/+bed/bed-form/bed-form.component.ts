import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../+core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../+core/services/utility.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { Subject } from 'rxjs';
import { Bed } from '../../models/bed.model';
import { BedService } from '../bed.service';

@Component({
  selector: 'app-bed-form',
  templateUrl: './bed-form.component.html',
  styleUrls: ['./bed-form.component.scss']
})
export class BedFormComponent implements OnInit {

  public bed: Bed = new Bed();
  public bedTypes: Array<any>;
  public wards: Array<any>;
  public auxListBedTypes: Array<any> = new Array<any>();
  public auxListWards: Array<any> = new Array<any>();
  public bedTypeName: string = '';
  public wardName: string = '';
  public form: FormGroup;
  public id: any;
  public isLoading: boolean = false;
  public isEdit: boolean = false;
  public openModalSubject: Subject<any> = new Subject();
  public title: string = "Nueva Cama";
  public isNewBed: boolean = false;
  public isLoadedBedType: boolean = false;
  public isLoadedWard: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private toastyService: ToastyMessageService,
    public bedService: BedService
  ) { }

  ngOnInit() {
    this.loadForm();
  }

  createForm() {
    this.form = this.fb.group({
        name: [this.bed.name, Validators.required],
        bedTypeName: [this.bed.typeName, Validators.required],
        wardName: [this.bed.wardName, Validators.required]
    });
  }


  customCallbackBedType(event: any) {
    if (event != null) {
        this.bedTypeName = event;
        this.isLoadedBedType = true;
        let a = this.bedTypes.find((e: any) => e.name.toLowerCase() == event.toLowerCase());
        if (a) {
            this.bedTypeName = a.name;
            this.bed.typeId = a.number;
            this.isLoadedBedType = true;
        }
    }
  }

  customCallbackWard(event: any) {
    if (event != null) {
        this.wardName = event;
        this.isLoadedWard = true;
        let a = this.wards.find((e: any) => e.name.toLowerCase() == event.toLowerCase());
        if (a) {
            this.wardName = a.name;
            this.bed.wardId = a.number;
            this.isLoadedWard = true;
        }
    }
  }

  getBed() {
    this.title = "Editar Cama";
    this.isLoading = true;
    this.bedService.getById(this.id)
    .subscribe(
      result => {
        this.bed = result.model;
        this.loadBedTypes();
        this.loadWards();
        this.createForm();
      },
      error => {
        this.toastyService.showErrorMessagge("Ocurrio un error al obtener los datos.");
    });
  }

  loadForm() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEdit = this.activatedRoute.snapshot.paramMap.get('detail') == 'true';
    if (this.id) this.getBed();
    else 
    {
      this.loadBedTypes();
      this.loadWards();
      this.createForm();
    }
  }

  loadBedTypes(){
    this.commonService.getBedTypes().subscribe(
      response => {
        this.bedTypes = response.model || [];
        this.auxListBedTypes = this.bedTypes.map(e => e.name);
        if(this.bed.typeId) {
          this.loadBedTypeName(this.bed.typeId);
        }
      },
      error => this.toastyService.showErrorMessagge("No se pudo obtener las especialidades")
    )
  }

  loadWards(){
    this.commonService.getWards()
    .finally(() => this.isLoading = false)
    .subscribe(
      response => {
        this.wards = response.model || [];
        this.auxListWards = this.wards.map(e => e.name);
        if(this.bed.wardId) this.loadWardName(this.bed.wardId);
      },
      error => this.toastyService.showErrorMessagge("No se pudo obtener las especialidades")
    )
  }

  loadBedTypeName(bedTypeId: number) {
    const found = this.bedTypes.find(b => b.number == bedTypeId );
    if(!found) return;
    this.bedTypeName = found.name;
    this.bed.typeName = found.name;
    this.isLoadedBedType = true;
  }

  loadWardName(wardId: number) {
    const found = this.wards.find(x => x.number == wardId);
    if(!found) return;
    this.wardName = found.name;
    this.bed.wardName = found.name;
    this.isLoadedWard = true;
  }

  onSubmit() {
    Object.assign(this.bed, this.form.value);
    var result = !!this.id ? this.bedService.update(this.bed) : this.bedService.insert(this.bed);

    result.subscribe(
        result => {
            this.toastyService.showSuccessMessagge("Se guardaron los cambios.");
            this.utilityService.navigate("camas/camas");
        },
        err => {
            this.toastyService.showErrorMessagge("Ocurrio un error al guardar los datos");
        });
  }

  onCancelButton(): void {
    this.openModalSubject.next();
  }

  onAgree() {
    this.utilityService.navigate("/camas/camas");
  }

}
