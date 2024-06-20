import { User } from "../../domain/entities/user.entity";


export interface RegisterResponse {
  _id: string;
  name: string;
  city: string;
  users: User[];
}