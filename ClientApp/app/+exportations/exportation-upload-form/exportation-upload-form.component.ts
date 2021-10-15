import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportationService } from './../exportation.service';
import { ToastyService } from 'ng2-toasty';

@Component({
    selector: 'selector-name',
    templateUrl: 'exportation-upload-form.component.html'
})

export class ExportationUploadFormComponent implements OnInit {
    fileLoad: {
        name: string,
        size: number
    }
    xml: Blob;

    constructor(
        private router: Router,
        private exportationService: ExportationService,
        private toastyService: ToastyService
    ) { }

    ngOnInit() { }

    onAgree() {
        this.router.navigate([`/sistema/exportaciones/`]);
    }

    selectFile() {
        (<HTMLInputElement>document.getElementById('file-input')).click();
    }

    getFiles(e: any) {
        const aux = e.target.files[0]
        this.fileLoad = { name: aux['name'], size: aux['size'] };
        this.xml = e.target.files[0] as Blob;
    }

    uploadServerFile() {
        this.exportationService.importDefinition(this.xml).subscribe((success) => {
            this.toastyService.success({
                title: 'Exíto',
                msg: 'Importación Terminada.',
                theme: 'material',
                showClose: true,
                timeout: 5000
            });
            this.onAgree();
        },
        (error) => {
            this.toastyService.error({
                title: 'Error',
                msg: 'No se pudo subir archivo.',
                theme: 'material',
                showClose: true,
                timeout: 5000
            });
        });
    }
}