import { AppointmentResultDTO } from './appointment-result-dto';
export class AppointmentListResultDTO {
	
    totalResults: number;
	
	currentPage: number;
	
	pageCount: number;
	
	numResultsOnCurrentPage: number;

    appointments: AppointmentResultDTO[] = [];
}
