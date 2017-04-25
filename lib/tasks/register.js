const fs = require('fs');
const Task = require('./task');
const mustache = require('mustache');


/**
 * Represents a SIPp scenario
 */
class Register extends Task {

    /**
     * @param {String} username username to register
     * @param {String} password password for authentication
     */
    constructor(username, password) {
        super();
        this.username = username;
        this.password = password;
        this.template = 'templates/register.xml';
    }

    /**
     * Compile this task to a template and return the content.
     * This content can then be added/appended to the scenario xml.
     * @return {Promise} a promise which resolve upon completion or rejects
     * upon failure.
     **/
    getCompiled() {
        return new Promise((resolve, reject) => {
            fs.readFile(__dirname + '/' + this.template, 'utf8',
            (err, data) => {
                if (err) {
                    return reject(err);
                } else {
                    resolve(data);
                }
            });
        })
        .then((data) => {
            return mustache.render(data, {
                username: this.username,
                password: this.password,
            });
        })
        ;
    }

}


module.exports = Register;
