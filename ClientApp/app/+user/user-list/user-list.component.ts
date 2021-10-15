import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserService } from './../user.service';
import { GenericControl } from '../../+shared';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

    columns = [
        { header: 'Usuario', property: 'login' },
        { header: 'Nombre', property: 'name' },
        { header: 'E-mail', property: 'email' },
        { header: 'Habilitado', property: 'enabledText', disableSorting: true }
    ];

    controlsToFilter: Array<GenericControl> = [
        { key: 'login', label: 'Usuario', type: 'text', class: 'col s12 m4' },
        { key: 'name', label: 'Nombre', type: 'text', class: 'col s12 m4' },
        { key: 'email', label: 'Email', type: 'text', class: 'col s12 m4' }
    ];

    reloadingData = false;
    deleteModalSubject: Subject<any> = new Subject();

    constructor(
        public userService: UserService,
        private _router: Router
    ) { }

    ngOnInit() {
    }

    onActionClick(event: any) {
        switch (event.action) {
            case 'new':
                this._router.navigate(['administrador/usuarios/formulario']);
                break;
            case 'edit':
                this._router.navigate([`administrador/usuarios/formulario/${event.item.number}`]);
                break;
            case 'detail':
                this._router.navigate([`administrador/usuarios/detalle/${event.item.number}`]);
                break;
            default:
                break;
        }
    }

    updateReloadingData(event: any) {
        this.reloadingData = event.value;
    }
}
