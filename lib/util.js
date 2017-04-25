const tmp = require('tmp');
const childProcess = require('child_process');


const SERVER = '172.16.1.121';
const SIPP = 'sipp';


const execute = (params) => {
    let _params = params.slice();
    _params.unshift(SERVER);

    return new Promise((resolve, reject) => {
        let p = childProcess.execFile(SIPP, _params,
        (error, stdout, stderr) => {
            if (p.exitCode === 0) {
                resolve();
            } else {
                reject(error || new Error(stderr));
            }
        });
    });
};


const getTempFile = () => {
    return new Promise((resolve, reject) => {
        tmp.file((err, path) => {
            if (err) {
                reject(err);
            } else {
                resolve(path);
            }
        });
    });
};


exports.execute = execute;
exports.getTempFile = getTempFile;
