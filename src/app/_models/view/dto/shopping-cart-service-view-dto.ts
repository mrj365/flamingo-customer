import { ShoppingCartServiceDTO } from './../../dto/shopping-cart-service-dto';
import { PriceUtil } from './../../../_util/price-util';
export class ShoppingCartServiceViewDTO {
    id: number;
    name: string;
    description: string;
    price: string;
    imgUrl: string;
    quantity: number;
    quantityDescription: string;

    constructor(shoppingCartDTO: ShoppingCartServiceDTO){
        this.id = shoppingCartDTO.id;
        this.name = shoppingCartDTO.name;
        this.description = shoppingCartDTO.description;
        this.imgUrl = shoppingCartDTO.imgUrl;
        this.price = PriceUtil.getPriceDecimalFormatted(shoppingCartDTO.price);
        this.quantity = shoppingCartDTO.quantity;
        this.quantityDescription = shoppingCartDTO.quantityDescription;
    }
}