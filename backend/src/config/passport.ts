import passport from "passport";
import { Strategy } from "passport-github2";
import userModel from "../Models/UserModel.js";
import dotenv from "dotenv";

dotenv.config();



console.log("Passport configuration loaded");
console.log("GitHub Client ID:", process.env.GITHUB_CLIENT_ID);
console.log("GitHub Client Secret:", process.env.GITHUB_CLIENT_SECRET);
console.log("GitHub Callback URL:", process.env.GITHUB_CALLBACK_URL);
passport.use(new Strategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.GITHUB_CALLBACK_URL!
    // @ts-ignore
}, async(accessToken,refreshToken,profile ,done)=>{
    try{
        let user = await userModel.findOne({githubId: profile.id});
        if(user){
            return done(null,user);
        }
        else{
            user = new userModel({
                githubId: profile.id,
                profileAvtarUrl: profile.photos?.[0]?.value,
                profileUrl: profile.profileUrl,
                name: profile.displayName,
                email: profile.emails?.[0]?.value
            });
            await user.save();
            return done(null,user);
        }
    }
    catch(error){
        return done(error);
    }
}))

passport.serializeUser((user,done)=>{
    done(null,(user as any)._id);
})

passport.deserializeUser(async(id,done)=>{
    try{
        const user = await userModel.findById(id);
        done(null,user);
    }
    catch(error){
        done(error);
    }
})

export default passport;