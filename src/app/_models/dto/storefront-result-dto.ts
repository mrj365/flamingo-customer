import { ServiceResultDTO } from './service-result-dto';
export class StorefrontResultDTO {
    id: number; 
    name: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
    imgUrl: string;
    rating: number = 0;
    reviewCount = 0;
    favorite: boolean; // Is this one of the users favorite location
    services: ServiceResultDTO[] = [];
}