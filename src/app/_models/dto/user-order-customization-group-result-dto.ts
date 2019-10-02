import { UserOrderCustomizationGroupItemResultDTO } from './user-order-customization-group-item-result-dto';
export class UserOrderCustomizationGroupResultDTO {

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

    items: UserOrderCustomizationGroupItemResultDTO[] = [];

}