// import validator from "validator";
import fs from "fs";
fs.writeFileSync("notes.js", `
// getNotes Function in notes.js
const getNotes = () => "Your Notes...";

export default getNotes;
`)

import getNotes from "./notes.js";
import chalk from "chalk";
import yargs from "yargs";
import { info } from "console";

console.log(getNotes());
// console.log(validator.isURL("https://localhost:3000"));
// console.log(chalk.blue.inverse.bold("Success!"));

// const command = process.argv;
// console.log(process.argv);
// console.log(yargs.argv);
// if (command === "add") {
//     console.log("Adding note!")
// } else if (command === "remove") {
//     console.log("Removing note!")
// }

// Customize yargs version
yargs.version("1.1.0");

// Create add command
yargs.command({
    command: "add",
    describe: "Add a new note",
    handler: function () {
        console.log("Adding a new note!");
    }
});

// Create remove command
yargs.command({
    command: "remove",
    describe: "Remove a note",
    handler: function() {
        console.log("Removed a note");
    }
})

// Create list command
yargs.command({
    command: "list",
    describe: "List your notes",
    handler: function() {
        console.log("Listing out all notes");
    }
})

// Create read command
yargs.command({
    command: "read",
    describe: "Read a note",
    handler: function() {
        console.log("Reading a note");
    }
})

// add, remove, readf, list
console.log(yargs.argv);

const command = process.argv[2];

if (command === "add") {
    console.log("Adding note!");
} else if (commnand === "remove") {
    console.log("Removing note!");
}