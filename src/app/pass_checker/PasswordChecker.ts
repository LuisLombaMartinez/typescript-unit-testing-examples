
export enum PasswordErrors {
    TOO_SHORT = "Password is too short",
    NO_UPPERCASE = "Password has no uppercase characters",
    NO_LOWERCASE = "Password has no lowercase characters",
    NO_SPECIAL_CHARACTERS = "Password has no special characters"
}

export interface CheckResult {
    valid: boolean;
    reasons: PasswordErrors[];
}


export class PasswordChecker {

    public checkPassword(password: string) : CheckResult {
        const reasons: PasswordErrors[] = [];
        if (password.length < 8) {
            reasons.push(PasswordErrors.TOO_SHORT);
        }
        if (password === password.toLowerCase()) {
            reasons.push(PasswordErrors.NO_UPPERCASE);
        }
        if (password === password.toUpperCase()) {
            reasons.push(PasswordErrors.NO_LOWERCASE);
        }
        if (password.match(/^[a-zA-Z0-9]+$/)) {
            reasons.push(PasswordErrors.NO_SPECIAL_CHARACTERS);
        }
        return { 
            valid: reasons.length > 0 ? false : true, 
            reasons: reasons 
        };
    }
}