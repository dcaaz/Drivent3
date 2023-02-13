import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import bookingRepository from "@/repositories/booking-repository";
import { notFoundError, Forbidden } from "@/errors";

async function findBookingRoom(userId: number) {
  const enrollment = await enrollmentRepository.findUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw notFoundError();
  }

  const data = await bookingRepository.findUserId(userId);

  if (!data) {
    throw notFoundError();
  }

  return data;
}

async function createBookingRoom(userId: number, roomId: number) {
  if (!roomId) {
    throw notFoundError();
  }

  const enrollment = await enrollmentRepository.findUserId(userId);

  if (!enrollment) {
    throw Forbidden();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw Forbidden();
  }

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== "PAID") {
    throw Forbidden();
  }

  const capacity = await bookingRepository.findBookingRoom(roomId);

  if (!capacity) {
    throw notFoundError();
  }

  if (capacity.Booking.length === capacity.capacity) {
    throw Forbidden();
  }

  const booking = await bookingRepository.createBooking(userId, roomId);
  return booking;
}

async function updateBookingRoom(userId: number, roomId: number, bookingId: number) {
  const enrollment = await enrollmentRepository.findUserId(userId);

  if (!enrollment) {
    throw Forbidden();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw Forbidden();
  }

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== "PAID") {
    throw Forbidden();
  }

  const capacity = await bookingRepository.findBookingRoom(roomId);

  if (!capacity) {
    throw notFoundError();
  }

  if (capacity.Booking.length === capacity.capacity) {
    throw Forbidden();
  }

  const bookingExists = await bookingRepository.findUserByBooking(bookingId, userId);

  if (!bookingExists) {
    throw Forbidden();
  }

  const data = await bookingRepository.updateRoom(bookingId, roomId);

  return data;
}

const bookingService = {
  createBookingRoom,
  findBookingRoom,
  updateBookingRoom
};

export default bookingService;
