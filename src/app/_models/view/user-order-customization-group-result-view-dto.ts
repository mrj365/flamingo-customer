import { UserOrderCustomizationGroupItemResultViewDTO } from './user-order-customization-group-item-result-view-dto';
export class UserOrderCustomizationGroupResultViewDTO {

    id: number;
    groupName: string;

    /**
     * Type of selector to display
     * CHECKBOX, RADIO, DROPDOWN
     */
    selector: string;

    /**
     * Can multiple items be selected in this group or just one
     */
    multiple: boolean;

    items: UserOrderCustomizationGroupItemResultViewDTO[] = [];

    /**
     * This is used to store the selected value for a dropdown
     */
    selectedItemId: number;
}