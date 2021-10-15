import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../+core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../+core/services/utility.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { Subject } from 'rxjs';
import { Ward } from '../../models/ward.model';
import { WardService } from '../ward.service';

@Component({
  selector: 'app-ward-form',
  templateUrl: './ward-form.component.html',
  styleUrls: ['./ward-form.component.scss']
})
export class WardFormComponent implements OnInit {

  public ward: Ward = new Ward();
  public wardTypes: Array<any>;
  public wardSectors: Array<any>;
  public auxListWardTypes: Array<any> = new Array<any>();
  public auxListWardSectors: Array<any> = new Array<any>();
  public wardTypeName: string = '';
  public wardSectorName: string = '';
  public form: FormGroup;
  public id: any;
  public isLoading: boolean = false;
  public isEdit: boolean = false;
  public openModalSubject: Subject<any> = new Subject();
  public title: string = "Nueva Sala";
  public isNewWard: boolean = false;
  public isLoadedWardType: boolean = false;
  public isLoadedWard: boolean = false;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private toastyService: ToastyMessageService,
    public wardService: WardService
  ) { }

  ngOnInit() {
    this.loadForm();
    this.loadWardTypes();
    this.loadWardSectors();
  }

  createForm() {
    this.form = this.fb.group({
      name: [this.ward.name, Validators.required],
      wardSectorName: [this.ward.sectorName, Validators.required],
      wardTypeName: [this.ward.typeName, Validators.required],
      disabled: [this.ward.disabled]
    });
  }


  // customCallbackWardType(event: any) {
  //   if (event != null) {
  //     this.wardTypeName = event;
  //     this.isLoadedWardType = true;
  //     let a = this.wardTypes.find((e: any) => e.name.toLowerCase() == event.toLowerCase());
  //     if (a) {
  //       this.wardTypeName = a.name;
  //       this.ward.typeId = a.number;
  //       this.isLoadedWardType = true;
  //     }
  //   }
  // }

  selectedType(event: any) {
    if (event != null) {
      this.ward.typeId = event.number;
      this.isLoadedWardType = true;
    }
  }
  // customCallbackWardSector(event: any) {
  //   if (event != null) {
  //       this.wardSectorName = event;
  //       this.isLoadedWard = true;
  //       let a = this.wardSectors.find((e: any) => e.name.toLowerCase() == event.toLowerCase());
  //       if (a) {
  //           this.ward.sectorName = a.name;
  //           this.ward.sectorId = a.number;
  //           this.isLoadedWard = true;
  //       }
  //   }
  // }

  selectedSector(event: any) {
    if (event != null) {
      this.ward.sectorId = event.number;
      this.isLoadedWard = true;
    }
  }

  getWard() {
    this.title = "Editar Sala";
    this.isLoading = true;
    this.wardService.getById(this.id)
      .finally(() => this.isLoading = false)
      .subscribe(
        result => {
          this.ward = result.model;
          this.loadWardTypeName(this.ward.typeId);
          this.loadWardSectorName(this.ward.sectorId);
          this.createForm();
        },
        error => {
          this.toastyService.showErrorMessagge("Ocurrio un error al obtener los datos.");
        });
  }

  loadForm() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEdit = this.activatedRoute.snapshot.paramMap.get('detail') == 'true';
    if (this.id) this.getWard();
    else this.createForm();
  }

  loadWardTypes() {
    this.commonService.getWardTypes().subscribe(
      response => {
        this.wardTypes = response.model || [];
        this.auxListWardTypes = this.wardTypes.map(e => e.name);
      },
      error => this.toastyService.showErrorMessagge("No se pudo obtener las especialidades")
    )
  }

  loadWardSectors() {
    this.commonService.getWardSectors().subscribe(
      response => {
        this.wardSectors = response.model || [];
        this.auxListWardSectors = this.wardSectors.map(e => e.name);
      },
      error => this.toastyService.showErrorMessagge("No se pudo obtener las especialidades")
    )
  }

  loadWardTypeName(wardTypeId: number) {
    for (let i in this.wardTypes) {
      if (this.wardTypes[i].number == wardTypeId) {
        this.wardTypeName = this.wardTypes[i].name;
        this.ward.typeName = this.wardTypes[i].name;
        this.isLoadedWardType = true;
      }
    }
  }

  loadWardSectorName(wardId: number) {
    for (let i in this.wardSectors) {
      if (this.wardSectors[i].number == wardId) {
        this.wardSectorName = this.wardSectors[i].name;
        this.ward.sectorName = this.wardSectors[i].name;
        this.isLoadedWard = true;
      }
    }
  }

  onSubmit() {
    Object.assign(this.ward, this.form.value);
    var result = !!this.id ? this.wardService.update(this.ward) : this.wardService.insert(this.ward);

    result.subscribe(
      result => {
        this.toastyService.showSuccessMessagge("Se guardaron los cambios.");
        this.utilityService.navigate("camas/salas");
      },
      err => {
        this.toastyService.showErrorMessagge("Ocurrio un error al guardar los datos");
      });
  }

  onCancelButton(): void {
    this.openModalSubject.next();
  }

  onAgree() {
    this.utilityService.navigate("/camas/salas");
  }

}
