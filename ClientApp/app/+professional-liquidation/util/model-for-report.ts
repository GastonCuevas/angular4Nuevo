import { LiquidateConcept } from "../../models/liquidate-concept.model";
import { PracticeToLiquidate } from "../../+medical-insurance-liquidation/util/models";

export class ModelForReport {
    fecha: string;
    //
    //professionalLiquidation: LiquidateProf;
    professionalName: string;
   

    liqAmbulatorios: Array<Liquidation>;//Array para separar Liquidaciones de tipo Consultorio Externo
    liqInternaciones: Array<Liquidation>;//Array para separar Liquidaciones de tipo Internacion
   
    total: number;
    //
    dateFrom: string;
    dateTo: string;
    dateGeneration: string;
    //
    precioPHs: number;
    fixedAmount: number;
    internmentConcepts: Array<Concept>;//Array para separar conceptos de tipo Internacion
    externs: Array<Concept>;//Array para separar conceptos de tipo Consultorio Externo
    medicalGuards: Array<Concept>;//Array para separar conceptos de tipo Guardia Medica
    debits: Array<Concept>;//Array para separar conceptos de tipo Debitos
    public ModelForReport()
    {
        this.liqAmbulatorios = new Array<Liquidation>();
        this.liqInternaciones = new Array<Liquidation>();
        this.internmentConcepts = new Array<Concept>();
        this.externs = new Array<Concept>();
        this.medicalGuards = new Array<Concept>();
        this.debits = new Array<Concept>();
    }
}


export class Liquidation {
   
    precio: number;
    fecha: string;
    fechaCobro: string;
    fechaDesde: string;
    fechaHasta: string;

    price: number;

    number = 0;
    liquidationId = 0;
    //verificar tipo de dato de type
    type: number;
    numberMovPacHC: number;
    practiceId: number;
    //Falta practiceName
    practiceName: string;
    //
    date: string;
    code: string;
    //Falta medicalInsuranceName
    medicalInsuranceName: string;
    //Falta professionalName
    professionalName: string;
    //falta patientName
    patientName: string;
    //

    typeInternament: boolean;
    days: number;
    departureDate: string;
    nextSettlementDate: string;
  

}


class Concept {
    number = 0;
    liquidationId = 0;
    conceptId: number;// precio por hora
    conceptDescription: string;
    count: number;//cantidad
    total: number;//precio por cantidad

    price: number;
    conceptCode: string;
    type: number;

    conceptType: number;

    orderReport: number;
 
}
//********************************************


