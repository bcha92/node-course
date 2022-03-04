// Chat App Node Express Server
const express = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public")

app.use(express.static(publicDirectoryPath));
io.on("connection", () => {
    console.log("New WebSocket connection")
})

server.listen(PORT, () => { // Listening at PORT #
    console.log(`Chat App server running on PORT ${PORT}`);
});