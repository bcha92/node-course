// Client Side JS
console.log("Client Side JavaScript is loaded.");

const puzzleText = document.querySelector("p");

fetch("https://puzzle.mead.io/puzzle").then((res) => {
    res.json().then((data) => {
        console.log(data.puzzle);
    })
})