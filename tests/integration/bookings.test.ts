import app, { init } from '@/app';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
    createEnrollmentWithAddress,
    createUser,
    createTicketType,
    createTicket,
    createBookingRoom,
    createHotelWithRooms,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
    it('should respond with status 401 if NO TOKEN is given', async () => {
        const response = await server.get('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given TOKEN IS INVALID', async () => {
        const token = faker.lorem.word();
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
        const token = await generateValidToken();
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user doesnt have a ticket yet', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user doesnt have a booking', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and booking data', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotelWithRooms();
        const room = hotel.Rooms[0];
        await createBookingRoom(user.id, room.id);

        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.OK);
    });
});
