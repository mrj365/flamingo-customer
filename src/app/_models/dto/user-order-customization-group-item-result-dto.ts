export class UserOrderCustomizationGroupItemResultDTO {

    id: number;
    displayText: string;

    /**
     * Rate to charge for item. This will be multiplied by the quantity
     */
    rate: string;
    
    /**
     * Additional fee that will be applied per quantity
     */
    additionalFeePreQuantityMultiplier: string;

    quantity: number;

    showQuantity: boolean;

    /**
     * Show quantity selector in UI
     */
    quantitySelector: boolean;

    /**
     * Additional fee to be added after quantity multiplier applied
     */
    additionalFee: string;

    description: string;

}