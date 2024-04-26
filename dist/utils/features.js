import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const db = await mongoose.connect("mongodb://0.0.0.0:27017", {
            dbName: "aura-ecommerce",
        });
        console.log(`database has been connected! : ${db.connection.host}`);
    }
    catch (error) {
        console.log(error);
    }
};
