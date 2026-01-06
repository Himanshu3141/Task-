import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn(
    "MONGODB_URI is not set. Set it in your environment variables for database access."
  );
}

type MongooseGlobal = typeof globalThis & {
  _mongooseConn?: typeof mongoose;
  _mongoosePromise?: Promise<typeof mongoose>;
};

const globalWithMongoose = global as MongooseGlobal;

export async function connectDB() {
  if (globalWithMongoose._mongooseConn) {
    return globalWithMongoose._mongooseConn;
  }

  if (!globalWithMongoose._mongoosePromise) {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    globalWithMongoose._mongoosePromise = mongoose.connect(MONGODB_URI).then(
      (m) => {
        return m;
      }
    );
  }

  globalWithMongoose._mongooseConn = await globalWithMongoose._mongoosePromise;
  return globalWithMongoose._mongooseConn;
}


