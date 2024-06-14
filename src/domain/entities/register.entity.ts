import { User } from "./user.entity";

export interface Register {
    id: string;
    name: string;
    city: string;
    users: User[];
  }