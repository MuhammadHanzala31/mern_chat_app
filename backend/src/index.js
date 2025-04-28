// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from './app.js'
import { Server } from 'socket.io'
import http from 'http'
import { log } from "console";

dotenv.config({
    path: './env'
})


const server = http.createServer(app)

export const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
})
const userSocketMap = {};

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}


io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId
    if (userId) { userSocketMap[userId] = socket.id }
    console.log("userID", userId);


    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

connectDB()
    .then(() => {
        server.listen(process.env.PORT || 8000, () => {
            console.log(` Server is running at port : ${process.env.PORT}`);


        })
    })

    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })