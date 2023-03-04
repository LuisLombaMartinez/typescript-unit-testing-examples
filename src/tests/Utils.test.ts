import { getStringInfo, StringUtils, toUpperCase } from "../app/Utils";


describe('Utils test suite', () => {

    describe('StringUtils tests', () => {

        let sut: StringUtils;

        beforeEach(() => {
            sut = new StringUtils();
           
        });
        
        it ('should return correct uppercase of a valid string', () => {

            const actual = sut.toUpperCase('abc');

            expect(actual).toBe('ABC');
        });

        it('should return error on invalidad argument - function', () => {
            function expectError() {
                const actual = sut.toUpperCase('');
            }
            expect(expectError).toThrow();
            expect(expectError).toThrowError('Invalid argument');
        });

        it('should return error on invalidad argument - arrow function', () => {
            expect(()=>{
                sut.toUpperCase('');
            }).toThrowError('Invalid argument');
        });

        it('should return error on invalidad argument - try catch block', (done) => {
            try {
                sut.toUpperCase('');
                done('Expected an error to be thrown for invalid argument');
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty('message', 'Invalid argument');
                done();
            }
        });
    });

    it('should return uppercase of a valid string', () => {
        // arrange:
        const sut = toUpperCase;
        const expected = 'ABC';

        // act:
        const actual = sut('abc');

        // assert:
        expect(actual).toBe(expected);
    });

    describe('ToUpperCase examples', () => { 
        it.each([
            { input: 'abc', expected: 'ABC' }, 
            { input: 'My-String', expected: 'MY-STRING' },
            { input: 'def', expected: 'DEF' },
        ])('$input toUpperCase should be $expected', ({input, expected}) => {
            const actual = toUpperCase(input);
            expect(actual).toBe(expected);
        });
    });

    describe('getStringInfo for arg My-String should', () => {
        test('return lowerCase as my-string', () => {
            // arrange:
            const actual = getStringInfo("My-String");

            // assert:
            expect(actual.lowerCase).toBe("my-string");
        });

        test('return upperCase as MY-STRING', () => {
            // arrange:
            const actual = getStringInfo("My-String");

            // assert:
            expect(actual.upperCase).toBe("MY-STRING");
        });

        test('return extraInfo as empty object', () => {
            // arrange:
            const actual = getStringInfo("My-String");

            // assert:
            expect(actual.extraInfo).toEqual({});
        });

        test('return characters as array of length 9', () => {          
            // arrange:
            const actual = getStringInfo("My-String");

            // assert:
            expect(actual.characters).toHaveLength(9);
        });

        test('return characters as array of M, y, -, S, t, r, i, n, g', () => {     
            // arrange:
            const actual = getStringInfo("My-String");

            // assert:
            expect(actual.characters).toEqual(["M", "y", "-", "S", "t", "r", "i", "n", "g"]);
        });

        test('return characters as array containing M, y, -, S, t, r, i, n, g', () => {
            // arrange:
            const actual = getStringInfo("My-String");

            // assert:
            expect(actual.characters).toContain<string>("M");
            expect(actual.characters).toEqual(
                expect.arrayContaining(["S", "t", "r", "i", "n", "g","M", "y", "-"])
            );
        });

        test('return extraInfo as defined', () => {
            // arrange:
            const actual = getStringInfo("My-String");

            // assert:
            expect(actual.extraInfo).toBeDefined();
        });

        test('return extraInfo as truthy', () => {
            // arrange:
            const actual = getStringInfo("My-String");

            // assert:
            expect(actual.extraInfo).toBeTruthy();
        });
    });
});