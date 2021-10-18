import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';
import { Subject } from 'rxjs';

import { ContentModal } from './content-modal';

@Component({
    selector: 'app-modal-confirm',
    templateUrl: './modal-confirm.component.html',
    styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {
    @Input() title : string = '';
    @Input() message : string = '';
    @Input() openModalSubject: Subject<any>;
    @Input() content: ContentModal;

    @Output() public agree : EventEmitter<any> = new EventEmitter<any>();
    @Output() public close : EventEmitter<any> = new EventEmitter<any>();

    modalActions = new EventEmitter<string|MaterializeAction>();
    primaryBtnTxt : string = 'Aceptar';
    secondaryBtnTxt : string = 'Cancelar';
    centered: boolean;
    width: string;

    constructor() {
    }

    ngOnInit() {
        this.loadValues();
        this.openModalSubject.subscribe(event => {
            this.onOpenModal();
            // called when the notifyChildren method is
            // called in the parent component
        });
    }

    ngOnDestroy() {
        this.openModalSubject.unsubscribe();
    }

    private loadValues() {
        if (this.content) {
            this.title = this.content.title || '';
            this.message = this.content.msg || '';
            this.primaryBtnTxt = this.content.primaryBtnTxt || 'Aceptar';
            this.secondaryBtnTxt = this.content.secondaryBtnTxt || 'Cancelar';
            this.centered = this.content.centered || false;
            this.width = this.content.width || '55%';
        }
    }

    onOpenModal() {
        this.modalActions.emit({action:"modal",params:['open']});
    }
    
    closeModal() {
        this.modalActions.emit({action:"modal",params:['close']});
        this.close.emit();
    }

    onAgree() {
        this.agree.emit(true);
    }
}
