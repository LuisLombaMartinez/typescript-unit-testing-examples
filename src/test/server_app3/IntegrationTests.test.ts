import { Account } from "../../app/server_app/model/AuthModel";
import { Reservation } from "../../app/server_app/model/ReservationModel";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server"
import { makeAwesomeRequest } from "./utils/http-client";



describe('Server app Integration tests', () => {

    let server: Server;

    beforeAll(() => {
        server = new Server();
        server.startServer();
        console.log(`connecting to address: ${process.env.HOST}:${process.env.PORT}`)
    });

    afterAll(() => {
        server.stopServer();
    });

    const someUser: Account = {
        id: '',
        userName: 'someUserName',
        password: 'somePassword',
    };

    const someReservation : Reservation = {
        id: '',
        endDate: 'someEndDate',
        startDate: 'someStartDate',
        room: 'someRoom',
        user: 'someUser',
    }

    it('should register a new user', async () => {
        const result = await fetch('http://localhost:8080/register', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someUser),
        });
        const resultBody = await result.json();

        expect(result.status).toBe(HTTP_CODES.CREATED);
        expect(resultBody.userId).toBeDefined();
    });

    it('should register a new user with awesome request', async () => {
        const result = await makeAwesomeRequest({
            host: 'localhost',
            port: 8080,
            method: HTTP_METHODS.POST,
            path: '/register',
        }, someUser);

        expect(result.statusCode).toBe(HTTP_CODES.CREATED);
        expect(result.body.userId).toBeDefined();
    });

    let token: string;

    it('should login a registered user', async () => {
        const result = await fetch('http://localhost:8080/login', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someUser),
        });
        const resultBody = await result.json();

        expect(result.status).toBe(HTTP_CODES.CREATED);
        expect(resultBody.token).toBeDefined();
        token = resultBody.token;
    });

    let reservationId: string;
    it('should create a reservation if authorized', async () => {
        const result = await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token
            }
        });
        const resultBody = await result.json();

        expect(result.status).toBe(HTTP_CODES.CREATED);
        expect(resultBody.reservationId).toBeDefined();
        reservationId = resultBody.reservationId;
    });

    it('should get a reservation if authorized', async () => {
        const result = await fetch(`http://localhost:8080/reservation/${reservationId}`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        });
        const resultBody = await result.json();

        const expectedReservation = structuredClone(someReservation);
        expectedReservation.id = reservationId;

        expect(result.status).toBe(HTTP_CODES.OK);
        expect(resultBody).toEqual(expectedReservation);

    });

    it('should create and retrieve multiple reservations if authorized', async () => {
        await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token
            }
        });
        await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token
            }
        });
        await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers: {
                authorization: token
            }
        });

        const getAllResult = await fetch('http://localhost:8080/reservation/all', {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        });

        const getAllResultBody = await getAllResult.json();
        expect(getAllResult.status).toBe(HTTP_CODES.OK);
        expect(getAllResultBody.length).toBe(4);
    });

    it('should update a reservation if authorized', async () => {
        const updatedResult = await fetch(`http://localhost:8080/reservation/${reservationId}`, {
            method: HTTP_METHODS.PUT,
            body: JSON.stringify({
                startDate: 'someNewStartDate',
            }),
            headers: {
                authorization: token
            }
        });

        expect(updatedResult.status).toBe(HTTP_CODES.OK);

        const getResult = await fetch(`http://localhost:8080/reservation/${reservationId}`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        });

        const getResultBody: Reservation = await getResult.json();

        expect(getResult.status).toBe(HTTP_CODES.OK);
        expect(getResultBody.startDate).toBe('someNewStartDate');

    });

    it('should delete a reservation if authorized', async () => {
        const deleteResult = await fetch(`http://localhost:8080/reservation/${reservationId}`, {
            method: HTTP_METHODS.DELETE,
            headers: {
                authorization: token
            }
        });

        expect(deleteResult.status).toBe(HTTP_CODES.OK);

        const getResult = await fetch(`http://localhost:8080/reservation/${reservationId}`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        });

        expect(getResult.status).toBe(HTTP_CODES.NOT_FOUND);

    });
});