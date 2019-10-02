import { BeanUtils } from './../../../_util/BeanUtils';
import { UserOrderCustomizationGroupResultViewDTO } from './../user-order-customization-group-result-view-dto';
import { PriceUtil } from './../../../_util/price-util';
import { ShoppingCartDTO } from './../../dto/shopping-cart-dto';
import { ShoppingCartServiceViewDTO } from './shopping-cart-service-view-dto';

export class ShoppingCartViewDTO {
    status: string;

    storefrontId: number;

    /**
     * yyyy-MM-dd'T'HH:mm
     */
    appointmentStartDateTime: string;
    
    serviceProviderId: number = 0;

	serviceProviderDisplayName: string;

	serviceProviderImgUrl: string;

	staffSelected: boolean;

    

	orderId: number;
	appointmentId: number;
    storefrontDiaplayName: string;

	address1: string;
	address2: string;
	city: string;
	state: string;
	zip: string;
	latitude: number;
	longitude: number;

	customerImg: string;

	customerName: string;

	note: string;


	paymentMethodGuid: string;
	paymentMethodLast4: string;
	paymentMethodType: string;

    
	subtotal: string;
	bookingFee: string;
	tax: string;
	total: string;
    
    services: ShoppingCartServiceViewDTO[] = [];

	orderCustomizationGroups: UserOrderCustomizationGroupResultViewDTO[] = [];

	totalPreGiftCard: string;
	giftCardAmountApplied: string;

    constructor(shoppingCartDTO?: ShoppingCartDTO){
		//Allow empty constructor
        if (!shoppingCartDTO) {
            return;
        }
		
		this.status = shoppingCartDTO.status;
		this.storefrontId = shoppingCartDTO.storefrontId;

		this.address1 = shoppingCartDTO.address1;
		this.address2 = shoppingCartDTO.address2;
		this.city = shoppingCartDTO.city;
		this.state = shoppingCartDTO.state;
		this.zip = shoppingCartDTO.zip;
		this.latitude = shoppingCartDTO.latitude;
		this.longitude = shoppingCartDTO.longitude;
		
		this.appointmentId = shoppingCartDTO.appointmentId;
		this.orderId = shoppingCartDTO.orderId;

		this.appointmentStartDateTime = shoppingCartDTO.appointmentStartDateTime;
		this.storefrontDiaplayName = shoppingCartDTO.storefrontDisplayName;
		this.customerImg = shoppingCartDTO.customerImg;
		this.customerName = shoppingCartDTO.customerName;
		this.note = shoppingCartDTO.note;
		
		this.paymentMethodGuid = shoppingCartDTO.paymentMethodGuid;
		this.paymentMethodLast4 = shoppingCartDTO.paymentMethodLast4;
		this.paymentMethodType = shoppingCartDTO.paymentMethodType;
		
		this.serviceProviderDisplayName = shoppingCartDTO.serviceProviderDisplayName;
		this.serviceProviderId = shoppingCartDTO.serviceProviderId;
		this.serviceProviderImgUrl = shoppingCartDTO.serviceProviderImgUrl;
		this.staffSelected = shoppingCartDTO.staffSelected;

        this.subtotal = PriceUtil.getPriceDecimalFormatted(shoppingCartDTO.subtotal);
        this.bookingFee = PriceUtil.getPriceDecimalFormatted(shoppingCartDTO.bookingFee);
        this.tax = PriceUtil.getPriceDecimalFormatted(shoppingCartDTO.tax);
		this.total = PriceUtil.getPriceDecimalFormatted(shoppingCartDTO.total);
		
		this.totalPreGiftCard = shoppingCartDTO.totalPreGiftCard;
		this.giftCardAmountApplied = shoppingCartDTO.giftCardAmountApplied;

		for (let service of shoppingCartDTO.services) {
			let shoppingCartServiceViewDTO: ShoppingCartServiceViewDTO = new ShoppingCartServiceViewDTO(service);
			this.services.push(shoppingCartServiceViewDTO);
		}

		for(let orderCustomizationGroup of shoppingCartDTO.orderCustomizationGroups) {
			let userOrderCustomizationGroupResultViewDTO = new UserOrderCustomizationGroupResultViewDTO();
				BeanUtils.copyProperties(userOrderCustomizationGroupResultViewDTO, orderCustomizationGroup);

			this.orderCustomizationGroups.push(userOrderCustomizationGroupResultViewDTO);
		}
    }
}