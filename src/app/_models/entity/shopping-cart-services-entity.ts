/**
 * This does not extend Entity because it is only used as 
 * an associated class to the shopping-cart entity
 */
export class ShoppingCartServicesEntity {
    id: number;

    name: string;

	description: string;

    price: number;

	durationInMinutes: number;

	imgUrl: string;

	quantity: number;

	quantityDescription: string;
}