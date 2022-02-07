// Weather Application (Node.js async)
const geocodeURL = "";

requestAnimationFrame({ url: geocodeURL, json: true }, (error, response) => {
    const latitude = response.body.features[0].center[0];
    const longitude = response.body.features[0].center[1];
    console.log(latitude, longitude);
});