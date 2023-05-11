const passport = require('passport');
const { Strategy: PasswordlessStrategy } = require('passport-passwordless');
const { Strategy: LocalStrategy } = require('passport-local');

const User = require('../models/User') // Getting access to the user model

// Passport Passwordless Strategy
passport.use(
    new PasswordlessStrategy(
    // Configuration
        { usernameField: 'email' },
        
        // Async Fnx :: validate the logged in user and build your final user object
        async (email, done) => {
            // Using the try catch error handler
            try {
                // Getting the user from collection
                const user = await User.findOne({ email });

                // Checking if user exist, but if not
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                // Checking if the user email is verified, but if not
                if (!user.isEmailVerified) {
                    return done(null, false, { message: 'Email address not verified' });
                }
                // If user is indeed exist and user email is verified the return
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
  )
);

// When user log-in successfully
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// When a user requests a protected resource and Passport needs to verify their identity
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
})