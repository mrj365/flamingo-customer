export class PriceUtil {

    static getPriceDecimalFormatted(price: number): string {
        if (!price) {
            price = 0;
        }
     return  parseFloat((Math.round(price * 100) / 100) + '').toFixed(2);
  }
}