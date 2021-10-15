import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss'],
})

export class UserDetailComponent implements OnInit {
    public user: any;
    public isLoad: boolean = false;

    constructor(
        private _userService: UserService,
        private _toastyService: ToastyMessageService,
        private _route: ActivatedRoute,
    ) { }

    ngOnInit() {
        const id = this._route.snapshot.paramMap.get('id');
        this.getUser(id);
    }

    getUser(id: any) {
        this._userService.get(id)
            .finally(() => this.isLoad = true)
            .subscribe(
            result => {
                this.user = result.model;
            },
            error => {
                this._toastyService.showErrorMessagge("Ocurrio un error al obtener los datos del usuario");
            });
    }
}