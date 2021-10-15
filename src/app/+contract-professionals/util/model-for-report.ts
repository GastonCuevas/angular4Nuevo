export class ModelForReport {
    professionalName: string;
    dateFrom: string;
    dateTo: string;
    fixedAmount: number;
    description: string;
    observation: string;
    priceHs: number;
    
    horarios: Array<Schedule>;
    practicas: Array<Practices>;
    public ModelForReport()
    {
        this.horarios = new Array<Schedule>();
        this.practicas = new Array<Practices>();
        
    }
}

//Clase Horarios
export class Schedule {
    /*weekday: string;
    hourFrom: string;
    hourTo: string;
    time: string;//Duración
    consultingRoom: string;
    specialty: string;
    */
    numint: number;
    contractNumber: number;
    specialtyNumber: number;
    specialtyName: string;
    weekday: number;
    weekdayName: string;
    hourFrom: string;
    hourTo: string;
    time: number;
    consultingRoom?: number;
    order: number;
    index: number;
    
}

//Clase Prácticas
export class Practices {
    /*medicalInsuranceName: string;
    practiceName: string;
    factor: number;
    fixed: number;
    retention: number;*/

    numint: number;
    contractNumber: number;
    medicalInsuranceNumber: number;
    medicalInsuranceName: string;
    practiceNumber: number;
    practiceName: string;
    factor?: number;
    porcob: boolean = false;
    fixed?: number;
    index?: number;
    retention: number;
}
//********************************************
