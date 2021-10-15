import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PracticeInosService } from '../practice-inos.service';
import { ToastyService } from 'ng2-toasty';

@Component({
    selector: 'app-practice-inos-upload-form',
    templateUrl: 'practice-inos-upload-form.component.html'
})

export class PracticeInosUploadFormComponent implements OnInit {
    fileLoad: {
        name: string,
        size: number
    }
    excel: Blob;

    constructor(
        private router: Router,
        public practiceInosService: PracticeInosService,
        public toastyService: ToastyService
    ) { }

    ngOnInit() { }

    onAgree() {
        this.router.navigate([`/archivos/practicasInos/`]);
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
        this.practiceInosService.import(this.excel).subscribe((success) => {
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