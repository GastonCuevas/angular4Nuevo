import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RequestService } from '../../+core/services';
import { IColumn, Sort, Paginator } from '../../+shared/util';
import { DiagnosticMovement } from '../../models';

@Injectable()
export class DiagnosticMovementService {

	diagnosticMovement: DiagnosticMovement;
	diagnosticMovements = new Array<DiagnosticMovement>();
	isNew = false;
	columns: Array<IColumn> = [
		{ header: 'Diagnóstico', property: "name", searchProperty: "diagnostic.description", disableSorting: true },
		{ header: 'Fecha', property: "date", type: 'date', disableSorting: true },
		{ header: 'Jerarquía', property: "hierarchy", disableSorting: true }
	];

	constructor(
		public requestService: RequestService
	) {}

	getAll(paginator: Paginator, filterBy?: any, sort?: Sort): Observable<any> {
		return Observable.of({ model: this.diagnosticMovements });
	}

	save(diagnosticMovement: DiagnosticMovement): boolean {
        return this.isNew ? this.add(diagnosticMovement) : this.update(diagnosticMovement);
	}

	add(diagnosticMovement: DiagnosticMovement): boolean {
		diagnosticMovement.id = -(diagnosticMovement.diagnosticId);
		diagnosticMovement.date = new Date();
		this.diagnosticMovements.push(diagnosticMovement);
		this.diagnosticMovements.sort((a, b) => a.hierarchy - b.hierarchy);
		return true;
	}

	update(diagnosticMovement: DiagnosticMovement): boolean {
		const index = this.diagnosticMovements.findIndex(d => d.id == diagnosticMovement.id);
		if (index == -1) return false;
		if (this.diagnosticMovements[index].diagnosticId != diagnosticMovement.diagnosticId)
			diagnosticMovement.id = -(diagnosticMovement.diagnosticId);
		this.diagnosticMovements[index] = diagnosticMovement;
		return true;
	}

	delete(diagnosticMovement: DiagnosticMovement) {
		const index = this.diagnosticMovements.findIndex(d => d.id == diagnosticMovement.id);
		if (index != -1) this.diagnosticMovements.splice(index, 1);
	}

	exists(diagnosticMovement: DiagnosticMovement): boolean {
		return this.diagnosticMovements.some(d => d.diagnosticId == diagnosticMovement.diagnosticId && d.id != diagnosticMovement.id);
	}

	setDiagnosticList(diagnosticMovements?: Array<DiagnosticMovement>) {
        this.diagnosticMovements = diagnosticMovements || new Array<DiagnosticMovement>();
	}

	resetService() {
		this.diagnosticMovement = new DiagnosticMovement();
		this.diagnosticMovements = new Array<DiagnosticMovement>();
		this.isNew = false;
	}

}
