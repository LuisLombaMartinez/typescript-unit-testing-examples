import { v4 } from "uuid";


export type stringInfo = {
    lowerCase: string;
    upperCase: string;
    characters: string[];
    length: number;
    extraInfo: Object | undefined;
}

export function calculateComplexity(stringInfo: stringInfo) {
    return Object.keys(stringInfo.extraInfo).length * stringInfo.length;
}

type LoggerServiceCallBack = (message: string) => void;

export function toUpperCaseWithCallback(arg: string, callBack: LoggerServiceCallBack) {
    if (!arg) {
        callBack('Invalid argument!');
        return;
    }
    callBack(`called function with argument ${arg}`);
    return arg.toUpperCase();
}

export function toUpperCase(arg: string) {
    return arg.toUpperCase();
}

export function toLowerCaseWithId(arg: string) {
    return arg.toLowerCase() + v4();
}

export class OtherStringUtils {

    public callExternalService(arg: string) {
        console.log(`Calling external service with argument ${arg}`);
    }
    
    public toUpperCase(arg: string) {
        return arg.toUpperCase();
    }

    public logString(arg: string) {
        console.log(arg);
    }
}