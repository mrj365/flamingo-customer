export class UpdateShoppingCartPaymentMethod {
    
    /**
     * Globally unique card identifier
     */
    guid: string;

    constructor(guid: string) {
        this.guid = guid;
    }
}