class MycelPortNode {
    constructor() {
        this._isRunning = false;
    }

    async close() {
        this._isRunning = false;
    }

    isRunning() {
        return this._isRunning;
    }
}

module.exports = { MycelPortNode };
