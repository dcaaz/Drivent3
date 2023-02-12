import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import bookingService from "@/services/bookings-service";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const data = await bookingService.findBookingRoom(userId);
    res.status(httpStatus.OK).send(data);

  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    const data = await bookingService.createBookingRoom(userId, roomId);
    res.status(httpStatus.OK).send(data.roomId);

  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if (error.name === "NoVacancy") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }

    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;

  try {
    const data = await bookingService.updateBookingRoom(userId, roomId, Number(bookingId));
    res.status(httpStatus.OK).send(data.id);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    
    }
    if (error.name === "NoVacancy") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}