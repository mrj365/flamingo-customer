export class BeanUtils {

    /**
     * This will copy the properties from one class to another
     * @param dest 
     * @param orig 
     */
    static copyProperties( dest: any, orig: any): any {
        return Object.assign(dest, orig);
    }
}