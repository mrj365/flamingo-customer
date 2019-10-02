export class GooglePlaceConstants {

    /**
     * indicates a precise street address.
     */
    static readonly STREET_ADDRESS = 'street_address'

    /**
     * indicates a named route (such as "US 101").
     */
    static readonly ROUTE = 'route';

    /**
     *  indicates a major intersection, usually of two major roads.
     */
    static readonly INTERSECTION = 'intersection';

    /**
     * indicates a political entity. Usually, 
     * this type indicates a polygon of some civil administration.
     */
    static readonly POLITICAL = 'political'; 

    /**
     * indicates the national political entity, and is typically 
     * the highest order type returned by the Geocoder.
     */
    static readonly COUNTRY = 'country'; 

    /**
     * indicates a first-order civil entity below the country level. Within the United States, 
     * these administrative levels are states. Not all nations exhibit these administrative levels. 
     * In most cases, administrative_area_level_1 short names will closely match ISO 3166-2 
     * subdivisions and other widely circulated lists; however this is not guaranteed as 
     * our geocoding results are based on a variety of signals and location data.
     */
    static readonly ADMINISTRATIVE_AREA_LEVEL_1 = 'administrative_area_level_1'; 

    /**
     *  indicates a second-order civil entity below the country level. Within the United States, these administrative 
     * levels are counties. Not all nations exhibit these administrative levels.
     */
    static readonly ADMINISTRATIVE_AREA_LEVEL_2 = 'administrative_area_level_2';

    /**
     * indicates a third-order civil entity below the country level. 
     * This type indicates a minor civil division. 
     * Not all nations exhibit these administrative levels.
     */
    static readonly ADMINISTRATIVE_AREA_LEVEL_3 = 'administrative_area_level_3'; 

    /**
     * indicates a fourth-order civil entity below the country level. 
     * This type indicates a minor civil division. 
     * Not all nations exhibit these administrative levels.
     */
    static readonly ADMINISTRATIVE_AREA_LEVEL_4 = 'administrative_area_level_4'; 

    /**
     * indicates a fifth-order civil entity below the country level. 
     * This type indicates a minor civil division. 
     * Not all nations exhibit these administrative levels.
     */
    static readonly ADMINISTRATIVE_AREA_LEVEL_5 = 'administrative_area_level_5'; 

    /**
     * indicates a commonly-used alternative name for the entity.
     */
    static readonly COLLOQUIAL_AREA = 'colloquial_area'; 

    /**
     * indicates an incorporated city or town political entity.
     */
    static readonly LOCALITY = 'locality'; 

    /**
     * indicates a specific type of Japanese locality, 
     * to facilitate distinction between multiple locality 
     * components within a Japanese address.
     */
    static readonly WARD = 'ward'; 

    /**
     * indicates a first-order civil entity below a locality. 
     * For some locations may receive one of the additional types: 
     * sublocality_level_1 to sublocality_level_5. Each sublocality level is a civil entity. 
     * Larger numbers indicate a smaller geographic area.
     */
    static readonly SUBLOCALITY = 'sublocality'; 

    /**
     * indicates a named neighborhood
     */
    static readonly NEIGHBORHOOD = 'neighborhood'; 

    /**
     * indicates a named location, usually a building or collection of buildings with a common name
     */
    static readonly PREMISE = 'premise'; 

    /**
     * indicates a first-order entity below a named location, 
     * usually a singular building within a collection of buildings with a common name
     */
    static readonly SUBPREMISE = 'subpremise'; 

    /**
     * indicates a postal code as used to address postal mail within the country.
     */
    static readonly POSTAL_CODE = 'postal_code'; 

    /**
     * indicates a prominent natural feature.
     */
    static readonly NATURAL_FEATURE = 'natural_feature'; 

    /**
     * indicates an airport.
     */
    static readonly AIRPORT = 'airport'; 

    /**
     * indicates a named park.
     */
    static readonly PARK = 'park'; 

    /**
     * indicates a named point of interest. Typically, these "POI"s are prominent 
     * local entities that don't easily fit in another category, 
     * such as "Empire State Building" or "Statue of Liberty."
     */
    static readonly POINT_OF_INTEREST = 'point_of_interest'; 

    /**
     * indicates the precise street number.
     */
     static readonly STREET_NUMBER = 'street_number';

     static readonly GOOGLE_MAP_STYLE = [
        {
            'featureType': 'landscape.man_made',
            'elementType': 'geometry',
            'stylers': [
                {
                    'color': '#f7f1df'
                }
            ]
        },
        {
            'featureType': 'landscape.natural',
            'elementType': 'geometry',
            'stylers': [
                {
                    'color': '#d0e3b4'
                }
            ]
        },
        {
            'featureType': 'landscape.natural.terrain',
            'elementType': 'geometry',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'poi',
            'elementType': 'labels',
            'stylers': [
                {
                    'visibility': 'on'
                }
            ]
        },
        {
            'featureType': 'poi.business',
            'elementType': 'all',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'poi.medical',
            'elementType': 'geometry',
            'stylers': [
                {
                    'color': '#fbd3da'
                }
            ]
        },
        {
            'featureType': 'poi.park',
            'elementType': 'geometry',
            'stylers': [
                {
                    'color': '#bde6ab'
                }
            ]
        },
        {
            'featureType': 'road',
            'elementType': 'geometry.stroke',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'road',
            'elementType': 'labels',
            'stylers': [
                {
                    'visibility': 'on'
                }
            ]
        },
        {
            'featureType': 'road.highway',
            'elementType': 'geometry.fill',
            'stylers': [
                {
                    'color': '#ffe15f'
                }
            ]
        },
        {
            'featureType': 'road.highway',
            'elementType': 'geometry.stroke',
            'stylers': [
                {
                    'color': '#efd151'
                }
            ]
        },
        {
            'featureType': 'road.arterial',
            'elementType': 'geometry.fill',
            'stylers': [
                {
                    'color': '#ffffff'
                }
            ]
        },
        {
            'featureType': 'road.local',
            'elementType': 'geometry.fill',
            'stylers': [
                {
                    'color': 'black'
                }
            ]
        },
        {
            'featureType': 'transit.station.airport',
            'elementType': 'geometry.fill',
            'stylers': [
                {
                    'color': '#cfb2db'
                }
            ]
        },
        {
            'featureType': 'water',
            'elementType': 'geometry',
            'stylers': [
                {
                    'color': '#a2daf2'
                }
            ]
        }
    ];
    
}
