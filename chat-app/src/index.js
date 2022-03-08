// Chat App Node Express Server
const express = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");
const Filter = require("bad-words"); // Profanity detector

// Import
const { generateMessage, generateLocationMessage } = require("./utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public")

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    
    socket.on("join", (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) {
            return callback(error)
        }

        socket.join(user.room);
        // Only visible to user
        socket.emit("message", generateMessage("Chat App Bot", "Welcome!"));
        // Broadcast to everyone in room except user
        socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username} has joined!`));
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback();
    })

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed!")
        }

        io.to(user.room).emit("message", generateMessage(user.username, message));
        callback(); // Message Sent! --acknowledgement callback
    })

    socket.on("sendLocation", (coords, callback) => {
        const user = getUser(socket.id);
        // Geolocation to Google Maps link
        io.to(user.room).emit("locationMessage", generateLocationMessage(
            user.username,
            `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
        ))
        callback();
    })

    // Emit to everyone else when user is disconnected
    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit("message", generateMessage("Chat App Bot", `${user.username} has left!`));
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    });
});

server.listen(PORT, () => { // Listening at PORT #
    console.log(`Chat App server running on PORT ${PORT}`);
});