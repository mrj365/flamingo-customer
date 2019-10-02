import { AppointmentResponseDTO } from './dto/appointment-response-dto';
export class AppointmentListResponse {

    totalResults: number;
	
	currentPage: number;
	
	pageCount: number;
	
	numResultsOnCurrentPage: number;
    
    appointmentResponseDTO: AppointmentResponseDTO[] = [];
}
