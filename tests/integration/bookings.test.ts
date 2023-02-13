import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createHotel,
  createRoomWithHotelId,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 401 if NO TOKEN is given", async () => {
    const response = await server.get("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given TOKEN IS INVALID", async () => {
    const token = faker.lorem.word();
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 404 when user doesnt have an enrollment yet", async () => {
    const token = await generateValidToken();
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it("should respond with status 404 when user doesnt have a ticket yet", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it("should respond with status 404 when user doesnt have a booking", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  /* it("should respond with status 200 and booking data", async () => {
    const user = await createUser();
    console.log("user", user);
    const token = await generateValidToken(user);
    console.log("token", token);
    const enrollment = await createEnrollmentWithAddress(user);
    console.log("enrollment", enrollment);
    const ticketType = await createTicketType();
    console.log("ticketType", ticketType);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    console.log("hotel", hotel);
    const room = await createRoomWithHotelId(hotel.id);
    console.log("room", room);
    const booking = await createBookingRoomUser(user.id, room.id);
    console.log("create", booking);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    console.log(response.error)

    expect(response.status).toEqual(httpStatus.OK);
    }); */
});

describe("POST /booking", () => {
  it("should respond with status 401 if NO TOKEN is given", async () => {
    const response = await server.post("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given TOKEN IS INVALID", async () => {
    const token = faker.lorem.word();
    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 404 when roomId doesnt exists", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const body = { roomId: 0 };

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it("should respond with status 403 when user doesnt have an enrollment yet", async () => {
    const token = await generateValidToken();
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    const body = { roomId: room.id };

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

  it("should respond with status 403 when user doesnt have a ticket yet", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    const body = { roomId: room.id };

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

  it("should respond with status 403 when ticket isnt paid", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    const body = { roomId: room.id };

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

  it("should respond with status 403 when ticket doesnt includes hotel", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    const body = { roomId: room.id };

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  });

/* it("should respond with status 200 and bookingId", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true);
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    const body = { userId: user.id, roomId: room.id };
    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual({
      bookingId: expect.any(Number)
      });
  });
*/
});

describe("PUT /booking/:bookingId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.put("/booking/0");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const response = await server.put("/booking/0").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put("/booking/0").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

/*  it("should respond with status 403 when user doesnt have an enrollment yet", async () => {
    const token = await generateValidToken();
    const body = { roomId: 2 };

    const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`).send(body);

    expect(response.status).toEqual(httpStatus.FORBIDDEN);
  }); */
});
