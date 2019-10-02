export class NotificationResultDTO {

    id: number;
	title: string;
	content: string;
	
	// Format: dd-MM-yyyy hh:mm:ss
	sentDate: string;
	read: boolean;
	
	// Format: dd-MM-yyyy hh:mm:ss
	readDate: string;
}