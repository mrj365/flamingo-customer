import { AppointmentResultDTO } from './appointment-result-dto';
export class AppointmentWReoccurringListResultDTO {

    totalResults: number;
	
	currentPage: number;
	
	pageCount: number;
	
	numResultsOnCurrentPage: number;

    index: number;

    reoccurringIndex: number;

    morePages: boolean;

    appointments: AppointmentResultDTO[] = [];
}