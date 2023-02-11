import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { postBooking } from "@/controllers/booking-controller";

const bookingsRouter = Router();

bookingsRouter
  .post("/", postBooking)

export { bookingsRouter };