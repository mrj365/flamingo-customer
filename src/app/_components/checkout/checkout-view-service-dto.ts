import { PriceUtil } from './../../_util/price-util';
import { ShoppingCartServiceDTO } from './../../_models/dto/shopping-cart-service-dto';
export class CheckoutViewServiceDTO {

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