import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import bookingRepository from "@/repositories/booking-repository";
import { notFoundError, noVacancyInTheRoom } from "@/errors";


async function createBookingRoom(userId:number, roomId: number){
 
  if(!roomId){
    throw notFoundError();
  }

  //ver como avaliar capacidade do quarto
  const enrollment = await enrollmentRepository.findById(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  const ticketType = await ticketRepository.findOneTickeType(ticket.ticketTypeId);

  if (ticketType.isRemote == true || ticketType.includesHotel == false || ticket.status !== "PAID"){
    throw notFoundError();
  }

  const booking = await bookingRepository.createBooking(userId, roomId)

  return booking
}

async function findBookingRoom(userId: number){
  const enrollment = await enrollmentRepository.findUserId(userId);

  if(!enrollment){
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if(!ticket){
    throw notFoundError();
  }

  const data = await bookingRepository.findUserId(userId);

  if(!data){
    throw notFoundError();
  }

  return data;
}

const bookingService = {
    createBookingRoom,
    findBookingRoom
}

export default bookingService;