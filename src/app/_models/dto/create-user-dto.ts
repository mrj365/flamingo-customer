import { RegistrationTypeEnum } from '../_enums/registration-type-enum.enum';
export class CreateUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    credential: string;
    phone: string;
    registrationId: string;
    registrationType: RegistrationTypeEnum;
    profileImageBase64: string;
}