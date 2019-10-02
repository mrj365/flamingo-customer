import { ServiceProviderResultDTO } from './../../_models/dto/service-provider-result-dto';

export class ServiceProviderViewDTO {
    id: number; 
    displayName: string; 
    imgUrl: string; 

    constructor(serviceProviderResultDTO?: ServiceProviderResultDTO) {
        if (serviceProviderResultDTO){
            this.id = serviceProviderResultDTO.id;
            this.displayName = serviceProviderResultDTO.displayName;
            this.imgUrl = serviceProviderResultDTO.imgUrl;
        }
    }
}
