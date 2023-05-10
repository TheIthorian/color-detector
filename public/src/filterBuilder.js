import {
    invertFilter,
    mirrorFilter,
    greenScreen,
    sobelFilter,
    grayScale,
    blackAndWhiteFilter,
} from './filters.js';

export class FilterBuilder {
    static FILTERS = {
        invertFilter,
        mirrorFilter,
        greenScreen,
        sobelFilter,
        grayScale,
        blackAndWhiteFilter,
    };

    static fromArray(arr) {
        let head;
        let prev, curr;

        for (const filterName of arr) {
            const filterConstructor = FilterBuilder.FILTERS[filterName];
            if (!filterConstructor) continue;

            curr = filterConstructor();
            if (!head) head = curr;

            prev?.connectOutput(curr);
            prev = curr;
        }

        return head;
    }
}
