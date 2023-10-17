const HyperDHT = require('hyperdht');
const net = require('net');
const libNet = require('@hyper-cmd/lib-net');
const libUtils = require('@hyper-cmd/lib-utils');
const libKeys = require('@hyper-cmd/lib-keys');

const { MycelPortNode } = require('./MycelPortNode.js');
const { MycelIdentity } = require('../auth/MycelIdentity.js');
const { randomBytes } = require('crypto');

const connPiper = libNet.connPiper;

function prepareConfig(config, opts) {
    if (typeof opts.seed === 'string') {
        config.seed = opts.seed;
    }

    if (typeof opts.configFilePath === 'string') {
        libUtils.readConf(config, opts.configFilePath);
    }

    if (
        (typeof opts.compress === 'boolean' && opts.compress === true) ||
        (typeof opts.compress === 'number' && opts.compress != 0)
    ) {
        config.compress = true;
    }

    if (
        (typeof opts.skipCertificateCheck === 'boolean' && opts.skipCertificateCheck === true) ||
        (typeof opts.skipCertificateCheck === 'number' && opts.skipCertificateCheck != 0)
    ) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    }

    // Validate the seed.
    if (!config.seed) {
        // throw "A valid seed must be provided.";
        config.seed = randomBytes(32).toString('hex');
    }

    // Prepare the key list.
    if (config.allow) {
        config.allow = libKeys.prepKeyList(config.allow);
    }
}

class MycelPortServer extends MycelPortNode {
    constructor(opts, callback) {
        super();

        if (!opts.unixSocket && !+opts.port) {
            throw "Invalid proxy port.";
        }

        if (opts.unixSocket && opts.port) {
            throw "Cannot simultaneously listen to both a port and Unix domain socket.";
        }

        this._config = {};

        prepareConfig(this._config, opts);

        this._isDebugModeEnabled = opts.debug;

        this._seed = Buffer.from(this._config.seed, 'hex');

        this._dht = new HyperDHT();

        const identityJSON = HyperDHT.keyPair(this._seed);
        const identity = MycelIdentity.fromJSON(identityJSON);

        this._identityJSON = identityJSON;
        this._identity = identity;

        this._stats = {};

        this._createServer(opts);

        this._isRunning = true;

        this._listen(callback);

        if (this._isDebugModeEnabled) {
            setInterval(
                () => {
                    console.debug('connection stats', this._stats);
                },
                5000
            );
        }

        process.once(
            'SIGINT',
            async () => {
                await this._dht.destroy();
            }
        );
    }

    static createSync(port, opts={}, cb=null) {
        if (typeof opts !== 'object' || opts === null) {
            opts = {};
        }

        if (typeof port !== 'number') {
            throw `Invalid port number \`${port}\``
        }

        opts.port = port;

        return new MycelPortServer(opts, cb);
    }

    async destroy() {
        if (this._isRunning === false) {
            return;
        }

        this._isRunning = false;

        if (this._dht) {
            this._dht.destroy();

            this._dht = null;
        }
    }

    isDebugModeEnabled() {
        return this._isDebugModeEnabled;
    }

    publicKey() {
        return this._identity.publicKey;
    }

    publicKeyHexString() {
        return this._identity.publicKey.toString('hex');
    }

    seed() {
        return this._seed;
    }

    _createServer(opts) {
        this._dhtServer = this._dht.createServer(
            {
                firewall: (remotePublicKey, remoteHandshakePayload) => {
                    if (
                        this._config.allow &&
                        !libKeys.checkAllowList(this._config.allow, remotePublicKey)
                    ) {
                        return true;
                    }

                    return false;
                },
                reusableSocket: true
            },
            c => {
                connPiper(
                    c,
                    () => {
                        return net.connect(
                            opts.unixSocket ?
                            {
                                path: opts.unixSocket
                            } :
                            {
                                port: +opts.port,
                                host: '127.0.0.1',
                                allowHalfOpen: true
                            }
                        );
                    },
                    {
                        debug: this._isDebugModeEnabled,
                        isServer: true,
                        compress: this._config.compress
                    },
                    this._stats
                );
            }
        );
    }

    _listen(callback) {
        this._dhtServer.listen(
            this._identityJSON
        ).then(
            () => {
                if (typeof callback === 'function') {
                    callback(
                        {
                            identity: this._identity,
                            server: this
                        }
                    );
                }
            }
        );
    }

    _registerDebugLog() {
        if (this._isDebugModeEnabled) {
            setInterval(
                () => {
                    console.debug(
                        'connection stats',
                        stats
                    );
                },
                5000
            );
        }
    }
}

module.exports = { MycelPortServer };
