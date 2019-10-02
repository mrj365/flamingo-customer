export class TimeSlotResultDTO {
    /**
     * Format: HH:mm
     */
    startTime: string;
    serviceProviderId: number;

    selected: boolean = false;

    /**
     * yyyy-MM-dd'T'HH:mm
     */
    fullAppointmentDate: string;
}