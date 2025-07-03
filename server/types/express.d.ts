// Custom type declarations to override conflicting Passport types
import { IUser } from "../models/userModel";

declare global {
  namespace Express {
    interface User extends IUser {
      [key: string]: any;
    }
  }
}

// Override passport types
declare module "passport" {
  interface AuthenticatedRequest extends Express.Request {
    user: IUser;
  }
}

export {};
