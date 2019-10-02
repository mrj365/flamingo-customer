import { CustomerMapDTO } from './customer-map-dto';
import { UserAddressEntity } from './../entity/user-address-entity';
import { Subject } from 'rxjs/Subject';
/*
 * Map location info
 */
export class MapLocationDTO {

	formattedAddress: string;

    address1: string;

	address2: string;

	city: string;
	
	state: string;

	zip: string;

	latitude: number;

	longitude: number;

	mapChangedEvent = new Subject<MapLocationDTO>();
	
	locationEvent$ = this.mapChangedEvent.asObservable();

	announceMapLocationUpdate(mapLocationDTO: MapLocationDTO) {

        this.mapChangedEvent.next(mapLocationDTO);
    }

	public static convertUserAddressEntityToMapLocationDTO(userAddressEntity: UserAddressEntity, mapLocationDTO: MapLocationDTO) {
		  mapLocationDTO.formattedAddress = userAddressEntity.formattedAddress;
          mapLocationDTO.address1 = userAddressEntity.address1;
          mapLocationDTO.address2 = userAddressEntity.address2;
          mapLocationDTO.city = userAddressEntity.city;
          mapLocationDTO.state =  userAddressEntity.state;
          mapLocationDTO.latitude = userAddressEntity.latitude;
          mapLocationDTO.longitude = userAddressEntity.longitude;
		  mapLocationDTO.zip = userAddressEntity.zip;
	}

	public static copyMapToMap(sourceMapDTO: MapLocationDTO, destMapDTO: MapLocationDTO) {
		  destMapDTO.formattedAddress = sourceMapDTO.formattedAddress;
          destMapDTO.address1 = sourceMapDTO.address1;
          destMapDTO.address2 = sourceMapDTO.address2;
          destMapDTO.city = sourceMapDTO.city;
          destMapDTO.state =  sourceMapDTO.state;
          destMapDTO.latitude = sourceMapDTO.latitude;
          destMapDTO.longitude = sourceMapDTO.longitude;
		  destMapDTO.zip = sourceMapDTO.zip;
	}

	public reset() {
		this.formattedAddress = null;

		this.address1 = null;

		this.address2 = null;

		this.city = null;
		
		this.state = null;

		this.zip = null;

		this.latitude = null;

		this.longitude = null;
	}

	public getCustomerMapDTO(): CustomerMapDTO {
		let customerMapDTO: CustomerMapDTO = new CustomerMapDTO();

		customerMapDTO.formattedAddress = this.formattedAddress;
		customerMapDTO.address1 = this.address1;
		customerMapDTO.address2 = this.address2;
		customerMapDTO.city = this.city;
		customerMapDTO.state =  this.state;
		customerMapDTO.latitude = this.latitude;
		customerMapDTO.longitude = this.longitude;
		customerMapDTO.zip = this.zip;

		return customerMapDTO;
	}
}