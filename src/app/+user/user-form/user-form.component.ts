import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { MaterializeAction } from 'angular2-materialize';

import { UserService } from '../user.service';
import { User } from '../../models/user.model';
import { CommonService } from '../../+core/services/common.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from '../../+core/services/utility.service';
import { ValidationService } from './../../+shared/forms/validation.service';
import * as jquery from 'jquery';
import { PermissionCodeModel } from '../../models/permission-code.model';
import { UserPermission } from '../../models/user-permission.model';
import { ActionUseCase } from '../../models/action-use-case.model';
import { UserPermissionGroup } from '../../models/user-permission-group.model';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

    modalActions = new EventEmitter<string | MaterializeAction>();
    public user: User = new User();
    public groups: Array<any>;
    public useCases: Array<any>;
    public actionUseCases: Array<UserPermissionGroup> = new Array<UserPermissionGroup>();
    public deletedActionUseCases: Array<UserPermissionGroup> = new Array<UserPermissionGroup>();
    public actionUseCase: any;
    public auxListUseCases: Array<any> = new Array<any>();
    public nameUseCase: string = '';
    public useCaseSelected: any;
    public isLoadedUseCase: boolean = false;
    public id: number;
    public openModalSubject: Subject<any> = new Subject();
    public isLoading: boolean = false;
    public form: FormGroup;
    public emailPattern = ValidationService.emailPattern;
    public showEmptyMsg: boolean = true;

    constructor(
        private fb: FormBuilder,
        private _userService: UserService,
        private _commonService: CommonService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _utilityService: UtilityService,
        private _toastyService: ToastyMessageService
    ) {
        this.id = +(this._route.snapshot.paramMap.get('id') || 0);
    }

    ngOnInit() {
        this.loadGroups();
        this.loadUseCases();
        this.loadForm();
    }

    loadGroups() {
        this._commonService.getGroups().subscribe(
            response => {
                this.groups = response.model || [];
            },
            error => this._toastyService.showErrorMessagge("No se pudo obtener los grupos")
        );
    }

    loadUseCases() {
        this._commonService.getUseCases().subscribe(
            response => {
                this.useCases = response.model || [];
                this.auxListUseCases = this.useCases.map(e => e.description );
            },
            error => this._toastyService.showErrorMessagge("No se pudo obtener los casos de uso")
        );
    }

    addUseCaseWithActions() {
        const userPermission = this.user.userPermissions.find(x => x.useCase == this.useCaseSelected.code);
        if (userPermission) 
        {
            this._toastyService.showMessageToast("Validacion", "Caso de uso existente", 'warning');
            this.resetUseCase();
        } else {
            this._userService.getActionsUseCase(this.useCaseSelected.code).subscribe(
                response => {
                    this.actionUseCase = new ActionUseCase(this.useCaseSelected.code, this.useCaseSelected.description, true, false);
    
                    response.model.forEach((useCase: any) => {
                        this.actionUseCase.actions.push({
                            code : useCase.code,
                            name: useCase.description,
                            enabled: true,
                            fatherCode: this.useCaseSelected.code
                        });
                    });
                    this.actionUseCases.push(this.actionUseCase);
    
                    this.resetUseCase();
                },
                error => this._toastyService.showErrorMessagge("No se pudo obtener los casos de uso")
            );
        }
    }

    deleteUseCases(item: any) {
        const permission = this.actionUseCases.find(x => x.useCase == item.useCase);
        if (permission) {
            const index = this.actionUseCases.indexOf(permission);
            this.actionUseCases.splice(index, 1);
            this.deletedActionUseCases.push(item);
        }
    }

    customCallbackUseCase(event: any) {
        if (event != null) {
            this.nameUseCase = event;
            this.isLoadedUseCase = true;
            let a = this.useCases.find((e: any) => e.description.toLowerCase() == event.toLowerCase());
            if (a) {
                this.useCaseSelected = a;
                this.nameUseCase = a.description;
                this.isLoadedUseCase = true;
            }
        }
    }

    validateNameUseCase(event: any) {
        if (event == "") {
            this.resetUseCase();
        } else {
            let a = this.useCases.find((e: any) => e.description.toLowerCase() == event.toLowerCase());
            if (!a) {
                this.resetUseCase();
            }
        }
    }

    resetUseCase() {
        this.nameUseCase = "";
        this.useCaseSelected = null;
        this.isLoadedUseCase = false;
    }

    loadForm() {
        if (this.id) this.getUser();
        else this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            login: [this.user.login, Validators.required],
            name: [this.user.name, Validators.required],
            enabled: [this.user.enabled, null],
            isRoot: [this.user.isRoot, null],
            email: [this.user.email, null],
            passwords: this.fb.group({
                password: ['', !this.id ? Validators.required : null],
                confirmPassword: ['', null]
            }, { validator: this.matchingPasswords})
        });
        this.updateShowEmptyMsg();
    }

    matchingPasswords(group: FormGroup) {
        const password = group.controls['password'].value;
        const confirmPassword = group.controls['confirmPassword'].value;
        if (confirmPassword !== password)
            return { areEqual: true };
    }

    save() {
        const user = Object.assign({}, this.user, this.form.value);
        user.url = user.passwords.password;
        user.userPermissions = this.actionUseCases;
        this._userService.save(user).subscribe(
            response => {
                this._toastyService.showSuccessMessagge("Se guardaron los datos correctamente");
                this._utilityService.navigate("administrador/usuarios");
            },
            error => {
                this._toastyService.showErrorMessagge(error.message || "No se pudo guardar los datos del usuario");
            });
    }

    getUser() {
        this.isLoading = true;
        this._userService.get(this.id)
            .finally(() => this.isLoading = false)
            .subscribe(
            result => {
                this.user = result.model;
                this.actionUseCases = this.user.userPermissions;
                this.createForm();
            },
            error => {
                this._toastyService.showErrorMessagge("No se pudo obtener los datos del usuario");
            });
    }

    deleteUseCase(item: any) {
        const userPermission = this.user.userPermissions.find(x => x.useCase == item.useCase);
        if (userPermission) {
            if (userPermission.operationState) userPermission.operationState = 2;
            else {
                const index = this.user.userPermissions.indexOf(userPermission);
                this.user.userPermissions.splice(index, 1);
            }
            this.updateShowEmptyMsg();
        }
    }

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onAgree() {
        this._utilityService.navigate("administrador/usuarios");
    }

    addUseCase() {
        const userPermission = this.user.userPermissions.find(x => x.useCase == this.useCaseSelected.code);
        if (!userPermission) {
            this.user.userPermissions.push(new UserPermissionGroup(this.user.number, this.useCaseSelected.code, this.useCaseSelected.description, true, 0));
        } else if (userPermission.operationState) userPermission.operationState = 3;
        this.resetUseCase();
        this.updateShowEmptyMsg();
    }

    switchEnabled(event: any, item: any) {
        const userPermission = this.user.userPermissions.find(x => x.useCase == item.useCase);
        if (userPermission) {
            userPermission.enabled = event.target.checked;
            if (userPermission.operationState) userPermission.operationState = 1;
        }
    }

    switchGroup(event: any, item: any) {
        const group = this.user.groups.find(x => x.number == item.number);
        if (!group && event.target.checked) this.user.groups.push({ number: item.number });
        else if (group && group.operationState)
            group.operationState = event.target.checked ? 3 : 2;
        else if (group && !event.target.checked) {
            const index = this.user.groups.indexOf(group);
            this.user.groups.splice(index, 1);
        }
    }

    verifyCheck(group: any): Boolean {
        return !!this.user.groups.find(x => x.number == group.number);
    }

    updateShowEmptyMsg() {
        this.showEmptyMsg = !this.user.userPermissions.length || this.user.userPermissions.every(x => x.operationState == 2);
    }

    showOrHideActions(item: any) {
        item.hiddenActions = !item.hiddenActions;
    }

    onCheckboxItemChange(e: UserPermissionGroup, checked: any) {
        const useCase = this.actionUseCases.find(x => x.useCase === e.useCase);
        if (!useCase) return;
        useCase.enabled = checked;
        useCase.actions.forEach((a: any) => {
            a.enabled = checked;
        });
    }

    onCheckboxSubItemChange(e: any, checked: any) {
        const useCase = this.actionUseCases.find(x => x.useCase === e.fatherCode);
        if (!useCase) return;
        const action = useCase.actions.find(x => x.code === e.code);
        if (!action) return;
        action.enabled = checked;
        if (checked || useCase.actions.every(x => !x.enabled)) useCase.enabled = checked;
    }
}
