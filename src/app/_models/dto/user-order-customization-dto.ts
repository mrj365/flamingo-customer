export class UserOrderCustomizationDTO {

    customizationItemId: number;
    quantity: number;

    constructor(customizationItemId: number, quantity: number) {
        this.customizationItemId = customizationItemId;
        this.quantity = quantity;
    }
    
}