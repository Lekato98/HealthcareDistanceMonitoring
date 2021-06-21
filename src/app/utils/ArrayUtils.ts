import { IMyObject } from './ObjectUtils';

class ArrayUtils {
    public static getIntersection(arr1: [], arr2: []): Array<string | number | boolean> { // todo more than 2 arrays
        const obj: IMyObject = {};
        arr1.forEach(item => obj[item] = Number(obj[item]) + 1); // mark arr1 items as number of occurrences

        // if the number of occurrences of the current item > 0 that's mean the same item is available in arr1 and arr2
        return arr2.filter(item => obj[item]-- > 0);
    }
}

export default ArrayUtils;
