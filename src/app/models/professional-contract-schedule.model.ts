export class ProfessionalContractSchedule {
  numint: number;
  contractNumber: number;
  specialtyNumber: number;
  specialtyName: string;
  weekday: number;
  weekdayName: string;
  weekdayFrom: number;
  weekdayTo: number;
  hourFrom: string;
  hourTo: string;
  time: number;
  order: number;
  index: number;
  withTurns: boolean;
  consultingRoom?: number;

  constructor(
    numint = 0,
    contractNumber: number,
    specialtyNumber: number,
    specialtyName: string,
    weekday: number,
    weekdayName: string,
    weekdayFrom: number,
    weekdayTo: number,
    hourFrom: string,
    hourTo: string,
    time: number,
    order: number,
    index: number,
    withTurns = false,
    consultingRoom?: number
  ) {
    this.numint = numint;
    this.contractNumber = contractNumber;
    this.specialtyNumber = specialtyNumber;
    this.specialtyName = specialtyName;
    this.weekday = weekday;
    this.weekdayName = weekdayName;
    this.weekdayFrom = weekdayFrom;
    this.weekdayTo = weekdayTo;
    this.hourFrom = hourFrom;
    this.hourTo = hourTo;
    this.time = time;
    this.order = order;
    this.index = index;
    this.withTurns = withTurns;
    this.consultingRoom = consultingRoom;
  }
}
