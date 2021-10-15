import { Component, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-error',
    templateUrl:'./error.component.html', 
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent{
    @Input() type = 'lock'; // name icon 
    @Input() show = false;
    @Input() buttonshow = false;
    @Input() title = 'SIN AUTORIZACION';
    @Input() subtitle = 'Solicite acceso al administrador';
    @Input() txtButton = 'Regresar';
    @Input() returnPath: string = '/';

    constructor () {
        this.show = true;
    }
}
