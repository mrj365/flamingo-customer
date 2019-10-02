import { UpdateUserDTO } from './../../_models/dto/update-user-dto';

export class EditUserFormDTO {
    
    email: string;
    firstName: string;
    lastName: string;
    phone: string;

    getUpdateUserDTO(): UpdateUserDTO {
        let updateUserDTO: UpdateUserDTO = new UpdateUserDTO();
        updateUserDTO.email = this.email;
        updateUserDTO.firstName = this.firstName;
        updateUserDTO.lastName = this.lastName;
        updateUserDTO.phone = this.phone;

        return updateUserDTO;
    }
}