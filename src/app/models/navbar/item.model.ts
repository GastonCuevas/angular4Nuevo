export class Item {
    actions: Array<string>;
    codRam: string;
    codigo: string;
    config: string;
    descri: string;
    esNodo: number;
    formul: string;
    image1: string;
    image2: string;
    label: string;
    nodo: string;
    oculta: number;
    orden: number;
    padre: string;
    parame: string;
    permis: number;
    webmnu: string;
    weburl: string;
    constructor(
        actions?: Array<string>,
        codRam?: string,
        codigo?: string,
        config?: string,
        descri?: string,
        esNodo?: number,
        formul?: string,
        image1?: string,
        image2?: string,
        label?: string,
        nodo?: string,
        oculta?: number,
        orden?: number,
        padre?: string,
        parame?: string,
        permis?: number,
        webmnu?: string,
        weburl?: string) {
        this.actions = actions || new Array<string>();
        this.codRam = codRam || "";
        this.codigo = codigo || "";
        this.config = config || "";
        this.descri = descri || "";
        this.esNodo = esNodo || NaN;
        this.formul = formul || "";
        this.image1 = image1 || "";
        this.image2 = image2 || "";
        this.label = label || "";
        this.nodo = nodo || "";
        this.oculta = oculta || NaN;
        this.orden = orden || NaN;
        this.padre = padre || "";
        this.parame = parame || "";
        this.permis = permis || NaN;
        this.webmnu = webmnu || "";
        this.weburl = weburl || "";
    }
}