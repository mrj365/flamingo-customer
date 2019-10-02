import { ShoppingCartCustomizationGroupItemViewDTO } from './shopping-cart-customization-group-item-view-dto';
export class ShoppingCartCustomizationGroupViewDTO {

    id: number;
    groupName: string;


    items: ShoppingCartCustomizationGroupItemViewDTO[] = [];
}