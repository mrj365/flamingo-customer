export class ApplyGiftCardDTO {
    applyGiftCardBalance: boolean;
    updateType: string;

    constructor(applyGiftCardBalance: boolean, updateType?: string) {
        this.applyGiftCardBalance = applyGiftCardBalance;

        if(updateType) {
            this.updateType = updateType;
        }
    }
}
