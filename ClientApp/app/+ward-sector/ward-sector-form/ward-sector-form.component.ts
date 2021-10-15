import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../+core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../+core/services/utility.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { Subject } from 'rxjs';
import { Ward } from '../../models/ward.model';
import { WardSectorService } from '../ward-sector.service';
import { WardSector } from '../../models/ward-sector.model';

@Component({
  selector: 'app-ward-sector-form',
  templateUrl: './ward-sector-form.component.html',
  styleUrls: ['./ward-sector-form.component.scss']
})
export class WardSectorFormComponent implements OnInit {

  public wardSector: WardSector = new WardSector();
  public deposits: Array<any>;
  public wardSectors: Array<any>;
  public auxListWardTypes: Array<any> = new Array<any>();
  public auxListDeposit: Array<any> = new Array<any>();
  public depositName: string = '';
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
    public wardSectorService: WardSectorService
  ) { }

  ngOnInit() {
    this.loadForm();
    this.loadDeposits();
  }

  createForm() {
    this.form = this.fb.group({
      name: [this.wardSector.name, Validators.required],
      depositName: [this.wardSector.depositName, Validators.required],
    });
  }

  // customCallbackDeposit(event: any) {
  //   if (event != null) {
  //     this.depositName = event;
  //     this.isLoadedWardType = true;
  //     let a = this.deposits.find((e: any) => e.name.toLowerCase() == event.toLowerCase());
  //     if (a) {
  //       this.depositName = a.name;
  //       this.wardSector.depositId = a.number;
  //       this.isLoadedWardType = true;
  //     }
  //   }
  // }

  depositSelected(deposit: any) {
    if (event != null) {
      this.wardSector.depositId = deposit.number;
    }
  }

  getWardSector() {
    this.title = "Editar Sector";
    this.isLoading = true;
    this.wardSectorService.getById(this.id)
      .finally(() => this.isLoading = false)
      .subscribe(
        (result: any) => {
          this.wardSector = result.model;
          this.loadDepositName(this.wardSector.depositId);
          this.createForm();
        },
        (error: any) => {
          this.toastyService.showErrorMessagge("Ocurrio un error al obtener los datos.");
        });
  }

  loadForm() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEdit = this.activatedRoute.snapshot.paramMap.get('detail') == 'true';
    if (this.id) this.getWardSector();
    else this.createForm();
  }

  loadDeposits() {
    this.commonService.getDeposits().subscribe(
      response => {
        this.deposits = response.model || [];
        // this.auxListDeposit = this.deposits.map(e => e.name);
      },
      error => this.toastyService.showErrorMessagge("No se pudo obtener las especialidades")
    )
  }

  loadDepositName(wardTypeId: number) {
    for (let i in this.deposits) {
      if (this.deposits[i].number == wardTypeId) {
        this.depositName = this.deposits[i].name;
        this.wardSector.depositName = this.deposits[i].name;
        this.isLoadedWardType = true;
      }
    }
  }


  onSubmit() {
    Object.assign(this.wardSector, this.form.value);
    var result = !!this.id ? this.wardSectorService.update(this.wardSector) : this.wardSectorService.insert(this.wardSector);

    result.subscribe(
      result => {
        this.toastyService.showSuccessMessagge("Se guardaron los cambios.");
        this.utilityService.navigate("camas/sectorsala");
      },
      err => {
        this.toastyService.showErrorMessagge("Ocurrio un error al guardar los datos");
      });
  }

  onCancelButton(): void {
    this.openModalSubject.next();
  }

  onAgree() {
    this.utilityService.navigate("/camas/sectorsala");
  }

}
