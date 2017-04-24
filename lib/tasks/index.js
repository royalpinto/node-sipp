const fs = require('fs');
const path = require('path');
const tasks = {};


const files = fs.readdirSync(__dirname);
for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (/^(?!(model|index|validators))\w+.js$/i.test(file)) {
        let task = require(path.join(__dirname, file));
        tasks[task.name] = task;
    }
}


module.exports = tasks;
