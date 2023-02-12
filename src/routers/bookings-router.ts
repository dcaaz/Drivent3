import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { postBooking, putBooking } from "@/controllers/booking-controller";

const bookingsRouter = Router();

bookingsRouter
  .get("/")
  .post("/booking", postBooking)
  .put("/booking/:bookingId", putBooking)

export { bookingsRouter };