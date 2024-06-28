import { User } from "../../domain/entities/user.entity";


export interface RegisterResponse {
  data: any ;
  _id: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  userId: string;
  register_id: string;
  checkIn: Date;
  checkOut: Date;
  edited: boolean;
  editedBy: string;
  workedHours: number;
}