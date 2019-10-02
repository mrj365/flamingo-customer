import { ShoppingCartCustomizationGroupItemViewDTO } from './shopping-cart-customization-group-item-view-dto';
import { PriceUtil } from './../../_util/price-util';
import { ShoppingCartDTO } from './../../_models/dto/shopping-cart-dto';
import { CheckoutViewServiceDTO } from './checkout-view-service-dto';
import { BeanUtils } from '../../_util/BeanUtils';
import * as moment from 'moment';
export class CheckoutViewDTO {
    
	appointmentId: number;
	serviceProviderId: number = 0;
	serviceProviderDisplayName: string;
	serviceProviderImgUrl: string;
	staffSelected: boolean;
    storefrontDisplayName: string;

	address1: string;
	address2: string;
	city: string;
	state: string;
	zip: string;
	latitude: number;
	longitude: number;

	/**
     * Format: yyyy-MM-dd'T'HH:mm
     */
	appointmentDateAndTime: string;
	
	appointmentDate: string;


	paymentMethodGuid: string;
	paymentMethodLast4: string;
	paymentMethodType: string;
	subtotal: string;
	bookingFee: string;
	tax: string;
	total: string;

	services: CheckoutViewServiceDTO[] = [];

	orderCustomizationGroups: ShoppingCartCustomizationGroupItemViewDTO[] = [];

	periodType: string;

	applyGiftCardBalance: boolean;
	totalPreGiftCard: string;
	giftCardAmountApplied: string;

    constructor(shoppingCartDTO?: ShoppingCartDTO){
        //Allow empty constructor
        if (!shoppingCartDTO) {
            return;
        }

		this.appointmentId = shoppingCartDTO.appointmentId;
        this.storefrontDisplayName = shoppingCartDTO.storefrontDisplayName;
		this.serviceProviderId = shoppingCartDTO.serviceProviderId;
		this.serviceProviderImgUrl = shoppingCartDTO.serviceProviderImgUrl;
		this.serviceProviderDisplayName = shoppingCartDTO.serviceProviderDisplayName;
		this.staffSelected = shoppingCartDTO.staffSelected;

		if(shoppingCartDTO.appointmentStartDateTime) {
			this.appointmentDateAndTime = this.formatAptDateTime(shoppingCartDTO.appointmentStartDateTime);
		}

		if(shoppingCartDTO.appointmentStartDateTime) {
			this.appointmentDate = this.formatAptDate(shoppingCartDTO.appointmentStartDateTime);
		}

        this.address1 = shoppingCartDTO.address1;
        this.address2 = shoppingCartDTO.address2;
        this.city = shoppingCartDTO.city;
        this.state = shoppingCartDTO.state;
        this.zip = shoppingCartDTO.zip;
        this.latitude = shoppingCartDTO.latitude;
        this.longitude = shoppingCartDTO.longitude;

        this.paymentMethodGuid = shoppingCartDTO.paymentMethodGuid;
        this.paymentMethodLast4 = shoppingCartDTO.paymentMethodLast4;
        this.paymentMethodType = shoppingCartDTO.paymentMethodType;

        this.subtotal = PriceUtil.getPriceDecimalFormatted(shoppingCartDTO.subtotal);
        this.bookingFee = PriceUtil.getPriceDecimalFormatted(shoppingCartDTO.bookingFee);
        this.tax = PriceUtil.getPriceDecimalFormatted(shoppingCartDTO.tax);
        this.total = PriceUtil.getPriceDecimalFormatted(shoppingCartDTO.total);

		for (let service of shoppingCartDTO.services) {
			let checkoutViewServiceDTO: CheckoutViewServiceDTO = new CheckoutViewServiceDTO(service);
			this.services.push(checkoutViewServiceDTO);
		}

		for(let customizationGroup of shoppingCartDTO.orderCustomizationGroups) {
			let customizationGroupViewDTO = BeanUtils.copyProperties(new ShoppingCartCustomizationGroupItemViewDTO(), customizationGroup);
			this.orderCustomizationGroups.push(customizationGroupViewDTO);
		}

		this.periodType = shoppingCartDTO.periodType;

		this.applyGiftCardBalance = shoppingCartDTO.applyGiftCardBalance;
		this.totalPreGiftCard = shoppingCartDTO.totalPreGiftCard;
		this.giftCardAmountApplied = shoppingCartDTO.giftCardAmountApplied;
		

    }

	/**
	 * Expected input date formate: yyyy-MM-dd'T'HH:mm
	 * @param string 
	 */
	private formatAptDateTime(dateToFormat: string): string {
		let year = dateToFormat.substr(0, 4);
		let month = dateToFormat.substr(5, 2);
		let day = dateToFormat.substr(8, 2);
		let hour = dateToFormat.substr(11, 2);
		let min = dateToFormat.substr(14, 2);

		let date: Date = new Date(+year, +month-1, +day, +hour, +min);

		let dateFormat = require('dateformat');	
		let formattedDate: string = dateFormat(date, 'ddd, mmmm d');
		formattedDate += ' @ ' + dateFormat(date, 'h:MM TT');

		return formattedDate;
	}

	private formatAptDate(dateToFormat: string): string {
		let formattedDate: string = moment(dateToFormat).format('dddd, MMMM Do YYYY');

		return formattedDate;
	}

	public getFormattedAddress() {
		return this.address1 + ' ' + this.city + ' ' + this.state + ' ' + this.zip;
	}
	
}
