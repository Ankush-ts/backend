import express from "express";
import { getBooking, getBookingById, newBooking } from "../controllers/booking-contoller.js";

const bookingRouter =  express.Router();

bookingRouter.post("/", newBooking);
bookingRouter.get("/", getBooking);
bookingRouter.get("/:id", getBookingById);

export default bookingRouter;