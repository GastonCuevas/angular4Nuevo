export class PatientFilter {
  number: number;
  name: string;
  address: string;
  cuit: string;
  birthdate: string;
  state: false;
  estado: string;

  constructor(
    number: number,
    name: string,
    address: string,
    cuit: string,
    birthdate: string,
    state: false,
    estado: string
  ) {
    this.number = number
    this.name = name
    this.address = address
    this.cuit = cuit
    this.birthdate = birthdate
    this.state = state
    this.estado = estado
  }
}
