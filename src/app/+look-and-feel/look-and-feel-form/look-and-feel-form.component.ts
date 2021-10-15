import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';

import { LookAndFeel, LookAndFeelConfig } from "../../models";
import { ItemComboColor } from "../iac-color/iac-color.component";
import { UtilityService, CommonService, ToastyMessageService, LookAndFeelService } from '../../+core/services';

@Component({
    selector: 'app-look-and-feel-form',
    templateUrl: './look-and-feel-form.component.html',
    styleUrls: ['./look-and-feel-form.component.scss']
})
export class LookAndFeelFormComponent implements OnInit {

    isLoading = false;
    isSaving = false;
    isEdit: boolean;
    code: string;
    form: FormGroup;
    lookAndFeel = new LookAndFeel();
    openModalDiscardSubject = new Subject();
    functionForFontFamilies: Observable<ItemComboColor[]> = this.commonService.getFontFamilies();
    srcImage: any = require("../../images/default-image.png");
    haveImageLogo = false;

    private companyNumber: number;
    private fileImage: Blob;
    private currentLookAndFeel: LookAndFeelConfig;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private commonService: CommonService,
        private toastyMessageService: ToastyMessageService,
        private utilityService: UtilityService,
        private sanitization: DomSanitizer,
        public lookAndFeelService: LookAndFeelService
    ) {
        this.isEdit = true;
        this.companyNumber = Number(this.route.snapshot.paramMap.get('companyNumber'));
        const code = this.route.snapshot.paramMap.get('code') || '';
        this.code = code.toUpperCase();
        this.haveImageLogo = this.code === 'HEADERWEB' || this.code === "LOGINWEB";
    }

    ngOnInit() {
        this.loadForm();
    }

    private loadForm() {
        if (this.isEdit) this.getLookAndFeel();
        else this.createForm();
    }

    private createForm() {
        this.form = this.fb.group({
            section: [this.lookAndFeel.section, Validators.required],
            fontFamily: [this.lookAndFeel.fontFamily, Validators.required],
        });
    }

    private getLookAndFeel() {
        this.isLoading = true;
        this.lookAndFeelService.get(this.code)
            .finally(() => this.isLoading = false)
            .subscribe(
            response => {
                this.lookAndFeel = response.model;
                this.createForm();
                if (this.lookAndFeel.imageBase) {
                    this.srcImage = `data:image/jpeg;base64,${this.lookAndFeel.imageBase}`;
                }
            },
            error => {
                this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al obtener los datos");
            });
    }

    onCancelButton() {
        this.openModalDiscardSubject.next();
    }

    discardChanges() {
        if (this.currentLookAndFeel) this.lookAndFeelService.lookConfig = Object.assign({}, this.currentLookAndFeel);
        this.utilityService.navigate("sisarchivos/lookandfeel");
    }

    onPreview() {
        if (!this.currentLookAndFeel) this.currentLookAndFeel = Object.assign({}, this.lookAndFeelService.lookConfig);
        switch(this.code) {
            case 'HEADERWEB':
                if (this.fileImage) this.lookAndFeelService.lookConfig.imageLogo = this.sanitization.bypassSecurityTrustUrl(URL.createObjectURL(this.fileImage)) as string;
                this.lookAndFeelService.lookConfig.backgroundColorHeader = this.lookAndFeel.backgroundColor;
                this.lookAndFeelService.lookConfig.fontColorHeader = this.lookAndFeel.fontColor;
                this.lookAndFeelService.lookConfig.fontFamilyHeader = this.form.value.fontFamily;
                break;
            case 'MENUWEB':
                this.lookAndFeelService.lookConfig.backgroundColorMenu = this.lookAndFeel.backgroundColor;
                this.lookAndFeelService.lookConfig.fontColorMenu = this.lookAndFeel.fontColor;
                this.lookAndFeelService.lookConfig.fontFamilyMenu = this.form.value.fontFamily;
                break;
            default:
                break;
        }
    }

    onSubmit() {
        this.isSaving = true;
        let hasError = false;
        let lookAndFeelToSave: LookAndFeel = Object.assign(this.lookAndFeel, this.form.value);
        lookAndFeelToSave.imagePath = this.code;
        this.lookAndFeelService.update(lookAndFeelToSave)
            .subscribe(
            response => {
                if (this.fileImage) {
                    this.lookAndFeelService.uploadImage(this.code, this.fileImage)
                        .finally(() => this.reloadStyles(hasError))
                        .subscribe(
                        result => {
                            this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
                        },
                        error => {
                            hasError = true;
                            this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios del formulario");
                            this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Error al subir la imagen");
                        });
                } else {
                    this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
                    this.reloadStyles(hasError);
                }
            },
            error => {
                this.isSaving = false;
                this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al guardar los datos");
            }
        );
    }

    private reloadStyles(hasError: boolean) {
        this.lookAndFeelService.getLookAndFeel()
            .finally(() => {
                this.isSaving = false;
                if (!hasError) this.utilityService.navigate("sisarchivos/lookandfeel");
            })
            .subscribe(
            result => {
                this.currentLookAndFeel = Object.assign({}, result);
                this.lookAndFeelService.lookConfig = Object.assign({}, result);
            },
            error => {
                this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Error al cargar los nuevos estilos");
            });
    }

    //methods for image
    clickFile() {
        (document.getElementById('file-input') as HTMLInputElement).click();
    }

    selected(event: any) {
        const size: number = event.target.files[0].size;
        if (size > 1050000) {
            this.toastyMessageService.showMessageToast('', 'El tamaño de la imagen no debe superar 1MB', 'warning');
            return;
        }
        const image = <HTMLInputElement>document.getElementById('imgSRC');
        image.src = URL.createObjectURL(event.target.files[0]);
        this.fileImage = event.target.files[0];
    }

}
