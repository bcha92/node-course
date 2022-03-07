// Chat App Node Express Server
const express = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");
const Filter = require("bad-words"); // Profanity detector

const app = express();
const server = http.createServer(app);
const io = socket(server);

const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public")

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    // Only visible to user
    socket.emit("message", "Welcome!");
    // Broadcast to everyone except user
    socket.broadcast.emit("message", "A new user has joined!");

    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed!")
        }

        io.emit("message", message);
        callback(); // Message Sent! --acknowledgement callback
    })

    socket.on("sendLocation", (coords, callback) => {
        // Geolocation to Google Maps link
        io.emit("message", `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback();
    })

    // Emit to everyone else when user is disconnected
    socket.on("disconnect", () => {
        io.emit("message", "A user has left!");
    });
});

server.listen(PORT, () => { // Listening at PORT #
    console.log(`Chat App server running on PORT ${PORT}`);
});