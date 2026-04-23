import { Router } from "express";
import passport from "passport";

const auth = Router();

auth.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

auth.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});


auth.get("/github", (req, res, next) => {
  passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
});

auth.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('https://google.com'); 
  }
);
export default auth;