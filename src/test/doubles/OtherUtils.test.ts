import { calculateComplexity, OtherStringUtils, toUpperCaseWithCallback } from "../../app/doubles/OtherUtils";


describe.skip('OtherUtils test suite', () => {
    
    it('Calculates complexity - using a stub', () => {
        
        const someInfo = {
            length: 5,
            extraInfo: {
                field1: 'someInfo',
                field2: 'someOtherInfo'
            }
        }

        const actual = calculateComplexity(someInfo as any);
        expect(actual).toBe(10);
    });

    it('ToUpperCase - calls callback with invalid argument - using a fake', () => {
        const actual = toUpperCaseWithCallback('', () => {});
        expect(actual).toBe(undefined);
    });

    it('ToUpperCase - calls callback with valid argument - using a fake', () => {
        const actual = toUpperCaseWithCallback('abc', () => {});
        expect(actual).toBe('ABC');
    });

    describe('Tracking callbacks with our own mock', () => {
        let cbArgs = [];
        let timesCalled = 0;

        function callBackMock(arg: string) {
            cbArgs.push(arg);
            timesCalled++;
        }

        afterEach(() => {
            // clean up
            cbArgs = [];
            timesCalled = 0;
        });

        it('calls callback with invalid argument - track calls', () => {
            const actual = toUpperCaseWithCallback('', callBackMock);
            expect(actual).toBe(undefined);
            expect(cbArgs).toContain('Invalid argument!');
            expect(timesCalled).toBe(1);
        });

        it('calls callback with valid argument - track calls', () => {
            const actual = toUpperCaseWithCallback('abc', callBackMock);
            expect(actual).toBe('ABC');
            expect(cbArgs).toContain('called function with argument abc');
            expect(timesCalled).toBe(1);
        });
    });

    describe('Tracking callbacks - using jest mocks', () => {
        const callBackMock = jest.fn();

        afterEach(() => {
            // clean up
            jest.clearAllMocks();
        });

        it ('calls callback with invalid argument - track calls', () => {
            const actual = toUpperCaseWithCallback('', callBackMock);
            expect(actual).toBeUndefined();
            expect(callBackMock).toBeCalledWith('Invalid argument!');
            expect(callBackMock).toBeCalledTimes(1);
        });

        it ('calls callback with valid argument - track calls', () => {
            const actual = toUpperCaseWithCallback('abc', callBackMock);
            expect(actual).toBe('ABC');
            expect(callBackMock).toBeCalledWith('called function with argument abc');
            expect(callBackMock).toBeCalledTimes(1);
        });
    });

    describe('OtherStringUtils tests using spies', () => {
        let sut: OtherStringUtils;

        beforeEach(() => {
            sut = new OtherStringUtils();
        });

        test('Use a spy to track calls', () => {
            const toUpperCasespy = jest.spyOn(sut, 'toUpperCase');
            sut.toUpperCase('abc');
            expect(toUpperCasespy).toBeCalledTimes(1);
        });

        test('Use a spy to track calls to other module', () => {
            const consoleLogSpy = jest.spyOn(console, 'log');
            sut.logString('abc');
            expect(consoleLogSpy).toBeCalledWith('abc');
        });

        test('Use a spy to replace the implementation of a method', () => {
            jest.spyOn(sut, 'callExternalService').mockImplementationOnce(() => {
                console.log('calling mock implementation');
            });
            sut.callExternalService('abc');
        });
    });

});