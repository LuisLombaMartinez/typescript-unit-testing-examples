import { PasswordChecker } from "../../app/pass_checker/PasswordChecker";


describe('PasswordChecker test suite', () => { 

    let sut: PasswordChecker;

    beforeEach(() => {
        sut = new PasswordChecker();
    });
    
    test('Password with less than 8 characters is invalid', () => {
        const actual = sut.checkPassword("1234567");
        expect(actual).toBe(false);
    });

    test('Password with 8 or more characters is OK', () => {
        const actual = sut.checkPassword("1234_Abcd");
        expect(actual).toBe(true);
    });

    test('Password with no uppercase is invalid', () => {
        const actual = sut.checkPassword("1234abcd");
        expect(actual).toBe(false);
    });

    test('Password with uppercase is OK', () => {
        const actual = sut.checkPassword("1234$Abcd");
        expect(actual).toBe(true);
    });

    test('Password with no lowercase is invalid', () => {
        const actual = sut.checkPassword("1234ABCD");
        expect(actual).toBe(false);
    });

    test('Password with lowercase is OK', () => {
        const actual = sut.checkPassword("1234_Abcd");
        expect(actual).toBe(true);
    });

    test('Password with no special characters is invalid', () => {
        const actual = sut.checkPassword("1234Abcd");
        expect(actual).toBe(false);
    });

    test('Password with special characters is OK', () => {
        const actual = sut.checkPassword("1234_Abcd");
        expect(actual).toBe(true);
    });

});