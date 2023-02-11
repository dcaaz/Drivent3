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

  await bookingRepository.createBooking(+userId, +roomId)
}

const bookingService = {
    createBookingRoom
}

export default bookingService;