import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

// Use require for MicrosoftStrategy to avoid type issues
const MicrosoftStrategy = require("passport-microsoft").Strategy;

const router = express.Router();

// Microsoft OAuth strategy
passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/auth/microsoft/callback",
      scope: ["user.read"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        let user = await User.findOne({
          $or: [{ microsoftId: profile.id }, { email }],
        });

        if (!user) {
          user = await User.create({
            microsoftId: profile.id,
            email,
            firstName: profile.displayName?.split(" ")[0] || "",
            isVerified: true,
          });
        } else if (!user.microsoftId) {
          user.microsoftId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    console.log("Google OAuth callback user:", req.user);
    const user = req.user as any;
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth`);
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    res.redirect(`${process.env.FRONTEND_URL}/oauth/callback?token=${token}`);
  }
);

// Start Microsoft OAuth
router.get(
  "/microsoft",
  passport.authenticate("microsoft", { scope: ["user.read"] })
);

// Microsoft OAuth callback
router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const user = req.user as any;
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth`);
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );
    res.redirect(`${process.env.FRONTEND_URL}/oauth/callback?token=${token}`);
  }
);

export default router;
