import { BeanUtils } from './../../_util/BeanUtils';
import { ShoppingCartCustomizationGroupItemViewDTO } from './../checkout/shopping-cart-customization-group-item-view-dto';
import { AppointmentDetailsResultDTO } from './../../_models/dto/appointment-details-result-dto';
import { PriceUtil } from './../../_util/price-util';
import { AppointmentDetailsServicesViewDTO } from './appointment-details-services-view-dto';
import * as moment from 'moment';
export class AppointmentDetailsViewDTO {
    
	appointmentId: number;
	guid: string;

	status: string;

	serviceProviderId: number = 0;

	serviceProviderDisplayName: string;

	serviceProviderImgUrl: string;

    storefrontDiaplayName: string;

    staffSelected: boolean;

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

	miscCostDescription: string;
	miscCost: string;
	cancellationFee: string;
	subtotal: string;
	bookingFee: string;
	tax: string;
	total: string;
	services: AppointmentDetailsServicesViewDTO[] = [];
	note: string;
	cumulativeTotalRefundAmount: string;
	cumulativeConvenienceFeeRefundAmount: string;
	cumulativeSubtotalotalRefundAmount: string;
	cumulativeGiftCardAmountAppliedRefundAmount: string;
	refunded: boolean
	fullyRefunded: boolean;

	orderCustomizationGroups: ShoppingCartCustomizationGroupItemViewDTO[] = [];

	reoccurring: boolean;

	periodType: string;

	applyGiftCardBalance: boolean;
	giftCardAmountApplied: string;


    constructor(appointmentDetailsResultDTO?: AppointmentDetailsResultDTO){
        //Allow empty constructor
        if (!appointmentDetailsResultDTO) {
            return;
        }

		this.appointmentId = appointmentDetailsResultDTO.appointmentId;
		this.guid = appointmentDetailsResultDTO.guid;
		this.status = appointmentDetailsResultDTO.status;
        this.storefrontDiaplayName = appointmentDetailsResultDTO.storefrontDisplayName;
		this.serviceProviderId = appointmentDetailsResultDTO.serviceProviderId;
		this.serviceProviderImgUrl = appointmentDetailsResultDTO.serviceProviderImgUrl;
		this.serviceProviderDisplayName = appointmentDetailsResultDTO.serviceProviderDisplayName;
		this.staffSelected = appointmentDetailsResultDTO.staffSelected;

		if(appointmentDetailsResultDTO.appointmentStartDateTime) {
			this.appointmentDateAndTime = this.formatAptDateTime(appointmentDetailsResultDTO.appointmentStartDateTime);
			this.appointmentDate = this.formatAptDate(appointmentDetailsResultDTO.appointmentStartDateTime);
		}

        this.address1 = appointmentDetailsResultDTO.address1;
        this.address2 = appointmentDetailsResultDTO.address2;
        this.city = appointmentDetailsResultDTO.city;
        this.state = appointmentDetailsResultDTO.state;
        this.zip = appointmentDetailsResultDTO.zip;
        this.latitude = appointmentDetailsResultDTO.latitude;
        this.longitude = appointmentDetailsResultDTO.longitude;

        this.paymentMethodGuid = appointmentDetailsResultDTO.paymentMethodGuid;
        this.paymentMethodLast4 = appointmentDetailsResultDTO.paymentMethodLast4;
        this.paymentMethodType = appointmentDetailsResultDTO.paymentMethodType;

		this.cancellationFee = PriceUtil.getPriceDecimalFormatted(appointmentDetailsResultDTO.cancellationFee);

		this.miscCostDescription = appointmentDetailsResultDTO.miscCostDescription;
		this.miscCost = PriceUtil.getPriceDecimalFormatted(appointmentDetailsResultDTO.miscCost);

        this.subtotal = PriceUtil.getPriceDecimalFormatted(appointmentDetailsResultDTO.subtotal);
        this.bookingFee = PriceUtil.getPriceDecimalFormatted(appointmentDetailsResultDTO.bookingFee);
        this.tax = PriceUtil.getPriceDecimalFormatted(appointmentDetailsResultDTO.tax);
        this.total = PriceUtil.getPriceDecimalFormatted(appointmentDetailsResultDTO.total);

		this.cumulativeTotalRefundAmount = PriceUtil.getPriceDecimalFormatted(appointmentDetailsResultDTO.cumulativeTotalRefundAmount);;
		this.cumulativeConvenienceFeeRefundAmount = PriceUtil.getPriceDecimalFormatted(appointmentDetailsResultDTO.cumulativeConvenienceFeeRefundAmount);
		this.cumulativeSubtotalotalRefundAmount = PriceUtil.getPriceDecimalFormatted(appointmentDetailsResultDTO.cumulativeSubtotalotalRefundAmount);
		this.cumulativeGiftCardAmountAppliedRefundAmount = PriceUtil.getPriceDecimalFormatted(appointmentDetailsResultDTO.cumulativeGiftCardAmountAppliedRefundAmount);
		this.refunded = appointmentDetailsResultDTO.refunded;
		this.fullyRefunded = appointmentDetailsResultDTO.refunded;

		for (let service of appointmentDetailsResultDTO.services) {
			let appointmentDetailsServicesViewDTO: AppointmentDetailsServicesViewDTO = new AppointmentDetailsServicesViewDTO(service);
			this.services.push(appointmentDetailsServicesViewDTO);
		}

		for(let customizationGroup of appointmentDetailsResultDTO.orderCustomizationGroups) {
			let customizationGroupViewDTO = BeanUtils.copyProperties(new ShoppingCartCustomizationGroupItemViewDTO(), customizationGroup);
			this.orderCustomizationGroups.push(customizationGroupViewDTO);
		}

		this.note = appointmentDetailsResultDTO.note;

		this.reoccurring = appointmentDetailsResultDTO.reoccurring;
		this.periodType = appointmentDetailsResultDTO.periodType;

		this.applyGiftCardBalance = appointmentDetailsResultDTO.applyGiftCardBalance;
		this.giftCardAmountApplied = appointmentDetailsResultDTO.giftCardAmountApplied;

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

		let date: Date = new Date(+year, +month - 1, +day, +hour, +min);

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