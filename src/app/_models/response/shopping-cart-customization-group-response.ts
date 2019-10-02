import { ShoppingCartCustomizationGroupItemResponse } from './shopping-cart-customization-group-item-response';
export class ShoppingCartCustomizationGroupResponse {

    id: number;
    groupName: string;


    items: ShoppingCartCustomizationGroupItemResponse[] = [];
}