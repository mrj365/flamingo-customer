import { ContactUsDTO } from './../../_models/dto/contact-us-dto';


export class ContactUsForm {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
    supportType = '';

    getContacUsDTO(): ContactUsDTO {
        let contactUsDTO: ContactUsDTO = new ContactUsDTO();
        contactUsDTO.firstName = this.firstName;
        contactUsDTO.lastName = this.lastName;
        contactUsDTO.email = this.email;
        contactUsDTO.subject = this.subject;
        contactUsDTO.message = this.message;
        contactUsDTO.supportType = this.supportType;

        return contactUsDTO;
    }
}
