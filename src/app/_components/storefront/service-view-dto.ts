export class ServiceViewDTO {

    id: number; 
	name: string;
	description: string;
    price: number = 0;
	durationInMinutes: number;
	slotsNeeded: number;
	imgUrl: string;

	selected: boolean = false; // not returned form server. used for ui
	
	/**
	 * Quantity of this item that is currently in the cart
	 * Calculated client side
	 */
	quantityInCart: number = 0;

	/**
	 * When the users clicks the increase and decrease quantity buttons
	 * this value will change
	 */
	updatedQuantity: number = 1;

	quantityDescription: string;

	constructor(serviceViewDTO?: ServiceViewDTO){
		if (serviceViewDTO) {
			this.id = serviceViewDTO.id;
			this.name = serviceViewDTO.name;
			this.description = serviceViewDTO.description;
			this.price = serviceViewDTO.price;
			this.durationInMinutes = serviceViewDTO.durationInMinutes;
			this.slotsNeeded = serviceViewDTO.slotsNeeded;
			this.imgUrl = serviceViewDTO.imgUrl;
			this.quantityDescription = serviceViewDTO.quantityDescription;
		}
	}
}