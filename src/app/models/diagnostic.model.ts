export class Diagnostic {
  number = 0;
  code: string;
  name: string;
  type: number;

  constructor(code: string, name: string, type: number) {
    this.code = code;
    this.name = name;
    this.type = type;
  }
}
