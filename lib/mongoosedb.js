import mongoose from "mongoose";
import { Avatar, Content, Draft } from "../utils/models";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.DB_NAME;

// Check the MongoDB URI
if (!MONGODB_URI) {
  throw new Error("Define the MONGODB_URI environment variable");
}

// Check the MongoDB DB
if (!MONGODB_DB) {
  throw new Error("Define the MONGODB_DB environment variable")
}

let clientPromise;

;(async () => {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (hot module replacement).
    if (!global._mongooseClientPromise) {
      global._mongooseClientPromise = await mongoose.connect(MONGODB_URI);
      console.log("is global");
    }

    clientPromise = global._mongooseClientPromise;
  }  else {
    // In production mode, it's best to not use a global variable.
    clientPromise = await mongoose.connect(MONGODB_URI);
    console.log("is not global");
  }
})()


// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
module.exports = clientPromise;



// Connect to ANDTHENEUM, full driver code
// const uri is connection String
// Replace <password> with the password for the w0nd3r user. Replace myFirstDatabase with the name of the database that connections will use by default. Ensure any option params are URL encoded.

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://w0nd3r:andtest@andtheneum.x8xg3.mongodb.net/ANDTHENEUM?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
