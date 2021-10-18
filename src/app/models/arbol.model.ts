export class Arbol {
  code: string;
  label: string;
  padre: string;
  image1: string;
  image2: string;
  orden: number;
  oculta: number;
  edicio: string;

  constructor(
    code: string,
    label: string,
    padre: string,
    image1: string,
    image2: string,
    orden: number,
    oculta: number,
    edicio: string
  ) {
    this.code = code;
    this.label = label;
    this.padre = padre;
    this.image1 = image1;
    this.image2 = image2;
    this.orden = orden;
    this.oculta = oculta;
    this.edicio = edicio;
  }
}
