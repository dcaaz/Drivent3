import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import bookingService from "@/services/bookings-service";

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { roomId } = req.body;

    try {
        await bookingService.createBookingRoom(userId, roomId);
        res.sendStatus(httpStatus.OK)
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