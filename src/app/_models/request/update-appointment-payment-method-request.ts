import { stringify } from "@angular/core/src/facade/lang";

export class UpdateAppointmentPaymentMethodRequest {

    guid: string;
    updateType: string;

    constructor(updateType: string, guid?: string) {
        if (guid) {
            this.guid = guid;
        }

        this.updateType = updateType;
    }
}
