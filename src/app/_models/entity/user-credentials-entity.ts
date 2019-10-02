import { Entity } from './entity';
import { LocalStorageConstants } from '../constants/local-storage-constants';
export class UserCredentialsEntity implements Entity {
    private key = LocalStorageConstants.CURRENT_USER_KEY;

    secret: string;
    uniqueId: string;
    deviceUniqueId: string;
    onBehalfOf: boolean = false;

    getKey(): string {
        return this.key;
    }
}