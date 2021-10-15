import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ToastyMessageService, LoadingGlobalService, CommonService } from '../../+core/services';
import * as XLSX from 'xlsx';
import { ImportDataService } from '../../+import-data/import-data.service';
import { ImportDataFile } from '../../models/import-data-file.model';
import { ImportData } from '../../models/import-data.model';
import { ImportDataField } from '../../models/import-data-field';

@Component({
  selector: 'app-import-run-form',
  templateUrl: './import-run-form.component.html',
  styleUrls: ['./import-run-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ImportRunFormComponent implements OnInit {

  functionForTables = this.commonService.getTables();
  file: any;
  data: Array<any> = new Array<any>();
  headers: Array<any> = new Array<any>();
  public form: FormGroup;
  isLoading: boolean = false;
  fileText: string;
  importData: ImportData = new ImportData();
  displayText: string;
  fileTypes = [{ name: "Excel", type: 2 }, { name: "Texto", type: 0 }, { name: "Csv", type: 1 }]
  separators = [{ name: "Coma", type: ',' }, { name: "Punto y coma", type: ';' }]
  insertModes = [{ name: 'Agregar', value: 1 }, { name: 'Actualizar', value: 2 }, { name: 'Agregar o actualizar', value: 3 }]
  fileTypesAccepted = [{ value: "text/plain", type: 0 }, { value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", type: 2 }, { value: ".csv", type: 1 }];
  extensionFile: string;
  constructor(
    private _importDataService: ImportDataService,
    private commonService: CommonService,
    private _toastyService: ToastyMessageService,
    private loadingGlobalService: LoadingGlobalService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  onFileChange(event: any) {

    if (!event.target.files[0]) { this._toastyService.showErrorMessagge("Seleccione un archivo"); return }

    if (event.target.files.length > 1) { this._toastyService.showErrorMessagge("No puede seleccionar multiples archivos"); return }

    this.file = event.target.files[0];

    if (this.file['size'] > 10000000) { this._toastyService.showErrorMessagge("Tamaño maximo 10MB"); return };

    this.getExtensionAndNameFile();

    if (!(this.extensionFile == 'txt' || this.extensionFile == 'xlsx' || this.extensionFile == 'csv')) { this._toastyService.showErrorMessagge("No soportado"); return }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.setFileTypeAndName();
      this.displayContent(reader.result, 'binary');
    };

    this.extensionFile == 'csv' || this.extensionFile == 'txt' ? reader.readAsText(this.file as Blob, 'file') : reader.readAsBinaryString(this.file);

  }

  displayContent(contentFile: string, typeFile: any) {
    if (this.importData.importFile.type == 0) {
      this.displayText = this.fileText = typeFile === 'base64' ? atob(contentFile) : contentFile;
    }

    if (this.importData.importFile.type == 1 && typeFile != 'base64') {
      let allTextLines = contentFile.split("\n");
      this.headers = allTextLines[0].split(this.form.value.separator ? this.form.value.separator : ';');
      this.data = [];
      var countToRead = allTextLines.length < 100 ? allTextLines.length : 100;
      for (let i = 1; i < countToRead; i++) {
        let data = allTextLines[i].split(this.form.value.separator ? this.form.value.separator : ';');
        if (data.length === this.headers.length) {
          let row = [];
          for (let j = 0; j < this.headers.length; j++) {
            row.push(data[j]);
          }
          this.data.push(row);
        }
      }
    }
    if ((this.importData.importFile.type == 1 && typeFile == 'base64') || this.importData.importFile.type == 2) {
      const wb: XLSX.WorkBook = XLSX.read(contentFile, { type: typeFile });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = <Array<any>>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.headers = this.data[0];
      this.data.splice(0, 1);
    }
  };

  getExtensionAndNameFile() {
    this.importData.importFile.name = this.file['name'];
    this.extensionFile = this.file['name'].split('.').pop() || '';
  }

  setFileTypeAndName() {
    this.importData.importFile.type = this.extensionFile == 'txt' ? 0 : this.extensionFile == 'csv' ? 1 : 2;
    this.form.patchValue({
      type: this.importData.importFile.type,
      name: this.importData.importFile.name
    });
    this.importData.importFile.type == 0 ? this.addControlToTxt() : this.addControlToSeparator();
  }

  onRunImport() {
    if (!this.importData) { this._toastyService.showErrorMessagge("Seleccione una tabla"); return; }
    if (!this.file) {
      if (!this.file && this.importData.importFile.file) {
        this._toastyService.showErrorMessagge("Datos del archivo ya estan importados. Seleccione otro archivo");
      }
      else {
        this._toastyService.showErrorMessagge("Seleccione un archivo");
      }
      return
    }
    if (!this.isUniqueIndex(this.importData.importFields)) { this._toastyService.showErrorMessagge("Los numeros de orden deben ser unicos"); return }

    this.loadingGlobalService.showLoading("Importando datos, Espere un momento");
    var resultFile = this._importDataService.update(this.importData.id, this.importData);
    resultFile.subscribe(() => {
      this._importDataService.runImport(this.constructFormData())
        .finally(() => { this.loadingGlobalService.hideLoading(); })
        .subscribe((resp) => {
          this.reset();
          this.informImportation(resp);
        },
          (error) => {
            error = JSON.parse(error);
            this._toastyService.showErrorMessagge(error.didError ? error.errorMessage : "Error al subir el archivo");
          });
    },
      error => {
        this._toastyService.showErrorMessagge(error.success ? error.errorMessage : "Error al subir el archivo");
      })
  }


  informImportation(resp: any) {

    if (resp) {
      resp = JSON.parse(resp);
      if (resp.model.insertMode == 0 || resp.model.insertMode == 1) {
        this._toastyService.showSuccessMessagge(resp.model.entitiesAdded + ' entidades agregadas');
      } else if (resp.model.insertMode == 2) {
        this._toastyService.showSuccessMessagge(resp.model.entitiesUpdated + ' entidades actualizadas');
      } else if (resp.model.insertMode == 3) {
        this._toastyService.showSuccessMessagge(resp.model.entitiesUpdatedOrAdded + ' entidades agregadas o actualizadas');
      }
    }
  }

  constructFormData() {
    const formData = new FormData();
    formData.append('importId', this.importData.id.toString());
    formData.append('file', this.file);
    formData.append('insertMode', this.form.value.insertMode || '');
    formData.append('type', this.form.value.type || '');
    formData.append('name', this.form.value.name || '');
    formData.append('separator', this.form.value.separator || '');
    return formData;
  }



  reset() {
    this.importData = new ImportData();
    this.form.reset();
    this.file = null;
  }

  onTableChange(event: any) {
    if (event.number) {
      this.isLoading = true;
      this._importDataService.get(event.number)
        .finally(() => this.isLoading = false)
        .subscribe(resp => {
          this.importData = resp.model;
          this.orderByIndex();
          if (this.importData.importFile) {
            this.importData.importFile = this.importData.importFile;
            this.displayContent(this.importData.importFile.file, 'base64');
          } else {
            this.importData.importFile = new ImportDataFile();
          }
          this.createForm();
        });
    }
  }

  createForm() {
    this.form = this.fb.group({
      importId: [this.importData.id, Validators.required],
      insertMode: [this.importData.importFile.insertMode, Validators.required],
      name: [this.importData.importFile.name],
      type: [this.importData.importFile.type, Validators.required],
    });

    if(this.importData.importFile.type == 1)
    this.addControlToSeparator();

    for (var field of this.importData.importFields) {
      this.form.addControl(field.name, new FormControl(field.index,
        [Validators.required, Validators.max(this.importData.importFields.length),
        Validators.min(1)]));
    }
    if(this.importData.importFile.type == 0)
     this.addControlToTxt();
  }

  public addControlToTxt() {
    if (this.importData.importFields) {
      for (var field of this.importData.importFields) {
        this.form.addControl(field.from, new FormControl(field.from, Validators.required));
        this.form.addControl(field.to, new FormControl(field.to, Validators.required));
      }
    }
  }

  public addControlToSeparator() {
    if (this.importData.importFile && this.importData.importFile.type == 1) {
      this.form.addControl('separator', new FormControl(this.importData.importFile.separator || ';', Validators.required));
    }
  }

  setColor(valueInitial: number, valueFinal: number) {
    if (valueInitial >= valueFinal || valueInitial < 0 || valueFinal < 0) {
      this.displayText = this.fileText;
      return
    }
    const numberOfLineTxt = (this.fileText.match(/\n/g) || []).length;
    this.displayText = this.fileText;
    for (let j = 1; j <= numberOfLineTxt; j++) {
      let textLine: string = this.fileText.split('\n')[j];
      let cutText: string = textLine.substring(valueInitial, valueFinal);
      let textLineChanged: string = '<span class="color-text-mark">' + cutText + '</span>';
      let textReplace = this.replaceAt(textLine, cutText, textLineChanged, valueInitial, valueFinal);
      this.displayText = this.displayText.replace(textLine, textReplace);
    }
  }

  replaceAt(input: string, search: string, replace: string, start: number, end: number) {
    return input.slice(0, start)
      + input.slice(start, end).replace(search, replace)
      + input.slice(end);
  }

  orderByIndex() {
    this.importData.importFields.sort((a, b) => { return Number(a.index) - Number(b.index) });
  }

  isUniqueIndex(fields: Array<ImportDataField>) {
    var tempArr = [];
    for (let field of fields) {
      if (tempArr.indexOf(field.index) < 0) {
        tempArr.push(field.index);
      } else {
        return false;
      }
    }
    return true;
  }

  getFileTypeAccepted() {
    var accepted = this.fileTypesAccepted[0].value + ',' + this.fileTypesAccepted[1].value + ',' + this.fileTypesAccepted[2].value;
    if (this.form.value.type != -1) {
      var type = this.fileTypesAccepted.find(x => x.type === this.form.value.type);
      if (type)
        return type.value;
    }
    return accepted;
  }
}