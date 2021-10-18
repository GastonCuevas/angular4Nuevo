export class LiquidationProfessionalContract {
  pricePerHourExternalOffice: number;
  quantityExternalOffice: number;
  coordinationPrice: number;
  internmentQuantity: number;
  internmentPrice: number;

  constructor(
    pricePerHourExternalOffice: number,
    quantityExternalOffice: number,
    coordinationPrice: number,
    internmentQuantity: number,
    internmentPrice: number
  ) {
    this.pricePerHourExternalOffice = pricePerHourExternalOffice
    this.quantityExternalOffice = quantityExternalOffice
    this.coordinationPrice = coordinationPrice
    this.internmentQuantity = internmentQuantity
    this.internmentPrice = internmentPrice
  }
}
