import { FbPictureResponseDTO } from "app/_models/response/dto/fb-picture-response-dto";

export class FacebookUserResponse {

    id: string;
    first_name: string;
    last_name: string;
    email: string;
    picture: FbPictureResponseDTO;

}