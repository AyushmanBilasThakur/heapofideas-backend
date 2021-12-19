import { connect } from "mongoose";

connect(String(process.env.MONGO_CONNECTION_STRING), (err) => {
    if(err){
        console.log(err)
    }
    else{
        console.log("Connected to DB")
    }
})