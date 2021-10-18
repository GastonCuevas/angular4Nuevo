export class Diagnostic {
  number: number;
  code: string;
  name: string;
  type: number;

  constructor(number: number = 0, code: string, name: string, type: number) {
    this.number = number;
    this.code = code;
    this.name = name;
    this.type = type;
  }
}
