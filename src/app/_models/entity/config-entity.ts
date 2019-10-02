import { Entity } from './entity';
import { LocalStorageConstants } from './../constants/local-storage-constants';


export class ConfigEntity implements Entity { 
    private key = LocalStorageConstants.CONFIG_KEY;

    staticImgPath: string;
    stripePublicApiKey: string;
    googleApiKey: string;
    
    getKey() {
        return this.key;
    }


}
