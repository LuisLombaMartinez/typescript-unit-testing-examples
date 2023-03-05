import { IncomingMessage, ServerResponse, STATUS_CODES } from "http";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler"
import { Account } from "../../../app/server_app/model/AuthModel";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";


const getRequestBodyMock = jest.fn();

jest.mock('../../../app/server_app/utils/Utils', () => ({
    getRequestBody: () => getRequestBodyMock()
}));

describe("LoginHandler test suite", () => {

    let sut: LoginHandler;

    const requestMock = {
        method: undefined
    }

    const responseMock = {
        statusCode: 0,
        writeHead: jest.fn(),
        write: jest.fn()
    }

    const authorizerMock = {
        login: jest.fn()
    }

    const someAccount: Account = {
        id: '',
        userName: 'someUserName',
        password: 'somePassword'
    }

    const someToken = '1234';

    beforeEach(() => {
        sut = new LoginHandler(
            requestMock as IncomingMessage,
            responseMock as any as ServerResponse,
            authorizerMock as any as Authorizer
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return token for valid accounts in requests', async () => {
        requestMock.method = 'POST';
        getRequestBodyMock.mockResolvedValueOnce(someAccount);
        authorizerMock.login.mockResolvedValueOnce(someToken);

        await sut.handleRequest();

        expect(authorizerMock.login).toBeCalledWith(
            someAccount.userName,
            someAccount.password
        );

        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseMock.writeHead).toBeCalledWith(
            HTTP_CODES.CREATED,
            {
                'Content-Type': 'application/json',
            }
        );

        expect(responseMock.write).toBeCalledWith(
            JSON.stringify({
                token: someToken
            })
        );
    });
    
    it('should return not found for invalid accounts in requests', async () => {
        requestMock.method = 'POST';
        getRequestBodyMock.mockResolvedValueOnce(someAccount);
        authorizerMock.login.mockResolvedValueOnce(undefined);

        await sut.handleRequest();

        expect(authorizerMock.login).toBeCalledWith(
            someAccount.userName,
            someAccount.password
        )
        expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_FOUND);
        expect(responseMock.write).toBeCalledWith(
            JSON.stringify('wrong username or password')
        )
    });

    it('should return bad request for invalid requests', async () => {
        requestMock.method = 'POST';
        getRequestBodyMock.mockResolvedValueOnce({});

        await sut.handleRequest();

        expect(authorizerMock.login).not.toBeCalled();
        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseMock.write).toBeCalledWith(
            JSON.stringify('userName and password required')
        )
    });

    it('should do nothing for not supported http methods', async () => {
        requestMock.method = 'GET';

        await sut.handleRequest();

        expect(responseMock.writeHead).not.toBeCalled();
        expect(responseMock.write).not.toBeCalled();
        expect(getRequestBodyMock).not.toBeCalled();
    });
});