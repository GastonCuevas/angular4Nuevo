import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiagnosticService } from '../diagnostic.service';
import { Diagnostic } from '../../models/diagnostic.model';
import { ToastyService } from 'ng2-toasty';

@Component({
    selector: 'app-diagnostic-upload-form',
    templateUrl: './diagnostic-upload-form.component.html',
    styleUrls: ['./diagnostic-upload-form.component.scss']
})

export class DiagnosticUploadComponent implements OnInit {

    excel: Blob;
    fileLoad: {
        name: string,
        size: number
    }
    diagnostic: Diagnostic = {
        number: 0,
        code: "",
        name: "",
        type: 0
    }

    constructor(
        private _diagnosticService: DiagnosticService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _toastyService: ToastyService
    ) {
        _route.params.subscribe(d => {

        })
    }

    ngOnInit() {
    }
    onAgree() {
        this._router.navigate([`/archivos/diagnosticos/`]);
    }

    selectFile() {
        (<HTMLInputElement>document.getElementById('file-input')).click();
    }

    getFiles(e: any) {
        const aux = e.target.files[0]
        this.fileLoad = { name: aux['name'], size: aux['size'] };
        this.excel = e.target.files[0] as Blob;
    }

    uploadServerFile() {
        this._diagnosticService.uploadFile(this.excel).subscribe(
            (success) =>{
                this._toastyService.success({
                    title: 'Exíto',
                    msg: 'Importación Terminada.',
                    theme: 'material',
                    showClose: true,
                    timeout: 5000
                });
                this.onAgree();
            },
            (error)=>{
                this._toastyService.error({
                    title: 'Error',
                    msg: 'No se pudo subir archivo.',
                    theme: 'material',
                    showClose: true,
                    timeout: 5000
                });
            }
        );
    }
}