const fs = require('fs');
const util = require('./util');
const tasks = require('./tasks');
const xmlbuilder = require('xmlbuilder');


const SCENARIO_END = `
<!-- definition of the response time repartition table (unit is ms)   -->
  <ResponseTimeRepartition value="10, 20, 30, 40, 50, 100, 150, 200"/>

  <!-- definition of the call length repartition table (unit is ms)     -->
  <CallLengthRepartition value="10, 50, 100, 500, 1000, 5000, 10000"/>
`;


/**
 * Represents a SIPp scenario
 */
class Scenario {

    /**
     * @param {String} name name of the scenario
     * @param {Array} tasks set of initial tasks
     */
    constructor(name, tasks) {
        this.name = name;
        this.tasks = tasks || [];
    }

    /**
     * Add a task to the scenario
     * @param {Task} task task to be added to the scenario
     */
    add(task) {
        this.tasks.push(task);
    }

    /**
     * Execute scenario
     * @return {Promise} a promise object which resolves upon successful
     * execution or rejects with an error upon failure
     */
    execute() {
        let path;
        let doc = xmlbuilder.create('scenario', {
            encoding: 'utf-8',
        });
        doc.att('name', this.name);
        return Promise.all(this.tasks.map((task) => {
            return task.getCompiled()
            .then((data) => {
                doc.raw(data);
            });
        }))
        .then(() => {
            doc.raw(SCENARIO_END);
        })
        .then(() => {
            return util.getTempFile();
        })
        .then((_path) => {
            path = _path;
            return new Promise((resolve, reject) => {
                fs.writeFile(path, doc.end({pretty: true}), (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        })
        .then(() => {
            this.run(path);
        })
        ;
    }

    /**
     * Given the scenario file, run with the predefined arguments.
     * This will be invoked internally by execute method and can be overriden
     * to run with modified parameters
     * @param {String} path path to the scenario file.
     * @return {Promise} resolves upon successful run or rejects upon failure
     */
    run(path) {
        return util.execute(['-sf', path,
            '-i', '172.16.1.204',
            '-m', '1', '-l', '1', // Run only once..
        ]);
    }

}


exports.tasks = tasks;
exports.Scenario = Scenario;
