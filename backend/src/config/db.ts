import { connect } from "mongoose";


async function connectToDb(){
    try{
        const mongoUri = process.env.MONGO_URI;
        if(!mongoUri){
            throw new Error("MONGO_URI is not defined in environment variables");
        }
        await connect(mongoUri);
        console.log("Connected to MongoDB successfully");
    }
    catch(error){
        console.error("Error connecting to MongoDB:", error);
        
    }
}

export default connectToDb;