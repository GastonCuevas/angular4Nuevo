import { forEach } from "@angular/router/src/utils/collection";
import { PharmacySchemeLiq } from "../../models/pharmacy-scheme.model";

//import { Concept } from "../../+shared/util";

export class ModelForReport {
    fecha: string;
    fechaDesde: string;
    fechaHasta: string;
   // obras_sociales: Array<MedicalInsurance>;

    nombre: string;
    
    total: number;
    liquidaciones = new Array<Liquidation>();
    internaciones = new Array<Liquidation>();
    conceptos = new Array<LiquidateConcept>();
    medicines = new Array<PharmacySchemeLiq>();
    
}



class Liquidation {
    practica: string;
    profesional: string;
    profEnrollment: number;
    paciente: string;
    fecha: string;
    re = false;
    subTotal: number;
    //precio_practica: number;
    precio: number;
    cobert: number;
    cosegu: number;
    contratoOsId: number;
    nombreOS: string;
    practicaId: number;
    //
    carnet: number;
    //
    // codes
    code: string;
    dias: number;
    fechaDesde: string;
    fechaHasta: string;
    fechaCobro: string;
    //
    coinsuranceEventual: number;
    //

    public Liquidation()
    {
        this.carnet = 123;
    }

}



class LiquidateConcept {
   
    conceptId: number;// precio por hora
    conceptDescription: string;
    count: number;//cantidad
    total: number;//precio por cantidad

    price: number;
    conceptCode: string;
   

  
}