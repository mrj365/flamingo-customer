export class UpdateAppointmentNoteRequest {

    note: string;
    updateType: string;

    constructor(note: string, updateType: string) {
        this.note = note;
        this.updateType = updateType;
    }
}
