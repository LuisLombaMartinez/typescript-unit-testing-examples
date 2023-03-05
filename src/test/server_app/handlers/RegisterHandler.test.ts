import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler";
import { IncomingMessage, ServerResponse } from "http";
import { Account } from "../../../app/server_app/model/AuthModel";
import { HTTP_CODES } from "../../../app/server_app/model/ServerModel";

const getRequestBodyMock = jest.fn();

jest.mock('../../../app/server_app/utils/Utils', () => ({
    getRequestBody: () => getRequestBodyMock()
}));

describe('RegisterHandler test suite', () => {

    let sut: RegisterHandler;

    const requestMock = {
        method: undefined
    }

    const responseMock = {
        statusCode: 0,
        writeHead: jest.fn(),
        write: jest.fn()
    }

    const authorizerMock = {
        registerUser: jest.fn()
    }

    const someAccount: Account = {
        id: '',
        userName: 'someUserName',
        password: 'somePassword'
    }
    
    const someId = '1234';
        

    beforeEach(() => {
        sut = new RegisterHandler(
            requestMock as IncomingMessage,
            responseMock as any as ServerResponse,
            authorizerMock as any as Authorizer
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register valid accounts in request', async () => {
        requestMock.method = 'POST';
        getRequestBodyMock.mockResolvedValueOnce(someAccount);
        authorizerMock.registerUser.mockResolvedValueOnce(someId);

        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseMock.writeHead).toBeCalledWith(
            HTTP_CODES.CREATED, 
            { 
                'Content-Type': 'application/json' 
            }
        );
        expect(responseMock.write).toBeCalledWith(
            JSON.stringify({
                userId: someId
            })
        );
    });

    it('should not register invalid accounts in request', async () => {
        requestMock.method = 'POST';
        getRequestBodyMock.mockResolvedValueOnce({});

        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseMock.writeHead).toBeCalledWith(
            HTTP_CODES.BAD_REQUEST, 
            { 
                'Content-Type': 'application/json' 
            }
        );
        expect(responseMock.write).toBeCalledWith(
            JSON.stringify('userName and password required')
        );
    });

    it('should do nothing for not supported http methods', async () => {
        requestMock.method = 'GET';

        await sut.handleRequest();

        expect(responseMock.writeHead).not.toBeCalled();
        expect(responseMock.write).not.toBeCalled();
        expect(getRequestBodyMock).not.toBeCalled();
    });
});