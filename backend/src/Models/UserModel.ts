import { Document, model, Schema } from "mongoose";

export interface IUser extends Document{
    githubId: string;
    profileAvtarUrl?: string;
    profileUrl?: string;
    name?: string;
    email?: string;
    createdAt: Date;
}


const userSchema = new Schema({
    githubId: {
        type: String,
        required: true,
        unique: true
    },
    profileAvtarUrl: {
        type: String,
    },
    profileUrl: {   
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    createdAt: {    
        type: Date,
        default: Date.now
    }
})


const userModel = model<IUser>('User', userSchema);
export default userModel;
