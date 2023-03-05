
export enum PasswordErrors {
    TOO_SHORT = "Password is too short",
    NO_UPPERCASE = "Password has no uppercase characters",
    NO_LOWERCASE = "Password has no lowercase characters",
    NO_SPECIAL_CHARACTERS = "Password has no special characters",
    NO_NUMBER = "Password has no number"
}

export interface CheckResult {
    valid: boolean;
    reasons: PasswordErrors[];
}


export class PasswordChecker {

    public checkPassword(password: string) : CheckResult {
        const reasons: PasswordErrors[] = [];
        this.checkPasswordLength(password, reasons);
        this.checkForUppercase(password, reasons);
        this.checkForLowercase(password, reasons);
        this.checkForSpecialCharacters(password, reasons);
        return { 
            valid: reasons.length > 0 ? false : true, 
            reasons: reasons 
        };
    }

    public checkAdminPassword(password: string) : CheckResult {
        const basicCheck = this.checkPassword(password);
        this.checkForNumber(password, basicCheck.reasons);
        return {
            valid: basicCheck.reasons.length > 0 ? false : true,
            reasons: basicCheck.reasons
        }
    }

    private checkForNumber(password: string, reasons: PasswordErrors[]) {
        if (!password.match(/\d/)) {
            reasons.push(PasswordErrors.NO_NUMBER);
        }
    }

    private checkPasswordLength(password: string, reasons: PasswordErrors[]) {
        if (password.length < 8) {
            reasons.push(PasswordErrors.TOO_SHORT);
        }
    }

    private checkForUppercase(password: string, reasons: PasswordErrors[]) {
        if (password === password.toLowerCase()) {
            reasons.push(PasswordErrors.NO_UPPERCASE);
        }
    }

    private checkForLowercase(password: string, reasons: PasswordErrors[]) {
        if (password === password.toUpperCase()) {
            reasons.push(PasswordErrors.NO_LOWERCASE);
        }
    }

    private checkForSpecialCharacters(password: string, reasons: PasswordErrors[]) {
        if (password.match(/^[a-zA-Z0-9]+$/)) {
            reasons.push(PasswordErrors.NO_SPECIAL_CHARACTERS);
        }
    }


}