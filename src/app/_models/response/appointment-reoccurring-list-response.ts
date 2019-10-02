import { AppointmentResponseDTO } from './dto/appointment-response-dto';
export class AppointmentReoccurringListResponse {

    totalResults: number;
	
	currentPage: number;
	
	pageCount: number;
	
	numResultsOnCurrentPage: number;

    index: number;

    reoccurringIndex: number;

    /**
	 * For re-occurring results, not all pages may be counted 
	 * to save processing time
	 */
    morePages: boolean;
    
    appointmentResponseDTO: AppointmentResponseDTO[] = [];
}