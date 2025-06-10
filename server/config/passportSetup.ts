import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel"; // adjust path if needed

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = profile.emails?.[0].value.toLowerCase();
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (!user) {
          try {
            user = await User.create({
              googleId: profile.id,
              email,
              firstName:
                profile.name?.givenName || profile.displayName.split(" ")[0],
              isVerified: true,
            });
          } catch (err: any) {
            if (err.code === 11000) {
              // Duplicate email, fetch the existing user
              user = await User.findOne({ email });
            } else {
              return done(err, undefined);
            }
          }
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj as any);
});
