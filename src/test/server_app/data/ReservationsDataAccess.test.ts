import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess"
import { DataBase } from '../../../app/server_app/data/DataBase';
import * as IdGenerator from '../../../app/server_app/data/IdGenerator';
import { Reservation } from "../../../app/server_app/model/ReservationModel";

const insertMock = jest.fn();
const getByMock = jest.fn();
const getAllElementsMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();

jest.mock('../../../app/server_app/data/DataBase', () => {
    return {
        DataBase: jest.fn().mockImplementation(() => {
            return {
                insert: insertMock,
                getBy: getByMock,
                getAllElements: getAllElementsMock,
                update: updateMock,
                delete: deleteMock
            }
        })
    }
});

describe('ReservationsDataAccess test suite', () => {

    let sut : ReservationsDataAccess;

    const someId = '1234';

    const someReservation : Reservation = {
        id: '',
        startDate: 'someStartDate',
        endDate: 'someEndDate',
        room: 'someRoom',
        user: 'someUser'
    };

    beforeEach(() => {
        sut = new ReservationsDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
        jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValue(someId);
    });

    afterEach(() => {
        jest.clearAllMocks();
        someReservation.id = '';
    });

    it('should create reservation and return the id', async () => {
        insertMock.mockResolvedValueOnce(someId);

        const actualId = await sut.createReservation(someReservation);

        expect(actualId).toBe(someId);
        expect(insertMock).toHaveBeenCalledWith(someReservation);
    });

    it('should update reservation', async () => {
        await sut.updateReservation(
            someId, 
            'startDate', 
            'someNewStartDate'
        );

        expect(updateMock).toHaveBeenCalledWith(
            someId, 
            'startDate', 
            'someNewStartDate'
        );
    });

    it('should delete reservation', async () => {
        await sut.deleteReservation(someId);

        expect(deleteMock).toHaveBeenCalledWith(someId);
    });

    it('should get reservation by id', async () => {
        getByMock.mockResolvedValueOnce(someReservation);

        const actual = await sut.getReservation(someId);

        expect(actual).toEqual(someReservation);
        expect(getByMock).toHaveBeenCalledWith('id', someId);
    });

    it('should get all reservations', async () => {
        const someReservations = [someReservation, someReservation];
        getAllElementsMock.mockResolvedValueOnce(someReservations);

        const actual = await sut.getAllReservations();

        expect(actual).toEqual(someReservations);
        expect(getAllElementsMock).toHaveBeenCalledTimes(1);
    });
});