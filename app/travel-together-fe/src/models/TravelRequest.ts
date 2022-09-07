import { EGender } from "../api/Enum/EGender";
import { ETripType } from "../api/Enum/ETripType";

export class TravelRequest {
  genderLooking?: EGender;
  tripType?: string;
  destination?: string;
  departureDate?: Date;
  endDate?: Date;
  description?: string;
  active?: boolean;

  constructor(
    genderLooking?: EGender,
    tripType?: string,
    destination?: string,
    departureDate?: Date,
    endDate?: Date,
    description?: string,
    active?: boolean
  ) {
    this.genderLooking = genderLooking;
    this.tripType = tripType;
    this.destination = destination;
    this.departureDate = departureDate;
    this.endDate = endDate;
    this.description = description;
    this.active = active;
  }
}
