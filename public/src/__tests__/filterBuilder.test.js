import { FilterBuilder } from '../filterBuilder.js';

describe('FilterBuilder', () => {
    it('makes a single filter', () => {
        const firstNode = FilterBuilder.fromArray(['invertFilter']);
        const fullVideoGraph = firstNode.getVideoGraph();

        expect(fullVideoGraph.length).toBe(1);
        expect(firstNode.name).toBe('invertFilter');
        expect(firstNode.output).toBe(undefined);
        expect(firstNode.input).toBe(undefined);
    });

    it('makes multiple filters', () => {
        const filterList = [
            'invertFilter',
            'mirrorFilter',
            'greenScreen',
            'sobelFilter',
            'grayScale',
            'blackAndWhiteFilter',
        ];

        const firstNode = FilterBuilder.fromArray(filterList);
        const fullVideoGraph = firstNode.getVideoGraph();

        expect(fullVideoGraph.map(filter => filter.name)).toStrictEqual(filterList);
        expect(firstNode.input).toBeUndefined();
        expect(firstNode.output).toBe(fullVideoGraph[1]);
        expect(fullVideoGraph[fullVideoGraph.length - 1].output).toBeUndefined();
    });

    it('skips invalid filter names', () => {
        const filterList = ['invertFilter', 'not a real filter name', 'blackAndWhiteFilter'];

        const firstNode = FilterBuilder.fromArray(filterList);
        const fullVideoGraph = firstNode.getVideoGraph();

        expect(fullVideoGraph.map(filter => filter.name)).toStrictEqual([
            'invertFilter',
            'blackAndWhiteFilter',
        ]);
        expect(firstNode.input).toBeUndefined();
        expect(firstNode.output).toBe(fullVideoGraph[1]);
        expect(fullVideoGraph.length).toBe(2);
    });
});
