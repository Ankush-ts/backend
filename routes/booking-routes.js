import express from "express";
import { deleteBooking, getBooking, getBookingById, newBooking } from "../controllers/booking-contoller.js";

const bookingRouter =  express.Router();

bookingRouter.post("/", newBooking);
bookingRouter.get("/", getBooking);
bookingRouter.get("/:id", getBookingById);
bookingRouter.delete("/:id", deleteBooking);

export default bookingRouter;