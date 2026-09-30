import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const globalForMongo = globalThis;

let mongoClient;

if (process.env.NODE_ENV === "production") {
  mongoClient = new MongoClient(mongoUri);
} else {
  if (!globalForMongo.routesyncMongoClient) {
    globalForMongo.routesyncMongoClient = new MongoClient(mongoUri);
  }

  mongoClient = globalForMongo.routesyncMongoClient;
}

const database = mongoClient.db(
  process.env.DB_NAME || "routesync"
);

export { database, mongoClient };