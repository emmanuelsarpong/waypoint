declare module "passport-microsoft" {
  import { Strategy as PassportStrategy } from "passport-strategy";
  import { Request } from "express";

  export interface MicrosoftStrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    tenant?: string;
    passReqToCallback?: boolean;
  }

  export interface MicrosoftProfile extends Record<string, any> {
    id: string;
    displayName: string;
    emails?: Array<{ value: string }>;
    name?: {
      familyName: string;
      givenName: string;
      middleName?: string;
    };
    provider: string;
    _raw: string;
    _json: any;
  }

  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: MicrosoftProfile,
    done: (error: any, user?: any, info?: any) => void
  ) => void | Promise<void>;

  export type VerifyFunctionWithRequest = (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: MicrosoftProfile,
    done: (error: any, user?: any, info?: any) => void
  ) => void | Promise<void>;

  export class Strategy extends PassportStrategy {
    constructor(
      options: MicrosoftStrategyOptions,
      verify: VerifyFunction | VerifyFunctionWithRequest
    );
  }
}
