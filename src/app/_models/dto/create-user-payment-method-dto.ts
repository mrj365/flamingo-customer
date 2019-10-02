export class CreateUserPaymentMethodDTO {
   
    token: string;
	type: string;
	lastFour: string;
    
	// Format MMYYYY
    expirationDate: string;
}