import { StorefrontResultDTO } from './../../_models/dto/storefront-result-dto';
import { ServiceViewDTO } from './service-view-dto';
export class StorefrontViewDTO {

    id: number;
    displayName: string;
    imgUrl: string;

    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
    
    rating: number = 0;
    reviewCount = 0;
    favorite: boolean; // Has this been selected as a users favorite
    services: ServiceViewDTO[] = [];

    constructor(storefrontResultDTO?: StorefrontResultDTO){
        if (storefrontResultDTO) {
            this.id = storefrontResultDTO.id;
            this.displayName = storefrontResultDTO.name;
            this.address1 = storefrontResultDTO.address1;
            this.address2 = storefrontResultDTO.address2;
            this.city = storefrontResultDTO.city;
            this.state = storefrontResultDTO.state;
            this.zip = storefrontResultDTO.zip;
            this.latitude = storefrontResultDTO.latitude;
            this.longitude = storefrontResultDTO.longitude;
            this.imgUrl = storefrontResultDTO.imgUrl;
            this.rating = storefrontResultDTO.rating;
            this.reviewCount = storefrontResultDTO.reviewCount;
            this.favorite = storefrontResultDTO.favorite;

            for(let service of storefrontResultDTO.services){
                let serviceViewDTO: ServiceViewDTO = new ServiceViewDTO;
                serviceViewDTO.id = service.id;
                serviceViewDTO.description = service.description;
                serviceViewDTO.durationInMinutes = service.durationInMinutes;
                serviceViewDTO.imgUrl = service.imgUrl;
                serviceViewDTO.name = service.name;
                serviceViewDTO.price = service.price;
                serviceViewDTO.quantityDescription = service.quantityDescription;
                
                this.services.push(serviceViewDTO);
            }
        }

    }
}