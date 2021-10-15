import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-not-found',
    template: `<div class="center-align margin top-s bottom-s">
                    <h6 class="margin bottom-s" style="font-weight: bold;">NO HAY DATOS PARA MOSTRAR</h6>
                    <a [routerLink]="[returnPath]" class="waves-effect waves-light btn red lighten-1" (click)="close()">Cerrar</a>
                </div>`,
    styles: ['']
})
export class NotFoundComponent{
    @Input() returnPath: string;
    @Output() closeEvent = new EventEmitter<any>();

    constructor() { }

    close() {
        this.closeEvent.emit();
    }
}
