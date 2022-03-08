// Chat JS WebSocket Connection // Client
const socket = io();
// server (emit) -> client (receive) --acknowledgement--> server
// client (emit) -> server (receive) --acknowledgement--> client

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");

const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

// Auto-Scroll Function in Chat Room
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};

socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm A")
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoscroll();
})

// Location Render
socket.on("locationMessage", (url) => {
    console.log(url);
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.cratedAt).format("h:mm A")
    });
    $messages.insertAdjacentElement("beforeend", html);
    autoscroll();
})

// List of Users in Room
socket.on("roomData", ({ room, users }) => {
    document.querySelector("#sidebar").innerHTML = Mustache.render(sidebarTemplate, { room, users })
})

// Message Form
$messageForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevents default full browser refresh action

    $messageFormButton.setAttribute("disabled", "disabled");

    const message = e.target.elements.message.value;
    // Targets HTML Input Tag by "message" element value
    
    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormInput.focus();
        // Error Message Enable
        if (error) {
            return console.log(error);
        }
    });
})

// Geolocation // Get Current GPS Location
$sendLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.")
    }

    $sendLocationButton.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute("disabled");
            console.log("Location shared!");
        })
    })
})

// Homepage Join
socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = "/"
    }
})