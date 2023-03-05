import { DataBase } from "../../../app/server_app/data/DataBase";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { Account } from "../../../app/server_app/model/AuthModel";
import * as IdGenerator from '../../../app/server_app/data/IdGenerator';

const insertMock = jest.fn();
const getByMock = jest.fn();
const updateMock = jest.fn();

jest.mock('../../../app/server_app/data/DataBase', () => {
    return {
        DataBase: jest.fn().mockImplementation(() => {
            return {
                insert: insertMock,
                getBy: getByMock,
                update: updateMock
            }
        })
    }
});

const someAccount : Account = {
    id: '',
    userName: 'someUserName',
    password: 'somePassword'
};

describe('SessionTokenDataAccess test suite', () => {

    let sut : SessionTokenDataAccess;
    const someId = '1234';

    beforeEach(() => {
        sut = new SessionTokenDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
        jest.spyOn(Date, 'now').mockReturnValue(0);
        jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValue(someId);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create session token and return the id', async () => {
        insertMock.mockResolvedValueOnce(someId);
        const actualTokenId = await sut.generateToken(someAccount);

        expect(actualTokenId).toBe(someId);
        expect(insertMock).toBeCalledWith({
            id: '',
            userName: someAccount.userName,
            valid: true,
            expirationDate: new Date(60 * 60 * 1000)
        });
    });

    it('should invalidate token', async () => {
        await sut.invalidateToken(someId);

        expect(updateMock).toBeCalledWith(someId, 'valid', false);
    });

    it('should check valid token', async () => {
        getByMock.mockResolvedValueOnce({
            id: someId,
            userName: someAccount.userName,
            valid: true,
            expirationDate: new Date(60 * 60 * 1000)
        });

        const actualResult = await sut.isValidToken(someId);

        expect(actualResult).toBe(true);
        expect(getByMock).toBeCalledWith('id', someId);
    });

    it('should check invalid token', async () => {
        getByMock.mockResolvedValueOnce({
            id: someId,
            userName: someAccount.userName,
            valid: false,
            expirationDate: new Date(60 * 60 * 1000)
        });

        const actualResult = await sut.isValidToken(someId);

        expect(actualResult).toBe(false);
        expect(getByMock).toBeCalledWith('id', someId);
    });

    it('should check inexistend token', async () => {
        getByMock.mockResolvedValueOnce(undefined);

        const actualResult = await sut.isValidToken(someId);

        expect(actualResult).toBe(false);
        expect(getByMock).toBeCalledWith('id', someId);
    });
});