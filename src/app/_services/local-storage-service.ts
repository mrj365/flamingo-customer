import { Entity } from './../_models/entity/entity';
export class LocalStorageService {

    private storage = localStorage;

    getItem<T extends Entity>(type: { new(): T ;}): T {
        let typeInstance = this.create<T>(type);
        let key = typeInstance.getKey();
        var serialized: string = this.storage.getItem(key);
        return serialized ? Object.assign(typeInstance, JSON.parse(serialized)) : undefined;
    }

    setItem<T extends Entity>(data: T) {
        let serialized: string = JSON.stringify(data);
        this.storage.setItem(data.getKey(), serialized);
    }

    remove<T extends Entity>(type: { new(): T ;}) {
        let typeInstance = this.create(type);
        this.storage.removeItem(typeInstance.getKey());
    }

    /**
     * Create instance from generic type
     * @param 
     */
    private create<T>(c: {new(): T; }): T {
        return new c();
    }
}