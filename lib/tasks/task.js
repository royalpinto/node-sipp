/**
 * Represents a SIPp scenario
 */
class Task {

    /**
     * Get compiled output/scenario section (set of xml tags)
     * @return {String} set of xml tags which can be used within scenario file.
     */
    getCompiled() {
        return Promise.reject(new Error('Not Implemented at base level!'));
    }

}


module.exports = Task;
