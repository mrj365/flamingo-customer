import { ShoppingCartCustomizationGroupItemResultDTO } from './shopping-cart-customization-group-item-result-dto';
export class ShoppingCartCustomizationGroupResultDTO {

    id: number;
    groupName: string;


    items: ShoppingCartCustomizationGroupItemResultDTO[] = [];
}