import { Component, OnInit } from '@angular/core';
import { PracticeInosService } from './../practice-inos.service';
import { PracticeInos } from './../../models/practiceInos.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from '../../+core/services/utility.service';
import { Subject } from 'rxjs/Subject';
import { CommonService } from './../../+core/services/common.service';

@Component({
    selector: 'app-practice-inos-form',
    templateUrl: 'practice-inos-form.component.html',
    styleUrls: ['./practice-inos-form.component.css']
})

export class PracticeInosFormComponent implements OnInit {
    practiceInos: PracticeInos = new PracticeInos();
    form: FormGroup;
    isEdit: boolean = false;
    title: string = "Nueva Práctica INOS";
    isLoading: boolean = false;
    tipos: Array<any>;
    openModalSubject: Subject<any> = new Subject();

    constructor(
        private practiceInosService: PracticeInosService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private toastyService: ToastyMessageService,
        private utilityService: UtilityService,
        private commonService: CommonService
    ) { }

    ngOnInit() {
        this.loadTiposPracticas();
        this.loadForm();
    }

    loadForm() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id) this.getPracticeInos(id);
        else this.createForm();
    }

    loadTiposPracticas() {
        this.commonService.getPracticeType().subscribe(response => {
            this.tipos = response.model;
        },
            error => {
                this.toastyService.showErrorMessagge("Ocurrio un error al cargar el combo")
            })
    }

    getPracticeInos(id: any) {
        this.isEdit = true;
        this.title = "Editar Práctica INOS";
        this.isLoading = true;
        this.practiceInosService.get(id)
            .finally(() => this.isLoading = false)
            .subscribe(response => {
                this.practiceInos = response.model;
                this.createForm();
            },
            error => {
                this.toastyService.showErrorMessagge("Ocurrio un error al obtener los datos de práctica INOS");
            })
    }

    createForm() {
        this.form = this.fb.group({
            practiceTypeNumber: [this.practiceInos.practiceTypeNumber, Validators.required],
            code: [this.practiceInos.code, Validators.required],
            description: [this.practiceInos.description, Validators.required],
            disabled: [this.practiceInos.disabled, null]
        })
    }

    onSubmit($event: any) {
        this.form.value.disabled = this.form.value.disabled ? true : false;
        const practiceInos = Object.assign({}, this.practiceInos, this.form.value);
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        if (!id) {
            this.practiceInosService.add(practiceInos).subscribe(response => {
                this.toastyService.showSuccessMessagge("Alta exitosa de práctica Inos");
                this.utilityService.navigate("archivos/practicasInos");
            },
                error => {
                    this.toastyService.showErrorMessagge("Ocurrió un error al dar el alta");
                })
        } else {
            this.practiceInosService.update(id, practiceInos).subscribe(response => {
                this.toastyService.showSuccessMessagge("Se guardaron los cambios");
                this.utilityService.navigate("archivos/practicasInos");
            },
                error => {
                    this.toastyService.showErrorMessagge("Ocurrió un error al editar");
                })
        }
    }

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onAgree() {
        this.utilityService.navigate("archivos/practicasInos");
    }


}