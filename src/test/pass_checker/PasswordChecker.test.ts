import { PasswordChecker, PasswordErrors } from "../../app/pass_checker/PasswordChecker";


describe('PasswordChecker test suite', () => { 

    let sut: PasswordChecker;

    beforeEach(() => {
        sut = new PasswordChecker();
    });
    
    test('Password with less than 8 characters is invalid', () => {
        const actual = sut.checkPassword("1234567");
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.TOO_SHORT);
    });

    test('Password with 8 or more characters is OK', () => {
        const actual = sut.checkPassword("12345678");
        expect(actual.reasons).not.toContain(PasswordErrors.TOO_SHORT);
    });

    test('Password with no uppercase is invalid', () => {
        const actual = sut.checkPassword("abc");
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.NO_UPPERCASE);
    });

    test('Password with uppercase is OK', () => {
        const actual = sut.checkPassword("Abc");
        expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPERCASE);
    });

    test('Password with no lowercase is invalid', () => {
        const actual = sut.checkPassword("ABCD");
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.NO_LOWERCASE);
    });

    test('Password with lowercase is OK', () => {
        const actual = sut.checkPassword("Abc");
        expect(actual.reasons).not.toContain(PasswordErrors.NO_LOWERCASE);
    });

    test('Password with no special characters is invalid', () => {
        const actual = sut.checkPassword("Abc123");
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.NO_SPECIAL_CHARACTERS);
    });

    test('Password with special characters is OK', () => {
        const actual = sut.checkPassword("_·!");
        expect(actual.reasons).not.toContain(PasswordErrors.NO_SPECIAL_CHARACTERS);
    });

    test('Password with all requirements is OK', () => {
        const actual = sut.checkPassword("Abc123_·!");
        expect(actual.valid).toBe(true);
        expect(actual.reasons).toHaveLength(0);
    });

});