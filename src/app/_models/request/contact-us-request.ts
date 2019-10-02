import { ContactUsDTO } from '../dto/contact-us-dto';
export class ContactUsRequest {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
    supportType = '';

    constructor(contactUsDTO: ContactUsDTO) {
        this.firstName = contactUsDTO.firstName;
        this.lastName = contactUsDTO.lastName;
        this.email = contactUsDTO.email;
        this.subject = contactUsDTO.subject;
        this.message = contactUsDTO.message;
        this.supportType = contactUsDTO.supportType;
    }
}