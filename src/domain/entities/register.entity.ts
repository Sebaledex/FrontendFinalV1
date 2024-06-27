import { User } from "./user.entity";

export interface Register {
    id: string;
    coordinates: {
      latitude: string;
      longitude: string;
    };
    user_id: string;
    checkIn: Date;
    checkOut: Date;
  }