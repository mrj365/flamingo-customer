import { ShoppingCartCustomizationGroupItemEntity } from './shopping-cart-customization-group-item-entity';
export class ShoppingCartCustomizationGroupEntity {

    id: number;
    groupName: string;


    orderCustomizationGroups: ShoppingCartCustomizationGroupItemEntity[] = [];

}