/** Check if a value is a non-negative integer. */
function isNonNegativeInteger(n) {
    return typeof n === "number" && n % 1 === 0 && n >= 0;
}
function toString(thing) {
    if (typeof thing === "string") {
        return thing;
    }
    const bytes = new Uint8Array(thing);
    let str = "";
    for (let i = 0; i < bytes.length; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    return str;
}
function ensureStringed(thing) {
    if (typeof thing === "string" || typeof thing === "number" || typeof thing === "boolean") {
        return thing;
    }
    else if (thing instanceof ArrayBuffer || thing instanceof Uint8Array) {
        return util.toString(thing);
    }
    else if (Array.isArray(thing)) {
        return thing.map(ensureStringed);
    }
    else if (thing === Object(thing)) {
        const obj = {};
        for (const key in thing) {
            if (!Object.prototype.hasOwnProperty.call(thing, key)) {
                continue;
            }
            const val = thing[key];
            if (val === undefined) {
                continue;
            }
            try {
                obj[key] = ensureStringed(val);
            }
            catch (ex) {
                console.log("Error serializing key", key);
                throw ex;
            }
        }
        return obj;
    }
    else if (thing === null) {
        return null;
    }
    else {
        throw new Error(`unsure of how to jsonify object of type ${typeof thing}`);
    }
}
/** Serialize a value to JSON, converting binary data to strings. */
function jsonThing(thing) {
    return JSON.stringify(ensureStringed(thing));
}
function strToBytes(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
}
function toArrayBuffer(thing) {
    if (thing === undefined) {
        return undefined;
    }
    if (thing instanceof ArrayBuffer) {
        return thing;
    }
    if (thing instanceof Uint8Array) {
        return thing.buffer;
    }
    if (typeof thing !== "string") {
        throw new Error(`Tried to convert a non-string of type ${typeof thing} to an array buffer`);
    }
    return strToBytes(thing);
}
function normalizeBuffer(input, encoding) {
    if (input instanceof ArrayBuffer) {
        return new Uint8Array(input);
    }
    if (input instanceof Uint8Array) {
        return input;
    }
    if (typeof input !== "string") {
        throw new Error("Expected string or buffer");
    }
    switch (encoding) {
        case "binary": {
            const buf = new Uint8Array(input.length);
            for (let i = 0; i < input.length; i++) {
                buf[i] = input.charCodeAt(i);
            }
            return buf;
        }
        case "base64": {
            const raw = atob(input);
            const buf = new Uint8Array(raw.length);
            for (let i = 0; i < raw.length; i++) {
                buf[i] = raw.charCodeAt(i);
            }
            return buf;
        }
        case "hex": {
            const len = input.length / 2;
            const buf = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                buf[i] = parseInt(input.substring(i * 2, i * 2 + 2), 16);
            }
            return buf;
        }
        case "utf8":
        case "utf-8":
            return new TextEncoder().encode(input);
        default:
            throw new Error(`Unsupported encoding: ${encoding}`);
    }
}
function isEqual(a, b) {
    if (a === undefined || b === undefined) {
        return false;
    }
    const aStr = toString(a);
    const bStr = toString(b);
    const maxLength = Math.max(aStr.length, bStr.length);
    if (maxLength < 5)
        throw new Error("a/b compare too short");
    if (aStr.length !== bStr.length)
        return false;
    // Constant-time compare: OR-accumulate per-character differences so the run
    // time doesn't reveal where two values first diverge.
    let result = 0;
    for (let i = 0; i < aStr.length; i++) {
        result |= aStr.charCodeAt(i) ^ bStr.charCodeAt(i);
    }
    return result === 0;
}
const util = { toString, toArrayBuffer, normalizeBuffer, isEqual };

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Stand-in for the wasm-backed {@link Curve25519}, substituted for `./curve` in
 * the `worker-client` build (see rollup.config.js). That build ships no
 * WebAssembly and every curve operation must run in the worker. This stub is the
 * local backend there, so if any operation reaches it, it means no worker is
 * available, which is a usage error we surface (via Promise.reject);
 *
 * The class only needs the methods LocalCurveBackend calls; it deliberately does
 * not import the compiled module, which is what keeps the wasm out of this build.
 */
const NO_LOCAL_WASM = "libomemo.js/worker-client runs no cryptography on the main thread: call " +
    "startWorker(url) with a reachable worker script before any OMEMO operation.";
class Curve25519 {
    createKeyPair() {
        return Promise.reject(new Error(NO_LOCAL_WASM));
    }
    ECDHE() {
        return Promise.reject(new Error(NO_LOCAL_WASM));
    }
    Ed25519Sign() {
        return Promise.reject(new Error(NO_LOCAL_WASM));
    }
    verifySignature() {
        return Promise.reject(new Error(NO_LOCAL_WASM));
    }
    curvePubKeyToEd25519PubKey() {
        return Promise.reject(new Error(NO_LOCAL_WASM));
    }
    ed25519PubKeyToCurvePubKey() {
        return Promise.reject(new Error(NO_LOCAL_WASM));
    }
}

var _LocalCurveBackend_instances, _LocalCurveBackend_curve, _LocalCurveBackend_get;
const webCrypto = globalThis.crypto;
if (!webCrypto || !webCrypto.subtle || typeof webCrypto.getRandomValues !== "function") {
    throw new Error("WebCrypto not found");
}
/** Generate cryptographically secure random bytes. */
function getRandomBytes(size) {
    const array = new Uint8Array(size);
    webCrypto.getRandomValues(array);
    return array.buffer;
}
/** AES-CBC encryption. */
async function encrypt(key, data, iv) {
    const algo = { name: "AES-CBC" };
    const importedKey = await webCrypto.subtle.importKey("raw", key, algo, false, ["encrypt"]);
    return webCrypto.subtle.encrypt({ ...algo, iv: new Uint8Array(iv) }, importedKey, data);
}
/** AES-CBC decryption. */
async function decrypt(key, data, iv) {
    const algo = { name: "AES-CBC" };
    const importedKey = await webCrypto.subtle.importKey("raw", key, algo, false, ["decrypt"]);
    return webCrypto.subtle.decrypt({ ...algo, iv: new Uint8Array(iv) }, importedKey, data);
}
/** HMAC-SHA256 signing. */
async function sign(key, data) {
    const importedKey = await webCrypto.subtle.importKey("raw", key, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
    return webCrypto.subtle.sign({ name: "HMAC", hash: "SHA-256" }, importedKey, data);
}
/** SHA-512 hash. */
function hash(data) {
    return webCrypto.subtle.digest({ name: "SHA-512" }, data);
}
/** HKDF key derivation producing three 32-byte keys. Internal implementation. */
async function HKDFInternal(input, salt, info) {
    const PRK = await sign(salt, input);
    const infoBuffer = new ArrayBuffer(info.byteLength + 1 + 32);
    const infoArray = new Uint8Array(infoBuffer);
    infoArray.set(new Uint8Array(info), 32);
    infoArray[infoArray.length - 1] = 1;
    const T1 = await sign(PRK, infoBuffer.slice(32));
    infoArray.set(new Uint8Array(T1));
    infoArray[infoArray.length - 1] = 2;
    const T2 = await sign(PRK, infoBuffer);
    infoArray.set(new Uint8Array(T2));
    infoArray[infoArray.length - 1] = 3;
    const T3 = await sign(PRK, infoBuffer);
    return [T1, T2, T3];
}
function HKDF(input, salt, info) {
    if (salt.byteLength !== 32) {
        throw new Error("Got salt of incorrect length");
    }
    const infoBuffer = typeof info === "string" ? util.toArrayBuffer(info) : info;
    return HKDFInternal(input, salt, infoBuffer);
}
async function verifyMAC(data, key, mac, length) {
    const calculatedMac = await sign(key, data);
    if (mac.byteLength !== length || calculatedMac.byteLength < length) {
        throw new Error("Bad MAC length");
    }
    const a = new Uint8Array(calculatedMac);
    const b = new Uint8Array(mac);
    let result = 0;
    for (let i = 0; i < mac.byteLength; ++i) {
        result |= a[i] ^ b[i];
    }
    if (result !== 0) {
        throw new Error("Bad MAC");
    }
}
/**
 * Runs the curve operations on the main thread via the compiled WebAssembly.
 * A single `Curve25519` instance is created lazily and reused, so we compile and
 * instantiate the wasm at most once for the lifetime of the backend (rather than
 * once per operation).
 */
class LocalCurveBackend {
    constructor() {
        _LocalCurveBackend_instances.add(this);
        _LocalCurveBackend_curve.set(this, void 0);
    }
    createKeyPair(privKey) {
        return __classPrivateFieldGet(this, _LocalCurveBackend_instances, "m", _LocalCurveBackend_get).call(this).createKeyPair(privKey);
    }
    ECDHE(pubKey, privKey) {
        return __classPrivateFieldGet(this, _LocalCurveBackend_instances, "m", _LocalCurveBackend_get).call(this).ECDHE(pubKey, privKey);
    }
    Ed25519Sign(privKey, message) {
        return __classPrivateFieldGet(this, _LocalCurveBackend_instances, "m", _LocalCurveBackend_get).call(this).Ed25519Sign(privKey, message);
    }
    Ed25519Verify(pubKey, msg, sig) {
        return __classPrivateFieldGet(this, _LocalCurveBackend_instances, "m", _LocalCurveBackend_get).call(this).verifySignature(pubKey, msg, sig);
    }
    curvePubKeyToEd25519PubKey(pubKey) {
        return __classPrivateFieldGet(this, _LocalCurveBackend_instances, "m", _LocalCurveBackend_get).call(this).curvePubKeyToEd25519PubKey(pubKey);
    }
    ed25519PubKeyToCurvePubKey(edPubKey) {
        return __classPrivateFieldGet(this, _LocalCurveBackend_instances, "m", _LocalCurveBackend_get).call(this).ed25519PubKeyToCurvePubKey(edPubKey);
    }
}
_LocalCurveBackend_curve = new WeakMap(), _LocalCurveBackend_instances = new WeakSet(), _LocalCurveBackend_get = function _LocalCurveBackend_get() {
    return (__classPrivateFieldSet(this, _LocalCurveBackend_curve, __classPrivateFieldGet(this, _LocalCurveBackend_curve, "f") ?? new Curve25519(), "f"));
};
// The default backend runs on the main thread. `startWorker()` swaps in a
// worker-backed one (see curve25519_worker_manager.ts); `stopWorker()` reverts.
const localBackend = new LocalCurveBackend();
let activeBackend = localBackend;
/** Route curve operations through `backend` (used by `startWorker`). */
function setCurveBackend(backend) {
    activeBackend = backend;
}
/** Revert curve operations to the main-thread backend (used by `stopWorker`). */
function resetCurveBackend() {
    activeBackend = localBackend;
}
/**
 * The main-thread backend. In the default build it runs the bundled wasm; in the
 * `worker-client` build it is a stub whose methods throw. A worker backend uses it
 * as its fallback target, so worker failures degrade to local wasm (default build)
 * or to a clear error (worker-client build).
 */
function getLocalCurveBackend() {
    return localBackend;
}
const internalCrypto = {
    createKeyPair(privKey) {
        return activeBackend.createKeyPair(privKey ?? getRandomBytes(32));
    },
    ECDHE(pubKey, privKey) {
        return activeBackend.ECDHE(pubKey, privKey);
    },
    Ed25519Sign(privKey, message) {
        return activeBackend.Ed25519Sign(privKey, message);
    },
    Ed25519Verify(pubKey, msg, sig) {
        return activeBackend.Ed25519Verify(pubKey, msg, sig);
    },
    curvePubKeyToEd25519PubKey(pubKey) {
        return activeBackend.curvePubKeyToEd25519PubKey(pubKey);
    },
    ed25519PubKeyToCurvePubKey(edPubKey) {
        return activeBackend.ed25519PubKeyToCurvePubKey(edPubKey);
    },
};
const curvePubKeyToEd25519PubKey = (pubKey) => internalCrypto.curvePubKeyToEd25519PubKey(pubKey);
const ed25519PubKeyToCurvePubKey = (edPubKey) => internalCrypto.ed25519PubKeyToCurvePubKey(edPubKey);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var indexMinimal = {};

var minimal$1 = {};

var aspromise;
var hasRequiredAspromise;

function requireAspromise () {
	if (hasRequiredAspromise) return aspromise;
	hasRequiredAspromise = 1;
	aspromise = asPromise;

	/**
	 * Callback as used by {@link util.asPromise}.
	 * @typedef asPromiseCallback
	 * @type {function}
	 * @param {Error|null} error Error, if any
	 * @param {...*} params Additional arguments
	 * @returns {undefined}
	 */

	/**
	 * Returns a promise from a node-style callback function.
	 * @memberof util
	 * @param {asPromiseCallback} fn Function to call
	 * @param {*} ctx Function context
	 * @param {...*} params Function arguments
	 * @returns {Promise<*>} Promisified function
	 */
	function asPromise(fn, ctx/*, varargs */) {
	    var params  = new Array(arguments.length - 1),
	        offset  = 0,
	        index   = 2,
	        pending = true;
	    while (index < arguments.length)
	        params[offset++] = arguments[index++];
	    return new Promise(function executor(resolve, reject) {
	        params[offset] = function callback(err/*, varargs */) {
	            if (pending) {
	                pending = false;
	                if (err)
	                    reject(err);
	                else {
	                    var params = new Array(arguments.length - 1),
	                        offset = 0;
	                    while (offset < params.length)
	                        params[offset++] = arguments[offset];
	                    resolve.apply(null, params);
	                }
	            }
	        };
	        try {
	            fn.apply(ctx || null, params);
	        } catch (err) {
	            if (pending) {
	                pending = false;
	                reject(err);
	            }
	        }
	    });
	}
	return aspromise;
}

var base64 = {};

var hasRequiredBase64;

function requireBase64 () {
	if (hasRequiredBase64) return base64;
	hasRequiredBase64 = 1;
	(function (exports) {

		/**
		 * A minimal base64 implementation for number arrays.
		 * @memberof util
		 * @namespace
		 */
		var base64 = exports;

		/**
		 * Calculates the byte length of a base64 encoded string.
		 * @param {string} string Base64 encoded string
		 * @returns {number} Byte length
		 */
		base64.length = function length(string) {
		    var p = string.length;
		    if (!p)
		        return 0;
		    while (p > 0 && string.charAt(p - 1) === "=")
		        --p;
		    return Math.floor(p * 3 / 4);
		};

		// Base64 encoding table
		var b64 = new Array(64);

		// Base64 decoding table
		var s64 = new Array(123);

		// 65..90, 97..122, 48..57, 43, 47
		for (var i = 0; i < 64;)
		    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

		s64[45] = 62; // - -> +
		s64[95] = 63; // _ -> /

		/**
		 * Encodes a buffer to a base64 encoded string.
		 * @param {Uint8Array} buffer Source buffer
		 * @param {number} start Source start
		 * @param {number} end Source end
		 * @returns {string} Base64 encoded string
		 */
		base64.encode = function encode(buffer, start, end) {
		    var parts = null,
		        chunk = [];
		    var i = 0, // output index
		        j = 0, // goto index
		        t;     // temporary
		    while (start < end) {
		        var b = buffer[start++];
		        switch (j) {
		            case 0:
		                chunk[i++] = b64[b >> 2];
		                t = (b & 3) << 4;
		                j = 1;
		                break;
		            case 1:
		                chunk[i++] = b64[t | b >> 4];
		                t = (b & 15) << 2;
		                j = 2;
		                break;
		            case 2:
		                chunk[i++] = b64[t | b >> 6];
		                chunk[i++] = b64[b & 63];
		                j = 0;
		                break;
		        }
		        if (i > 8191) {
		            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
		            i = 0;
		        }
		    }
		    if (j) {
		        chunk[i++] = b64[t];
		        chunk[i++] = 61;
		        if (j === 1)
		            chunk[i++] = 61;
		    }
		    if (parts) {
		        if (i)
		            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
		        return parts.join("");
		    }
		    return String.fromCharCode.apply(String, chunk.slice(0, i));
		};

		var invalidEncoding = "invalid encoding";

		/**
		 * Decodes a base64 encoded string to a buffer.
		 * @param {string} string Source string
		 * @param {Uint8Array} buffer Destination buffer
		 * @param {number} offset Destination offset
		 * @returns {number} Number of bytes written
		 * @throws {Error} If encoding is invalid
		 */
		base64.decode = function decode(string, buffer, offset) {
		    var start = offset;
		    var j = 0, // goto index
		        t;     // temporary
		    for (var i = 0; i < string.length;) {
		        var c = string.charCodeAt(i++);
		        if (c === 61 && j > 1)
		            break;
		        if ((c = s64[c]) === undefined)
		            throw Error(invalidEncoding);
		        switch (j) {
		            case 0:
		                t = c;
		                j = 1;
		                break;
		            case 1:
		                buffer[offset++] = t << 2 | (c & 48) >> 4;
		                t = c;
		                j = 2;
		                break;
		            case 2:
		                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
		                t = c;
		                j = 3;
		                break;
		            case 3:
		                buffer[offset++] = (t & 3) << 6 | c;
		                j = 0;
		                break;
		        }
		    }
		    if (j === 1)
		        throw Error(invalidEncoding);
		    return offset - start;
		};

		var base64Re = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
		    base64UrlRe = /[-_]/,
		    base64UrlNoPaddingRe = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2}(?:==)?|[A-Za-z0-9_-]{3}=?)?$/;

		/**
		 * Tests if the specified string appears to be base64 encoded.
		 * @param {string} string String to test
		 * @returns {boolean} `true` if probably base64 encoded, otherwise false
		 */
		base64.test = function test(string) {
		    return base64Re.test(string)
		        || base64UrlRe.test(string) && base64UrlNoPaddingRe.test(string);
		}; 
	} (base64));
	return base64;
}

var eventemitter;
var hasRequiredEventemitter;

function requireEventemitter () {
	if (hasRequiredEventemitter) return eventemitter;
	hasRequiredEventemitter = 1;
	eventemitter = EventEmitter;

	/**
	 * Constructs a new event emitter instance.
	 * @classdesc A minimal event emitter.
	 * @memberof util
	 * @constructor
	 */
	function EventEmitter() {

	    /**
	     * Registered listeners.
	     * @type {Object.<string,*>}
	     * @private
	     */
	    this._listeners = Object.create(null);
	}

	/**
	 * Event listener as used by {@link util.EventEmitter}.
	 * @typedef EventEmitterListener
	 * @type {function}
	 * @param {...*} args Arguments
	 * @returns {undefined}
	 */

	/**
	 * Registers an event listener.
	 * @param {string} evt Event name
	 * @param {EventEmitterListener} fn Listener
	 * @param {*} [ctx] Listener context
	 * @returns {this} `this`
	 */
	EventEmitter.prototype.on = function on(evt, fn, ctx) {
	    (this._listeners[evt] || (this._listeners[evt] = [])).push({
	        fn  : fn,
	        ctx : ctx || this
	    });
	    return this;
	};

	/**
	 * Removes an event listener or any matching listeners if arguments are omitted.
	 * @param {string} [evt] Event name. Removes all listeners if omitted.
	 * @param {EventEmitterListener} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
	 * @returns {this} `this`
	 */
	EventEmitter.prototype.off = function off(evt, fn) {
	    if (evt === undefined)
	        this._listeners = Object.create(null);
	    else {
	        if (fn === undefined)
	            this._listeners[evt] = [];
	        else {
	            var listeners = this._listeners[evt];
	            if (!listeners)
	                return this;
	            for (var i = 0; i < listeners.length;)
	                if (listeners[i].fn === fn)
	                    listeners.splice(i, 1);
	                else
	                    ++i;
	        }
	    }
	    return this;
	};

	/**
	 * Emits an event by calling its listeners with the specified arguments.
	 * @param {string} evt Event name
	 * @param {...*} args Arguments
	 * @returns {this} `this`
	 */
	EventEmitter.prototype.emit = function emit(evt) {
	    var listeners = this._listeners[evt];
	    if (listeners) {
	        var args = [],
	            i = 1;
	        for (; i < arguments.length;)
	            args.push(arguments[i++]);
	        for (i = 0; i < listeners.length;)
	            listeners[i].fn.apply(listeners[i++].ctx, args);
	    }
	    return this;
	};
	return eventemitter;
}

var float;
var hasRequiredFloat;

function requireFloat () {
	if (hasRequiredFloat) return float;
	hasRequiredFloat = 1;

	float = factory(factory);

	/**
	 * Reads / writes floats / doubles from / to buffers.
	 * @name util.float
	 * @namespace
	 */

	/**
	 * Writes a 32 bit float to a buffer using little endian byte order.
	 * @name util.float.writeFloatLE
	 * @function
	 * @param {number} val Value to write
	 * @param {Uint8Array} buf Target buffer
	 * @param {number} pos Target buffer offset
	 * @returns {undefined}
	 */

	/**
	 * Writes a 32 bit float to a buffer using big endian byte order.
	 * @name util.float.writeFloatBE
	 * @function
	 * @param {number} val Value to write
	 * @param {Uint8Array} buf Target buffer
	 * @param {number} pos Target buffer offset
	 * @returns {undefined}
	 */

	/**
	 * Reads a 32 bit float from a buffer using little endian byte order.
	 * @name util.float.readFloatLE
	 * @function
	 * @param {Uint8Array} buf Source buffer
	 * @param {number} pos Source buffer offset
	 * @returns {number} Value read
	 */

	/**
	 * Reads a 32 bit float from a buffer using big endian byte order.
	 * @name util.float.readFloatBE
	 * @function
	 * @param {Uint8Array} buf Source buffer
	 * @param {number} pos Source buffer offset
	 * @returns {number} Value read
	 */

	/**
	 * Writes a 64 bit double to a buffer using little endian byte order.
	 * @name util.float.writeDoubleLE
	 * @function
	 * @param {number} val Value to write
	 * @param {Uint8Array} buf Target buffer
	 * @param {number} pos Target buffer offset
	 * @returns {undefined}
	 */

	/**
	 * Writes a 64 bit double to a buffer using big endian byte order.
	 * @name util.float.writeDoubleBE
	 * @function
	 * @param {number} val Value to write
	 * @param {Uint8Array} buf Target buffer
	 * @param {number} pos Target buffer offset
	 * @returns {undefined}
	 */

	/**
	 * Reads a 64 bit double from a buffer using little endian byte order.
	 * @name util.float.readDoubleLE
	 * @function
	 * @param {Uint8Array} buf Source buffer
	 * @param {number} pos Source buffer offset
	 * @returns {number} Value read
	 */

	/**
	 * Reads a 64 bit double from a buffer using big endian byte order.
	 * @name util.float.readDoubleBE
	 * @function
	 * @param {Uint8Array} buf Source buffer
	 * @param {number} pos Source buffer offset
	 * @returns {number} Value read
	 */

	// Factory function for the purpose of node-based testing in modified global environments
	function factory(exports) {

	    // float: typed array
	    if (typeof Float32Array !== "undefined") (function() {

	        var f32 = new Float32Array([ -0 ]),
	            f8b = new Uint8Array(f32.buffer),
	            le  = f8b[3] === 128;

	        function writeFloat_f32_cpy(val, buf, pos) {
	            f32[0] = val;
	            buf[pos    ] = f8b[0];
	            buf[pos + 1] = f8b[1];
	            buf[pos + 2] = f8b[2];
	            buf[pos + 3] = f8b[3];
	        }

	        function writeFloat_f32_rev(val, buf, pos) {
	            f32[0] = val;
	            buf[pos    ] = f8b[3];
	            buf[pos + 1] = f8b[2];
	            buf[pos + 2] = f8b[1];
	            buf[pos + 3] = f8b[0];
	        }

	        /* istanbul ignore next */
	        exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
	        /* istanbul ignore next */
	        exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;

	        function readFloat_f32_cpy(buf, pos) {
	            f8b[0] = buf[pos    ];
	            f8b[1] = buf[pos + 1];
	            f8b[2] = buf[pos + 2];
	            f8b[3] = buf[pos + 3];
	            return f32[0];
	        }

	        function readFloat_f32_rev(buf, pos) {
	            f8b[3] = buf[pos    ];
	            f8b[2] = buf[pos + 1];
	            f8b[1] = buf[pos + 2];
	            f8b[0] = buf[pos + 3];
	            return f32[0];
	        }

	        /* istanbul ignore next */
	        exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
	        /* istanbul ignore next */
	        exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;

	    // float: ieee754
	    })(); else (function() {

	        function writeFloat_ieee754(writeUint, val, buf, pos) {
	            var sign = val < 0 ? 1 : 0;
	            if (sign)
	                val = -val;
	            if (val === 0)
	                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
	            else if (isNaN(val))
	                writeUint(2143289344, buf, pos);
	            else if (val > 3.4028234663852886e+38) // +-Infinity
	                writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
	            else if (val < 1.1754943508222875e-38) // denormal
	                writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
	            else {
	                var exponent = Math.floor(Math.log(val) / Math.LN2),
	                    mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
	                writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
	            }
	        }

	        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
	        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);

	        function readFloat_ieee754(readUint, buf, pos) {
	            var uint = readUint(buf, pos),
	                sign = (uint >> 31) * 2 + 1,
	                exponent = uint >>> 23 & 255,
	                mantissa = uint & 8388607;
	            return exponent === 255
	                ? mantissa
	                ? NaN
	                : sign * Infinity
	                : exponent === 0 // denormal
	                ? sign * 1.401298464324817e-45 * mantissa
	                : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
	        }

	        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
	        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);

	    })();

	    // double: typed array
	    if (typeof Float64Array !== "undefined") (function() {

	        var f64 = new Float64Array([-0]),
	            f8b = new Uint8Array(f64.buffer),
	            le  = f8b[7] === 128;

	        function writeDouble_f64_cpy(val, buf, pos) {
	            f64[0] = val;
	            buf[pos    ] = f8b[0];
	            buf[pos + 1] = f8b[1];
	            buf[pos + 2] = f8b[2];
	            buf[pos + 3] = f8b[3];
	            buf[pos + 4] = f8b[4];
	            buf[pos + 5] = f8b[5];
	            buf[pos + 6] = f8b[6];
	            buf[pos + 7] = f8b[7];
	        }

	        function writeDouble_f64_rev(val, buf, pos) {
	            f64[0] = val;
	            buf[pos    ] = f8b[7];
	            buf[pos + 1] = f8b[6];
	            buf[pos + 2] = f8b[5];
	            buf[pos + 3] = f8b[4];
	            buf[pos + 4] = f8b[3];
	            buf[pos + 5] = f8b[2];
	            buf[pos + 6] = f8b[1];
	            buf[pos + 7] = f8b[0];
	        }

	        /* istanbul ignore next */
	        exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
	        /* istanbul ignore next */
	        exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;

	        function readDouble_f64_cpy(buf, pos) {
	            f8b[0] = buf[pos    ];
	            f8b[1] = buf[pos + 1];
	            f8b[2] = buf[pos + 2];
	            f8b[3] = buf[pos + 3];
	            f8b[4] = buf[pos + 4];
	            f8b[5] = buf[pos + 5];
	            f8b[6] = buf[pos + 6];
	            f8b[7] = buf[pos + 7];
	            return f64[0];
	        }

	        function readDouble_f64_rev(buf, pos) {
	            f8b[7] = buf[pos    ];
	            f8b[6] = buf[pos + 1];
	            f8b[5] = buf[pos + 2];
	            f8b[4] = buf[pos + 3];
	            f8b[3] = buf[pos + 4];
	            f8b[2] = buf[pos + 5];
	            f8b[1] = buf[pos + 6];
	            f8b[0] = buf[pos + 7];
	            return f64[0];
	        }

	        /* istanbul ignore next */
	        exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
	        /* istanbul ignore next */
	        exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;

	    // double: ieee754
	    })(); else (function() {

	        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
	            var sign = val < 0 ? 1 : 0;
	            if (sign)
	                val = -val;
	            if (val === 0) {
	                writeUint(0, buf, pos + off0);
	                writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
	            } else if (isNaN(val)) {
	                writeUint(0, buf, pos + off0);
	                writeUint(2146959360, buf, pos + off1);
	            } else if (val > 1.7976931348623157e+308) { // +-Infinity
	                writeUint(0, buf, pos + off0);
	                writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
	            } else {
	                var mantissa;
	                if (val < 2.2250738585072014e-308) { // denormal
	                    mantissa = val / 5e-324;
	                    writeUint(mantissa >>> 0, buf, pos + off0);
	                    writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
	                } else {
	                    var exponent = Math.floor(Math.log(val) / Math.LN2);
	                    if (exponent === 1024)
	                        exponent = 1023;
	                    mantissa = val * Math.pow(2, -exponent);
	                    writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
	                    writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
	                }
	            }
	        }

	        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
	        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);

	        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
	            var lo = readUint(buf, pos + off0),
	                hi = readUint(buf, pos + off1);
	            var sign = (hi >> 31) * 2 + 1,
	                exponent = hi >>> 20 & 2047,
	                mantissa = 4294967296 * (hi & 1048575) + lo;
	            return exponent === 2047
	                ? mantissa
	                ? NaN
	                : sign * Infinity
	                : exponent === 0 // denormal
	                ? sign * 5e-324 * mantissa
	                : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
	        }

	        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
	        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);

	    })();

	    return exports;
	}

	// uint helpers

	function writeUintLE(val, buf, pos) {
	    buf[pos    ] =  val        & 255;
	    buf[pos + 1] =  val >>> 8  & 255;
	    buf[pos + 2] =  val >>> 16 & 255;
	    buf[pos + 3] =  val >>> 24;
	}

	function writeUintBE(val, buf, pos) {
	    buf[pos    ] =  val >>> 24;
	    buf[pos + 1] =  val >>> 16 & 255;
	    buf[pos + 2] =  val >>> 8  & 255;
	    buf[pos + 3] =  val        & 255;
	}

	function readUintLE(buf, pos) {
	    return (buf[pos    ]
	          | buf[pos + 1] << 8
	          | buf[pos + 2] << 16
	          | buf[pos + 3] << 24) >>> 0;
	}

	function readUintBE(buf, pos) {
	    return (buf[pos    ] << 24
	          | buf[pos + 1] << 16
	          | buf[pos + 2] << 8
	          | buf[pos + 3]) >>> 0;
	}
	return float;
}

var utf8 = {};

var hasRequiredUtf8;

function requireUtf8 () {
	if (hasRequiredUtf8) return utf8;
	hasRequiredUtf8 = 1;
	(function (exports) {

		/**
		 * A minimal UTF8 implementation.
		 * @memberof util
		 * @namespace
		 */
		var utf8 = exports,
		    replacementChar = "\ufffd",
		    looseDecoder = new TextDecoder("utf-8", { ignoreBOM: true }),
		    strictDecoder;
		var TEXT_DECODER_MIN_LENGTH = 64;

		try {
		    strictDecoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
		} catch (err) {
		    // "fatal" option is not supported on Node.js compiled without ICU
		    strictDecoder = looseDecoder;
		}

		/**
		 * Calculates the UTF8 byte length of a string.
		 * @param {string} string String
		 * @returns {number} Byte length
		 */
		utf8.length = function utf8_length(string) {
		    var len = 0,
		        c = 0;
		    for (var i = 0; i < string.length; ++i) {
		        c = string.charCodeAt(i);
		        if (c < 128)
		            len += 1;
		        else if (c < 2048)
		            len += 2;
		        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
		            ++i;
		            len += 4;
		        } else
		            len += 3;
		    }
		    return len;
		};

		function utf8_read_js(buffer, start, end, str) {
		    for (var i = start; i < end;) {
		        var t = buffer[i++];
		        if (t <= 0x7F) {
		            str += String.fromCharCode(t);
		        } else if (t >= 0xC0 && t < 0xE0) {
		            var c2 = (t & 0x1F) << 6 | buffer[i++] & 0x3F;
		            str += c2 >= 0x80 ? String.fromCharCode(c2) : replacementChar;
		        } else if (t >= 0xE0 && t < 0xF0) {
		            var c3 = (t & 0xF) << 12 | (buffer[i++] & 0x3F) << 6 | buffer[i++] & 0x3F;
		            str += c3 >= 0x800 ? String.fromCharCode(c3) : replacementChar;
		        } else if (t >= 0xF0) {
		            var t2 = (t & 7) << 18 | (buffer[i++] & 0x3F) << 12 | (buffer[i++] & 0x3F) << 6 | buffer[i++] & 0x3F;
		            if (t2 < 0x10000 || t2 > 0x10FFFF)
		                str += replacementChar;
		            else {
		                t2 -= 0x10000;
		                str += String.fromCharCode(0xD800 + (t2 >> 10));
		                str += String.fromCharCode(0xDC00 + (t2 & 0x3FF));
		            }
		        }
		    }
		    return str;
		}

		function utf8_read_decoder(decoder, buffer, start, end) {
		    var source = start === 0 && end === buffer.length
		        ? buffer
		        : buffer.subarray(start, end);
		    return decoder.decode(source);
		}

		/**
		 * Reads UTF8 bytes as a string.
		 * @param {Uint8Array} buffer Source buffer
		 * @param {number} start Source start
		 * @param {number} end Source end
		 * @returns {string} String read
		 */
		utf8.read = function utf8_read_loose(buffer, start, end) {
		    if (end - start < 1)
		        return "";
		    if (end - start >= TEXT_DECODER_MIN_LENGTH)
		        return utf8_read_decoder(looseDecoder, buffer, start, end);

		    var str = "",
		        i = start,
		        c1, c2, c3, c4, c5, c6, c7, c8;

		    for (; i + 7 < end; i += 8) {
		        c1 = buffer[i];
		        c2 = buffer[i + 1];
		        c3 = buffer[i + 2];
		        c4 = buffer[i + 3];
		        c5 = buffer[i + 4];
		        c6 = buffer[i + 5];
		        c7 = buffer[i + 6];
		        c8 = buffer[i + 7];
		        if ((c1 | c2 | c3 | c4 | c5 | c6 | c7 | c8) & 0x80)
		            return utf8_read_js(buffer, i, end, str);
		        str += String.fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8);
		    }

		    for (; i < end; ++i) {
		        c1 = buffer[i];
		        if (c1 & 0x80)
		            return utf8_read_js(buffer, i, end, str);
		        str += String.fromCharCode(c1);
		    }

		    return str;
		};

		/**
		 * Reads UTF8 bytes as a string, rejecting invalid UTF8.
		 * @param {Uint8Array} buffer Source buffer
		 * @param {number} start Source start
		 * @param {number} end Source end
		 * @returns {string} String read
		 */
		utf8.readStrict = function utf8_read_strict(buffer, start, end) {
		    if (end - start < 1)
		        return "";
		    if (end - start >= TEXT_DECODER_MIN_LENGTH)
		        return utf8_read_decoder(strictDecoder, buffer, start, end);

		    var str = "",
		        i = start,
		        c1, c2, c3, c4, c5, c6, c7, c8;

		    for (; i + 7 < end; i += 8) {
		        c1 = buffer[i];
		        c2 = buffer[i + 1];
		        c3 = buffer[i + 2];
		        c4 = buffer[i + 3];
		        c5 = buffer[i + 4];
		        c6 = buffer[i + 5];
		        c7 = buffer[i + 6];
		        c8 = buffer[i + 7];
		        if ((c1 | c2 | c3 | c4 | c5 | c6 | c7 | c8) & 0x80)
		            return str + utf8_read_decoder(strictDecoder, buffer, i, end);
		        str += String.fromCharCode(c1, c2, c3, c4, c5, c6, c7, c8);
		    }

		    for (; i < end; ++i) {
		        c1 = buffer[i];
		        if (c1 & 0x80)
		            return str + utf8_read_decoder(strictDecoder, buffer, i, end);
		        str += String.fromCharCode(c1);
		    }

		    return str;
		};

		/**
		 * Writes a string as UTF8 bytes.
		 * @param {string} string Source string
		 * @param {Uint8Array} buffer Destination buffer
		 * @param {number} offset Destination offset
		 * @returns {number} Bytes written
		 */
		utf8.write = function utf8_write(string, buffer, offset) {
		    var start = offset,
		        c1, // character 1
		        c2; // character 2
		    for (var i = 0; i < string.length; ++i) {
		        c1 = string.charCodeAt(i);
		        if (c1 < 128) {
		            buffer[offset++] = c1;
		        } else if (c1 < 2048) {
		            buffer[offset++] = c1 >> 6       | 192;
		            buffer[offset++] = c1       & 63 | 128;
		        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
		            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
		            ++i;
		            buffer[offset++] = c1 >> 18      | 240;
		            buffer[offset++] = c1 >> 12 & 63 | 128;
		            buffer[offset++] = c1 >> 6  & 63 | 128;
		            buffer[offset++] = c1       & 63 | 128;
		        } else {
		            buffer[offset++] = c1 >> 12      | 224;
		            buffer[offset++] = c1 >> 6  & 63 | 128;
		            buffer[offset++] = c1       & 63 | 128;
		        }
		    }
		    return offset - start;
		}; 
	} (utf8));
	return utf8;
}

var pool_1;
var hasRequiredPool;

function requirePool () {
	if (hasRequiredPool) return pool_1;
	hasRequiredPool = 1;
	pool_1 = pool;

	/**
	 * An allocator as used by {@link util.pool}.
	 * @typedef PoolAllocator
	 * @type {function}
	 * @param {number} size Buffer size
	 * @returns {Uint8Array} Buffer
	 */

	/**
	 * A slicer as used by {@link util.pool}.
	 * @typedef PoolSlicer
	 * @type {function}
	 * @param {number} start Start offset
	 * @param {number} end End offset
	 * @returns {Uint8Array} Buffer slice
	 * @this Uint8Array
	 */

	/**
	 * A general purpose buffer pool.
	 * @memberof util
	 * @function
	 * @param {PoolAllocator} alloc Allocator
	 * @param {PoolSlicer} slice Slicer
	 * @param {number} [size=8192] Slab size
	 * @returns {PoolAllocator} Pooled allocator
	 */
	function pool(alloc, slice, size) {
	    var SIZE   = size || 8192;
	    var MAX    = SIZE >>> 1;
	    var slab   = null;
	    var offset = SIZE;
	    return function pool_alloc(size) {
	        if (size < 1 || size > MAX)
	            return alloc(size);
	        if (offset + size > SIZE) {
	            slab = alloc(SIZE);
	            offset = 0;
	        }
	        var buf = slice.call(slab, offset, offset += size);
	        if (offset & 7) // align to 32 bit
	            offset = (offset | 7) + 1;
	        return buf;
	    };
	}
	return pool_1;
}

var longbits;
var hasRequiredLongbits;

function requireLongbits () {
	if (hasRequiredLongbits) return longbits;
	hasRequiredLongbits = 1;
	longbits = LongBits;

	var Long;

	/**
	 * Constructs new long bits.
	 * @classdesc Helper class for working with the low and high bits of a 64 bit value.
	 * @memberof util
	 * @constructor
	 * @param {number} lo Low 32 bits, unsigned
	 * @param {number} hi High 32 bits, unsigned
	 */
	function LongBits(lo, hi) {

	    // note that the casts below are theoretically unnecessary as of today, but older statically
	    // generated converter code might still call the ctor with signed 32bits. kept for compat.

	    /**
	     * Low bits.
	     * @type {number}
	     */
	    this.lo = lo >>> 0;

	    /**
	     * High bits.
	     * @type {number}
	     */
	    this.hi = hi >>> 0;
	}

	/**
	 * Zero bits.
	 * @memberof util.LongBits
	 * @type {util.LongBits}
	 */
	var zero = LongBits.zero = new LongBits(0, 0);

	zero.toNumber = function() { return 0; };
	zero.zzEncode = zero.zzDecode = function() { return this; };
	zero.length = function() { return 1; };

	/**
	 * Zero hash.
	 * @memberof util.LongBits
	 * @type {string}
	 */
	var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

	/**
	 * Constructs new long bits from the specified number.
	 * @param {number} value Value
	 * @returns {util.LongBits} Instance
	 */
	LongBits.fromNumber = function fromNumber(value) {
	    if (value === 0)
	        return zero;
	    var sign = value < 0;
	    if (sign)
	        value = -value;
	    var lo = value >>> 0,
	        hi = (value - lo) / 4294967296 >>> 0;
	    if (sign) {
	        hi = ~hi >>> 0;
	        lo = ~lo >>> 0;
	        if (++lo > 4294967295) {
	            lo = 0;
	            if (++hi > 4294967295)
	                hi = 0;
	        }
	    }
	    return new LongBits(lo, hi);
	};

	/**
	 * Constructs new long bits from a number, long or string.
	 * @param {Long|number|string} value Value
	 * @returns {util.LongBits} Instance
	 */
	LongBits.from = function from(value) {
	    if (typeof value === "number")
	        return LongBits.fromNumber(value);
	    if (typeof value === "string" || value instanceof String) {
	        /* istanbul ignore else */
	        if (Long)
	            value = Long.fromString(value);
	        else
	            return LongBits.fromNumber(parseInt(value, 10));
	    }
	    return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
	};

	/**
	 * Converts this long bits to a possibly unsafe JavaScript number.
	 * @param {boolean} [unsigned=false] Whether unsigned or not
	 * @returns {number} Possibly unsafe number
	 */
	LongBits.prototype.toNumber = function toNumber(unsigned) {
	    if (!unsigned && this.hi >>> 31) {
	        var lo = ~this.lo + 1 >>> 0,
	            hi = ~this.hi     >>> 0;
	        if (!lo)
	            hi = hi + 1 >>> 0;
	        return -(lo + hi * 4294967296);
	    }
	    return this.lo + this.hi * 4294967296;
	};

	/**
	 * Converts this long bits to a long.
	 * @param {boolean} [unsigned=false] Whether unsigned or not
	 * @returns {Long} Long
	 */
	LongBits.prototype.toLong = function toLong(unsigned) {
	    return Long
	        ? new Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
	        /* istanbul ignore next */
	        : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
	};

	var charCodeAt = String.prototype.charCodeAt;

	/**
	 * Constructs new long bits from the specified 8 characters long hash.
	 * @param {string} hash Hash
	 * @returns {util.LongBits} Bits
	 */
	LongBits.fromHash = function fromHash(hash) {
	    if (hash === zeroHash)
	        return zero;
	    return new LongBits(
	        ( charCodeAt.call(hash, 0)
	        | charCodeAt.call(hash, 1) << 8
	        | charCodeAt.call(hash, 2) << 16
	        | charCodeAt.call(hash, 3) << 24) >>> 0
	    ,
	        ( charCodeAt.call(hash, 4)
	        | charCodeAt.call(hash, 5) << 8
	        | charCodeAt.call(hash, 6) << 16
	        | charCodeAt.call(hash, 7) << 24) >>> 0
	    );
	};

	/**
	 * Converts this long bits to a 8 characters long hash.
	 * @returns {string} Hash
	 */
	LongBits.prototype.toHash = function toHash() {
	    return String.fromCharCode(
	        this.lo        & 255,
	        this.lo >>> 8  & 255,
	        this.lo >>> 16 & 255,
	        this.lo >>> 24      ,
	        this.hi        & 255,
	        this.hi >>> 8  & 255,
	        this.hi >>> 16 & 255,
	        this.hi >>> 24
	    );
	};

	/**
	 * Zig-zag encodes this long bits.
	 * @returns {util.LongBits} `this`
	 */
	LongBits.prototype.zzEncode = function zzEncode() {
	    var mask =   this.hi >> 31;
	    this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
	    this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
	    return this;
	};

	/**
	 * Zig-zag decodes this long bits.
	 * @returns {util.LongBits} `this`
	 */
	LongBits.prototype.zzDecode = function zzDecode() {
	    var mask = -(this.lo & 1);
	    this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
	    this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
	    return this;
	};

	/**
	 * Calculates the length of this longbits when encoded as a varint.
	 * @returns {number} Length
	 */
	LongBits.prototype.length = function length() {
	    var part0 =  this.lo,
	        part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
	        part2 =  this.hi >>> 24;
	    return part2 === 0
	         ? part1 === 0
	           ? part0 < 16384
	             ? part0 < 128 ? 1 : 2
	             : part0 < 2097152 ? 3 : 4
	           : part1 < 16384
	             ? part1 < 128 ? 5 : 6
	             : part1 < 2097152 ? 7 : 8
	         : part2 < 128 ? 9 : 10;
	};

	LongBits._configure = function(Long_) {
	    Long = Long_;
	};
	return longbits;
}

var umd$1 = {exports: {}};

var umd = umd$1.exports;

var hasRequiredUmd;

function requireUmd () {
	if (hasRequiredUmd) return umd$1.exports;
	hasRequiredUmd = 1;
	(function (module, exports) {
		// GENERATED FILE. DO NOT EDIT.
		(function (global, factory) {
		  function preferDefault(exports) {
		    return exports.default || exports;
		  }
		  {
		    factory(exports);
		    module.exports = preferDefault(exports);
		  }
		})(
		  typeof globalThis !== "undefined"
		    ? globalThis
		    : typeof self !== "undefined"
		      ? self
		      : umd,
		  function (_exports) {

		    Object.defineProperty(_exports, "__esModule", {
		      value: true,
		    });
		    _exports.default = void 0;
		    /**
		     * @license
		     * Copyright 2009 The Closure Library Authors
		     * Copyright 2020 Daniel Wirtz / The long.js Authors.
		     *
		     * Licensed under the Apache License, Version 2.0 (the "License");
		     * you may not use this file except in compliance with the License.
		     * You may obtain a copy of the License at
		     *
		     *     http://www.apache.org/licenses/LICENSE-2.0
		     *
		     * Unless required by applicable law or agreed to in writing, software
		     * distributed under the License is distributed on an "AS IS" BASIS,
		     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		     * See the License for the specific language governing permissions and
		     * limitations under the License.
		     *
		     * SPDX-License-Identifier: Apache-2.0
		     */

		    // WebAssembly optimizations to do native i64 multiplication and divide
		    var wasm = null;
		    try {
		      wasm = new WebAssembly.Instance(
		        new WebAssembly.Module(
		          new Uint8Array([
		            // \0asm
		            0, 97, 115, 109,
		            // version 1
		            1, 0, 0, 0,
		            // section "type"
		            1, 13, 2,
		            // 0, () => i32
		            96, 0, 1, 127,
		            // 1, (i32, i32, i32, i32) => i32
		            96, 4, 127, 127, 127, 127, 1, 127,
		            // section "function"
		            3, 7, 6,
		            // 0, type 0
		            0,
		            // 1, type 1
		            1,
		            // 2, type 1
		            1,
		            // 3, type 1
		            1,
		            // 4, type 1
		            1,
		            // 5, type 1
		            1,
		            // section "global"
		            6, 6, 1,
		            // 0, "high", mutable i32
		            127, 1, 65, 0, 11,
		            // section "export"
		            7, 50, 6,
		            // 0, "mul"
		            3, 109, 117, 108, 0, 1,
		            // 1, "div_s"
		            5, 100, 105, 118, 95, 115, 0, 2,
		            // 2, "div_u"
		            5, 100, 105, 118, 95, 117, 0, 3,
		            // 3, "rem_s"
		            5, 114, 101, 109, 95, 115, 0, 4,
		            // 4, "rem_u"
		            5, 114, 101, 109, 95, 117, 0, 5,
		            // 5, "get_high"
		            8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0,
		            // section "code"
		            10, 191, 1, 6,
		            // 0, "get_high"
		            4, 0, 35, 0, 11,
		            // 1, "mul"
		            36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173,
		            32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0,
		            32, 4, 167, 11,
		            // 2, "div_s"
		            36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173,
		            32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0,
		            32, 4, 167, 11,
		            // 3, "div_u"
		            36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173,
		            32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0,
		            32, 4, 167, 11,
		            // 4, "rem_s"
		            36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173,
		            32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0,
		            32, 4, 167, 11,
		            // 5, "rem_u"
		            36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173,
		            32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0,
		            32, 4, 167, 11,
		          ]),
		        ),
		        {},
		      ).exports;
		    } catch {
		      // no wasm support :(
		    }

		    /**
		     * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
		     *  See the from* functions below for more convenient ways of constructing Longs.
		     * @exports Long
		     * @class A Long class for representing a 64 bit two's-complement integer value.
		     * @param {number} low The low (signed) 32 bits of the long
		     * @param {number} high The high (signed) 32 bits of the long
		     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		     * @constructor
		     */
		    function Long(low, high, unsigned) {
		      /**
		       * The low 32 bits as a signed value.
		       * @type {number}
		       */
		      this.low = low | 0;

		      /**
		       * The high 32 bits as a signed value.
		       * @type {number}
		       */
		      this.high = high | 0;

		      /**
		       * Whether unsigned or not.
		       * @type {boolean}
		       */
		      this.unsigned = !!unsigned;
		    }

		    // The internal representation of a long is the two given signed, 32-bit values.
		    // We use 32-bit pieces because these are the size of integers on which
		    // Javascript performs bit-operations.  For operations like addition and
		    // multiplication, we split each number into 16 bit pieces, which can easily be
		    // multiplied within Javascript's floating-point representation without overflow
		    // or change in sign.
		    //
		    // In the algorithms below, we frequently reduce the negative case to the
		    // positive case by negating the input(s) and then post-processing the result.
		    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
		    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
		    // a positive number, it overflows back into a negative).  Not handling this
		    // case would often result in infinite recursion.
		    //
		    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
		    // methods on which they depend.

		    /**
		     * An indicator used to reliably determine if an object is a Long or not.
		     * @type {boolean}
		     * @const
		     * @private
		     */
		    Long.prototype.__isLong__;
		    Object.defineProperty(Long.prototype, "__isLong__", {
		      value: true,
		    });

		    /**
		     * @function
		     * @param {*} obj Object
		     * @returns {boolean}
		     * @inner
		     */
		    function isLong(obj) {
		      return (obj && obj["__isLong__"]) === true;
		    }

		    /**
		     * @function
		     * @param {*} value number
		     * @returns {number}
		     * @inner
		     */
		    function ctz32(value) {
		      var c = Math.clz32(value & -value);
		      return value ? 31 - c : c;
		    }

		    /**
		     * Tests if the specified object is a Long.
		     * @function
		     * @param {*} obj Object
		     * @returns {boolean}
		     */
		    Long.isLong = isLong;

		    /**
		     * A cache of the Long representations of small integer values.
		     * @type {!Object}
		     * @inner
		     */
		    var INT_CACHE = {};

		    /**
		     * A cache of the Long representations of small unsigned integer values.
		     * @type {!Object}
		     * @inner
		     */
		    var UINT_CACHE = {};

		    /**
		     * @param {number} value
		     * @param {boolean=} unsigned
		     * @returns {!Long}
		     * @inner
		     */
		    function fromInt(value, unsigned) {
		      var obj, cachedObj, cache;
		      if (unsigned) {
		        value >>>= 0;
		        if ((cache = 0 <= value && value < 256)) {
		          cachedObj = UINT_CACHE[value];
		          if (cachedObj) return cachedObj;
		        }
		        obj = fromBits(value, 0, true);
		        if (cache) UINT_CACHE[value] = obj;
		        return obj;
		      } else {
		        value |= 0;
		        if ((cache = -128 <= value && value < 128)) {
		          cachedObj = INT_CACHE[value];
		          if (cachedObj) return cachedObj;
		        }
		        obj = fromBits(value, value < 0 ? -1 : 0, false);
		        if (cache) INT_CACHE[value] = obj;
		        return obj;
		      }
		    }

		    /**
		     * Returns a Long representing the given 32 bit integer value.
		     * @function
		     * @param {number} value The 32 bit integer in question
		     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		     * @returns {!Long} The corresponding Long value
		     */
		    Long.fromInt = fromInt;

		    /**
		     * @param {number} value
		     * @param {boolean=} unsigned
		     * @returns {!Long}
		     * @inner
		     */
		    function fromNumber(value, unsigned) {
		      if (isNaN(value)) return unsigned ? UZERO : ZERO;
		      if (unsigned) {
		        if (value < 0) return UZERO;
		        if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
		      } else {
		        if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
		        if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
		      }
		      if (value < 0) return fromNumber(-value, unsigned).neg();
		      return fromBits(
		        value % TWO_PWR_32_DBL | 0,
		        (value / TWO_PWR_32_DBL) | 0,
		        unsigned,
		      );
		    }

		    /**
		     * Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
		     * @function
		     * @param {number} value The number in question
		     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		     * @returns {!Long} The corresponding Long value
		     */
		    Long.fromNumber = fromNumber;

		    /**
		     * @param {number} lowBits
		     * @param {number} highBits
		     * @param {boolean=} unsigned
		     * @returns {!Long}
		     * @inner
		     */
		    function fromBits(lowBits, highBits, unsigned) {
		      return new Long(lowBits, highBits, unsigned);
		    }

		    /**
		     * Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
		     *  assumed to use 32 bits.
		     * @function
		     * @param {number} lowBits The low 32 bits
		     * @param {number} highBits The high 32 bits
		     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		     * @returns {!Long} The corresponding Long value
		     */
		    Long.fromBits = fromBits;

		    /**
		     * @function
		     * @param {number} base
		     * @param {number} exponent
		     * @returns {number}
		     * @inner
		     */
		    var pow_dbl = Math.pow; // Used 4 times (4*8 to 15+4)

		    /**
		     * @param {string} str
		     * @param {(boolean|number)=} unsigned
		     * @param {number=} radix
		     * @returns {!Long}
		     * @inner
		     */
		    function fromString(str, unsigned, radix) {
		      if (str.length === 0) throw Error("empty string");
		      if (typeof unsigned === "number") {
		        // For goog.math.long compatibility
		        radix = unsigned;
		        unsigned = false;
		      } else {
		        unsigned = !!unsigned;
		      }
		      if (
		        str === "NaN" ||
		        str === "Infinity" ||
		        str === "+Infinity" ||
		        str === "-Infinity"
		      )
		        return unsigned ? UZERO : ZERO;
		      radix = radix || 10;
		      if (radix < 2 || 36 < radix) throw RangeError("radix");
		      var p;
		      if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
		      else if (p === 0) {
		        return fromString(str.substring(1), unsigned, radix).neg();
		      }

		      // Do several (8) digits each time through the loop, so as to
		      // minimize the calls to the very expensive emulated div.
		      var radixToPower = fromNumber(pow_dbl(radix, 8));
		      var result = ZERO;
		      for (var i = 0; i < str.length; i += 8) {
		        var size = Math.min(8, str.length - i),
		          value = parseInt(str.substring(i, i + size), radix);
		        if (size < 8) {
		          var power = fromNumber(pow_dbl(radix, size));
		          result = result.mul(power).add(fromNumber(value));
		        } else {
		          result = result.mul(radixToPower);
		          result = result.add(fromNumber(value));
		        }
		      }
		      result.unsigned = unsigned;
		      return result;
		    }

		    /**
		     * Returns a Long representation of the given string, written using the specified radix.
		     * @function
		     * @param {string} str The textual representation of the Long
		     * @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
		     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
		     * @returns {!Long} The corresponding Long value
		     */
		    Long.fromString = fromString;

		    /**
		     * @function
		     * @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
		     * @param {boolean=} unsigned
		     * @returns {!Long}
		     * @inner
		     */
		    function fromValue(val, unsigned) {
		      if (typeof val === "number") return fromNumber(val, unsigned);
		      if (typeof val === "string") return fromString(val, unsigned);
		      // Throws for non-objects, converts non-instanceof Long:
		      return fromBits(
		        val.low,
		        val.high,
		        typeof unsigned === "boolean" ? unsigned : val.unsigned,
		      );
		    }

		    /**
		     * Converts the specified value to a Long using the appropriate from* function for its type.
		     * @function
		     * @param {!Long|number|bigint|string|!{low: number, high: number, unsigned: boolean}} val Value
		     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		     * @returns {!Long}
		     */
		    Long.fromValue = fromValue;

		    // NOTE: the compiler should inline these constant values below and then remove these variables, so there should be
		    // no runtime penalty for these.

		    /**
		     * @type {number}
		     * @const
		     * @inner
		     */
		    var TWO_PWR_16_DBL = 1 << 16;

		    /**
		     * @type {number}
		     * @const
		     * @inner
		     */
		    var TWO_PWR_24_DBL = 1 << 24;

		    /**
		     * @type {number}
		     * @const
		     * @inner
		     */
		    var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;

		    /**
		     * @type {number}
		     * @const
		     * @inner
		     */
		    var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;

		    /**
		     * @type {number}
		     * @const
		     * @inner
		     */
		    var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;

		    /**
		     * @type {!Long}
		     * @const
		     * @inner
		     */
		    var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

		    /**
		     * @type {!Long}
		     * @inner
		     */
		    var ZERO = fromInt(0);

		    /**
		     * Signed zero.
		     * @type {!Long}
		     */
		    Long.ZERO = ZERO;

		    /**
		     * @type {!Long}
		     * @inner
		     */
		    var UZERO = fromInt(0, true);

		    /**
		     * Unsigned zero.
		     * @type {!Long}
		     */
		    Long.UZERO = UZERO;

		    /**
		     * @type {!Long}
		     * @inner
		     */
		    var ONE = fromInt(1);

		    /**
		     * Signed one.
		     * @type {!Long}
		     */
		    Long.ONE = ONE;

		    /**
		     * @type {!Long}
		     * @inner
		     */
		    var UONE = fromInt(1, true);

		    /**
		     * Unsigned one.
		     * @type {!Long}
		     */
		    Long.UONE = UONE;

		    /**
		     * @type {!Long}
		     * @inner
		     */
		    var NEG_ONE = fromInt(-1);

		    /**
		     * Signed negative one.
		     * @type {!Long}
		     */
		    Long.NEG_ONE = NEG_ONE;

		    /**
		     * @type {!Long}
		     * @inner
		     */
		    var MAX_VALUE = fromBits(0xffffffff | 0, 0x7fffffff | 0, false);

		    /**
		     * Maximum signed value.
		     * @type {!Long}
		     */
		    Long.MAX_VALUE = MAX_VALUE;

		    /**
		     * @type {!Long}
		     * @inner
		     */
		    var MAX_UNSIGNED_VALUE = fromBits(0xffffffff | 0, 0xffffffff | 0, true);

		    /**
		     * Maximum unsigned value.
		     * @type {!Long}
		     */
		    Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

		    /**
		     * @type {!Long}
		     * @inner
		     */
		    var MIN_VALUE = fromBits(0, 0x80000000 | 0, false);

		    /**
		     * Minimum signed value.
		     * @type {!Long}
		     */
		    Long.MIN_VALUE = MIN_VALUE;

		    /**
		     * @alias Long.prototype
		     * @inner
		     */
		    var LongPrototype = Long.prototype;

		    /**
		     * Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
		     * @this {!Long}
		     * @returns {number}
		     */
		    LongPrototype.toInt = function toInt() {
		      return this.unsigned ? this.low >>> 0 : this.low;
		    };

		    /**
		     * Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
		     * @this {!Long}
		     * @returns {number}
		     */
		    LongPrototype.toNumber = function toNumber() {
		      if (this.unsigned)
		        return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
		      return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
		    };

		    /**
		     * Converts the Long to a string written in the specified radix.
		     * @this {!Long}
		     * @param {number=} radix Radix (2-36), defaults to 10
		     * @returns {string}
		     * @override
		     * @throws {RangeError} If `radix` is out of range
		     */
		    LongPrototype.toString = function toString(radix) {
		      radix = radix || 10;
		      if (radix < 2 || 36 < radix) throw RangeError("radix");
		      if (this.isZero()) return "0";
		      if (this.isNegative()) {
		        // Unsigned Longs are never negative
		        if (this.eq(MIN_VALUE)) {
		          // We need to change the Long value before it can be negated, so we remove
		          // the bottom-most digit in this base and then recurse to do the rest.
		          var radixLong = fromNumber(radix),
		            div = this.div(radixLong),
		            rem1 = div.mul(radixLong).sub(this);
		          return div.toString(radix) + rem1.toInt().toString(radix);
		        } else return "-" + this.neg().toString(radix);
		      }

		      // Do several (6) digits each time through the loop, so as to
		      // minimize the calls to the very expensive emulated div.
		      var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned),
		        rem = this;
		      var result = "";
		      while (true) {
		        var remDiv = rem.div(radixToPower),
		          intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0,
		          digits = intval.toString(radix);
		        rem = remDiv;
		        if (rem.isZero()) return digits + result;
		        else {
		          while (digits.length < 6) digits = "0" + digits;
		          result = "" + digits + result;
		        }
		      }
		    };

		    /**
		     * Gets the high 32 bits as a signed integer.
		     * @this {!Long}
		     * @returns {number} Signed high bits
		     */
		    LongPrototype.getHighBits = function getHighBits() {
		      return this.high;
		    };

		    /**
		     * Gets the high 32 bits as an unsigned integer.
		     * @this {!Long}
		     * @returns {number} Unsigned high bits
		     */
		    LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
		      return this.high >>> 0;
		    };

		    /**
		     * Gets the low 32 bits as a signed integer.
		     * @this {!Long}
		     * @returns {number} Signed low bits
		     */
		    LongPrototype.getLowBits = function getLowBits() {
		      return this.low;
		    };

		    /**
		     * Gets the low 32 bits as an unsigned integer.
		     * @this {!Long}
		     * @returns {number} Unsigned low bits
		     */
		    LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
		      return this.low >>> 0;
		    };

		    /**
		     * Gets the number of bits needed to represent the absolute value of this Long.
		     * @this {!Long}
		     * @returns {number}
		     */
		    LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
		      if (this.isNegative())
		        // Unsigned Longs are never negative
		        return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
		      var val = this.high != 0 ? this.high : this.low;
		      for (var bit = 31; bit > 0; bit--) if ((val & (1 << bit)) != 0) break;
		      return this.high != 0 ? bit + 33 : bit + 1;
		    };

		    /**
		     * Tests if this Long can be safely represented as a JavaScript number.
		     * @this {!Long}
		     * @returns {boolean}
		     */
		    LongPrototype.isSafeInteger = function isSafeInteger() {
		      // 2^53-1 is the maximum safe value
		      var top11Bits = this.high >> 21;
		      // [0, 2^53-1]
		      if (!top11Bits) return true;
		      // > 2^53-1
		      if (this.unsigned) return false;
		      // [-2^53, -1] except -2^53
		      return top11Bits === -1 && !(this.low === 0 && this.high === -2097152);
		    };

		    /**
		     * Tests if this Long's value equals zero.
		     * @this {!Long}
		     * @returns {boolean}
		     */
		    LongPrototype.isZero = function isZero() {
		      return this.high === 0 && this.low === 0;
		    };

		    /**
		     * Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
		     * @returns {boolean}
		     */
		    LongPrototype.eqz = LongPrototype.isZero;

		    /**
		     * Tests if this Long's value is negative.
		     * @this {!Long}
		     * @returns {boolean}
		     */
		    LongPrototype.isNegative = function isNegative() {
		      return !this.unsigned && this.high < 0;
		    };

		    /**
		     * Tests if this Long's value is positive or zero.
		     * @this {!Long}
		     * @returns {boolean}
		     */
		    LongPrototype.isPositive = function isPositive() {
		      return this.unsigned || this.high >= 0;
		    };

		    /**
		     * Tests if this Long's value is odd.
		     * @this {!Long}
		     * @returns {boolean}
		     */
		    LongPrototype.isOdd = function isOdd() {
		      return (this.low & 1) === 1;
		    };

		    /**
		     * Tests if this Long's value is even.
		     * @this {!Long}
		     * @returns {boolean}
		     */
		    LongPrototype.isEven = function isEven() {
		      return (this.low & 1) === 0;
		    };

		    /**
		     * Tests if this Long's value equals the specified's.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.equals = function equals(other) {
		      if (!isLong(other)) other = fromValue(other);
		      if (
		        this.unsigned !== other.unsigned &&
		        this.high >>> 31 === 1 &&
		        other.high >>> 31 === 1
		      )
		        return false;
		      return this.high === other.high && this.low === other.low;
		    };

		    /**
		     * Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
		     * @function
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.eq = LongPrototype.equals;

		    /**
		     * Tests if this Long's value differs from the specified's.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.notEquals = function notEquals(other) {
		      return !this.eq(/* validates */ other);
		    };

		    /**
		     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
		     * @function
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.neq = LongPrototype.notEquals;

		    /**
		     * Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
		     * @function
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.ne = LongPrototype.notEquals;

		    /**
		     * Tests if this Long's value is less than the specified's.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.lessThan = function lessThan(other) {
		      return this.comp(/* validates */ other) < 0;
		    };

		    /**
		     * Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
		     * @function
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.lt = LongPrototype.lessThan;

		    /**
		     * Tests if this Long's value is less than or equal the specified's.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
		      return this.comp(/* validates */ other) <= 0;
		    };

		    /**
		     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
		     * @function
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.lte = LongPrototype.lessThanOrEqual;

		    /**
		     * Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
		     * @function
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.le = LongPrototype.lessThanOrEqual;

		    /**
		     * Tests if this Long's value is greater than the specified's.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.greaterThan = function greaterThan(other) {
		      return this.comp(/* validates */ other) > 0;
		    };

		    /**
		     * Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
		     * @function
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.gt = LongPrototype.greaterThan;

		    /**
		     * Tests if this Long's value is greater than or equal the specified's.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
		      return this.comp(/* validates */ other) >= 0;
		    };

		    /**
		     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
		     * @function
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.gte = LongPrototype.greaterThanOrEqual;

		    /**
		     * Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
		     * @function
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {boolean}
		     */
		    LongPrototype.ge = LongPrototype.greaterThanOrEqual;

		    /**
		     * Compares this Long's value with the specified's.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
		     *  if the given one is greater
		     */
		    LongPrototype.compare = function compare(other) {
		      if (!isLong(other)) other = fromValue(other);
		      if (this.eq(other)) return 0;
		      var thisNeg = this.isNegative(),
		        otherNeg = other.isNegative();
		      if (thisNeg && !otherNeg) return -1;
		      if (!thisNeg && otherNeg) return 1;
		      // At this point the sign bits are the same
		      if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
		      // Both are positive if at least one is unsigned
		      return other.high >>> 0 > this.high >>> 0 ||
		        (other.high === this.high && other.low >>> 0 > this.low >>> 0)
		        ? -1
		        : 1;
		    };

		    /**
		     * Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
		     * @function
		     * @param {!Long|number|bigint|string} other Other value
		     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
		     *  if the given one is greater
		     */
		    LongPrototype.comp = LongPrototype.compare;

		    /**
		     * Negates this Long's value.
		     * @this {!Long}
		     * @returns {!Long} Negated Long
		     */
		    LongPrototype.negate = function negate() {
		      if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
		      return this.not().add(ONE);
		    };

		    /**
		     * Negates this Long's value. This is an alias of {@link Long#negate}.
		     * @function
		     * @returns {!Long} Negated Long
		     */
		    LongPrototype.neg = LongPrototype.negate;

		    /**
		     * Returns the sum of this and the specified Long.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} addend Addend
		     * @returns {!Long} Sum
		     */
		    LongPrototype.add = function add(addend) {
		      if (!isLong(addend)) addend = fromValue(addend);

		      // Divide each number into 4 chunks of 16 bits, and then sum the chunks.

		      var a48 = this.high >>> 16;
		      var a32 = this.high & 0xffff;
		      var a16 = this.low >>> 16;
		      var a00 = this.low & 0xffff;
		      var b48 = addend.high >>> 16;
		      var b32 = addend.high & 0xffff;
		      var b16 = addend.low >>> 16;
		      var b00 = addend.low & 0xffff;
		      var c48 = 0,
		        c32 = 0,
		        c16 = 0,
		        c00 = 0;
		      c00 += a00 + b00;
		      c16 += c00 >>> 16;
		      c00 &= 0xffff;
		      c16 += a16 + b16;
		      c32 += c16 >>> 16;
		      c16 &= 0xffff;
		      c32 += a32 + b32;
		      c48 += c32 >>> 16;
		      c32 &= 0xffff;
		      c48 += a48 + b48;
		      c48 &= 0xffff;
		      return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
		    };

		    /**
		     * Returns the difference of this and the specified Long.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} subtrahend Subtrahend
		     * @returns {!Long} Difference
		     */
		    LongPrototype.subtract = function subtract(subtrahend) {
		      if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
		      return this.add(subtrahend.neg());
		    };

		    /**
		     * Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
		     * @function
		     * @param {!Long|number|bigint|string} subtrahend Subtrahend
		     * @returns {!Long} Difference
		     */
		    LongPrototype.sub = LongPrototype.subtract;

		    /**
		     * Returns the product of this and the specified Long.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} multiplier Multiplier
		     * @returns {!Long} Product
		     */
		    LongPrototype.multiply = function multiply(multiplier) {
		      if (this.isZero()) return this;
		      if (!isLong(multiplier)) multiplier = fromValue(multiplier);

		      // use wasm support if present
		      if (wasm) {
		        var low = wasm["mul"](
		          this.low,
		          this.high,
		          multiplier.low,
		          multiplier.high,
		        );
		        return fromBits(low, wasm["get_high"](), this.unsigned);
		      }
		      if (multiplier.isZero()) return this.unsigned ? UZERO : ZERO;
		      if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
		      if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
		      if (this.isNegative()) {
		        if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());
		        else return this.neg().mul(multiplier).neg();
		      } else if (multiplier.isNegative())
		        return this.mul(multiplier.neg()).neg();

		      // If both longs are small, use float multiplication
		      if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
		        return fromNumber(
		          this.toNumber() * multiplier.toNumber(),
		          this.unsigned,
		        );

		      // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
		      // We can skip products that would overflow.

		      var a48 = this.high >>> 16;
		      var a32 = this.high & 0xffff;
		      var a16 = this.low >>> 16;
		      var a00 = this.low & 0xffff;
		      var b48 = multiplier.high >>> 16;
		      var b32 = multiplier.high & 0xffff;
		      var b16 = multiplier.low >>> 16;
		      var b00 = multiplier.low & 0xffff;
		      var c48 = 0,
		        c32 = 0,
		        c16 = 0,
		        c00 = 0;
		      c00 += a00 * b00;
		      c16 += c00 >>> 16;
		      c00 &= 0xffff;
		      c16 += a16 * b00;
		      c32 += c16 >>> 16;
		      c16 &= 0xffff;
		      c16 += a00 * b16;
		      c32 += c16 >>> 16;
		      c16 &= 0xffff;
		      c32 += a32 * b00;
		      c48 += c32 >>> 16;
		      c32 &= 0xffff;
		      c32 += a16 * b16;
		      c48 += c32 >>> 16;
		      c32 &= 0xffff;
		      c32 += a00 * b32;
		      c48 += c32 >>> 16;
		      c32 &= 0xffff;
		      c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
		      c48 &= 0xffff;
		      return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
		    };

		    /**
		     * Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
		     * @function
		     * @param {!Long|number|bigint|string} multiplier Multiplier
		     * @returns {!Long} Product
		     */
		    LongPrototype.mul = LongPrototype.multiply;

		    /**
		     * Returns this Long divided by the specified. The result is signed if this Long is signed or
		     *  unsigned if this Long is unsigned.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} divisor Divisor
		     * @returns {!Long} Quotient
		     */
		    LongPrototype.divide = function divide(divisor) {
		      if (!isLong(divisor)) divisor = fromValue(divisor);
		      if (divisor.isZero()) throw Error("division by zero");

		      // use wasm support if present
		      if (wasm) {
		        // guard against signed division overflow: the largest
		        // negative number / -1 would be 1 larger than the largest
		        // positive number, due to two's complement.
		        if (
		          !this.unsigned &&
		          this.high === -2147483648 &&
		          divisor.low === -1 &&
		          divisor.high === -1
		        ) {
		          // be consistent with non-wasm code path
		          return this;
		        }
		        var low = (this.unsigned ? wasm["div_u"] : wasm["div_s"])(
		          this.low,
		          this.high,
		          divisor.low,
		          divisor.high,
		        );
		        return fromBits(low, wasm["get_high"](), this.unsigned);
		      }
		      if (this.isZero()) return this.unsigned ? UZERO : ZERO;
		      var approx, rem, res;
		      if (!this.unsigned) {
		        // This section is only relevant for signed longs and is derived from the
		        // closure library as a whole.
		        if (this.eq(MIN_VALUE)) {
		          if (divisor.eq(ONE) || divisor.eq(NEG_ONE))
		            return MIN_VALUE; // recall that -MIN_VALUE == MIN_VALUE
		          else if (divisor.eq(MIN_VALUE)) return ONE;
		          else {
		            // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
		            var halfThis = this.shr(1);
		            approx = halfThis.div(divisor).shl(1);
		            if (approx.eq(ZERO)) {
		              return divisor.isNegative() ? ONE : NEG_ONE;
		            } else {
		              rem = this.sub(divisor.mul(approx));
		              res = approx.add(rem.div(divisor));
		              return res;
		            }
		          }
		        } else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
		        if (this.isNegative()) {
		          if (divisor.isNegative()) return this.neg().div(divisor.neg());
		          return this.neg().div(divisor).neg();
		        } else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
		        res = ZERO;
		      } else {
		        // The algorithm below has not been made for unsigned longs. It's therefore
		        // required to take special care of the MSB prior to running it.
		        if (!divisor.unsigned) divisor = divisor.toUnsigned();
		        if (divisor.gt(this)) return UZERO;
		        if (divisor.gt(this.shru(1)))
		          // 15 >>> 1 = 7 ; with divisor = 8 ; true
		          return UONE;
		        res = UZERO;
		      }

		      // Repeat the following until the remainder is less than other:  find a
		      // floating-point that approximates remainder / other *from below*, add this
		      // into the result, and subtract it from the remainder.  It is critical that
		      // the approximate value is less than or equal to the real value so that the
		      // remainder never becomes negative.
		      rem = this;
		      while (rem.gte(divisor)) {
		        // Approximate the result of division. This may be a little greater or
		        // smaller than the actual value.
		        approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

		        // We will tweak the approximate result by changing it in the 48-th digit or
		        // the smallest non-fractional digit, whichever is larger.
		        var log2 = Math.ceil(Math.log(approx) / Math.LN2),
		          delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48),
		          // Decrease the approximation until it is smaller than the remainder.  Note
		          // that if it is too large, the product overflows and is negative.
		          approxRes = fromNumber(approx),
		          approxRem = approxRes.mul(divisor);
		        while (approxRem.isNegative() || approxRem.gt(rem)) {
		          approx -= delta;
		          approxRes = fromNumber(approx, this.unsigned);
		          approxRem = approxRes.mul(divisor);
		        }

		        // We know the answer can't be zero... and actually, zero would cause
		        // infinite recursion since we would make no progress.
		        if (approxRes.isZero()) approxRes = ONE;
		        res = res.add(approxRes);
		        rem = rem.sub(approxRem);
		      }
		      return res;
		    };

		    /**
		     * Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
		     * @function
		     * @param {!Long|number|bigint|string} divisor Divisor
		     * @returns {!Long} Quotient
		     */
		    LongPrototype.div = LongPrototype.divide;

		    /**
		     * Returns this Long modulo the specified.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} divisor Divisor
		     * @returns {!Long} Remainder
		     */
		    LongPrototype.modulo = function modulo(divisor) {
		      if (!isLong(divisor)) divisor = fromValue(divisor);

		      // use wasm support if present
		      if (wasm) {
		        var low = (this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(
		          this.low,
		          this.high,
		          divisor.low,
		          divisor.high,
		        );
		        return fromBits(low, wasm["get_high"](), this.unsigned);
		      }
		      return this.sub(this.div(divisor).mul(divisor));
		    };

		    /**
		     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
		     * @function
		     * @param {!Long|number|bigint|string} divisor Divisor
		     * @returns {!Long} Remainder
		     */
		    LongPrototype.mod = LongPrototype.modulo;

		    /**
		     * Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
		     * @function
		     * @param {!Long|number|bigint|string} divisor Divisor
		     * @returns {!Long} Remainder
		     */
		    LongPrototype.rem = LongPrototype.modulo;

		    /**
		     * Returns the bitwise NOT of this Long.
		     * @this {!Long}
		     * @returns {!Long}
		     */
		    LongPrototype.not = function not() {
		      return fromBits(~this.low, ~this.high, this.unsigned);
		    };

		    /**
		     * Returns count leading zeros of this Long.
		     * @this {!Long}
		     * @returns {!number}
		     */
		    LongPrototype.countLeadingZeros = function countLeadingZeros() {
		      return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
		    };

		    /**
		     * Returns count leading zeros. This is an alias of {@link Long#countLeadingZeros}.
		     * @function
		     * @param {!Long}
		     * @returns {!number}
		     */
		    LongPrototype.clz = LongPrototype.countLeadingZeros;

		    /**
		     * Returns count trailing zeros of this Long.
		     * @this {!Long}
		     * @returns {!number}
		     */
		    LongPrototype.countTrailingZeros = function countTrailingZeros() {
		      return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
		    };

		    /**
		     * Returns count trailing zeros. This is an alias of {@link Long#countTrailingZeros}.
		     * @function
		     * @param {!Long}
		     * @returns {!number}
		     */
		    LongPrototype.ctz = LongPrototype.countTrailingZeros;

		    /**
		     * Returns the bitwise AND of this Long and the specified.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} other Other Long
		     * @returns {!Long}
		     */
		    LongPrototype.and = function and(other) {
		      if (!isLong(other)) other = fromValue(other);
		      return fromBits(
		        this.low & other.low,
		        this.high & other.high,
		        this.unsigned,
		      );
		    };

		    /**
		     * Returns the bitwise OR of this Long and the specified.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} other Other Long
		     * @returns {!Long}
		     */
		    LongPrototype.or = function or(other) {
		      if (!isLong(other)) other = fromValue(other);
		      return fromBits(
		        this.low | other.low,
		        this.high | other.high,
		        this.unsigned,
		      );
		    };

		    /**
		     * Returns the bitwise XOR of this Long and the given one.
		     * @this {!Long}
		     * @param {!Long|number|bigint|string} other Other Long
		     * @returns {!Long}
		     */
		    LongPrototype.xor = function xor(other) {
		      if (!isLong(other)) other = fromValue(other);
		      return fromBits(
		        this.low ^ other.low,
		        this.high ^ other.high,
		        this.unsigned,
		      );
		    };

		    /**
		     * Returns this Long with bits shifted to the left by the given amount.
		     * @this {!Long}
		     * @param {number|!Long} numBits Number of bits
		     * @returns {!Long} Shifted Long
		     */
		    LongPrototype.shiftLeft = function shiftLeft(numBits) {
		      if (isLong(numBits)) numBits = numBits.toInt();
		      if ((numBits &= 63) === 0) return this;
		      else if (numBits < 32)
		        return fromBits(
		          this.low << numBits,
		          (this.high << numBits) | (this.low >>> (32 - numBits)),
		          this.unsigned,
		        );
		      else return fromBits(0, this.low << (numBits - 32), this.unsigned);
		    };

		    /**
		     * Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
		     * @function
		     * @param {number|!Long} numBits Number of bits
		     * @returns {!Long} Shifted Long
		     */
		    LongPrototype.shl = LongPrototype.shiftLeft;

		    /**
		     * Returns this Long with bits arithmetically shifted to the right by the given amount.
		     * @this {!Long}
		     * @param {number|!Long} numBits Number of bits
		     * @returns {!Long} Shifted Long
		     */
		    LongPrototype.shiftRight = function shiftRight(numBits) {
		      if (isLong(numBits)) numBits = numBits.toInt();
		      if ((numBits &= 63) === 0) return this;
		      else if (numBits < 32)
		        return fromBits(
		          (this.low >>> numBits) | (this.high << (32 - numBits)),
		          this.high >> numBits,
		          this.unsigned,
		        );
		      else
		        return fromBits(
		          this.high >> (numBits - 32),
		          this.high >= 0 ? 0 : -1,
		          this.unsigned,
		        );
		    };

		    /**
		     * Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
		     * @function
		     * @param {number|!Long} numBits Number of bits
		     * @returns {!Long} Shifted Long
		     */
		    LongPrototype.shr = LongPrototype.shiftRight;

		    /**
		     * Returns this Long with bits logically shifted to the right by the given amount.
		     * @this {!Long}
		     * @param {number|!Long} numBits Number of bits
		     * @returns {!Long} Shifted Long
		     */
		    LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
		      if (isLong(numBits)) numBits = numBits.toInt();
		      if ((numBits &= 63) === 0) return this;
		      if (numBits < 32)
		        return fromBits(
		          (this.low >>> numBits) | (this.high << (32 - numBits)),
		          this.high >>> numBits,
		          this.unsigned,
		        );
		      if (numBits === 32) return fromBits(this.high, 0, this.unsigned);
		      return fromBits(this.high >>> (numBits - 32), 0, this.unsigned);
		    };

		    /**
		     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
		     * @function
		     * @param {number|!Long} numBits Number of bits
		     * @returns {!Long} Shifted Long
		     */
		    LongPrototype.shru = LongPrototype.shiftRightUnsigned;

		    /**
		     * Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
		     * @function
		     * @param {number|!Long} numBits Number of bits
		     * @returns {!Long} Shifted Long
		     */
		    LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;

		    /**
		     * Returns this Long with bits rotated to the left by the given amount.
		     * @this {!Long}
		     * @param {number|!Long} numBits Number of bits
		     * @returns {!Long} Rotated Long
		     */
		    LongPrototype.rotateLeft = function rotateLeft(numBits) {
		      var b;
		      if (isLong(numBits)) numBits = numBits.toInt();
		      if ((numBits &= 63) === 0) return this;
		      if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
		      if (numBits < 32) {
		        b = 32 - numBits;
		        return fromBits(
		          (this.low << numBits) | (this.high >>> b),
		          (this.high << numBits) | (this.low >>> b),
		          this.unsigned,
		        );
		      }
		      numBits -= 32;
		      b = 32 - numBits;
		      return fromBits(
		        (this.high << numBits) | (this.low >>> b),
		        (this.low << numBits) | (this.high >>> b),
		        this.unsigned,
		      );
		    };
		    /**
		     * Returns this Long with bits rotated to the left by the given amount. This is an alias of {@link Long#rotateLeft}.
		     * @function
		     * @param {number|!Long} numBits Number of bits
		     * @returns {!Long} Rotated Long
		     */
		    LongPrototype.rotl = LongPrototype.rotateLeft;

		    /**
		     * Returns this Long with bits rotated to the right by the given amount.
		     * @this {!Long}
		     * @param {number|!Long} numBits Number of bits
		     * @returns {!Long} Rotated Long
		     */
		    LongPrototype.rotateRight = function rotateRight(numBits) {
		      var b;
		      if (isLong(numBits)) numBits = numBits.toInt();
		      if ((numBits &= 63) === 0) return this;
		      if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
		      if (numBits < 32) {
		        b = 32 - numBits;
		        return fromBits(
		          (this.high << b) | (this.low >>> numBits),
		          (this.low << b) | (this.high >>> numBits),
		          this.unsigned,
		        );
		      }
		      numBits -= 32;
		      b = 32 - numBits;
		      return fromBits(
		        (this.low << b) | (this.high >>> numBits),
		        (this.high << b) | (this.low >>> numBits),
		        this.unsigned,
		      );
		    };
		    /**
		     * Returns this Long with bits rotated to the right by the given amount. This is an alias of {@link Long#rotateRight}.
		     * @function
		     * @param {number|!Long} numBits Number of bits
		     * @returns {!Long} Rotated Long
		     */
		    LongPrototype.rotr = LongPrototype.rotateRight;

		    /**
		     * Converts this Long to signed.
		     * @this {!Long}
		     * @returns {!Long} Signed long
		     */
		    LongPrototype.toSigned = function toSigned() {
		      if (!this.unsigned) return this;
		      return fromBits(this.low, this.high, false);
		    };

		    /**
		     * Converts this Long to unsigned.
		     * @this {!Long}
		     * @returns {!Long} Unsigned long
		     */
		    LongPrototype.toUnsigned = function toUnsigned() {
		      if (this.unsigned) return this;
		      return fromBits(this.low, this.high, true);
		    };

		    /**
		     * Converts this Long to its byte representation.
		     * @param {boolean=} le Whether little or big endian, defaults to big endian
		     * @this {!Long}
		     * @returns {!Array.<number>} Byte representation
		     */
		    LongPrototype.toBytes = function toBytes(le) {
		      return le ? this.toBytesLE() : this.toBytesBE();
		    };

		    /**
		     * Converts this Long to its little endian byte representation.
		     * @this {!Long}
		     * @returns {!Array.<number>} Little endian byte representation
		     */
		    LongPrototype.toBytesLE = function toBytesLE() {
		      var hi = this.high,
		        lo = this.low;
		      return [
		        lo & 0xff,
		        (lo >>> 8) & 0xff,
		        (lo >>> 16) & 0xff,
		        lo >>> 24,
		        hi & 0xff,
		        (hi >>> 8) & 0xff,
		        (hi >>> 16) & 0xff,
		        hi >>> 24,
		      ];
		    };

		    /**
		     * Converts this Long to its big endian byte representation.
		     * @this {!Long}
		     * @returns {!Array.<number>} Big endian byte representation
		     */
		    LongPrototype.toBytesBE = function toBytesBE() {
		      var hi = this.high,
		        lo = this.low;
		      return [
		        hi >>> 24,
		        (hi >>> 16) & 0xff,
		        (hi >>> 8) & 0xff,
		        hi & 0xff,
		        lo >>> 24,
		        (lo >>> 16) & 0xff,
		        (lo >>> 8) & 0xff,
		        lo & 0xff,
		      ];
		    };

		    /**
		     * Creates a Long from its byte representation.
		     * @param {!Array.<number>} bytes Byte representation
		     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		     * @param {boolean=} le Whether little or big endian, defaults to big endian
		     * @returns {Long} The corresponding Long value
		     */
		    Long.fromBytes = function fromBytes(bytes, unsigned, le) {
		      return le
		        ? Long.fromBytesLE(bytes, unsigned)
		        : Long.fromBytesBE(bytes, unsigned);
		    };

		    /**
		     * Creates a Long from its little endian byte representation.
		     * @param {!Array.<number>} bytes Little endian byte representation
		     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		     * @returns {Long} The corresponding Long value
		     */
		    Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
		      return new Long(
		        bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24),
		        bytes[4] | (bytes[5] << 8) | (bytes[6] << 16) | (bytes[7] << 24),
		        unsigned,
		      );
		    };

		    /**
		     * Creates a Long from its big endian byte representation.
		     * @param {!Array.<number>} bytes Big endian byte representation
		     * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		     * @returns {Long} The corresponding Long value
		     */
		    Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
		      return new Long(
		        (bytes[4] << 24) | (bytes[5] << 16) | (bytes[6] << 8) | bytes[7],
		        (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3],
		        unsigned,
		      );
		    };

		    // Support conversion to/from BigInt where available
		    if (typeof BigInt === "function") {
		      /**
		       * Returns a Long representing the given big integer.
		       * @function
		       * @param {number} value The big integer value
		       * @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		       * @returns {!Long} The corresponding Long value
		       */
		      Long.fromBigInt = function fromBigInt(value, unsigned) {
		        var lowBits = Number(BigInt.asIntN(32, value));
		        var highBits = Number(BigInt.asIntN(32, value >> BigInt(32)));
		        return fromBits(lowBits, highBits, unsigned);
		      };

		      // Override
		      Long.fromValue = function fromValueWithBigInt(value, unsigned) {
		        if (typeof value === "bigint") return Long.fromBigInt(value, unsigned);
		        return fromValue(value, unsigned);
		      };

		      /**
		       * Converts the Long to its big integer representation.
		       * @this {!Long}
		       * @returns {bigint}
		       */
		      LongPrototype.toBigInt = function toBigInt() {
		        var lowBigInt = BigInt(this.low >>> 0);
		        var highBigInt = BigInt(this.unsigned ? this.high >>> 0 : this.high);
		        return (highBigInt << BigInt(32)) | lowBigInt;
		      };
		    }
		    (_exports.default = Long);
		  },
		); 
	} (umd$1, umd$1.exports));
	return umd$1.exports;
}

var hasRequiredMinimal$1;

function requireMinimal$1 () {
	if (hasRequiredMinimal$1) return minimal$1;
	hasRequiredMinimal$1 = 1;
	(function (exports) {
		/* global globalThis */
		var util = exports;

		// used to return a Promise where callback is omitted
		util.asPromise = requireAspromise();

		// converts to / from base64 encoded strings
		util.base64 = requireBase64();

		// base class of rpc.Service
		util.EventEmitter = requireEventemitter();

		// float handling accross browsers
		util.float = requireFloat();

		// converts to / from utf8 encoded strings
		util.utf8 = requireUtf8();

		// provides a node-like buffer pool in the browser
		util.pool = requirePool();

		// utility to work with the low and high bits of a 64 bit value
		util.LongBits = requireLongbits();

		/**
		 * Tests if the specified key can affect object prototypes.
		 * @memberof util
		 * @param {string} key Key to test
		 * @returns {boolean} `true` if the key is unsafe
		 */
		function isUnsafeProperty(key) {
		    return key === "__proto__" || key === "prototype" || key === "constructor";
		}

		util.isUnsafeProperty = isUnsafeProperty;

		/**
		 * Whether running within node or not.
		 * @memberof util
		 * @type {boolean}
		 */
		util.isNode = Boolean(typeof commonjsGlobal !== "undefined"
		                   && commonjsGlobal
		                   && commonjsGlobal.process
		                   && commonjsGlobal.process.versions
		                   && commonjsGlobal.process.versions.node);

		/**
		 * Global object reference.
		 * @memberof util
		 * @type {Object}
		 */
		util.global = util.isNode && commonjsGlobal
		           || typeof window !== "undefined" && window
		           || typeof self   !== "undefined" && self
		           || typeof globalThis !== "undefined" && globalThis
		           || minimal$1; // eslint-disable-line no-invalid-this

		/**
		 * An immuable empty array.
		 * @memberof util
		 * @type {Array.<*>}
		 * @const
		 */
		util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes

		/**
		 * An immutable empty object.
		 * @type {Object}
		 * @const
		 */
		util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes

		/**
		 * Tests if the specified value is an integer.
		 * @function
		 * @param {*} value Value to test
		 * @returns {boolean} `true` if the value is an integer
		 */
		util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
		    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
		};

		/**
		 * Tests if the specified value is a string.
		 * @param {*} value Value to test
		 * @returns {boolean} `true` if the value is a string
		 */
		util.isString = function isString(value) {
		    return typeof value === "string" || value instanceof String;
		};

		/**
		 * Tests if the specified value is a non-null object.
		 * @param {*} value Value to test
		 * @returns {boolean} `true` if the value is a non-null object
		 */
		util.isObject = function isObject(value) {
		    return value && typeof value === "object";
		};

		/**
		 * Checks if a property on a message is considered to be present.
		 * This is an alias of {@link util.isSet}.
		 * @function
		 * @param {Object} obj Plain object or message instance
		 * @param {string} prop Property name
		 * @returns {boolean} `true` if considered to be present, otherwise `false`
		 */
		util.isset =

		/**
		 * Checks if a property on a message is considered to be present.
		 * @param {Object} obj Plain object or message instance
		 * @param {string} prop Property name
		 * @returns {boolean} `true` if considered to be present, otherwise `false`
		 */
		util.isSet = function isSet(obj, prop) {
		    var value = obj[prop];
		    if (value != null && Object.hasOwnProperty.call(obj, prop)) // eslint-disable-line eqeqeq
		        return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
		    return false;
		};

		/**
		 * Any compatible Buffer instance.
		 * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
		 * @interface Buffer
		 * @extends Uint8Array
		 */

		/**
		 * Node's Buffer class if available.
		 * @type {Constructor<Buffer>}
		 */
		util.Buffer = (function() {
		    try {
		        var Buffer = util.global.Buffer;
		        // refuse to use non-node buffers if not explicitly assigned (perf reasons)
		        return Buffer.prototype.utf8Write || util.isNode ? Buffer : /* istanbul ignore next */ null;
		    } catch (e) {
		        /* istanbul ignore next */
		        return null;
		    }
		})();

		/**
		 * Creates a new buffer of whatever type supported by the environment.
		 * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
		 * @returns {Uint8Array|Buffer} Buffer
		 */
		util.newBuffer = function newBuffer(sizeOrArray) {
		    var Buffer = util.Buffer;
		    /* istanbul ignore next */
		    return typeof sizeOrArray === "number"
		        ? Buffer
		            ? Buffer.allocUnsafe(sizeOrArray)
		            : new Uint8Array(sizeOrArray)
		        : Buffer
		            ? Buffer.from(sizeOrArray)
		            : new Uint8Array(sizeOrArray);
		};

		/**
		 * Prepends a raw field tag to raw field data.
		 * @param {number} id Field id
		 * @param {number} wireType Wire type
		 * @param {Uint8Array} data Raw field data
		 * @returns {Uint8Array|Buffer} Raw field bytes
		 * @ignore
		 */
		util.rawField = function rawField(id, wireType, data) {
		    var out = [],
		        tag = id << 3 | wireType;
		    tag >>>= 0;
		    while (tag > 127) {
		        out.push(tag & 127 | 128);
		        tag >>>= 7;
		    }
		    out.push(tag);
		    for (var i = 0; i < data.length; ++i)
		        out.push(data[i]);
		    return util.newBuffer(out);
		};

		/**
		 * Array implementation used in the browser.
		 * @type {Constructor<Uint8Array>}
		 * @deprecated Use `Uint8Array` instead.
		 */
		util.Array = Uint8Array;

		/**
		 * Any compatible Long instance.
		 * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
		 * @interface Long
		 * @property {number} low Low bits
		 * @property {number} high High bits
		 * @property {boolean} unsigned Whether unsigned or not
		 */

		/**
		 * Long.js's Long class if available.
		 * @type {Constructor<Long>}
		 */
		util.Long = /* istanbul ignore next */ util.global.dcodeIO && /* istanbul ignore next */ util.global.dcodeIO.Long
		         || /* istanbul ignore next */ util.global.Long
		         || (function() {
		                try {
		                    var Long = requireUmd();
		                    return Long && Long.isLong ? Long : null;
		                } catch (e) {
		                    /* istanbul ignore next */
		                    return null;
		                }
		            })();

		/**
		 * Regular expression used to verify 2 bit (`bool`) map keys.
		 * @type {RegExp}
		 * @const
		 */
		util.key2Re = /^(?:true|false|0|1)$/;

		/**
		 * Regular expression used to verify 32 bit (`int32` etc.) map keys.
		 * @type {RegExp}
		 * @const
		 */
		util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;

		/**
		 * Regular expression used to verify 64 bit (`int64` etc.) map keys.
		 * @type {RegExp}
		 * @const
		 */
		util.key64Re = /^(?:[\x00-\xff]{8}|-?(?:0|[1-9][0-9]*))$/; // eslint-disable-line no-control-regex

		/**
		 * Converts a number or long to an 8 characters long hash string.
		 * @param {Long|number} value Value to convert
		 * @returns {string} Hash
		 */
		util.longToHash = function longToHash(value) {
		    return value
		        ? util.LongBits.from(value).toHash()
		        : util.LongBits.zeroHash;
		};

		/**
		 * Converts an 8 characters long hash string to a long or number.
		 * @param {string} hash Hash
		 * @param {boolean} [unsigned=false] Whether unsigned or not
		 * @returns {Long|number} Original value
		 */
		util.longFromHash = function longFromHash(hash, unsigned) {
		    var bits = util.LongBits.fromHash(hash);
		    if (util.Long)
		        return util.Long.fromBits(bits.lo, bits.hi, unsigned);
		    return bits.toNumber(Boolean(unsigned));
		};

		/**
		 * Converts a 64 bit key to a long or number if it is an 8 characters long hash string.
		 * @param {string} key Map key
		 * @param {boolean} [unsigned=false] Whether unsigned or not
		 * @returns {Long|number|string} Original value
		 */
		util.longFromKey = function longFromKey(key, unsigned) {
		    return util.key64Re.test(key) && !util.key32Re.test(key)
		        ? util.longFromHash(key, unsigned)
		        : key;
		};

		/**
		 * Converts a boolean key to a boolean value.
		 * @param {string} key Map key
		 * @returns {boolean} Boolean value
		 */
		util.boolFromKey = function boolFromKey(key) {
		    return key === "true" || key === "1";
		};

		/**
		 * Merges the properties of the source object into the destination object.
		 * @memberof util
		 * @param {Object.<string,*>} dst Destination object
		 * @param {...(Object.<string,*>|boolean)} src Source objects, optionally followed by an `ifNotSet` flag
		 * @returns {Object.<string,*>} Destination object
		 */
		function merge(dst) { // used by converters
		    var ifNotSet = typeof arguments[arguments.length - 1] === "boolean",
		        limit = ifNotSet ? arguments.length - 1 : arguments.length;
		    ifNotSet = ifNotSet && arguments[arguments.length - 1];
		    for (var a = 1; a < limit; ++a) {
		        var src = arguments[a];
		        if (!src)
		            continue;
		        for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
		            if (!isUnsafeProperty(keys[i]) && (!ifNotSet || !Object.prototype.hasOwnProperty.call(dst, keys[i]) || dst[keys[i]] === undefined))
		                dst[keys[i]] = src[keys[i]];
		    }
		    return dst;
		}

		util.merge = merge;

		/**
		 * Schema declaration nesting limit.
		 * @memberof util
		 * @type {number}
		 */
		util.nestingLimit = 32; // protoc: MaxMessageDeclarationNestingDepth

		/**
		 * Recursion limit.
		 * @memberof util
		 * @type {number}
		 */
		util.recursionLimit = 100; // protoc: CodedInputStream::default_recursion_limit_

		/**
		 * Makes a property safe for assignment as an own property.
		 * @memberof util
		 * @param {Object.<string,*>} obj Object
		 * @param {string} key Property key
		 * @param {boolean} [enumerable=true] Whether the property should be enumerable
		 * @returns {undefined}
		 */
		util.makeProp = function makeProp(obj, key, enumerable) {
		    if (Object.prototype.hasOwnProperty.call(obj, key))
		        return;
		    Object.defineProperty(obj, key, {
		        enumerable: enumerable === undefined ? true : enumerable,
		        configurable: true,
		        writable: true
		    });
		};

		/**
		 * Converts the first character of a string to lower case.
		 * @param {string} str String to convert
		 * @returns {string} Converted string
		 */
		util.lcFirst = function lcFirst(str) {
		    return str.charAt(0).toLowerCase() + str.substring(1);
		};

		/**
		 * Creates a custom error constructor.
		 * @memberof util
		 * @param {string} name Error name
		 * @returns {Constructor<Error>} Custom error constructor
		 */
		function newError(name) {

		    function CustomError(message, properties) {

		        if (!(this instanceof CustomError))
		            return new CustomError(message, properties);

		        // Error.call(this, message);
		        // ^ just returns a new error instance because the ctor can be called as a function

		        Object.defineProperty(this, "message", { get: function() { return message; } });

		        /* istanbul ignore next */
		        if (Error.captureStackTrace) // node
		            Error.captureStackTrace(this, CustomError);
		        else
		            Object.defineProperty(this, "stack", { value: new Error().stack || "" });

		        if (properties)
		            merge(this, properties);
		    }

		    CustomError.prototype = Object.create(Error.prototype, {
		        constructor: {
		            value: CustomError,
		            writable: true,
		            enumerable: false,
		            configurable: true,
		        },
		        name: {
		            get: function get() { return name; },
		            set: undefined,
		            enumerable: false,
		            // configurable: false would accurately preserve the behavior of
		            // the original, but I'm guessing that was not intentional.
		            // For an actual error subclass, this property would
		            // be configurable.
		            configurable: true,
		        },
		        toString: {
		            value: function value() { return this.name + ": " + this.message; },
		            writable: true,
		            enumerable: false,
		            configurable: true,
		        },
		    });

		    return CustomError;
		}

		util.newError = newError;

		/**
		 * Constructs a new protocol error.
		 * @classdesc Error subclass indicating a protocol specifc error.
		 * @memberof util
		 * @extends Error
		 * @template T extends Message<T>
		 * @constructor
		 * @param {string} message Error message
		 * @param {Object.<string,*>} [properties] Additional properties
		 * @example
		 * try {
		 *     MyMessage.decode(someBuffer); // throws if required fields are missing
		 * } catch (e) {
		 *     if (e instanceof ProtocolError && e.instance)
		 *         console.log("decoded so far: " + JSON.stringify(e.instance));
		 * }
		 */
		util.ProtocolError = newError("ProtocolError");

		/**
		 * So far decoded message instance.
		 * @name util.ProtocolError#instance
		 * @type {Message<T>}
		 */

		/**
		 * A OneOf getter as returned by {@link util.oneOfGetter}.
		 * @typedef OneOfGetter
		 * @type {function}
		 * @returns {string|undefined} Set field name, if any
		 */

		/**
		 * Builds a getter for a oneof's present field name.
		 * @param {string[]} fieldNames Field names
		 * @returns {OneOfGetter} Unbound getter
		 */
		util.oneOfGetter = function getOneOf(fieldNames) {
		    var fieldMap = {};
		    for (var i = 0; i < fieldNames.length; ++i)
		        fieldMap[fieldNames[i]] = 1;

		    /**
		     * @returns {string|undefined} Set field name, if any
		     * @this Object
		     * @ignore
		     */
		    return function() { // eslint-disable-line consistent-return
		        for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
		            if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
		                return keys[i];
		    };
		};

		/**
		 * A OneOf setter as returned by {@link util.oneOfSetter}.
		 * @typedef OneOfSetter
		 * @type {function}
		 * @param {string|undefined} value Field name
		 * @returns {undefined}
		 */

		/**
		 * Builds a setter for a oneof's present field name.
		 * @param {string[]} fieldNames Field names
		 * @returns {OneOfSetter} Unbound setter
		 */
		util.oneOfSetter = function setOneOf(fieldNames) {

		    /**
		     * @param {string} name Field name
		     * @returns {undefined}
		     * @this Object
		     * @ignore
		     */
		    return function(name) {
		        for (var i = 0; i < fieldNames.length; ++i)
		            if (fieldNames[i] !== name)
		                delete this[fieldNames[i]];
		    };
		};

		/**
		 * Default conversion options used for {@link Message#toJSON} implementations.
		 *
		 * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
		 *
		 * - Longs become strings
		 * - Enums become string keys
		 * - Bytes become base64 encoded strings
		 * - (Sub-)Messages become plain objects
		 * - Maps become plain objects with all string keys
		 * - Repeated fields become arrays
		 * - NaN and Infinity for float and double fields become strings
		 *
		 * @type {IConversionOptions}
		 * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
		 */
		util.toJSONOptions = {
		    longs: String,
		    enums: String,
		    bytes: String,
		    json: true
		}; 
	} (minimal$1));
	return minimal$1;
}

var writer;
var hasRequiredWriter;

function requireWriter () {
	if (hasRequiredWriter) return writer;
	hasRequiredWriter = 1;
	writer = Writer;

	var util      = requireMinimal$1();

	var BufferWriter; // cyclic

	var LongBits  = util.LongBits,
	    base64    = util.base64,
	    utf8      = util.utf8;

	/**
	 * Constructs a new writer instance.
	 * @classdesc Wire format writer using `Uint8Array`.
	 * @constructor
	 */
	function Writer() {

	    /**
	     * Write cursor into {@link Writer#buf}.
	     * @type {number}
	     */
	    this.pos = 0;

	    /**
	     * Backing buffer.
	     * @type {Uint8Array}
	     */
	    this.buf = this.constructor.alloc(64);

	    /**
	     * Cached DataView over {@link Writer#buf}.
	     * @type {DataView|null}
	     */
	    this.view = null;

	    /**
	     * Stack of forked length-prefix positions.
	     * @type {Array<number>|null}
	     */
	    this.states = null;
	}

	/**
	 * Current write position.
	 * @name Writer#len
	 * @type {number}
	 * @deprecated Use {@link Writer#pos} instead.
	 */
	Object.defineProperty(Writer.prototype, "len", {
	    configurable: true,
	    enumerable: true,
	    get: function get_len() {
	        return this.pos;
	    }
	});

	var create = function create() {
	    return util.Buffer
	        ? function create_buffer_setup() {
	            return (Writer.create = function create_buffer() {
	                return new BufferWriter();
	            })();
	        }
	        /* istanbul ignore next */
	        : function create_array() {
	            return new Writer();
	        };
	};

	/**
	 * Creates a new writer.
	 * @function
	 * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
	 */
	Writer.create = create();

	/**
	 * Allocates a buffer of the specified size.
	 * @param {number} size Buffer size
	 * @returns {Uint8Array} Buffer
	 */
	Writer.alloc = function alloc(size) {
	    return new Uint8Array(size);
	};

	// Use Uint8Array buffer pool in the browser, just like node does with buffers
	Writer.alloc = util.pool(Writer.alloc, Uint8Array.prototype.subarray);

	/**
	 * Calculates the number of bytes a value occupies as a varint.
	 * @param {number} value Value to size (unsigned)
	 * @returns {number} Byte length (1..5)
	 * @ignore
	 */
	function sizeVarint32(value) {
	    return value         < 128       ? 1
	         : value         < 16384     ? 2
	         : value         < 2097152   ? 3
	         : value         < 268435456 ? 4
	         :                             5;
	}

	/**
	 * Ensures that at least `n` more bytes fit into the backing buffer, doubling it if not.
	 * @param {number} n Number of additional bytes required
	 * @returns {undefined}
	 * @private
	 */
	Writer.prototype._reserve = function _reserve(n) {
	    var need = this.pos + n;
	    if (need > this.buf.length) {
	        var size = this.buf.length << 1;
	        if (size < need)
	            size = need;
	        var buf = this.constructor.alloc(size);
	        buf.set(this.buf.subarray(0, this.pos), 0);
	        this.buf = buf;
	        this.view = null; // invalidate
	    }
	};

	function writeStringAscii(val, buf, pos) {
	    for (var i = 0; i < val.length;)
	        buf[pos++] = val.charCodeAt(i++);
	}

	function writeVarint32(val, buf, pos) {
	    while (val > 127) {
	        buf[pos++] = val & 127 | 128;
	        val >>>= 7;
	    }
	    buf[pos] = val;
	    return pos + 1;
	}

	/**
	 * Writes an unsigned 32 bit value as a varint.
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.uint32 = function write_uint32(value) {
	    value = value >>> 0;
	    this._reserve(5);
	    var pos = this.pos;
	    this.pos = writeVarint32(value, this.buf, pos);
	    return this;
	};

	/**
	 * Writes a signed 32 bit value as a varint.
	 * @function
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.int32 = function write_int32(value) {
	    if ((value |= 0) < 0) { // 10 bytes per spec
	        this._reserve(10);
	        writeVarint64(LongBits.fromNumber(value), this.buf, this.pos);
	        this.pos += 10;
	        return this;
	    }
	    return this.uint32(value);
	};

	/**
	 * Writes a 32 bit value as a varint, zig-zag encoded.
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.sint32 = function write_sint32(value) {
	    return this.uint32((value << 1 ^ value >> 31) >>> 0);
	};

	function writeVarint64(val, buf, pos) {
	    var lo = val.lo,
	        hi = val.hi;
	    while (hi) {
	        buf[pos++] = lo & 127 | 128;
	        lo = (lo >>> 7 | hi << 25) >>> 0;
	        hi >>>= 7;
	    }
	    while (lo > 127) {
	        buf[pos++] = lo & 127 | 128;
	        lo = lo >>> 7;
	    }
	    buf[pos] = lo;
	    return pos + 1;
	}

	/**
	 * Writes an unsigned 64 bit value as a varint.
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.uint64 = function write_uint64(value) {
	    var bits = LongBits.from(value);
	    this._reserve(10);
	    var pos = this.pos;
	    this.pos = writeVarint64(bits, this.buf, pos);
	    return this;
	};

	/**
	 * Writes a signed 64 bit value as a varint.
	 * @function
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.int64 = Writer.prototype.uint64;

	/**
	 * Writes a signed 64 bit value as a varint, zig-zag encoded.
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.sint64 = function write_sint64(value) {
	    var bits = LongBits.from(value).zzEncode();
	    this._reserve(10);
	    var pos = this.pos;
	    this.pos = writeVarint64(bits, this.buf, pos);
	    return this;
	};

	/**
	 * Writes a boolish value as a varint.
	 * @param {boolean} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.bool = function write_bool(value) {
	    this._reserve(1);
	    this.buf[this.pos++] = value ? 1 : 0;
	    return this;
	};

	function writeFixed32(val, buf, pos) {
	    buf[pos    ] =  val         & 255;
	    buf[pos + 1] =  val >>> 8   & 255;
	    buf[pos + 2] =  val >>> 16  & 255;
	    buf[pos + 3] =  val >>> 24;
	}

	/**
	 * Writes an unsigned 32 bit value as fixed 32 bits.
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.fixed32 = function write_fixed32(value) {
	    this._reserve(4);
	    writeFixed32(value >>> 0, this.buf, this.pos);
	    this.pos += 4;
	    return this;
	};

	/**
	 * Writes a signed 32 bit value as fixed 32 bits.
	 * @function
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.sfixed32 = Writer.prototype.fixed32;

	/**
	 * Writes an unsigned 64 bit value as fixed 64 bits.
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.fixed64 = function write_fixed64(value) {
	    var bits = LongBits.from(value);
	    this._reserve(8);
	    writeFixed32(bits.lo, this.buf, this.pos);
	    writeFixed32(bits.hi, this.buf, this.pos + 4);
	    this.pos += 8;
	    return this;
	};

	/**
	 * Writes a signed 64 bit value as fixed 64 bits.
	 * @function
	 * @param {Long|number|string} value Value to write
	 * @returns {Writer} `this`
	 * @throws {TypeError} If `value` is a string and no long library is present.
	 */
	Writer.prototype.sfixed64 = Writer.prototype.fixed64;

	/**
	 * Writes a float (32 bit).
	 * @function
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.float = function write_float(value) {
	    this._reserve(4);
	    util.float.writeFloatLE(value, this.buf, this.pos);
	    this.pos += 4;
	    return this;
	};

	/**
	 * Writes a double (64 bit float).
	 * @function
	 * @param {number} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.double = function write_double(value) {
	    this._reserve(8);
	    util.float.writeDoubleLE(value, this.buf, this.pos);
	    this.pos += 8;
	    return this;
	};

	/**
	 * Writes a sequence of bytes.
	 * @param {Uint8Array|string} value Buffer or base64 encoded string to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.bytes = function write_bytes(value) {
	    var len = value.length >>> 0;
	    if (!len) {
	        this._reserve(1);
	        this.buf[this.pos++] = 0;
	        return this;
	    }
	    if (util.isString(value)) {
	        var buf = Writer.alloc(len = base64.length(value));
	        base64.decode(value, buf, 0);
	        value = buf;
	    }
	    this.uint32(len);
	    this._reserve(len);
	    this.buf.set(value, this.pos);
	    this.pos += len;
	    return this;
	};

	/**
	 * Writes raw bytes without a tag or length prefix.
	 * @param {Uint8Array} value Raw bytes
	 * @returns {Writer} `this`
	 */
	Writer.prototype.raw = function write_raw(value) {
	    var len = value.length >>> 0;
	    if (!len)
	        return this;
	    this._reserve(len);
	    this.buf.set(value, this.pos);
	    this.pos += len;
	    return this;
	};

	/**
	 * Backfills the length varint.
	 * @param {number} pos Position of reserved length byte
	 * @param {number} len Length of content after length varint
	 * @returns {Writer} `this`
	 * @private
	 */
	Writer.prototype._delim = function _delim(pos, len) {
	    var n = sizeVarint32(len);
	    if (n > 1)
	        this.buf.copyWithin(pos + n, pos + 1, pos + 1 + len);
	    writeVarint32(len, this.buf, pos);
	    this.pos = pos + n + len;
	    return this;
	};

	/**
	 * Writes a string.
	 * @param {string} value Value to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.string = function write_string(value) {
	    var n = value.length;
	    if (!n) {
	        this._reserve(1);
	        this.buf[this.pos++] = 0;
	        return this;
	    }
	    if (n < 0x80) {
	        this._reserve(n * 3 + 5); // worst case
	        var lenPos = this.pos;
	        return this._delim(lenPos, utf8.write(value, this.buf, lenPos + 1));
	    }
	    var len = utf8.length(value);
	    this.uint32(len);
	    this._reserve(len);
	    if (len === value.length)
	        writeStringAscii(value, this.buf, this.pos);
	    else
	        utf8.write(value, this.buf, this.pos);
	    this.pos += len;
	    return this;
	};

	/**
	 * Writes an array of unsigned 32 bit values as a packed repeated field.
	 * @param {number[]} value Values to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.uint32s = function write_uint32s(value) {
	    var n = value.length;
	    this._reserve(n * 5 + 5); // worst case: 5 bytes per value + length varint
	    var buf = this.buf, lenPos = this.pos, p = lenPos + 1;
	    for (var i = 0; i < n; ++i)
	        p = writeVarint32(value[i] >>> 0, buf, p);
	    return this._delim(lenPos, p - lenPos - 1);
	};

	/**
	 * Writes an array of signed 32 bit values as a packed repeated field.
	 * @param {number[]} value Values to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.int32s = function write_int32s(value) {
	    var n = value.length;
	    this._reserve(n * 10 + 5); // worst case: 10 bytes per negative value + length varint
	    var buf = this.buf, lenPos = this.pos, pos = lenPos + 1, val;
	    for (var i = 0; i < n; ++i) {
	        if ((val = value[i] | 0) < 0) { // negatives are 10 bytes per spec
	            pos = writeVarint64(LongBits.fromNumber(val), buf, pos);
	        } else {
	            pos = writeVarint32(val, buf, pos);
	        }
	    }
	    return this._delim(lenPos, pos - lenPos - 1);
	};

	/**
	 * Writes an array of 32 bit values as packed, zig-zag encoded varints.
	 * @param {number[]} value Values to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.sint32s = function write_sint32s(value) {
	    var n = value.length;
	    this._reserve(n * 5 + 5);
	    var buf = this.buf, lenPos = this.pos, pos = lenPos + 1;
	    for (var i = 0; i < n; ++i)
	        pos = writeVarint32((value[i] << 1 ^ value[i] >> 31) >>> 0, buf, pos);
	    return this._delim(lenPos, pos - lenPos - 1);
	};

	/**
	 * Writes an array of unsigned 64 bit values as a packed repeated field.
	 * @param {Array.<Long|number|string>} value Values to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.uint64s = function write_uint64s(value) {
	    var n = value.length;
	    this._reserve(n * 10 + 5);
	    var buf = this.buf, lenPos = this.pos, pos = lenPos + 1;
	    for (var i = 0; i < n; ++i) {
	        pos = writeVarint64(LongBits.from(value[i]), buf, pos);
	    }
	    return this._delim(lenPos, pos - lenPos - 1);
	};

	/**
	 * Writes an array of signed 64 bit values as a packed repeated field.
	 * @function
	 * @param {Array.<Long|number|string>} value Values to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.int64s = Writer.prototype.uint64s;

	/**
	 * Writes an array of 64 bit values as packed, zig-zag encoded varints.
	 * @param {Array.<Long|number|string>} value Values to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.sint64s = function write_sint64s(value) {
	    var n = value.length;
	    this._reserve(n * 10 + 5);
	    var buf = this.buf, lenPos = this.pos, pos = lenPos + 1;
	    for (var i = 0; i < n; ++i) {
	        pos = writeVarint64(LongBits.from(value[i]).zzEncode(), buf, pos);
	    }
	    return this._delim(lenPos, pos - lenPos - 1);
	};

	/**
	 * Writes an array of boolish values as a packed repeated field.
	 * @param {boolean[]} value Values to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.bools = function write_bools(value) {
	    var n = value.length;
	    this.uint32(n); // one byte per value
	    this._reserve(n);
	    var buf = this.buf, p = this.pos;
	    for (var i = 0; i < n; ++i)
	        buf[p++] = value[i] ? 1 : 0;
	    this.pos += n;
	    return this;
	};

	// The view allocation only pays off when amortized over enough writes
	var VIEW_THRESHOLD_FLOAT = 16,
	    VIEW_THRESHOLD_INT   = 128;

	function getLazyView(writer, count, threshold) {
	    var view = writer.view;
	    if (view || count < threshold)
	        return view;
	    var buf = writer.buf;
	    return writer.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
	}

	/**
	 * Writes an array of unsigned 32 bit values as packed, fixed 32 bits.
	 * @param {number[]} value Values to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.fixed32s = function write_fixed32s(value) {
	    var n = value.length, bytes = n * 4;
	    this.uint32(bytes); // length is known exactly
	    this._reserve(bytes);
	    var p = this.pos, i, dv = getLazyView(this, n, VIEW_THRESHOLD_INT);
	    if (dv)
	        for (i = 0; i < n; ++i) { dv.setUint32(p, value[i] >>> 0, true); p += 4; }
	    else {
	        var buf = this.buf;
	        for (i = 0; i < n; ++i) { writeFixed32(value[i] >>> 0, buf, p); p += 4; }
	    }
	    this.pos += bytes;
	    return this;
	};

	/**
	 * Writes an array of signed 32 bit values as packed, fixed 32 bits.
	 * @function
	 * @param {number[]} value Values to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.sfixed32s = Writer.prototype.fixed32s;

	/**
	 * Writes an array of unsigned 64 bit values as packed, fixed 64 bits.
	 * @param {Array.<Long|number|string>} value Values to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.fixed64s = function write_fixed64s(value) {
	    var n = value.length, bytes = n * 8;
	    this.uint32(bytes);
	    this._reserve(bytes);
	    var p = this.pos, i, bits, dv = getLazyView(this, n, VIEW_THRESHOLD_INT);
	    if (dv)
	        for (i = 0; i < n; ++i) { bits = LongBits.from(value[i]); dv.setUint32(p, bits.lo, true); dv.setUint32(p + 4, bits.hi, true); p += 8; }
	    else {
	        var buf = this.buf;
	        for (i = 0; i < n; ++i) { bits = LongBits.from(value[i]); writeFixed32(bits.lo, buf, p); writeFixed32(bits.hi, buf, p + 4); p += 8; }
	    }
	    this.pos += bytes;
	    return this;
	};

	/**
	 * Writes an array of signed 64 bit values as packed, fixed 64 bits.
	 * @function
	 * @param {Array.<Long|number|string>} value Values to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.sfixed64s = Writer.prototype.fixed64s;

	/**
	 * Writes an array of floats (32 bit) as a packed repeated field.
	 * @param {number[]} value Values to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.floats = function write_floats(value) {
	    var n = value.length, bytes = n * 4;
	    this.uint32(bytes);
	    this._reserve(bytes);
	    var p = this.pos, i, dv = getLazyView(this, n, VIEW_THRESHOLD_FLOAT);
	    if (dv)
	        for (i = 0; i < n; ++i) { dv.setFloat32(p, value[i], true); p += 4; }
	    else {
	        var buf = this.buf;
	        for (i = 0; i < n; ++i) { util.float.writeFloatLE(value[i], buf, p); p += 4; }
	    }
	    this.pos += bytes;
	    return this;
	};

	/**
	 * Writes an array of doubles (64 bit float) as a packed repeated field.
	 * @param {number[]} value Values to write
	 * @returns {Writer} `this`
	 */
	Writer.prototype.doubles = function write_doubles(value) {
	    var n = value.length, bytes = n * 8;
	    this.uint32(bytes);
	    this._reserve(bytes);
	    var p = this.pos, i, dv = getLazyView(this, n, VIEW_THRESHOLD_FLOAT);
	    if (dv)
	        for (i = 0; i < n; ++i) { dv.setFloat64(p, value[i], true); p += 8; }
	    else {
	        var buf = this.buf;
	        for (i = 0; i < n; ++i) { util.float.writeDoubleLE(value[i], buf, p); p += 8; }
	    }
	    this.pos += bytes;
	    return this;
	};

	/**
	 * Forks this writer's state by pushing it to a stack.
	 * @returns {Writer} `this`
	 */
	Writer.prototype.fork = function fork() {
	    this._reserve(1);
	    (this.states || (this.states = [])).push(this.pos);
	    this.pos += 1;
	    return this;
	};

	/**
	 * Resets this instance to the last state.
	 * @returns {Writer} `this`
	 */
	Writer.prototype.reset = function reset() {
	    var states = this.states;
	    if (states && states.length) {
	        this.pos = states.pop();
	    } else {
	        this.pos = 0;
	    }
	    return this;
	};

	/**
	 * Resets to the last state and prepends the fork state's current write length as a varint.
	 * @returns {Writer} `this`
	 */
	Writer.prototype.ldelim = function ldelim() {
	    var states = this.states,
	        len,
	        vlen;
	    if (states && states.length) {
	        var lenPos = states.pop();
	        len = this.pos - lenPos - 1;
	        vlen = sizeVarint32(len);
	        if (vlen > 1) { // grow the reserved single byte and shift content forward
	            this._reserve(vlen - 1);
	            this.buf.copyWithin(lenPos + vlen, lenPos + 1, lenPos + 1 + len);
	            this.pos += vlen - 1;
	            writeVarint32(len, this.buf, lenPos);
	        } else {
	            this.buf[lenPos] = len;
	        }
	    } else { // not forked: prefix the entire buffer with its length
	        // TODO: Compatibility with older generated code.
	        // Remove this branch in the next major release.
	        len = this.pos;
	        vlen = sizeVarint32(len);
	        this._reserve(vlen);
	        this.buf.copyWithin(vlen, 0, len);
	        writeVarint32(len, this.buf, 0);
	        this.pos += vlen;
	    }
	    return this;
	};

	/**
	 * Finishes the write operation.
	 * Returns a buffer sized to the written data by default.
	 * @param {boolean} [shared=false] Whether to return a shared view instead of a unique copy
	 * @returns {Uint8Array} Finished buffer
	 */
	Writer.prototype.finish = function finish(shared) {
	    if (shared)
	        return this.buf.subarray(0, this.pos);
	    var buf = this.constructor.alloc(this.pos);
	    buf.set(this.buf.subarray(0, this.pos), 0);
	    return buf;
	};

	/**
	 * Finishes the write operation, writing into the provided buffer.
	 * The caller must ensure that `buf` has enough space starting at `offset`
	 * to hold {@link Writer#pos} bytes.
	 * @param {T} buf Target buffer
	 * @param {number} [offset=0] Offset to start writing at
	 * @returns {T} The provided buffer
	 * @template T extends Uint8Array
	 */
	Writer.prototype.finishInto = function finishInto(buf, offset) {
	    if (offset === undefined)
	        offset = 0;
	    buf.set(this.buf.subarray(0, this.pos), offset);
	    return buf;
	};

	Writer._configure = function(BufferWriter_) {
	    BufferWriter = BufferWriter_;
	    Writer.create = create();
	    BufferWriter._configure();
	};
	return writer;
}

var writer_buffer;
var hasRequiredWriter_buffer;

function requireWriter_buffer () {
	if (hasRequiredWriter_buffer) return writer_buffer;
	hasRequiredWriter_buffer = 1;
	writer_buffer = BufferWriter;

	// extends Writer
	var Writer = requireWriter();
	BufferWriter.prototype = Object.create(Writer.prototype, {
	    constructor: {
	        value: BufferWriter,
	        writable: true,
	        enumerable: false,
	        configurable: true
	    }
	});

	var util = requireMinimal$1();

	/**
	 * Constructs a new buffer writer instance.
	 * @classdesc Wire format writer using node buffers.
	 * @extends Writer
	 * @constructor
	 */
	function BufferWriter() {
	    Writer.call(this);
	}

	var writeStringBuffer;

	BufferWriter._configure = function () {
	    /**
	     * Allocates a buffer of the specified size.
	     * @function
	     * @param {number} size Buffer size
	     * @returns {Buffer} Buffer
	     */
	    BufferWriter.alloc = util.Buffer && util.Buffer.allocUnsafe;

	    writeStringBuffer = util.Buffer && util.Buffer.prototype.utf8Write
	        ? function writeStringBuffer_utf8Write(val, buf, pos) {
	            return buf.utf8Write(val, pos);
	        }
	        : function writeStringBuffer_write(val, buf, pos) {
	            return buf.write(val, pos);
	        };
	};


	/**
	 * @override
	 */
	BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
	    if (util.isString(value))
	        value = util.Buffer.from(value, "base64");
	    var len = value.length >>> 0;
	    this.uint32(len);
	    if (len) {
	        this._reserve(len);
	        this.buf.set(value, this.pos);
	        this.pos += len;
	    }
	    return this;
	};

	/**
	 * @override
	 */
	BufferWriter.prototype.string = function write_string_buffer(value) {
	    var n = value.length;
	    if (!n) {
	        this._reserve(1);
	        this.buf[this.pos++] = 0;
	        return this;
	    }
	    if (n < 0x80) {
	        this._reserve(n * 3 + 5); // worst case
	        var pos = this.pos,
	            buf = this.buf;
	        return this._delim(pos,
	            n < 40
	                ? util.utf8.write(value, buf, pos + 1)
	                : writeStringBuffer(value, buf, pos + 1)
	        );
	    }
	    var len = util.Buffer.byteLength(value);
	    this.uint32(len);
	    this._reserve(len);
	    writeStringBuffer(value, this.buf, this.pos);
	    this.pos += len;
	    return this;
	};


	/**
	 * Finishes the write operation.
	 * @name BufferWriter#finish
	 * @function
	 * @returns {Buffer} Finished buffer
	 */

	BufferWriter._configure();
	return writer_buffer;
}

var reader;
var hasRequiredReader;

function requireReader () {
	if (hasRequiredReader) return reader;
	hasRequiredReader = 1;
	reader = Reader;

	var util      = requireMinimal$1();

	var BufferReader; // cyclic

	var LongBits  = util.LongBits,
	    utf8      = util.utf8;

	/* istanbul ignore next */
	function indexOutOfRange(reader, writeLength) {
	    return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
	}

	/**
	 * Constructs a new reader instance using the specified buffer.
	 * @classdesc Wire format reader using `Uint8Array`.
	 * @constructor
	 * @param {Uint8Array} buffer Buffer to read from
	 */
	function Reader(buffer) {

	    /**
	     * Read buffer.
	     * @type {Uint8Array}
	     */
	    this.buf = buffer;

	    /**
	     * Read buffer position.
	     * @type {number}
	     */
	    this.pos = 0;

	    /**
	     * Read buffer length.
	     * @type {number}
	     */
	    this.len = buffer.length;

	    /**
	     * Cached DataView for packed reads.
	     * @type {DataView|null}
	     */
	    this.view = null;

	    /**
	     * Whether to discard unknown fields while decoding.
	     * @type {boolean}
	     */
	    this.discardUnknown = Reader.discardUnknown;
	}

	function create_array(buffer) {
	    // TODO: Remove plain array reader support in the next major release.
	    if (Array.isArray(buffer))
	        buffer = new Uint8Array(buffer);
	    if (buffer instanceof Uint8Array)
	        return new Reader(buffer);
	    throw Error("illegal buffer");
	}

	var create = function create() {
	    return util.Buffer
	        ? function create_buffer_setup(buffer) {
	            return (Reader.create = function create_buffer(buffer) {
	                return util.Buffer.isBuffer(buffer)
	                    ? new BufferReader(buffer)
	                    /* istanbul ignore next */
	                    : create_array(buffer);
	            })(buffer);
	        }
	        /* istanbul ignore next */
	        : create_array;
	};

	/**
	 * Creates a new reader using the specified buffer.
	 * @function
	 * @param {Uint8Array|Buffer} buffer Buffer to read from
	 * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
	 * @throws {Error} If `buffer` is not a valid buffer
	 */
	Reader.create = create();

	/**
	 * Returns raw bytes from the backing buffer without advancing the reader.
	 * @param {number} start Start offset
	 * @param {number} end End offset
	 * @returns {Uint8Array} Raw bytes
	 */
	Reader.prototype.raw = function read_raw(start, end) {
	    return this.buf.subarray(start, end);
	};

	/**
	 * Reads a varint as an unsigned 32 bit value.
	 * @function
	 * @returns {number} Value read
	 */
	Reader.prototype.uint32 = function read_uint32() {
	    var buf = this.buf,
	        pos = this.pos,
	        value = (buf[pos] & 127) >>> 0;
	    if (buf[pos++] < 128) {
	        this.pos = pos;
	        return value;
	    }
	    value = (value | (buf[pos] & 127) << 7) >>> 0;
	    if (buf[pos++] < 128) {
	        this.pos = pos;
	        return value;
	    }
	    value = (value | (buf[pos] & 127) << 14) >>> 0;
	    if (buf[pos++] < 128) {
	        this.pos = pos;
	        return value;
	    }
	    value = (value | (buf[pos] & 127) << 21) >>> 0;
	    if (buf[pos++] < 128) {
	        this.pos = pos;
	        return value;
	    }
	    value = (value | (buf[pos] & 15) << 28) >>> 0;
	    if (buf[pos++] < 128) {
	        this.pos = pos;
	        return value;
	    }

	    for (var i = 0; i < 5; ++i) {
	        /* istanbul ignore if */
	        if (pos >= this.len) {
	            this.pos = pos;
	            throw indexOutOfRange(this);
	        }
	        if (buf[pos++] < 128) {
	            this.pos = pos;
	            return value;
	        }
	    }
	    /* istanbul ignore next */
	    this.pos = pos;
	    throw Error("invalid varint encoding");
	};

	/**
	 * Reads a field tag.
	 * @function
	 * @returns {number} Tag read
	 */
	Reader.prototype.tag = function read_tag() {
	    var buf = this.buf,
	        pos = this.pos,
	        value = (buf[pos] & 127) >>> 0;
	    if (buf[pos++] < 128) {
	        this.pos = pos;
	        return value;
	    }
	    value = (value | (buf[pos] & 127) << 7) >>> 0;
	    if (buf[pos++] < 128) {
	        this.pos = pos;
	        return value;
	    }
	    value = (value | (buf[pos] & 127) << 14) >>> 0;
	    if (buf[pos++] < 128) {
	        this.pos = pos;
	        return value;
	    }
	    value = (value | (buf[pos] & 127) << 21) >>> 0;
	    if (buf[pos++] < 128) {
	        this.pos = pos;
	        return value;
	    }
	    value = (value | (buf[pos] & 15) << 28) >>> 0;
	    if (buf[pos] < 128 && (buf[pos] & 112) === 0) {
	        this.pos = pos + 1;
	        return value;
	    }

	    this.pos = pos + 1;
	    throw Error("invalid tag encoding");
	};

	/**
	 * Reads a varint as a signed 32 bit value.
	 * @returns {number} Value read
	 */
	Reader.prototype.int32 = function read_int32() {
	    return this.uint32() | 0;
	};

	/**
	 * Reads a zig-zag encoded varint as a signed 32 bit value.
	 * @returns {number} Value read
	 */
	Reader.prototype.sint32 = function read_sint32() {
	    var value = this.uint32();
	    return value >>> 1 ^ -(value & 1) | 0;
	};

	/* eslint-disable no-invalid-this */

	function readLongVarint() {
	    // tends to deopt with local vars for octet etc.
	    var bits = new LongBits(0, 0);
	    var i = 0;
	    if (this.len - this.pos > 4) { // fast route (lo)
	        for (; i < 4; ++i) {
	            // 1st..4th
	            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
	            if (this.buf[this.pos++] < 128)
	                return bits;
	        }
	        // 5th
	        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
	        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
	        if (this.buf[this.pos++] < 128)
	            return bits;
	        i = 0;
	    } else {
	        for (; i < 4; ++i) {
	            /* istanbul ignore if */
	            if (this.pos >= this.len)
	                throw indexOutOfRange(this);
	            // 1st..4th
	            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
	            if (this.buf[this.pos++] < 128)
	                return bits;
	        }
	        throw indexOutOfRange(this);
	    }
	    if (this.len - this.pos > 4) { // fast route (hi)
	        for (; i < 5; ++i) {
	            // 6th..10th
	            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
	            if (this.buf[this.pos++] < 128)
	                return bits;
	        }
	    } else {
	        for (; i < 5; ++i) {
	            /* istanbul ignore if */
	            if (this.pos >= this.len)
	                throw indexOutOfRange(this);
	            // 6th..10th
	            bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
	            if (this.buf[this.pos++] < 128)
	                return bits;
	        }
	    }
	    /* istanbul ignore next */
	    throw Error("invalid varint encoding");
	}

	/* eslint-enable no-invalid-this */

	/**
	 * Reads a varint as a signed 64 bit value.
	 * @name Reader#int64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads a varint as an unsigned 64 bit value.
	 * @name Reader#uint64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads a zig-zag encoded varint as a signed 64 bit value.
	 * @name Reader#sint64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads a varint as a boolean.
	 * @returns {boolean} Value read
	 */
	Reader.prototype.bool = function read_bool() {
	    var value = false,
	        b;
	    for (var i = 0; i < 10; ++i) {
	        /* istanbul ignore if */
	        if (this.pos >= this.len)
	            throw indexOutOfRange(this);
	        b = this.buf[this.pos++];
	        if (b & 127)
	            value = true;
	        if (b < 128)
	            return value;
	    }
	    /* istanbul ignore next */
	    throw Error("invalid varint encoding");
	};

	function readFixed32_end(buf, end) { // note that this uses `end`, not `pos`
	    return (buf[end - 4]
	          | buf[end - 3] << 8
	          | buf[end - 2] << 16
	          | buf[end - 1] << 24) >>> 0;
	}

	/**
	 * Reads fixed 32 bits as an unsigned 32 bit integer.
	 * @returns {number} Value read
	 */
	Reader.prototype.fixed32 = function read_fixed32() {

	    /* istanbul ignore if */
	    if (this.pos + 4 > this.len)
	        throw indexOutOfRange(this, 4);

	    return readFixed32_end(this.buf, this.pos += 4);
	};

	/**
	 * Reads fixed 32 bits as a signed 32 bit integer.
	 * @returns {number} Value read
	 */
	Reader.prototype.sfixed32 = function read_sfixed32() {

	    /* istanbul ignore if */
	    if (this.pos + 4 > this.len)
	        throw indexOutOfRange(this, 4);

	    return readFixed32_end(this.buf, this.pos += 4) | 0;
	};

	/* eslint-disable no-invalid-this */

	function readFixed64(/* this: Reader */) {

	    /* istanbul ignore if */
	    if (this.pos + 8 > this.len)
	        throw indexOutOfRange(this, 8);

	    return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
	}

	/* eslint-enable no-invalid-this */

	/**
	 * Reads fixed 64 bits.
	 * @name Reader#fixed64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads zig-zag encoded fixed 64 bits.
	 * @name Reader#sfixed64
	 * @function
	 * @returns {Long} Value read
	 */

	/**
	 * Reads a float (32 bit) as a number.
	 * @function
	 * @returns {number} Value read
	 */
	Reader.prototype.float = function read_float() {

	    /* istanbul ignore if */
	    if (this.pos + 4 > this.len)
	        throw indexOutOfRange(this, 4);

	    var value = util.float.readFloatLE(this.buf, this.pos);
	    this.pos += 4;
	    return value;
	};

	/**
	 * Reads a double (64 bit float) as a number.
	 * @function
	 * @returns {number} Value read
	 */
	Reader.prototype.double = function read_double() {

	    /* istanbul ignore if */
	    if (this.pos + 8 > this.len)
	        throw indexOutOfRange(this, 4);

	    var value = util.float.readDoubleLE(this.buf, this.pos);
	    this.pos += 8;
	    return value;
	};

	/**
	 * Reads a packed repeated field of unsigned 32 bit varints.
	 * @param {number[]} [array] Array to read into; a new one is created if omitted
	 * @returns {number[]} Array read into
	 */
	Reader.prototype.uint32s = function read_uint32s(array) {
	    if (array === undefined) array = [];
	    var end = this.uint32() + this.pos;
	    while (this.pos < end)
	        array.push(this.uint32());
	    return array;
	};

	/**
	 * Reads a packed repeated field of signed 32 bit varints.
	 * @param {number[]} [array] Array to read into; a new one is created if omitted
	 * @returns {number[]} Array read into
	 */
	Reader.prototype.int32s = function read_int32s(array) {
	    if (array === undefined) array = [];
	    var end = this.uint32() + this.pos;
	    while (this.pos < end)
	        array.push(this.int32());
	    return array;
	};

	/**
	 * Reads a packed repeated field of zig-zag encoded signed 32 bit varints.
	 * @param {number[]} [array] Array to read into; a new one is created if omitted
	 * @returns {number[]} Array read into
	 */
	Reader.prototype.sint32s = function read_sint32s(array) {
	    if (array === undefined) array = [];
	    var end = this.uint32() + this.pos;
	    while (this.pos < end)
	        array.push(this.sint32());
	    return array;
	};

	/**
	 * Reads a packed repeated field of booleans.
	 * @param {boolean[]} [array] Array to read into; a new one is created if omitted
	 * @returns {boolean[]} Array read into
	 */
	Reader.prototype.bools = function read_bools(array) {
	    if (array === undefined) array = [];
	    var end = this.uint32() + this.pos;
	    while (this.pos < end)
	        array.push(this.bool());
	    return array;
	};

	// The view allocation only pays off when amortized over enough reads
	var VIEW_THRESHOLD_FLOAT = 8,
	    VIEW_THRESHOLD_INT   = 128;

	function getLazyView(reader, count, threshold) {
	    var view = reader.view;
	    if (view || count < threshold)
	        return view;
	    var buf = reader.buf;
	    return reader.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
	}

	/**
	 * Reads a packed repeated field of unsigned 32 bit fixed values.
	 * @param {number[]} [array] Array to read into; a new one is created if omitted
	 * @returns {number[]} Array read into
	 */
	Reader.prototype.fixed32s = function read_fixed32s(array) {
	    if (array === undefined) array = [];
	    var len = this.uint32(), end = this.pos + len;
	    /* istanbul ignore if */
	    if (end > this.len) throw indexOutOfRange(this, len);
	    var count = len >>> 2, i = array.length, pos = this.pos;
	    array.length = i + count;
	    var dv = getLazyView(this, count, VIEW_THRESHOLD_INT);
	    if (dv)
	        for (var k = 0; k < count; ++k, pos += 4) array[i++] = dv.getUint32(pos, true);
	    else {
	        var buf = this.buf;
	        for (var j = 0; j < count; ++j, pos += 4) array[i++] = readFixed32_end(buf, pos + 4);
	    }
	    this.pos = pos;
	    if (pos !== end) throw indexOutOfRange(this, 4);
	    return array;
	};

	/**
	 * Reads a packed repeated field of signed 32 bit fixed values.
	 * @param {number[]} [array] Array to read into; a new one is created if omitted
	 * @returns {number[]} Array read into
	 */
	Reader.prototype.sfixed32s = function read_sfixed32s(array) {
	    if (array === undefined) array = [];
	    var len = this.uint32(), end = this.pos + len;
	    /* istanbul ignore if */
	    if (end > this.len) throw indexOutOfRange(this, len);
	    var count = len >>> 2, i = array.length, pos = this.pos;
	    array.length = i + count;
	    var dv = getLazyView(this, count, VIEW_THRESHOLD_INT);
	    if (dv)
	        for (var k = 0; k < count; ++k, pos += 4) array[i++] = dv.getInt32(pos, true);
	    else {
	        var buf = this.buf;
	        for (var j = 0; j < count; ++j, pos += 4) array[i++] = readFixed32_end(buf, pos + 4) | 0;
	    }
	    this.pos = pos;
	    if (pos !== end) throw indexOutOfRange(this, 4);
	    return array;
	};

	/**
	 * Reads a packed repeated field of floats (32 bit).
	 * @param {number[]} [array] Array to read into; a new one is created if omitted
	 * @returns {number[]} Array read into
	 */
	Reader.prototype.floats = function read_floats(array) {
	    if (array === undefined) array = [];
	    var len = this.uint32(), end = this.pos + len;
	    /* istanbul ignore if */
	    if (end > this.len) throw indexOutOfRange(this, len);
	    var count = len >>> 2, i = array.length, pos = this.pos;
	    array.length = i + count;
	    var dv = getLazyView(this, count, VIEW_THRESHOLD_FLOAT);
	    if (dv)
	        for (var k = 0; k < count; ++k, pos += 4) array[i++] = dv.getFloat32(pos, true);
	    else {
	        var buf = this.buf;
	        for (var j = 0; j < count; ++j, pos += 4) array[i++] = util.float.readFloatLE(buf, pos);
	    }
	    this.pos = pos;
	    if (pos !== end) throw indexOutOfRange(this, 4);
	    return array;
	};

	/**
	 * Reads a packed repeated field of doubles (64 bit float).
	 * @param {number[]} [array] Array to read into; a new one is created if omitted
	 * @returns {number[]} Array read into
	 */
	Reader.prototype.doubles = function read_doubles(array) {
	    if (array === undefined) array = [];
	    var len = this.uint32(), end = this.pos + len;
	    /* istanbul ignore if */
	    if (end > this.len) throw indexOutOfRange(this, len);
	    var count = len >>> 3, i = array.length, pos = this.pos;
	    array.length = i + count;
	    var dv = getLazyView(this, count, VIEW_THRESHOLD_FLOAT);
	    if (dv)
	        for (var k = 0; k < count; ++k, pos += 8) array[i++] = dv.getFloat64(pos, true);
	    else {
	        var buf = this.buf;
	        for (var j = 0; j < count; ++j, pos += 8) array[i++] = util.float.readDoubleLE(buf, pos);
	    }
	    this.pos = pos;
	    if (pos !== end) throw indexOutOfRange(this, 8);
	    return array;
	};

	/**
	 * Reads a packed repeated field of unsigned 64 bit varints.
	 * @param {Array.<Long|number>} [array] Array to read into; a new one is created if omitted
	 * @returns {Array.<Long|number>} Array read into
	 */
	Reader.prototype.uint64s = function read_uint64s(array) {
	    if (array === undefined) array = [];
	    var end = this.uint32() + this.pos;
	    while (this.pos < end)
	        array.push(this.uint64());
	    return array;
	};

	/**
	 * Reads a packed repeated field of signed 64 bit varints.
	 * @param {Array.<Long|number>} [array] Array to read into; a new one is created if omitted
	 * @returns {Array.<Long|number>} Array read into
	 */
	Reader.prototype.int64s = function read_int64s(array) {
	    if (array === undefined) array = [];
	    var end = this.uint32() + this.pos;
	    while (this.pos < end)
	        array.push(this.int64());
	    return array;
	};

	/**
	 * Reads a packed repeated field of zig-zag encoded signed 64 bit varints.
	 * @param {Array.<Long|number>} [array] Array to read into; a new one is created if omitted
	 * @returns {Array.<Long|number>} Array read into
	 */
	Reader.prototype.sint64s = function read_sint64s(array) {
	    if (array === undefined) array = [];
	    var end = this.uint32() + this.pos;
	    while (this.pos < end)
	        array.push(this.sint64());
	    return array;
	};

	/**
	 * Reads a packed repeated field of unsigned 64 bit fixed values.
	 * @param {Array.<Long|number>} [array] Array to read into; a new one is created if omitted
	 * @returns {Array.<Long|number>} Array read into
	 */
	Reader.prototype.fixed64s = function read_fixed64s(array) {
	    if (array === undefined) array = [];
	    var len = this.uint32(), end = this.pos + len, i = array.length;
	    /* istanbul ignore if */
	    if (end > this.len) throw indexOutOfRange(this, len);
	    var count = len >>> 3;
	    array.length = i + count; // 8 bytes per value, count is known
	    for (var j = 0; j < count; ++j)
	        array[i++] = this.fixed64();
	    if (this.pos !== end) throw indexOutOfRange(this, 8);
	    return array;
	};

	/**
	 * Reads a packed repeated field of signed 64 bit fixed values.
	 * @param {Array.<Long|number>} [array] Array to read into; a new one is created if omitted
	 * @returns {Array.<Long|number>} Array read into
	 */
	Reader.prototype.sfixed64s = function read_sfixed64s(array) {
	    if (array === undefined) array = [];
	    var len = this.uint32(), end = this.pos + len, i = array.length;
	    /* istanbul ignore if */
	    if (end > this.len) throw indexOutOfRange(this, len);
	    var count = len >>> 3;
	    array.length = i + count; // 8 bytes per value, count is known
	    for (var j = 0; j < count; ++j)
	        array[i++] = this.sfixed64();
	    if (this.pos !== end) throw indexOutOfRange(this, 8);
	    return array;
	};

	/**
	 * Reads a sequence of bytes preceeded by its length as a varint.
	 * @returns {Uint8Array} Value read
	 */
	Reader.prototype.bytes = function read_bytes() {
	    var length = this.uint32(),
	        start  = this.pos,
	        end    = this.pos + length;

	    /* istanbul ignore if */
	    if (end > this.len)
	        throw indexOutOfRange(this, length);

	    this.pos = end;
	    return this.raw(start, end);
	};

	/**
	 * Reads a string preceeded by its byte length as a varint.
	 * @returns {string} Value read
	 */
	Reader.prototype.string = function read_string() {
	    var length = this.uint32(),
	        start  = this.pos,
	        end    = this.pos + length;

	    /* istanbul ignore if */
	    if (end > this.len)
	        throw indexOutOfRange(this, length);

	    this.pos = end;
	    return utf8.read(this.buf, start, end);
	};

	/**
	 * Reads a string preceeded by its byte length as a varint, rejecting invalid UTF8.
	 * @returns {string} Value read
	 */
	Reader.prototype.stringVerify = function read_string_verify() {
	    var length = this.uint32(),
	        start  = this.pos,
	        end    = this.pos + length;

	    /* istanbul ignore if */
	    if (end > this.len)
	        throw indexOutOfRange(this, length);

	    this.pos = end;
	    return utf8.readStrict(this.buf, start, end);
	};

	/**
	 * Skips the specified number of bytes if specified, otherwise skips a varint.
	 * @param {number} [length] Length if known, otherwise a varint is assumed
	 * @returns {Reader} `this`
	 */
	Reader.prototype.skip = function skip(length) {
	    if (typeof length === "number") {
	        /* istanbul ignore if */
	        if (this.pos + length > this.len)
	            throw indexOutOfRange(this, length);
	        this.pos += length;
	    } else {
	        do {
	            /* istanbul ignore if */
	            if (this.pos >= this.len)
	                throw indexOutOfRange(this);
	        } while (this.buf[this.pos++] & 128);
	    }
	    return this;
	};

	/**
	 * Recursion limit.
	 * @type {number}
	 */
	Reader.recursionLimit = util.recursionLimit;

	/**
	 * Whether readers discard unknown fields while decoding.
	 * @type {boolean}
	 */
	Reader.discardUnknown = true;

	/**
	 * Skips the next element of the specified wire type.
	 * @param {number} wireType Wire type received
	 * @param {number} [depth] Depth of recursion to control nested calls; 0 if omitted
	 * @param {number} [fieldNumber] Field number for validating group end tags
	 * @returns {Reader} `this`
	 */
	Reader.prototype.skipType = function(wireType, depth, fieldNumber) {
	    if (depth === undefined) depth = 0;
	    if (depth > Reader.recursionLimit)
	        throw Error("max depth exceeded");
	    if (fieldNumber === 0)
	        throw Error("illegal tag: field number 0");
	    switch (wireType) {
	        case 0:
	            this.skip();
	            break;
	        case 1:
	            this.skip(8);
	            break;
	        case 2:
	            this.skip(this.uint32());
	            break;
	        case 3:
	            while (true) {
	                var tag = this.tag();
	                var nestedField = tag >>> 3;
	                wireType = tag & 7;
	                if (!nestedField)
	                    throw Error("illegal tag: field number 0");
	                if (wireType === 4) {
	                    if (fieldNumber !== undefined && nestedField !== fieldNumber)
	                        throw Error("invalid end group tag");
	                    break;
	                }
	                this.skipType(wireType, depth + 1, nestedField);
	            }
	            break;
	        case 5:
	            this.skip(4);
	            break;

	        /* istanbul ignore next */
	        default:
	            throw Error("invalid wire type " + wireType + " at offset " + this.pos);
	    }
	    return this;
	};

	Reader._configure = function(BufferReader_) {
	    BufferReader = BufferReader_;
	    Reader.create = create();
	    BufferReader._configure();

	    var fn = util.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
	    util.merge(Reader.prototype, {

	        int64: function read_int64() {
	            return readLongVarint.call(this)[fn](false);
	        },

	        uint64: function read_uint64() {
	            return readLongVarint.call(this)[fn](true);
	        },

	        sint64: function read_sint64() {
	            return readLongVarint.call(this).zzDecode()[fn](false);
	        },

	        fixed64: function read_fixed64() {
	            return readFixed64.call(this)[fn](true);
	        },

	        sfixed64: function read_sfixed64() {
	            return readFixed64.call(this)[fn](false);
	        }

	    });
	};
	return reader;
}

var reader_buffer;
var hasRequiredReader_buffer;

function requireReader_buffer () {
	if (hasRequiredReader_buffer) return reader_buffer;
	hasRequiredReader_buffer = 1;
	reader_buffer = BufferReader;

	// extends Reader
	var Reader = requireReader();
	BufferReader.prototype = Object.create(Reader.prototype, {
	    constructor: {
	        value: BufferReader,
	        writable: true,
	        enumerable: false,
	        configurable: true
	    }
	});

	var util = requireMinimal$1();

	/**
	 * Constructs a new buffer reader instance.
	 * @classdesc Wire format reader using node buffers.
	 * @extends Reader
	 * @constructor
	 * @param {Buffer} buffer Buffer to read from
	 */
	function BufferReader(buffer) {
	    Reader.call(this, buffer);

	    /**
	     * Read buffer.
	     * @name BufferReader#buf
	     * @type {Buffer}
	    */
	}

	BufferReader._configure = function () {
	    /* istanbul ignore else */
	    if (util.Buffer)
	        BufferReader.prototype._slice = util.Buffer.prototype.slice;
	};

	/**
	 * Returns raw bytes from the backing buffer without advancing the reader.
	 * @name BufferReader#raw
	 * @function
	 * @param {number} start Start offset
	 * @param {number} end End offset
	 * @returns {Buffer} Raw bytes
	 */
	BufferReader.prototype.raw = function read_raw_buffer(start, end) {
	    return this._slice.call(this.buf, start, end);
	};

	/**
	 * @override
	 */
	BufferReader.prototype.string = function read_string_buffer() {
	    var len = this.uint32(), // modifies pos
	        start = this.pos,
	        end = this.pos + len;

	    /* istanbul ignore if */
	    if (end > this.len)
	        throw RangeError("index out of range: " + this.pos + " + " + len + " > " + this.len);

	    this.pos = end;
	    return this.buf.utf8Slice
	        ? this.buf.utf8Slice(start, end)
	        : this.buf.toString("utf-8", start, end);
	};

	/**
	 * Reads a sequence of bytes preceeded by its length as a varint.
	 * @name BufferReader#bytes
	 * @function
	 * @returns {Buffer} Value read
	 */

	BufferReader._configure();
	return reader_buffer;
}

var rpc = {};

var service;
var hasRequiredService;

function requireService () {
	if (hasRequiredService) return service;
	hasRequiredService = 1;
	service = Service;

	var util = requireMinimal$1();

	// Extends EventEmitter
	Service.prototype = Object.create(util.EventEmitter.prototype, {
	    constructor: {
	        value: Service,
	        writable: true,
	        enumerable: false,
	        configurable: true
	    }
	});

	/**
	 * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
	 *
	 * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
	 * @typedef rpc.ServiceMethodCallback
	 * @template TRes extends Message<TRes>
	 * @type {function}
	 * @param {Error|null} error Error, if any
	 * @param {TRes} [response] Response message
	 * @returns {undefined}
	 */

	/**
	 * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
	 * @typedef rpc.ServiceMethod
	 * @template TReq extends Message<TReq>
	 * @template TRes extends Message<TRes>
	 * @type {{
	 *   (request: TReq|Properties<TReq>, callback: rpc.ServiceMethodCallback<TRes>): void;
	 *   (request: TReq|Properties<TReq>): Promise<TRes>;
	 *   readonly name: string;
	 *   readonly path: string;
	 *   readonly requestType: string;
	 *   readonly responseType: string;
	 *   readonly requestStream: true|undefined;
	 *   readonly responseStream: true|undefined;
	 * }}
	 */

	/**
	 * Constructs a new RPC service instance.
	 * @classdesc An RPC service as returned by {@link Service#create}.
	 * @exports rpc.Service
	 * @extends util.EventEmitter
	 * @constructor
	 * @param {RPCImpl} rpcImpl RPC implementation
	 * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
	 * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
	 */
	function Service(rpcImpl, requestDelimited, responseDelimited) {

	    if (typeof rpcImpl !== "function")
	        throw TypeError("rpcImpl must be a function");

	    util.EventEmitter.call(this);

	    /**
	     * RPC implementation. Becomes `null` once the service is ended.
	     * @type {RPCImpl|null}
	     */
	    this.rpcImpl = rpcImpl;

	    /**
	     * Whether requests are length-delimited.
	     * @type {boolean}
	     */
	    this.requestDelimited = Boolean(requestDelimited);

	    /**
	     * Whether responses are length-delimited.
	     * @type {boolean}
	     */
	    this.responseDelimited = Boolean(responseDelimited);
	}

	/**
	 * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
	 * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
	 * @param {Constructor<TReq>} requestCtor Request constructor
	 * @param {Constructor<TRes>} responseCtor Response constructor
	 * @param {TReq|Properties<TReq>} request Request message or plain object
	 * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
	 * @returns {undefined}
	 * @template TReq extends Message<TReq>
	 * @template TRes extends Message<TRes>
	 */
	Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {

	    if (!request)
	        throw TypeError("request must be specified");

	    var self = this;
	    if (!callback)
	        return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);

	    if (!self.rpcImpl) {
	        setTimeout(function() { callback(Error("already ended")); }, 0);
	        return undefined;
	    }

	    try {
	        return self.rpcImpl(
	            method,
	            requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
	            function rpcCallback(err, response) {

	                if (err) {
	                    self.emit("error", err, method);
	                    return callback(err);
	                }

	                if (response === null) {
	                    self.end(/* endedByRPC */ true);
	                    return undefined;
	                }

	                if (!(response instanceof responseCtor)) {
	                    try {
	                        response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
	                    } catch (err) {
	                        self.emit("error", err, method);
	                        return callback(err);
	                    }
	                }

	                self.emit("data", response, method);
	                return callback(null, response);
	            }
	        );
	    } catch (err) {
	        self.emit("error", err, method);
	        setTimeout(function() { callback(err); }, 0);
	        return undefined;
	    }
	};

	/**
	 * Ends this service and emits the `end` event.
	 * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
	 * @returns {rpc.Service} `this`
	 */
	Service.prototype.end = function end(endedByRPC) {
	    if (this.rpcImpl) {
	        if (!endedByRPC) // signal end to rpcImpl
	            this.rpcImpl(null, null, null);
	        this.rpcImpl = null;
	        this.emit("end").off();
	    }
	    return this;
	};
	return service;
}

var hasRequiredRpc;

function requireRpc () {
	if (hasRequiredRpc) return rpc;
	hasRequiredRpc = 1;
	(function (exports) {

		/**
		 * Streaming RPC helpers.
		 * @namespace
		 */
		var rpc = exports;

		/**
		 * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
		 * @typedef RPCImpl
		 * @type {function}
		 * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
		 * @param {Uint8Array} requestData Request data
		 * @param {RPCImplCallback} callback Callback function
		 * @returns {undefined}
		 * @example
		 * function rpcImpl(method, requestData, callback) {
		 *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
		 *         throw Error("no such method");
		 *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
		 *         callback(err, responseData);
		 *     });
		 * }
		 */

		/**
		 * Node-style callback as used by {@link RPCImpl}.
		 * @typedef RPCImplCallback
		 * @type {function}
		 * @param {Error|null} error Error, if any, otherwise `null`
		 * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
		 * @returns {undefined}
		 */

		rpc.Service = requireService(); 
	} (rpc));
	return rpc;
}

var roots;
var hasRequiredRoots;

function requireRoots () {
	if (hasRequiredRoots) return roots;
	hasRequiredRoots = 1;
	roots = Object.create(null);

	/**
	 * Named roots.
	 * This is where pbjs stores generated structures (the option `-r, --root` specifies a name).
	 * Can also be used manually to make roots available across modules.
	 * @name roots
	 * @type {Object.<string,Root>}
	 * @example
	 * // pbjs -r myroot -o compiled.js ...
	 *
	 * // in another module:
	 * require("./compiled.js");
	 *
	 * // in any subsequent module:
	 * var root = protobuf.roots["myroot"];
	 */
	return roots;
}

var hasRequiredIndexMinimal;

function requireIndexMinimal () {
	if (hasRequiredIndexMinimal) return indexMinimal;
	hasRequiredIndexMinimal = 1;
	(function (exports) {

		/**
		 * Build type, one of `"full"`, `"light"` or `"minimal"`.
		 * @name build
		 * @type {string}
		 * @const
		 */
		exports.build = "minimal";

		// Serialization
		exports.Writer       = requireWriter();
		exports.BufferWriter = requireWriter_buffer();
		exports.Reader       = requireReader();
		exports.BufferReader = requireReader_buffer();

		// Utility
		exports.util         = requireMinimal$1();
		exports.rpc          = requireRpc();
		exports.roots        = requireRoots();
		exports.configure    = configure;

		/* istanbul ignore next */
		/**
		 * Reconfigures the library according to the environment.
		 * @returns {undefined}
		 */
		function configure() {
		    exports.util.LongBits._configure(exports.util.Long);
		    exports.Writer._configure(exports.BufferWriter);
		    exports.Reader._configure(exports.BufferReader);
		}

		// Set up buffer utility according to the environment
		configure(); 
	} (indexMinimal));
	return indexMinimal;
}

var minimal;
var hasRequiredMinimal;

function requireMinimal () {
	if (hasRequiredMinimal) return minimal;
	hasRequiredMinimal = 1;
	minimal = requireIndexMinimal();
	return minimal;
}

var minimalExports = requireMinimal();
var $protobuf = /*@__PURE__*/getDefaultExportFromCjs(minimalExports);

/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-mixed-operators, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars, default-case, jsdoc/require-param*/

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
const $Object = $util.global.Object, $undefined = $util.global.undefined, $Error = $util.global.Error;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

const textsecure = $root.textsecure = (() => {

    /**
     * Namespace textsecure.
     * @exports textsecure
     * @namespace
     */
    const textsecure = {};

    textsecure.WhisperMessage = (function() {

        /**
         * Properties of a WhisperMessage.
         * @typedef {Object} textsecure.WhisperMessage.$Properties
         * @property {Uint8Array|null} [ephemeralKey] WhisperMessage ephemeralKey
         * @property {number|null} [counter] WhisperMessage counter
         * @property {number|null} [previousCounter] WhisperMessage previousCounter
         * @property {Uint8Array|null} [ciphertext] WhisperMessage ciphertext
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a WhisperMessage.
         * @memberof textsecure
         * @interface IWhisperMessage
         * @augments textsecure.WhisperMessage.$Properties
         * @deprecated Use textsecure.WhisperMessage.$Properties instead.
         */

        /**
         * Shape of a WhisperMessage.
         * @typedef {textsecure.WhisperMessage.$Properties} textsecure.WhisperMessage.$Shape
         */

        /**
         * Constructs a new WhisperMessage.
         * @memberof textsecure
         * @classdesc Represents a WhisperMessage.
         * @constructor
         * @param {textsecure.WhisperMessage.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const WhisperMessage = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * WhisperMessage ephemeralKey.
         * @member {Uint8Array} ephemeralKey
         * @memberof textsecure.WhisperMessage
         * @instance
         */
        WhisperMessage.prototype.ephemeralKey = $util.newBuffer([]);

        /**
         * WhisperMessage counter.
         * @member {number} counter
         * @memberof textsecure.WhisperMessage
         * @instance
         */
        WhisperMessage.prototype.counter = 0;

        /**
         * WhisperMessage previousCounter.
         * @member {number} previousCounter
         * @memberof textsecure.WhisperMessage
         * @instance
         */
        WhisperMessage.prototype.previousCounter = 0;

        /**
         * WhisperMessage ciphertext.
         * @member {Uint8Array} ciphertext
         * @memberof textsecure.WhisperMessage
         * @instance
         */
        WhisperMessage.prototype.ciphertext = $util.newBuffer([]);

        /**
         * Creates a new WhisperMessage instance using the specified properties.
         * @function create
         * @memberof textsecure.WhisperMessage
         * @static
         * @param {textsecure.WhisperMessage.$Properties=} [properties] Properties to set
         * @returns {textsecure.WhisperMessage} WhisperMessage instance
         * @type {{
         *   (properties: textsecure.WhisperMessage.$Shape): textsecure.WhisperMessage & textsecure.WhisperMessage.$Shape;
         *   (properties?: textsecure.WhisperMessage.$Properties): textsecure.WhisperMessage;
         * }}
         */
        WhisperMessage.create = function(properties) {
            return new WhisperMessage(properties);
        };

        /**
         * Encodes the specified WhisperMessage message. Does not implicitly {@link textsecure.WhisperMessage.verify|verify} messages.
         * @function encode
         * @memberof textsecure.WhisperMessage
         * @static
         * @param {textsecure.WhisperMessage.$Properties} message WhisperMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WhisperMessage.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.ephemeralKey != null && $Object.hasOwnProperty.call(message, "ephemeralKey"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.ephemeralKey);
            if (message.counter != null && $Object.hasOwnProperty.call(message, "counter"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.counter);
            if (message.previousCounter != null && $Object.hasOwnProperty.call(message, "previousCounter"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.previousCounter);
            if (message.ciphertext != null && $Object.hasOwnProperty.call(message, "ciphertext"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.ciphertext);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a WhisperMessage message from the specified reader or buffer.
         * @function decode
         * @memberof textsecure.WhisperMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {textsecure.WhisperMessage & textsecure.WhisperMessage.$Shape} WhisperMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WhisperMessage.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.textsecure.WhisperMessage();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.ephemeralKey = reader.bytes();
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        message.counter = reader.uint32();
                        continue;
                    }
                case 3: {
                        if (wireType !== 0)
                            break;
                        message.previousCounter = reader.uint32();
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.ciphertext = reader.bytes();
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Gets the type url for WhisperMessage
         * @function getTypeUrl
         * @memberof textsecure.WhisperMessage
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        WhisperMessage.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/textsecure.WhisperMessage";
        };

        return WhisperMessage;
    })();

    textsecure.PreKeyWhisperMessage = (function() {

        /**
         * Properties of a PreKeyWhisperMessage.
         * @typedef {Object} textsecure.PreKeyWhisperMessage.$Properties
         * @property {number|null} [registrationId] PreKeyWhisperMessage registrationId
         * @property {number|null} [preKeyId] PreKeyWhisperMessage preKeyId
         * @property {number|null} [signedPreKeyId] PreKeyWhisperMessage signedPreKeyId
         * @property {Uint8Array|null} [baseKey] PreKeyWhisperMessage baseKey
         * @property {Uint8Array|null} [identityKey] PreKeyWhisperMessage identityKey
         * @property {Uint8Array|null} [message] PreKeyWhisperMessage message
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a PreKeyWhisperMessage.
         * @memberof textsecure
         * @interface IPreKeyWhisperMessage
         * @augments textsecure.PreKeyWhisperMessage.$Properties
         * @deprecated Use textsecure.PreKeyWhisperMessage.$Properties instead.
         */

        /**
         * Shape of a PreKeyWhisperMessage.
         * @typedef {textsecure.PreKeyWhisperMessage.$Properties} textsecure.PreKeyWhisperMessage.$Shape
         */

        /**
         * Constructs a new PreKeyWhisperMessage.
         * @memberof textsecure
         * @classdesc Represents a PreKeyWhisperMessage.
         * @constructor
         * @param {textsecure.PreKeyWhisperMessage.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const PreKeyWhisperMessage = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * PreKeyWhisperMessage registrationId.
         * @member {number} registrationId
         * @memberof textsecure.PreKeyWhisperMessage
         * @instance
         */
        PreKeyWhisperMessage.prototype.registrationId = 0;

        /**
         * PreKeyWhisperMessage preKeyId.
         * @member {number} preKeyId
         * @memberof textsecure.PreKeyWhisperMessage
         * @instance
         */
        PreKeyWhisperMessage.prototype.preKeyId = 0;

        /**
         * PreKeyWhisperMessage signedPreKeyId.
         * @member {number} signedPreKeyId
         * @memberof textsecure.PreKeyWhisperMessage
         * @instance
         */
        PreKeyWhisperMessage.prototype.signedPreKeyId = 0;

        /**
         * PreKeyWhisperMessage baseKey.
         * @member {Uint8Array} baseKey
         * @memberof textsecure.PreKeyWhisperMessage
         * @instance
         */
        PreKeyWhisperMessage.prototype.baseKey = $util.newBuffer([]);

        /**
         * PreKeyWhisperMessage identityKey.
         * @member {Uint8Array} identityKey
         * @memberof textsecure.PreKeyWhisperMessage
         * @instance
         */
        PreKeyWhisperMessage.prototype.identityKey = $util.newBuffer([]);

        /**
         * PreKeyWhisperMessage message.
         * @member {Uint8Array} message
         * @memberof textsecure.PreKeyWhisperMessage
         * @instance
         */
        PreKeyWhisperMessage.prototype.message = $util.newBuffer([]);

        /**
         * Creates a new PreKeyWhisperMessage instance using the specified properties.
         * @function create
         * @memberof textsecure.PreKeyWhisperMessage
         * @static
         * @param {textsecure.PreKeyWhisperMessage.$Properties=} [properties] Properties to set
         * @returns {textsecure.PreKeyWhisperMessage} PreKeyWhisperMessage instance
         * @type {{
         *   (properties: textsecure.PreKeyWhisperMessage.$Shape): textsecure.PreKeyWhisperMessage & textsecure.PreKeyWhisperMessage.$Shape;
         *   (properties?: textsecure.PreKeyWhisperMessage.$Properties): textsecure.PreKeyWhisperMessage;
         * }}
         */
        PreKeyWhisperMessage.create = function(properties) {
            return new PreKeyWhisperMessage(properties);
        };

        /**
         * Encodes the specified PreKeyWhisperMessage message. Does not implicitly {@link textsecure.PreKeyWhisperMessage.verify|verify} messages.
         * @function encode
         * @memberof textsecure.PreKeyWhisperMessage
         * @static
         * @param {textsecure.PreKeyWhisperMessage.$Properties} message PreKeyWhisperMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PreKeyWhisperMessage.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.preKeyId != null && $Object.hasOwnProperty.call(message, "preKeyId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.preKeyId);
            if (message.baseKey != null && $Object.hasOwnProperty.call(message, "baseKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.baseKey);
            if (message.identityKey != null && $Object.hasOwnProperty.call(message, "identityKey"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.identityKey);
            if (message.message != null && $Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.message);
            if (message.registrationId != null && $Object.hasOwnProperty.call(message, "registrationId"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.registrationId);
            if (message.signedPreKeyId != null && $Object.hasOwnProperty.call(message, "signedPreKeyId"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.signedPreKeyId);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a PreKeyWhisperMessage message from the specified reader or buffer.
         * @function decode
         * @memberof textsecure.PreKeyWhisperMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {textsecure.PreKeyWhisperMessage & textsecure.PreKeyWhisperMessage.$Shape} PreKeyWhisperMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PreKeyWhisperMessage.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.textsecure.PreKeyWhisperMessage();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 5: {
                        if (wireType !== 0)
                            break;
                        message.registrationId = reader.uint32();
                        continue;
                    }
                case 1: {
                        if (wireType !== 0)
                            break;
                        message.preKeyId = reader.uint32();
                        continue;
                    }
                case 6: {
                        if (wireType !== 0)
                            break;
                        message.signedPreKeyId = reader.uint32();
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.baseKey = reader.bytes();
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.identityKey = reader.bytes();
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.message = reader.bytes();
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Gets the type url for PreKeyWhisperMessage
         * @function getTypeUrl
         * @memberof textsecure.PreKeyWhisperMessage
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        PreKeyWhisperMessage.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/textsecure.PreKeyWhisperMessage";
        };

        return PreKeyWhisperMessage;
    })();

    textsecure.KeyExchangeMessage = (function() {

        /**
         * Properties of a KeyExchangeMessage.
         * @typedef {Object} textsecure.KeyExchangeMessage.$Properties
         * @property {number|null} [id] KeyExchangeMessage id
         * @property {Uint8Array|null} [baseKey] KeyExchangeMessage baseKey
         * @property {Uint8Array|null} [ephemeralKey] KeyExchangeMessage ephemeralKey
         * @property {Uint8Array|null} [identityKey] KeyExchangeMessage identityKey
         * @property {Uint8Array|null} [baseKeySignature] KeyExchangeMessage baseKeySignature
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a KeyExchangeMessage.
         * @memberof textsecure
         * @interface IKeyExchangeMessage
         * @augments textsecure.KeyExchangeMessage.$Properties
         * @deprecated Use textsecure.KeyExchangeMessage.$Properties instead.
         */

        /**
         * Shape of a KeyExchangeMessage.
         * @typedef {textsecure.KeyExchangeMessage.$Properties} textsecure.KeyExchangeMessage.$Shape
         */

        /**
         * Constructs a new KeyExchangeMessage.
         * @memberof textsecure
         * @classdesc Represents a KeyExchangeMessage.
         * @constructor
         * @param {textsecure.KeyExchangeMessage.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const KeyExchangeMessage = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * KeyExchangeMessage id.
         * @member {number} id
         * @memberof textsecure.KeyExchangeMessage
         * @instance
         */
        KeyExchangeMessage.prototype.id = 0;

        /**
         * KeyExchangeMessage baseKey.
         * @member {Uint8Array} baseKey
         * @memberof textsecure.KeyExchangeMessage
         * @instance
         */
        KeyExchangeMessage.prototype.baseKey = $util.newBuffer([]);

        /**
         * KeyExchangeMessage ephemeralKey.
         * @member {Uint8Array} ephemeralKey
         * @memberof textsecure.KeyExchangeMessage
         * @instance
         */
        KeyExchangeMessage.prototype.ephemeralKey = $util.newBuffer([]);

        /**
         * KeyExchangeMessage identityKey.
         * @member {Uint8Array} identityKey
         * @memberof textsecure.KeyExchangeMessage
         * @instance
         */
        KeyExchangeMessage.prototype.identityKey = $util.newBuffer([]);

        /**
         * KeyExchangeMessage baseKeySignature.
         * @member {Uint8Array} baseKeySignature
         * @memberof textsecure.KeyExchangeMessage
         * @instance
         */
        KeyExchangeMessage.prototype.baseKeySignature = $util.newBuffer([]);

        /**
         * Creates a new KeyExchangeMessage instance using the specified properties.
         * @function create
         * @memberof textsecure.KeyExchangeMessage
         * @static
         * @param {textsecure.KeyExchangeMessage.$Properties=} [properties] Properties to set
         * @returns {textsecure.KeyExchangeMessage} KeyExchangeMessage instance
         * @type {{
         *   (properties: textsecure.KeyExchangeMessage.$Shape): textsecure.KeyExchangeMessage & textsecure.KeyExchangeMessage.$Shape;
         *   (properties?: textsecure.KeyExchangeMessage.$Properties): textsecure.KeyExchangeMessage;
         * }}
         */
        KeyExchangeMessage.create = function(properties) {
            return new KeyExchangeMessage(properties);
        };

        /**
         * Encodes the specified KeyExchangeMessage message. Does not implicitly {@link textsecure.KeyExchangeMessage.verify|verify} messages.
         * @function encode
         * @memberof textsecure.KeyExchangeMessage
         * @static
         * @param {textsecure.KeyExchangeMessage.$Properties} message KeyExchangeMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        KeyExchangeMessage.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.baseKey != null && $Object.hasOwnProperty.call(message, "baseKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.baseKey);
            if (message.ephemeralKey != null && $Object.hasOwnProperty.call(message, "ephemeralKey"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.ephemeralKey);
            if (message.identityKey != null && $Object.hasOwnProperty.call(message, "identityKey"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.identityKey);
            if (message.baseKeySignature != null && $Object.hasOwnProperty.call(message, "baseKeySignature"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.baseKeySignature);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a KeyExchangeMessage message from the specified reader or buffer.
         * @function decode
         * @memberof textsecure.KeyExchangeMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {textsecure.KeyExchangeMessage & textsecure.KeyExchangeMessage.$Shape} KeyExchangeMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        KeyExchangeMessage.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.textsecure.KeyExchangeMessage();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        message.id = reader.uint32();
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.baseKey = reader.bytes();
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.ephemeralKey = reader.bytes();
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.identityKey = reader.bytes();
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        message.baseKeySignature = reader.bytes();
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Gets the type url for KeyExchangeMessage
         * @function getTypeUrl
         * @memberof textsecure.KeyExchangeMessage
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        KeyExchangeMessage.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/textsecure.KeyExchangeMessage";
        };

        return KeyExchangeMessage;
    })();

    textsecure.IncomingPushMessageSignal = (function() {

        /**
         * Properties of an IncomingPushMessageSignal.
         * @typedef {Object} textsecure.IncomingPushMessageSignal.$Properties
         * @property {textsecure.IncomingPushMessageSignal.Type|null} [type] IncomingPushMessageSignal type
         * @property {string|null} [source] IncomingPushMessageSignal source
         * @property {number|null} [sourceDevice] IncomingPushMessageSignal sourceDevice
         * @property {string|null} [relay] IncomingPushMessageSignal relay
         * @property {number|null} [timestamp] IncomingPushMessageSignal timestamp
         * @property {Uint8Array|null} [message] IncomingPushMessageSignal message
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of an IncomingPushMessageSignal.
         * @memberof textsecure
         * @interface IIncomingPushMessageSignal
         * @augments textsecure.IncomingPushMessageSignal.$Properties
         * @deprecated Use textsecure.IncomingPushMessageSignal.$Properties instead.
         */

        /**
         * Shape of an IncomingPushMessageSignal.
         * @typedef {textsecure.IncomingPushMessageSignal.$Properties} textsecure.IncomingPushMessageSignal.$Shape
         */

        /**
         * Constructs a new IncomingPushMessageSignal.
         * @memberof textsecure
         * @classdesc Represents an IncomingPushMessageSignal.
         * @constructor
         * @param {textsecure.IncomingPushMessageSignal.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const IncomingPushMessageSignal = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * IncomingPushMessageSignal type.
         * @member {textsecure.IncomingPushMessageSignal.Type} type
         * @memberof textsecure.IncomingPushMessageSignal
         * @instance
         */
        IncomingPushMessageSignal.prototype.type = 0;

        /**
         * IncomingPushMessageSignal source.
         * @member {string} source
         * @memberof textsecure.IncomingPushMessageSignal
         * @instance
         */
        IncomingPushMessageSignal.prototype.source = "";

        /**
         * IncomingPushMessageSignal sourceDevice.
         * @member {number} sourceDevice
         * @memberof textsecure.IncomingPushMessageSignal
         * @instance
         */
        IncomingPushMessageSignal.prototype.sourceDevice = 0;

        /**
         * IncomingPushMessageSignal relay.
         * @member {string} relay
         * @memberof textsecure.IncomingPushMessageSignal
         * @instance
         */
        IncomingPushMessageSignal.prototype.relay = "";

        /**
         * IncomingPushMessageSignal timestamp.
         * @member {number} timestamp
         * @memberof textsecure.IncomingPushMessageSignal
         * @instance
         */
        IncomingPushMessageSignal.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * IncomingPushMessageSignal message.
         * @member {Uint8Array} message
         * @memberof textsecure.IncomingPushMessageSignal
         * @instance
         */
        IncomingPushMessageSignal.prototype.message = $util.newBuffer([]);

        /**
         * Creates a new IncomingPushMessageSignal instance using the specified properties.
         * @function create
         * @memberof textsecure.IncomingPushMessageSignal
         * @static
         * @param {textsecure.IncomingPushMessageSignal.$Properties=} [properties] Properties to set
         * @returns {textsecure.IncomingPushMessageSignal} IncomingPushMessageSignal instance
         * @type {{
         *   (properties: textsecure.IncomingPushMessageSignal.$Shape): textsecure.IncomingPushMessageSignal & textsecure.IncomingPushMessageSignal.$Shape;
         *   (properties?: textsecure.IncomingPushMessageSignal.$Properties): textsecure.IncomingPushMessageSignal;
         * }}
         */
        IncomingPushMessageSignal.create = function(properties) {
            return new IncomingPushMessageSignal(properties);
        };

        /**
         * Encodes the specified IncomingPushMessageSignal message. Does not implicitly {@link textsecure.IncomingPushMessageSignal.verify|verify} messages.
         * @function encode
         * @memberof textsecure.IncomingPushMessageSignal
         * @static
         * @param {textsecure.IncomingPushMessageSignal.$Properties} message IncomingPushMessageSignal message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IncomingPushMessageSignal.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.source != null && $Object.hasOwnProperty.call(message, "source"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.source);
            if (message.relay != null && $Object.hasOwnProperty.call(message, "relay"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.relay);
            if (message.timestamp != null && $Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.timestamp);
            if (message.message != null && $Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.message);
            if (message.sourceDevice != null && $Object.hasOwnProperty.call(message, "sourceDevice"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.sourceDevice);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes an IncomingPushMessageSignal message from the specified reader or buffer.
         * @function decode
         * @memberof textsecure.IncomingPushMessageSignal
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {textsecure.IncomingPushMessageSignal & textsecure.IncomingPushMessageSignal.$Shape} IncomingPushMessageSignal
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IncomingPushMessageSignal.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.textsecure.IncomingPushMessageSignal();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        message.type = reader.int32();
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.source = reader.string();
                        continue;
                    }
                case 7: {
                        if (wireType !== 0)
                            break;
                        message.sourceDevice = reader.uint32();
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.relay = reader.string();
                        continue;
                    }
                case 5: {
                        if (wireType !== 0)
                            break;
                        message.timestamp = reader.uint64();
                        continue;
                    }
                case 6: {
                        if (wireType !== 2)
                            break;
                        message.message = reader.bytes();
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Gets the type url for IncomingPushMessageSignal
         * @function getTypeUrl
         * @memberof textsecure.IncomingPushMessageSignal
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        IncomingPushMessageSignal.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/textsecure.IncomingPushMessageSignal";
        };

        /**
         * Type enum.
         * @name textsecure.IncomingPushMessageSignal.Type
         * @enum {number}
         * @property {number} UNKNOWN=0 UNKNOWN value
         * @property {number} CIPHERTEXT=1 CIPHERTEXT value
         * @property {number} KEY_EXCHANGE=2 KEY_EXCHANGE value
         * @property {number} PREKEY_BUNDLE=3 PREKEY_BUNDLE value
         * @property {number} PLAINTEXT=4 PLAINTEXT value
         * @property {number} RECEIPT=5 RECEIPT value
         * @property {number} PREKEY_BUNDLE_DEVICE_CONTROL=6 PREKEY_BUNDLE_DEVICE_CONTROL value
         * @property {number} DEVICE_CONTROL=7 DEVICE_CONTROL value
         */
        IncomingPushMessageSignal.Type = (function() {
            const valuesById = {}, values = $Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN"] = 0;
            values[valuesById[1] = "CIPHERTEXT"] = 1;
            values[valuesById[2] = "KEY_EXCHANGE"] = 2;
            values[valuesById[3] = "PREKEY_BUNDLE"] = 3;
            values[valuesById[4] = "PLAINTEXT"] = 4;
            values[valuesById[5] = "RECEIPT"] = 5;
            values[valuesById[6] = "PREKEY_BUNDLE_DEVICE_CONTROL"] = 6;
            values[valuesById[7] = "DEVICE_CONTROL"] = 7;
            return values;
        })();

        return IncomingPushMessageSignal;
    })();

    textsecure.PushMessageContent = (function() {

        /**
         * Properties of a PushMessageContent.
         * @typedef {Object} textsecure.PushMessageContent.$Properties
         * @property {string|null} [body] PushMessageContent body
         * @property {Array.<textsecure.PushMessageContent.AttachmentPointer.$Properties>|null} [attachments] PushMessageContent attachments
         * @property {textsecure.PushMessageContent.GroupContext.$Properties|null} [group] PushMessageContent group
         * @property {number|null} [flags] PushMessageContent flags
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a PushMessageContent.
         * @memberof textsecure
         * @interface IPushMessageContent
         * @augments textsecure.PushMessageContent.$Properties
         * @deprecated Use textsecure.PushMessageContent.$Properties instead.
         */

        /**
         * Shape of a PushMessageContent.
         * @typedef {textsecure.PushMessageContent.$Properties} textsecure.PushMessageContent.$Shape
         */

        /**
         * Constructs a new PushMessageContent.
         * @memberof textsecure
         * @classdesc Represents a PushMessageContent.
         * @constructor
         * @param {textsecure.PushMessageContent.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const PushMessageContent = function (properties) {
            this.attachments = [];
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * PushMessageContent body.
         * @member {string} body
         * @memberof textsecure.PushMessageContent
         * @instance
         */
        PushMessageContent.prototype.body = "";

        /**
         * PushMessageContent attachments.
         * @member {Array.<textsecure.PushMessageContent.AttachmentPointer.$Properties>} attachments
         * @memberof textsecure.PushMessageContent
         * @instance
         */
        PushMessageContent.prototype.attachments = $util.emptyArray;

        /**
         * PushMessageContent group.
         * @member {textsecure.PushMessageContent.GroupContext.$Properties|null|undefined} group
         * @memberof textsecure.PushMessageContent
         * @instance
         */
        PushMessageContent.prototype.group = null;

        /**
         * PushMessageContent flags.
         * @member {number} flags
         * @memberof textsecure.PushMessageContent
         * @instance
         */
        PushMessageContent.prototype.flags = 0;

        /**
         * Creates a new PushMessageContent instance using the specified properties.
         * @function create
         * @memberof textsecure.PushMessageContent
         * @static
         * @param {textsecure.PushMessageContent.$Properties=} [properties] Properties to set
         * @returns {textsecure.PushMessageContent} PushMessageContent instance
         * @type {{
         *   (properties: textsecure.PushMessageContent.$Shape): textsecure.PushMessageContent & textsecure.PushMessageContent.$Shape;
         *   (properties?: textsecure.PushMessageContent.$Properties): textsecure.PushMessageContent;
         * }}
         */
        PushMessageContent.create = function(properties) {
            return new PushMessageContent(properties);
        };

        /**
         * Encodes the specified PushMessageContent message. Does not implicitly {@link textsecure.PushMessageContent.verify|verify} messages.
         * @function encode
         * @memberof textsecure.PushMessageContent
         * @static
         * @param {textsecure.PushMessageContent.$Properties} message PushMessageContent message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PushMessageContent.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            if (message.body != null && $Object.hasOwnProperty.call(message, "body"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.body);
            if (message.attachments != null && message.attachments.length)
                for (let i = 0; i < message.attachments.length; ++i)
                    $root.textsecure.PushMessageContent.AttachmentPointer.encode(message.attachments[i], writer.uint32(/* id 2, wireType 2 =*/18).fork(), _depth + 1).ldelim();
            if (message.group != null && $Object.hasOwnProperty.call(message, "group"))
                $root.textsecure.PushMessageContent.GroupContext.encode(message.group, writer.uint32(/* id 3, wireType 2 =*/26).fork(), _depth + 1).ldelim();
            if (message.flags != null && $Object.hasOwnProperty.call(message, "flags"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.flags);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a PushMessageContent message from the specified reader or buffer.
         * @function decode
         * @memberof textsecure.PushMessageContent
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {textsecure.PushMessageContent & textsecure.PushMessageContent.$Shape} PushMessageContent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PushMessageContent.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.textsecure.PushMessageContent();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.body = reader.string();
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        if (!(message.attachments && message.attachments.length))
                            message.attachments = [];
                        message.attachments.push($root.textsecure.PushMessageContent.AttachmentPointer.decode(reader, reader.uint32(), $undefined, _depth + 1));
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.group = $root.textsecure.PushMessageContent.GroupContext.decode(reader, reader.uint32(), $undefined, _depth + 1, message.group);
                        continue;
                    }
                case 4: {
                        if (wireType !== 0)
                            break;
                        message.flags = reader.uint32();
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            return message;
        };

        /**
         * Gets the type url for PushMessageContent
         * @function getTypeUrl
         * @memberof textsecure.PushMessageContent
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        PushMessageContent.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/textsecure.PushMessageContent";
        };

        PushMessageContent.AttachmentPointer = (function() {

            /**
             * Properties of an AttachmentPointer.
             * @typedef {Object} textsecure.PushMessageContent.AttachmentPointer.$Properties
             * @property {number|null} [id] AttachmentPointer id
             * @property {string|null} [contentType] AttachmentPointer contentType
             * @property {Uint8Array|null} [key] AttachmentPointer key
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of an AttachmentPointer.
             * @memberof textsecure.PushMessageContent
             * @interface IAttachmentPointer
             * @augments textsecure.PushMessageContent.AttachmentPointer.$Properties
             * @deprecated Use textsecure.PushMessageContent.AttachmentPointer.$Properties instead.
             */

            /**
             * Shape of an AttachmentPointer.
             * @typedef {textsecure.PushMessageContent.AttachmentPointer.$Properties} textsecure.PushMessageContent.AttachmentPointer.$Shape
             */

            /**
             * Constructs a new AttachmentPointer.
             * @memberof textsecure.PushMessageContent
             * @classdesc Represents an AttachmentPointer.
             * @constructor
             * @param {textsecure.PushMessageContent.AttachmentPointer.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const AttachmentPointer = function (properties) {
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * AttachmentPointer id.
             * @member {number} id
             * @memberof textsecure.PushMessageContent.AttachmentPointer
             * @instance
             */
            AttachmentPointer.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * AttachmentPointer contentType.
             * @member {string} contentType
             * @memberof textsecure.PushMessageContent.AttachmentPointer
             * @instance
             */
            AttachmentPointer.prototype.contentType = "";

            /**
             * AttachmentPointer key.
             * @member {Uint8Array} key
             * @memberof textsecure.PushMessageContent.AttachmentPointer
             * @instance
             */
            AttachmentPointer.prototype.key = $util.newBuffer([]);

            /**
             * Creates a new AttachmentPointer instance using the specified properties.
             * @function create
             * @memberof textsecure.PushMessageContent.AttachmentPointer
             * @static
             * @param {textsecure.PushMessageContent.AttachmentPointer.$Properties=} [properties] Properties to set
             * @returns {textsecure.PushMessageContent.AttachmentPointer} AttachmentPointer instance
             * @type {{
             *   (properties: textsecure.PushMessageContent.AttachmentPointer.$Shape): textsecure.PushMessageContent.AttachmentPointer & textsecure.PushMessageContent.AttachmentPointer.$Shape;
             *   (properties?: textsecure.PushMessageContent.AttachmentPointer.$Properties): textsecure.PushMessageContent.AttachmentPointer;
             * }}
             */
            AttachmentPointer.create = function(properties) {
                return new AttachmentPointer(properties);
            };

            /**
             * Encodes the specified AttachmentPointer message. Does not implicitly {@link textsecure.PushMessageContent.AttachmentPointer.verify|verify} messages.
             * @function encode
             * @memberof textsecure.PushMessageContent.AttachmentPointer
             * @static
             * @param {textsecure.PushMessageContent.AttachmentPointer.$Properties} message AttachmentPointer message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AttachmentPointer.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 1 =*/9).fixed64(message.id);
                if (message.contentType != null && $Object.hasOwnProperty.call(message, "contentType"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.contentType);
                if (message.key != null && $Object.hasOwnProperty.call(message, "key"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.key);
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Decodes an AttachmentPointer message from the specified reader or buffer.
             * @function decode
             * @memberof textsecure.PushMessageContent.AttachmentPointer
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {textsecure.PushMessageContent.AttachmentPointer & textsecure.PushMessageContent.AttachmentPointer.$Shape} AttachmentPointer
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AttachmentPointer.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.textsecure.PushMessageContent.AttachmentPointer();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 1)
                                break;
                            message.id = reader.fixed64();
                            continue;
                        }
                    case 2: {
                            if (wireType !== 2)
                                break;
                            message.contentType = reader.string();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.key = reader.bytes();
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Gets the type url for AttachmentPointer
             * @function getTypeUrl
             * @memberof textsecure.PushMessageContent.AttachmentPointer
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            AttachmentPointer.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/textsecure.PushMessageContent.AttachmentPointer";
            };

            return AttachmentPointer;
        })();

        PushMessageContent.GroupContext = (function() {

            /**
             * Properties of a GroupContext.
             * @typedef {Object} textsecure.PushMessageContent.GroupContext.$Properties
             * @property {Uint8Array|null} [id] GroupContext id
             * @property {textsecure.PushMessageContent.GroupContext.Type|null} [type] GroupContext type
             * @property {string|null} [name] GroupContext name
             * @property {Array.<string>|null} [members] GroupContext members
             * @property {textsecure.PushMessageContent.AttachmentPointer.$Properties|null} [avatar] GroupContext avatar
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */

            /**
             * Properties of a GroupContext.
             * @memberof textsecure.PushMessageContent
             * @interface IGroupContext
             * @augments textsecure.PushMessageContent.GroupContext.$Properties
             * @deprecated Use textsecure.PushMessageContent.GroupContext.$Properties instead.
             */

            /**
             * Shape of a GroupContext.
             * @typedef {textsecure.PushMessageContent.GroupContext.$Properties} textsecure.PushMessageContent.GroupContext.$Shape
             */

            /**
             * Constructs a new GroupContext.
             * @memberof textsecure.PushMessageContent
             * @classdesc Represents a GroupContext.
             * @constructor
             * @param {textsecure.PushMessageContent.GroupContext.$Properties=} [properties] Properties to set
             * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
             */
            const GroupContext = function (properties) {
                this.members = [];
                if (properties)
                    for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null && keys[i] !== "__proto__")
                            this[keys[i]] = properties[keys[i]];
            };

            /**
             * GroupContext id.
             * @member {Uint8Array} id
             * @memberof textsecure.PushMessageContent.GroupContext
             * @instance
             */
            GroupContext.prototype.id = $util.newBuffer([]);

            /**
             * GroupContext type.
             * @member {textsecure.PushMessageContent.GroupContext.Type} type
             * @memberof textsecure.PushMessageContent.GroupContext
             * @instance
             */
            GroupContext.prototype.type = 0;

            /**
             * GroupContext name.
             * @member {string} name
             * @memberof textsecure.PushMessageContent.GroupContext
             * @instance
             */
            GroupContext.prototype.name = "";

            /**
             * GroupContext members.
             * @member {Array.<string>} members
             * @memberof textsecure.PushMessageContent.GroupContext
             * @instance
             */
            GroupContext.prototype.members = $util.emptyArray;

            /**
             * GroupContext avatar.
             * @member {textsecure.PushMessageContent.AttachmentPointer.$Properties|null|undefined} avatar
             * @memberof textsecure.PushMessageContent.GroupContext
             * @instance
             */
            GroupContext.prototype.avatar = null;

            /**
             * Creates a new GroupContext instance using the specified properties.
             * @function create
             * @memberof textsecure.PushMessageContent.GroupContext
             * @static
             * @param {textsecure.PushMessageContent.GroupContext.$Properties=} [properties] Properties to set
             * @returns {textsecure.PushMessageContent.GroupContext} GroupContext instance
             * @type {{
             *   (properties: textsecure.PushMessageContent.GroupContext.$Shape): textsecure.PushMessageContent.GroupContext & textsecure.PushMessageContent.GroupContext.$Shape;
             *   (properties?: textsecure.PushMessageContent.GroupContext.$Properties): textsecure.PushMessageContent.GroupContext;
             * }}
             */
            GroupContext.create = function(properties) {
                return new GroupContext(properties);
            };

            /**
             * Encodes the specified GroupContext message. Does not implicitly {@link textsecure.PushMessageContent.GroupContext.verify|verify} messages.
             * @function encode
             * @memberof textsecure.PushMessageContent.GroupContext
             * @static
             * @param {textsecure.PushMessageContent.GroupContext.$Properties} message GroupContext message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            GroupContext.encode = function (message, writer, _depth) {
                if (!writer)
                    writer = $Writer.create();
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $util.recursionLimit)
                    throw $Error("max depth exceeded");
                if (message.id != null && $Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.id);
                if (message.type != null && $Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.type);
                if (message.name != null && $Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
                if (message.members != null && message.members.length)
                    for (let i = 0; i < message.members.length; ++i)
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.members[i]);
                if (message.avatar != null && $Object.hasOwnProperty.call(message, "avatar"))
                    $root.textsecure.PushMessageContent.AttachmentPointer.encode(message.avatar, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
                if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                    for (let i = 0; i < message.$unknowns.length; ++i)
                        writer.raw(message.$unknowns[i]);
                return writer;
            };

            /**
             * Decodes a GroupContext message from the specified reader or buffer.
             * @function decode
             * @memberof textsecure.PushMessageContent.GroupContext
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {textsecure.PushMessageContent.GroupContext & textsecure.PushMessageContent.GroupContext.$Shape} GroupContext
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            GroupContext.decode = function (reader, length, _end, _depth, _target) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                if (_depth === $undefined)
                    _depth = 0;
                if (_depth > $Reader.recursionLimit)
                    throw $Error("max depth exceeded");
                let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.textsecure.PushMessageContent.GroupContext();
                while (reader.pos < end) {
                    let start = reader.pos;
                    let tag = reader.tag();
                    if (tag === _end) {
                        _end = $undefined;
                        break;
                    }
                    let wireType = tag & 7;
                    switch (tag >>>= 3) {
                    case 1: {
                            if (wireType !== 2)
                                break;
                            message.id = reader.bytes();
                            continue;
                        }
                    case 2: {
                            if (wireType !== 0)
                                break;
                            message.type = reader.int32();
                            continue;
                        }
                    case 3: {
                            if (wireType !== 2)
                                break;
                            message.name = reader.string();
                            continue;
                        }
                    case 4: {
                            if (wireType !== 2)
                                break;
                            if (!(message.members && message.members.length))
                                message.members = [];
                            message.members.push(reader.string());
                            continue;
                        }
                    case 5: {
                            if (wireType !== 2)
                                break;
                            message.avatar = $root.textsecure.PushMessageContent.AttachmentPointer.decode(reader, reader.uint32(), $undefined, _depth + 1, message.avatar);
                            continue;
                        }
                    }
                    reader.skipType(wireType, _depth, tag);
                    if (!reader.discardUnknown) {
                        $util.makeProp(message, "$unknowns", false);
                        (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                    }
                }
                if (_end !== $undefined)
                    throw $Error("missing end group");
                return message;
            };

            /**
             * Gets the type url for GroupContext
             * @function getTypeUrl
             * @memberof textsecure.PushMessageContent.GroupContext
             * @static
             * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
             * @returns {string} The type url
             */
            GroupContext.getTypeUrl = function(prefix) {
                if (prefix === $undefined)
                    prefix = "type.googleapis.com";
                return prefix + "/textsecure.PushMessageContent.GroupContext";
            };

            /**
             * Type enum.
             * @name textsecure.PushMessageContent.GroupContext.Type
             * @enum {number}
             * @property {number} UNKNOWN=0 UNKNOWN value
             * @property {number} UPDATE=1 UPDATE value
             * @property {number} DELIVER=2 DELIVER value
             * @property {number} QUIT=3 QUIT value
             */
            GroupContext.Type = (function() {
                const valuesById = {}, values = $Object.create(valuesById);
                values[valuesById[0] = "UNKNOWN"] = 0;
                values[valuesById[1] = "UPDATE"] = 1;
                values[valuesById[2] = "DELIVER"] = 2;
                values[valuesById[3] = "QUIT"] = 3;
                return values;
            })();

            return GroupContext;
        })();

        /**
         * Flags enum.
         * @name textsecure.PushMessageContent.Flags
         * @enum {number}
         * @property {number} END_SESSION=1 END_SESSION value
         */
        PushMessageContent.Flags = (function() {
            const valuesById = {}, values = $Object.create(valuesById);
            values[valuesById[1] = "END_SESSION"] = 1;
            return values;
        })();

        return PushMessageContent;
    })();

    return textsecure;
})();

const omemo = $root.omemo = (() => {

    /**
     * Namespace omemo.
     * @exports omemo
     * @namespace
     */
    const omemo = {};

    omemo.OMEMOMessage = (function() {

        /**
         * Properties of a OMEMOMessage.
         * @typedef {Object} omemo.OMEMOMessage.$Properties
         * @property {number} n OMEMOMessage n
         * @property {number} pn OMEMOMessage pn
         * @property {Uint8Array} dh_pub OMEMOMessage dh_pub
         * @property {Uint8Array|null} [ciphertext] OMEMOMessage ciphertext
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a OMEMOMessage.
         * @memberof omemo
         * @interface IOMEMOMessage
         * @augments omemo.OMEMOMessage.$Properties
         * @deprecated Use omemo.OMEMOMessage.$Properties instead.
         */

        /**
         * Shape of a OMEMOMessage.
         * @typedef {omemo.OMEMOMessage.$Properties} omemo.OMEMOMessage.$Shape
         */

        /**
         * Constructs a new OMEMOMessage.
         * @memberof omemo
         * @classdesc Represents a OMEMOMessage.
         * @constructor
         * @param {omemo.OMEMOMessage.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const OMEMOMessage = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * OMEMOMessage n.
         * @member {number} n
         * @memberof omemo.OMEMOMessage
         * @instance
         */
        OMEMOMessage.prototype.n = 0;

        /**
         * OMEMOMessage pn.
         * @member {number} pn
         * @memberof omemo.OMEMOMessage
         * @instance
         */
        OMEMOMessage.prototype.pn = 0;

        /**
         * OMEMOMessage dh_pub.
         * @member {Uint8Array} dh_pub
         * @memberof omemo.OMEMOMessage
         * @instance
         */
        OMEMOMessage.prototype.dh_pub = $util.newBuffer([]);

        /**
         * OMEMOMessage ciphertext.
         * @member {Uint8Array} ciphertext
         * @memberof omemo.OMEMOMessage
         * @instance
         */
        OMEMOMessage.prototype.ciphertext = $util.newBuffer([]);

        /**
         * Creates a new OMEMOMessage instance using the specified properties.
         * @function create
         * @memberof omemo.OMEMOMessage
         * @static
         * @param {omemo.OMEMOMessage.$Properties=} [properties] Properties to set
         * @returns {omemo.OMEMOMessage} OMEMOMessage instance
         * @type {{
         *   (properties: omemo.OMEMOMessage.$Shape): omemo.OMEMOMessage & omemo.OMEMOMessage.$Shape;
         *   (properties?: omemo.OMEMOMessage.$Properties): omemo.OMEMOMessage;
         * }}
         */
        OMEMOMessage.create = function(properties) {
            return new OMEMOMessage(properties);
        };

        /**
         * Encodes the specified OMEMOMessage message. Does not implicitly {@link omemo.OMEMOMessage.verify|verify} messages.
         * @function encode
         * @memberof omemo.OMEMOMessage
         * @static
         * @param {omemo.OMEMOMessage.$Properties} message OMEMOMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OMEMOMessage.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.n);
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.pn);
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.dh_pub);
            if (message.ciphertext != null && $Object.hasOwnProperty.call(message, "ciphertext"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.ciphertext);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a OMEMOMessage message from the specified reader or buffer.
         * @function decode
         * @memberof omemo.OMEMOMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omemo.OMEMOMessage & omemo.OMEMOMessage.$Shape} OMEMOMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OMEMOMessage.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.omemo.OMEMOMessage();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        message.n = reader.uint32();
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        message.pn = reader.uint32();
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.dh_pub = reader.bytes();
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.ciphertext = reader.bytes();
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            if (!$Object.hasOwnProperty.call(message, "n"))
                throw $util.ProtocolError("missing required 'n'", { instance: message });
            if (!$Object.hasOwnProperty.call(message, "pn"))
                throw $util.ProtocolError("missing required 'pn'", { instance: message });
            if (!$Object.hasOwnProperty.call(message, "dh_pub"))
                throw $util.ProtocolError("missing required 'dh_pub'", { instance: message });
            return message;
        };

        /**
         * Gets the type url for OMEMOMessage
         * @function getTypeUrl
         * @memberof omemo.OMEMOMessage
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        OMEMOMessage.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/omemo.OMEMOMessage";
        };

        return OMEMOMessage;
    })();

    omemo.OMEMOAuthenticatedMessage = (function() {

        /**
         * Properties of a OMEMOAuthenticatedMessage.
         * @typedef {Object} omemo.OMEMOAuthenticatedMessage.$Properties
         * @property {Uint8Array} mac OMEMOAuthenticatedMessage mac
         * @property {Uint8Array} message OMEMOAuthenticatedMessage message
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a OMEMOAuthenticatedMessage.
         * @memberof omemo
         * @interface IOMEMOAuthenticatedMessage
         * @augments omemo.OMEMOAuthenticatedMessage.$Properties
         * @deprecated Use omemo.OMEMOAuthenticatedMessage.$Properties instead.
         */

        /**
         * Shape of a OMEMOAuthenticatedMessage.
         * @typedef {omemo.OMEMOAuthenticatedMessage.$Properties} omemo.OMEMOAuthenticatedMessage.$Shape
         */

        /**
         * Constructs a new OMEMOAuthenticatedMessage.
         * @memberof omemo
         * @classdesc Represents a OMEMOAuthenticatedMessage.
         * @constructor
         * @param {omemo.OMEMOAuthenticatedMessage.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const OMEMOAuthenticatedMessage = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * OMEMOAuthenticatedMessage mac.
         * @member {Uint8Array} mac
         * @memberof omemo.OMEMOAuthenticatedMessage
         * @instance
         */
        OMEMOAuthenticatedMessage.prototype.mac = $util.newBuffer([]);

        /**
         * OMEMOAuthenticatedMessage message.
         * @member {Uint8Array} message
         * @memberof omemo.OMEMOAuthenticatedMessage
         * @instance
         */
        OMEMOAuthenticatedMessage.prototype.message = $util.newBuffer([]);

        /**
         * Creates a new OMEMOAuthenticatedMessage instance using the specified properties.
         * @function create
         * @memberof omemo.OMEMOAuthenticatedMessage
         * @static
         * @param {omemo.OMEMOAuthenticatedMessage.$Properties=} [properties] Properties to set
         * @returns {omemo.OMEMOAuthenticatedMessage} OMEMOAuthenticatedMessage instance
         * @type {{
         *   (properties: omemo.OMEMOAuthenticatedMessage.$Shape): omemo.OMEMOAuthenticatedMessage & omemo.OMEMOAuthenticatedMessage.$Shape;
         *   (properties?: omemo.OMEMOAuthenticatedMessage.$Properties): omemo.OMEMOAuthenticatedMessage;
         * }}
         */
        OMEMOAuthenticatedMessage.create = function(properties) {
            return new OMEMOAuthenticatedMessage(properties);
        };

        /**
         * Encodes the specified OMEMOAuthenticatedMessage message. Does not implicitly {@link omemo.OMEMOAuthenticatedMessage.verify|verify} messages.
         * @function encode
         * @memberof omemo.OMEMOAuthenticatedMessage
         * @static
         * @param {omemo.OMEMOAuthenticatedMessage.$Properties} message OMEMOAuthenticatedMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OMEMOAuthenticatedMessage.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.mac);
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.message);
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a OMEMOAuthenticatedMessage message from the specified reader or buffer.
         * @function decode
         * @memberof omemo.OMEMOAuthenticatedMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omemo.OMEMOAuthenticatedMessage & omemo.OMEMOAuthenticatedMessage.$Shape} OMEMOAuthenticatedMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OMEMOAuthenticatedMessage.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.omemo.OMEMOAuthenticatedMessage();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 2)
                            break;
                        message.mac = reader.bytes();
                        continue;
                    }
                case 2: {
                        if (wireType !== 2)
                            break;
                        message.message = reader.bytes();
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            if (!$Object.hasOwnProperty.call(message, "mac"))
                throw $util.ProtocolError("missing required 'mac'", { instance: message });
            if (!$Object.hasOwnProperty.call(message, "message"))
                throw $util.ProtocolError("missing required 'message'", { instance: message });
            return message;
        };

        /**
         * Gets the type url for OMEMOAuthenticatedMessage
         * @function getTypeUrl
         * @memberof omemo.OMEMOAuthenticatedMessage
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        OMEMOAuthenticatedMessage.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/omemo.OMEMOAuthenticatedMessage";
        };

        return OMEMOAuthenticatedMessage;
    })();

    omemo.OMEMOKeyExchange = (function() {

        /**
         * Properties of a OMEMOKeyExchange.
         * @typedef {Object} omemo.OMEMOKeyExchange.$Properties
         * @property {number} pk_id OMEMOKeyExchange pk_id
         * @property {number} spk_id OMEMOKeyExchange spk_id
         * @property {Uint8Array} ik OMEMOKeyExchange ik
         * @property {Uint8Array} ek OMEMOKeyExchange ek
         * @property {omemo.OMEMOAuthenticatedMessage.$Properties} message OMEMOKeyExchange message
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */

        /**
         * Properties of a OMEMOKeyExchange.
         * @memberof omemo
         * @interface IOMEMOKeyExchange
         * @augments omemo.OMEMOKeyExchange.$Properties
         * @deprecated Use omemo.OMEMOKeyExchange.$Properties instead.
         */

        /**
         * Shape of a OMEMOKeyExchange.
         * @typedef {omemo.OMEMOKeyExchange.$Properties} omemo.OMEMOKeyExchange.$Shape
         */

        /**
         * Constructs a new OMEMOKeyExchange.
         * @memberof omemo
         * @classdesc Represents a OMEMOKeyExchange.
         * @constructor
         * @param {omemo.OMEMOKeyExchange.$Properties=} [properties] Properties to set
         * @property {Array.<Uint8Array>} [$unknowns] Unknown fields preserved while decoding when enabled
         */
        const OMEMOKeyExchange = function (properties) {
            if (properties)
                for (let keys = $Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null && keys[i] !== "__proto__")
                        this[keys[i]] = properties[keys[i]];
        };

        /**
         * OMEMOKeyExchange pk_id.
         * @member {number} pk_id
         * @memberof omemo.OMEMOKeyExchange
         * @instance
         */
        OMEMOKeyExchange.prototype.pk_id = 0;

        /**
         * OMEMOKeyExchange spk_id.
         * @member {number} spk_id
         * @memberof omemo.OMEMOKeyExchange
         * @instance
         */
        OMEMOKeyExchange.prototype.spk_id = 0;

        /**
         * OMEMOKeyExchange ik.
         * @member {Uint8Array} ik
         * @memberof omemo.OMEMOKeyExchange
         * @instance
         */
        OMEMOKeyExchange.prototype.ik = $util.newBuffer([]);

        /**
         * OMEMOKeyExchange ek.
         * @member {Uint8Array} ek
         * @memberof omemo.OMEMOKeyExchange
         * @instance
         */
        OMEMOKeyExchange.prototype.ek = $util.newBuffer([]);

        /**
         * OMEMOKeyExchange message.
         * @member {omemo.OMEMOAuthenticatedMessage.$Properties} message
         * @memberof omemo.OMEMOKeyExchange
         * @instance
         */
        OMEMOKeyExchange.prototype.message = null;

        /**
         * Creates a new OMEMOKeyExchange instance using the specified properties.
         * @function create
         * @memberof omemo.OMEMOKeyExchange
         * @static
         * @param {omemo.OMEMOKeyExchange.$Properties=} [properties] Properties to set
         * @returns {omemo.OMEMOKeyExchange} OMEMOKeyExchange instance
         * @type {{
         *   (properties: omemo.OMEMOKeyExchange.$Shape): omemo.OMEMOKeyExchange & omemo.OMEMOKeyExchange.$Shape;
         *   (properties?: omemo.OMEMOKeyExchange.$Properties): omemo.OMEMOKeyExchange;
         * }}
         */
        OMEMOKeyExchange.create = function(properties) {
            return new OMEMOKeyExchange(properties);
        };

        /**
         * Encodes the specified OMEMOKeyExchange message. Does not implicitly {@link omemo.OMEMOKeyExchange.verify|verify} messages.
         * @function encode
         * @memberof omemo.OMEMOKeyExchange
         * @static
         * @param {omemo.OMEMOKeyExchange.$Properties} message OMEMOKeyExchange message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OMEMOKeyExchange.encode = function (message, writer, _depth) {
            if (!writer)
                writer = $Writer.create();
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $util.recursionLimit)
                throw $Error("max depth exceeded");
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.pk_id);
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.spk_id);
            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.ik);
            writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.ek);
            $root.omemo.OMEMOAuthenticatedMessage.encode(message.message, writer.uint32(/* id 5, wireType 2 =*/42).fork(), _depth + 1).ldelim();
            if (message.$unknowns != null && $Object.hasOwnProperty.call(message, "$unknowns"))
                for (let i = 0; i < message.$unknowns.length; ++i)
                    writer.raw(message.$unknowns[i]);
            return writer;
        };

        /**
         * Decodes a OMEMOKeyExchange message from the specified reader or buffer.
         * @function decode
         * @memberof omemo.OMEMOKeyExchange
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {omemo.OMEMOKeyExchange & omemo.OMEMOKeyExchange.$Shape} OMEMOKeyExchange
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OMEMOKeyExchange.decode = function (reader, length, _end, _depth, _target) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            if (_depth === $undefined)
                _depth = 0;
            if (_depth > $Reader.recursionLimit)
                throw $Error("max depth exceeded");
            let end = length === $undefined ? reader.len : reader.pos + length, message = _target || new $root.omemo.OMEMOKeyExchange();
            while (reader.pos < end) {
                let start = reader.pos;
                let tag = reader.tag();
                if (tag === _end) {
                    _end = $undefined;
                    break;
                }
                let wireType = tag & 7;
                switch (tag >>>= 3) {
                case 1: {
                        if (wireType !== 0)
                            break;
                        message.pk_id = reader.uint32();
                        continue;
                    }
                case 2: {
                        if (wireType !== 0)
                            break;
                        message.spk_id = reader.uint32();
                        continue;
                    }
                case 3: {
                        if (wireType !== 2)
                            break;
                        message.ik = reader.bytes();
                        continue;
                    }
                case 4: {
                        if (wireType !== 2)
                            break;
                        message.ek = reader.bytes();
                        continue;
                    }
                case 5: {
                        if (wireType !== 2)
                            break;
                        message.message = $root.omemo.OMEMOAuthenticatedMessage.decode(reader, reader.uint32(), $undefined, _depth + 1, message.message);
                        continue;
                    }
                }
                reader.skipType(wireType, _depth, tag);
                if (!reader.discardUnknown) {
                    $util.makeProp(message, "$unknowns", false);
                    (message.$unknowns || (message.$unknowns = [])).push(reader.raw(start, reader.pos));
                }
            }
            if (_end !== $undefined)
                throw $Error("missing end group");
            if (!$Object.hasOwnProperty.call(message, "pk_id"))
                throw $util.ProtocolError("missing required 'pk_id'", { instance: message });
            if (!$Object.hasOwnProperty.call(message, "spk_id"))
                throw $util.ProtocolError("missing required 'spk_id'", { instance: message });
            if (!$Object.hasOwnProperty.call(message, "ik"))
                throw $util.ProtocolError("missing required 'ik'", { instance: message });
            if (!$Object.hasOwnProperty.call(message, "ek"))
                throw $util.ProtocolError("missing required 'ek'", { instance: message });
            if (!$Object.hasOwnProperty.call(message, "message"))
                throw $util.ProtocolError("missing required 'message'", { instance: message });
            return message;
        };

        /**
         * Gets the type url for OMEMOKeyExchange
         * @function getTypeUrl
         * @memberof omemo.OMEMOKeyExchange
         * @static
         * @param {string} [prefix] Custom type url prefix, defaults to `"type.googleapis.com"`
         * @returns {string} The type url
         */
        OMEMOKeyExchange.getTypeUrl = function(prefix) {
            if (prefix === $undefined)
                prefix = "type.googleapis.com";
            return prefix + "/omemo.OMEMOKeyExchange";
        };

        return OMEMOKeyExchange;
    })();

    return omemo;
})();

/** Load codecs for the Signal protocol messages. */
function loadProtocolMessages() {
    return {
        WhisperMessage: textsecure.WhisperMessage,
        PreKeyWhisperMessage: textsecure.PreKeyWhisperMessage,
    };
}
/** Load codecs for the OMEMO 2 (urn:xmpp:omemo:2) messages. */
function loadOMEMOMessages() {
    return {
        OMEMOMessage: omemo.OMEMOMessage,
        OMEMOAuthenticatedMessage: omemo.OMEMOAuthenticatedMessage,
        OMEMOKeyExchange: omemo.OMEMOKeyExchange,
    };
}

/** Version byte prepended to every 0.3.0 message: `(3 << 4) | 3`. */
const V3_VERSION_BYTE = (3 << 4) | 3;
/**
 * Copy a typed-array view into a fresh, exactly-sized ArrayBuffer.
 *
 * Necessary because protobufjs `.finish()` returns a Node `Buffer` whose
 * `.slice()` is `subarray` (a view sharing the backing pool), so `.buffer`
 * would expose unrelated memory. `ArrayBuffer.prototype.slice` always copies.
 */
function toExactBuffer(view) {
    return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
}
/** Concatenate ArrayBuffers into one. */
function concat(buffers) {
    const total = buffers.reduce((n, b) => n + b.byteLength, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    for (const b of buffers) {
        out.set(new Uint8Array(b), offset);
        offset += b.byteLength;
    }
    return out.buffer;
}
/** Drop the 0x05 type prefix from a curve public key, returning the raw 32 bytes. */
function stripKeyType(key) {
    const bytes = new Uint8Array(key);
    if (bytes.byteLength === 33 && bytes[0] === 5) {
        return key.slice(1);
    }
    return key;
}
/** Add the 0x05 type prefix to a raw 32-byte curve public key. */
function addKeyType(key) {
    const bytes = new Uint8Array(key);
    if (bytes.byteLength === 32) {
        const out = new Uint8Array(33);
        out[0] = 5;
        out.set(bytes, 1);
        return out.buffer;
    }
    return key;
}
/**
 * Build the 0.3.0 MAC input: `[senderIK(33) ‖ receiverIK(33) ‖ versionByte(1) ‖ message]`.
 * The identity-key prefix is ordered by direction (always sender-then-receiver).
 */
function buildV3MacInput(encodedInner, ctx) {
    const first = ctx.direction === "sending" ? ctx.ourIdentityKey : ctx.remoteIdentityKey;
    const second = ctx.direction === "sending" ? ctx.remoteIdentityKey : ctx.ourIdentityKey;
    const macInput = new Uint8Array(encodedInner.byteLength + 33 * 2 + 1);
    macInput.set(new Uint8Array(first));
    macInput.set(new Uint8Array(second), 33);
    macInput[33 * 2] = V3_VERSION_BYTE;
    macInput.set(encodedInner, 33 * 2 + 1);
    return macInput.buffer;
}
/** Profile for OMEMO 0.3.0 (libsignal "v3" wire format). */
const OMEMO_0_3_0 = {
    version: "eu.siacs.conversations.axolotl",
    requiresRegistrationId: true,
    usesEdIdentityKey: false,
    x3dhInfo: "WhisperText",
    rootChainInfo: "WhisperRatchet",
    messageKeyInfo: "WhisperMessageKeys",
    encodeInner(parts) {
        const { WhisperMessage } = loadProtocolMessages();
        const msg = WhisperMessage.create({
            ephemeralKey: new Uint8Array(parts.ephemeralKey),
            counter: parts.counter,
            previousCounter: parts.previousCounter,
            ciphertext: new Uint8Array(parts.ciphertext),
        });
        return WhisperMessage.encode(msg).finish();
    },
    async computeMac(authKey, encodedInner, ctx) {
        const fullMac = await sign(authKey, buildV3MacInput(encodedInner, ctx));
        return fullMac.slice(0, 8);
    },
    async verifyMac(authKey, encodedInner, ctx, mac) {
        await verifyMAC(buildV3MacInput(encodedInner, ctx), authKey, mac, 8);
    },
    frameMessage(encodedInner, mac) {
        const result = new Uint8Array(encodedInner.byteLength + 1 + mac.byteLength);
        result[0] = V3_VERSION_BYTE;
        result.set(encodedInner, 1);
        result.set(new Uint8Array(mac), encodedInner.byteLength + 1);
        return result;
    },
    parseMessage(bytes) {
        const version = new Uint8Array(bytes)[0];
        if ((version & 0xf) > 3 || version >> 4 < 3) {
            throw new Error("Incompatible version number on WhisperMessage");
        }
        const encodedInner = new Uint8Array(bytes.slice(1, bytes.byteLength - 8));
        const mac = bytes.slice(bytes.byteLength - 8, bytes.byteLength);
        const { WhisperMessage } = loadProtocolMessages();
        const message = WhisperMessage.decode(encodedInner);
        return {
            ephemeralKey: toExactBuffer(message.ephemeralKey),
            counter: message.counter,
            previousCounter: message.previousCounter,
            ciphertext: toExactBuffer(message.ciphertext),
            encodedInner,
            mac,
        };
    },
    async encodeKeyExchange(parts, framedMessage) {
        const { PreKeyWhisperMessage } = loadProtocolMessages();
        const preKeyMsg = PreKeyWhisperMessage.create({
            baseKey: new Uint8Array(parts.baseKey),
            identityKey: new Uint8Array(parts.ourIdentityKey.pubKey),
            message: framedMessage,
            preKeyId: parts.preKeyId ? parts.preKeyId : undefined,
            registrationId: parts.registrationId,
            signedPreKeyId: parts.signedPreKeyId,
        });
        const encoded = PreKeyWhisperMessage.encode(preKeyMsg).finish();
        const out = new Uint8Array(encoded.length + 1);
        out[0] = V3_VERSION_BYTE;
        out.set(encoded, 1);
        return out;
    },
    async parseKeyExchange(bytes) {
        const version = new Uint8Array(bytes)[0];
        if ((version & 0xf) > 3 || version >> 4 < 3) {
            throw new Error("Incompatible version number on PreKeyWhisperMessage");
        }
        const { PreKeyWhisperMessage } = loadProtocolMessages();
        const proto = PreKeyWhisperMessage.decode(new Uint8Array(bytes.slice(1)));
        return {
            registrationId: proto.registrationId,
            preKeyId: proto.preKeyId,
            signedPreKeyId: proto.signedPreKeyId,
            baseKey: toExactBuffer(proto.baseKey),
            identityKey: toExactBuffer(proto.identityKey),
            message: toExactBuffer(proto.message),
        };
    },
    wrapResult(body, isKeyExchange, registrationId) {
        return {
            type: isKeyExchange ? 3 : 1,
            body: bufferToBinaryString(body),
            registrationId,
        };
    },
    async buildAssociatedData() {
        return undefined;
    },
    async normalizeRemoteIdentityKey(wireKey) {
        return { curve: wireKey };
    },
    signedPreKeySignatureData(publicKey) {
        return publicKey;
    },
    normalizeRemotePreKey(wireKey) {
        // 0.3.0 publishes the 33-byte 0x05-prefixed form; a raw 32-byte key is
        // malformed and is left to fail closed on the DH path.
        return wireKey;
    },
};
/** Profile for OMEMO 2 (urn:xmpp:omemo:2). */
const OMEMO_2 = {
    version: "urn:xmpp:omemo:2",
    requiresRegistrationId: false,
    usesEdIdentityKey: true,
    x3dhInfo: "OMEMO X3DH",
    rootChainInfo: "OMEMO Root Chain",
    messageKeyInfo: "OMEMO Message Key Material",
    encodeInner(parts) {
        const { OMEMOMessage } = loadOMEMOMessages();
        // dh_pub is the raw 32-byte curve key (RFC 7748), without the 0x05 prefix.
        const msg = OMEMOMessage.create({
            n: parts.counter,
            pn: parts.previousCounter,
            dh_pub: new Uint8Array(stripKeyType(parts.ephemeralKey)),
            ciphertext: new Uint8Array(parts.ciphertext),
        });
        return OMEMOMessage.encode(msg).finish();
    },
    async computeMac(authKey, encodedInner, ctx) {
        if (ctx.ad === undefined) {
            throw new Error("omemo:2 MAC requires associated data");
        }
        const macInput = concat([ctx.ad, toExactBuffer(encodedInner)]);
        const fullMac = await sign(authKey, macInput);
        return fullMac.slice(0, 16);
    },
    async verifyMac(authKey, encodedInner, ctx, mac) {
        if (ctx.ad === undefined) {
            throw new Error("omemo:2 MAC requires associated data");
        }
        const macInput = concat([ctx.ad, toExactBuffer(encodedInner)]);
        await verifyMAC(macInput, authKey, mac, 16);
    },
    frameMessage(encodedInner, mac) {
        const { OMEMOAuthenticatedMessage } = loadOMEMOMessages();
        const authMsg = OMEMOAuthenticatedMessage.create({
            mac: new Uint8Array(mac),
            message: encodedInner,
        });
        return OMEMOAuthenticatedMessage.encode(authMsg).finish();
    },
    parseMessage(bytes) {
        const { OMEMOMessage, OMEMOAuthenticatedMessage } = loadOMEMOMessages();
        const authMsg = OMEMOAuthenticatedMessage.decode(new Uint8Array(bytes));
        const encodedInner = authMsg.message;
        const message = OMEMOMessage.decode(encodedInner);
        return {
            ephemeralKey: addKeyType(toExactBuffer(message.dh_pub)),
            counter: message.n,
            previousCounter: message.pn,
            ciphertext: toExactBuffer(message.ciphertext),
            encodedInner,
            mac: toExactBuffer(authMsg.mac),
        };
    },
    async encodeKeyExchange(parts, framedMessage) {
        const { OMEMOAuthenticatedMessage, OMEMOKeyExchange } = loadOMEMOMessages();
        // ik is the 32-byte Ed25519 form of our identity key; ek is the raw 32-byte curve base key.
        const ik = await internalCrypto.curvePubKeyToEd25519PubKey(parts.ourIdentityKey.pubKey);
        // The profile interface frames messages as bytes (opaque for 0.3.0), so we
        // decode the framed OMEMOAuthenticatedMessage back into an object to nest it
        // as a structured sub-message. This keeps standalone and key-exchange-wrapped
        // messages flowing through the one bytes-based contract.
        const authMsg = OMEMOAuthenticatedMessage.decode(framedMessage);
        const kex = OMEMOKeyExchange.create({
            pk_id: parts.preKeyId ?? 0,
            spk_id: parts.signedPreKeyId,
            ik: new Uint8Array(ik),
            ek: new Uint8Array(stripKeyType(parts.baseKey)),
            message: authMsg,
        });
        return OMEMOKeyExchange.encode(kex).finish();
    },
    async parseKeyExchange(bytes) {
        const { OMEMOAuthenticatedMessage, OMEMOKeyExchange } = loadOMEMOMessages();
        const proto = OMEMOKeyExchange.decode(new Uint8Array(bytes));
        const identityKeyEd = toExactBuffer(proto.ik);
        const identityKeyCurve = addKeyType(await internalCrypto.ed25519PubKeyToCurvePubKey(identityKeyEd));
        // proto.message is already a decoded OMEMOAuthenticatedMessage; re-encode it
        // to bytes so it flows through the same ratchet-decrypt path (parseMessage)
        // that a standalone message uses.
        const framedMessage = OMEMOAuthenticatedMessage.encode(proto.message).finish();
        return {
            preKeyId: proto.pk_id,
            signedPreKeyId: proto.spk_id,
            baseKey: addKeyType(toExactBuffer(proto.ek)),
            identityKey: identityKeyCurve,
            identityKeyEd,
            message: toExactBuffer(framedMessage),
        };
    },
    wrapResult(body, isKeyExchange, registrationId) {
        return {
            type: isKeyExchange ? 3 : 1,
            kex: isKeyExchange,
            body: bufferToBinaryString(body),
            registrationId,
        };
    },
    async buildAssociatedData(ourIdentityKey, remoteIdentityKeyEd, isInitiator) {
        if (remoteIdentityKeyEd === undefined) {
            throw new Error("omemo:2 associated data requires the remote Ed25519 identity key");
        }
        const ourEd = await internalCrypto.curvePubKeyToEd25519PubKey(ourIdentityKey.pubKey);
        return isInitiator
            ? concat([ourEd, remoteIdentityKeyEd])
            : concat([remoteIdentityKeyEd, ourEd]);
    },
    async normalizeRemoteIdentityKey(wireKey) {
        // wireKey is the 32-byte Ed25519 identity key.
        const curve = addKeyType(await internalCrypto.ed25519PubKeyToCurvePubKey(wireKey));
        return { curve, ed: wireKey };
    },
    signedPreKeySignatureData(publicKey) {
        // omemo:2 signs the raw 32-byte Curve25519 (Montgomery) form.
        return stripKeyType(publicKey);
    },
    normalizeRemotePreKey(wireKey) {
        // omemo:2 transfers the raw 32-byte curve form; restore the 0x05 prefix
        // to the library's internal form (no-op if already prefixed).
        return addKeyType(wireKey);
    },
};
/** Render an ArrayBuffer/Uint8Array as a binary string (one char per byte). */
function bufferToBinaryString(buf) {
    let str = "";
    for (let i = 0; i < buf.length; i++) {
        str += String.fromCharCode(buf[i]);
    }
    return str;
}
const PROFILES = {
    "eu.siacs.conversations.axolotl": OMEMO_0_3_0,
    "urn:xmpp:omemo:2": OMEMO_2,
};
/** Look up the protocol profile for a given OMEMO version. */
function getProtocolProfile(version) {
    const profile = PROFILES[version];
    if (!profile) {
        throw new Error(`Unsupported OMEMO version: ${String(version)}`);
    }
    return profile;
}

/** Helpers for generating cryptographic keys for OMEMO. */
const KeyHelper = {
    generateIdentityKeyPair() {
        return internalCrypto.createKeyPair();
    },
    generateRegistrationId() {
        const registrationId = new Uint16Array(getRandomBytes(2))[0];
        return registrationId & 0x3fff;
    },
    async generateSignedPreKey(identityKeyPair, signedKeyId, version) {
        if (!(identityKeyPair.privKey instanceof ArrayBuffer) ||
            identityKeyPair.privKey.byteLength !== 32 ||
            !(identityKeyPair.pubKey instanceof ArrayBuffer) ||
            identityKeyPair.pubKey.byteLength !== 33) {
            throw new TypeError("Invalid argument for identityKeyPair");
        }
        if (!isNonNegativeInteger(signedKeyId)) {
            throw new TypeError(`Invalid argument for signedKeyId: ${String(signedKeyId)}`);
        }
        const keyPair = await internalCrypto.createKeyPair();
        // The identity key signs the SPK in the encoding required by the version:
        // 0.3.0 over the 33-byte form, omemo:2 over the raw 32-byte Curve25519 form.
        const signatureData = getProtocolProfile(version).signedPreKeySignatureData(keyPair.pubKey);
        const sig = await internalCrypto.Ed25519Sign(identityKeyPair.privKey, signatureData);
        return {
            keyId: signedKeyId,
            keyPair,
            signature: sig,
        };
    },
    async generatePreKey(keyId) {
        if (!isNonNegativeInteger(keyId)) {
            throw new TypeError(`Invalid argument for keyId: ${keyId}`);
        }
        return {
            keyId,
            keyPair: await internalCrypto.createKeyPair(),
        };
    },
};

var _OMEMOAddress_name, _OMEMOAddress_deviceId;
/** Identifies a specific OMEMO device by name and device ID. */
class OMEMOAddress {
    constructor(name, deviceId) {
        _OMEMOAddress_name.set(this, void 0);
        _OMEMOAddress_deviceId.set(this, void 0);
        __classPrivateFieldSet(this, _OMEMOAddress_name, name, "f");
        __classPrivateFieldSet(this, _OMEMOAddress_deviceId, deviceId, "f");
    }
    getName() {
        return __classPrivateFieldGet(this, _OMEMOAddress_name, "f");
    }
    getDeviceId() {
        return __classPrivateFieldGet(this, _OMEMOAddress_deviceId, "f");
    }
    toString() {
        return `${__classPrivateFieldGet(this, _OMEMOAddress_name, "f")}.${__classPrivateFieldGet(this, _OMEMOAddress_deviceId, "f")}`;
    }
    equals(other) {
        if (!(other instanceof OMEMOAddress)) {
            return false;
        }
        return __classPrivateFieldGet(other, _OMEMOAddress_name, "f") === __classPrivateFieldGet(this, _OMEMOAddress_name, "f") && __classPrivateFieldGet(other, _OMEMOAddress_deviceId, "f") === __classPrivateFieldGet(this, _OMEMOAddress_deviceId, "f");
    }
    static fromString(encodedAddress) {
        if (typeof encodedAddress !== "string" || !encodedAddress.match(/^.+\.\d+$/)) {
            throw new Error("Invalid OMEMOAddress string");
        }
        const lastDot = encodedAddress.lastIndexOf(".");
        const name = encodedAddress.substring(0, lastDot);
        const deviceId = parseInt(encodedAddress.substring(lastDot + 1));
        return new OMEMOAddress(name, deviceId);
    }
}
_OMEMOAddress_name = new WeakMap(), _OMEMOAddress_deviceId = new WeakMap();

var ChainType;
(function (ChainType) {
    ChainType[ChainType["SENDING"] = 1] = "SENDING";
    ChainType[ChainType["RECEIVING"] = 2] = "RECEIVING";
})(ChainType || (ChainType = {}));
var BaseKeyType;
(function (BaseKeyType) {
    BaseKeyType[BaseKeyType["OURS"] = 1] = "OURS";
    BaseKeyType[BaseKeyType["THEIRS"] = 2] = "THEIRS";
})(BaseKeyType || (BaseKeyType = {}));

var _SessionRecord_instances, _SessionRecord_removeOldChains, _SessionRecord_removeOldSessions;
const ARCHIVED_STATES_MAX_LENGTH = 40;
const OLD_RATCHETS_MAX_LENGTH = 10;
const SESSION_RECORD_VERSION = "v2";
/**
 * Property names that, when assigned to a plain object, mutate its prototype
 * chain instead of creating a data property. Session records are rebuilt from
 * persisted JSON, where `JSON.parse` exposes a literal `"__proto__"` member as
 * an own, enumerable key. Writing it back with `obj[key] = …` on a fresh object
 * would reparent that object, so these keys are skipped during deserialization
 * (CWE-1321). Ratchet/session keys are 33-byte binary strings and never collide
 * with these names, so dropping them is safe.
 */
const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);
const migrations = [
    {
        version: "v1",
        migrate(data) {
            const sessions = data.sessions;
            if (data.registrationId) {
                for (const key in sessions) {
                    if (!sessions[key].registrationId) {
                        sessions[key].registrationId = data.registrationId;
                    }
                }
            }
            else {
                for (const key in sessions) {
                    if (SessionRecord.isSessionOpen(sessions[key])) {
                        console.log("V1 session storage migration error: registrationId", data.registrationId, "for open session version", data.version);
                    }
                }
            }
        },
    },
    {
        // Sessions stored before omemo:2 support predate the protocolVersion field
        // and can only be 0.3.0, the only version the library used to write.
        version: "v2",
        migrate(data) {
            for (const key in data.sessions) {
                if (data.sessions[key].protocolVersion === undefined) {
                    data.sessions[key].protocolVersion = "eu.siacs.conversations.axolotl";
                }
            }
        },
    },
];
function migrate(data) {
    let run = data.version === undefined;
    for (let i = 0; i < migrations.length; ++i) {
        if (run) {
            migrations[i].migrate(data);
        }
        else if (migrations[i].version === data.version) {
            run = true;
        }
    }
    if (!run) {
        throw new Error("Error migrating SessionRecord");
    }
}
/** Manages session state persistence, including serialization, deserialization, and lifecycle. */
class SessionRecord {
    constructor() {
        _SessionRecord_instances.add(this);
        this.sessions = {};
        this.version = SESSION_RECORD_VERSION;
    }
    static deserialize(serialized) {
        const data = JSON.parse(serialized);
        if (data.sessions === undefined ||
            data.sessions === null ||
            typeof data.sessions !== "object" ||
            Array.isArray(data.sessions)) {
            throw new Error("Error deserializing SessionRecord");
        }
        if (data.version !== SESSION_RECORD_VERSION) {
            migrate(data);
        }
        const record = new SessionRecord();
        for (const key of Object.keys(data.sessions)) {
            if (UNSAFE_KEYS.has(key))
                continue;
            const session = SessionRecord.deserializeSession(data.sessions[key]);
            if (session !== null) {
                record.sessions[key] = session;
            }
        }
        return record;
    }
    static deserializeSession(serialized) {
        const { indexInfo, pendingPreKey, registrationId, currentRatchet: cr } = serialized;
        if (!cr || typeof cr !== "object") {
            console.warn("Skipping corrupted session state: missing currentRatchet");
            return null;
        }
        if (!indexInfo || typeof indexInfo !== "object") {
            console.warn("Skipping corrupted session state: missing indexInfo");
            return null;
        }
        const session = {
            registrationId,
            protocolVersion: serialized.protocolVersion ?? "eu.siacs.conversations.axolotl",
            ad: typeof serialized.ad === "string" ? strToBytes(serialized.ad) : undefined,
            currentRatchet: {
                rootKey: typeof cr.rootKey === "string" ? strToBytes(cr.rootKey) : new ArrayBuffer(0),
                lastRemoteEphemeralKey: typeof cr.lastRemoteEphemeralKey === "string"
                    ? strToBytes(cr.lastRemoteEphemeralKey)
                    : new ArrayBuffer(0),
                previousCounter: cr.previousCounter ?? 0,
                ephemeralKeyPair: {
                    pubKey: typeof cr.ephemeralKeyPair?.pubKey === "string"
                        ? strToBytes(cr.ephemeralKeyPair.pubKey)
                        : new ArrayBuffer(0),
                    privKey: typeof cr.ephemeralKeyPair?.privKey === "string"
                        ? strToBytes(cr.ephemeralKeyPair.privKey)
                        : new ArrayBuffer(0),
                },
            },
            indexInfo: {
                baseKey: typeof indexInfo.baseKey === "string"
                    ? strToBytes(indexInfo.baseKey)
                    : undefined,
                baseKeyType: indexInfo.baseKeyType,
                closed: indexInfo.closed ?? 0,
                remoteIdentityKey: typeof indexInfo.remoteIdentityKey === "string"
                    ? strToBytes(indexInfo.remoteIdentityKey)
                    : new ArrayBuffer(0),
                remoteIdentityKeyEd: typeof indexInfo.remoteIdentityKeyEd === "string"
                    ? strToBytes(indexInfo.remoteIdentityKeyEd)
                    : undefined,
            },
            oldRatchetList: (serialized.oldRatchetList ?? []).map((entry) => ({
                added: entry.added,
                ephemeralKey: typeof entry.ephemeralKey === "string"
                    ? strToBytes(entry.ephemeralKey)
                    : new ArrayBuffer(0),
            })),
            pendingPreKey: pendingPreKey && typeof pendingPreKey.baseKey === "string"
                ? {
                    signedKeyId: pendingPreKey.signedKeyId,
                    baseKey: strToBytes(pendingPreKey.baseKey),
                    preKeyId: pendingPreKey.preKeyId,
                }
                : undefined,
        };
        for (const key of Object.keys(serialized)) {
            if (UNSAFE_KEYS.has(key))
                continue;
            if (key === "registrationId" ||
                key === "protocolVersion" ||
                key === "ad" ||
                key === "currentRatchet" ||
                key === "indexInfo" ||
                key === "oldRatchetList" ||
                key === "pendingPreKey") {
                continue;
            }
            const value = serialized[key];
            if (SessionRecord.isChainLike(value)) {
                const chain = value;
                const chainKey = chain.chainKey;
                const messageKeys = chain.messageKeys;
                session[key] = {
                    messageKeys: Object.fromEntries(Object.entries(messageKeys).map(([k, v]) => [
                        Number(k),
                        typeof v === "string" ? strToBytes(v) : new ArrayBuffer(0),
                    ])),
                    chainKey: {
                        counter: chainKey.counter ?? 0,
                        key: typeof chainKey.key === "string" ? strToBytes(chainKey.key) : undefined,
                    },
                    chainType: chain.chainType,
                };
            }
        }
        return session;
    }
    static isChainLike(value) {
        return (typeof value === "object" &&
            value !== null &&
            "messageKeys" in value &&
            typeof value.messageKeys === "object" &&
            value.messageKeys !== null &&
            "chainKey" in value &&
            typeof value.chainKey === "object" &&
            value.chainKey !== null &&
            "chainType" in value);
    }
    static isSessionOpen({ indexInfo }) {
        return indexInfo.closed === -1;
    }
    serialize() {
        return jsonThing({
            sessions: this.sessions,
            version: this.version,
        });
    }
    hasOpenSession() {
        const openSession = this.getOpenSession();
        return !!openSession && typeof openSession.registrationId === "number";
    }
    getSessionByBaseKey(baseKey) {
        const session = this.sessions[util.toString(baseKey)];
        if (session && session.indexInfo.baseKeyType === BaseKeyType.OURS) {
            console.log("Tried to lookup a session using our basekey");
            return undefined;
        }
        return session;
    }
    getSessionByRemoteEphemeralKey(remoteEphemeralKey) {
        this.detectDuplicateOpenSessions();
        const sessions = this.sessions;
        const searchKey = util.toString(remoteEphemeralKey);
        let openSession;
        for (const key in sessions) {
            if (!Object.prototype.hasOwnProperty.call(sessions, key)) {
                continue;
            }
            if (SessionRecord.isSessionOpen(sessions[key])) {
                openSession = sessions[key];
            }
            if (sessions[key][searchKey] !== undefined) {
                return sessions[key];
            }
        }
        return openSession;
    }
    getOpenSession() {
        const sessions = this.sessions;
        if (sessions === undefined) {
            return undefined;
        }
        this.detectDuplicateOpenSessions();
        for (const key in sessions) {
            if (SessionRecord.isSessionOpen(sessions[key])) {
                return sessions[key];
            }
        }
        return undefined;
    }
    detectDuplicateOpenSessions() {
        let openSession;
        const sessions = this.sessions;
        for (const key in sessions) {
            if (SessionRecord.isSessionOpen(sessions[key])) {
                if (openSession !== undefined) {
                    throw new Error("Datastore inconsistensy: multiple open sessions");
                }
                openSession = sessions[key];
            }
        }
    }
    updateSessionState(session) {
        const sessions = this.sessions;
        __classPrivateFieldGet(this, _SessionRecord_instances, "m", _SessionRecord_removeOldChains).call(this, session);
        sessions[util.toString(session.indexInfo.baseKey)] = session;
        __classPrivateFieldGet(this, _SessionRecord_instances, "m", _SessionRecord_removeOldSessions).call(this);
    }
    getSessions() {
        let list = [];
        let openSession;
        for (const k in this.sessions) {
            if (SessionRecord.isSessionOpen(this.sessions[k])) {
                openSession = this.sessions[k];
            }
            else {
                list.push(this.sessions[k]);
            }
        }
        list = list.sort((s1, s2) => s1.indexInfo.closed - s2.indexInfo.closed);
        if (openSession) {
            list.push(openSession);
        }
        return list;
    }
    archiveCurrentState() {
        const open_session = this.getOpenSession();
        if (open_session !== undefined) {
            console.log("closing session");
            open_session.indexInfo.closed = Date.now();
            this.updateSessionState(open_session);
        }
    }
    promoteState(session) {
        console.log("promoting session");
        session.indexInfo.closed = -1;
    }
    deleteAllSessions() {
        this.sessions = {};
    }
}
_SessionRecord_instances = new WeakSet(), _SessionRecord_removeOldChains = function _SessionRecord_removeOldChains(session) {
    while (session.oldRatchetList.length > OLD_RATCHETS_MAX_LENGTH) {
        let index = 0;
        let oldest = session.oldRatchetList[0];
        for (let i = 0; i < session.oldRatchetList.length; i++) {
            if (session.oldRatchetList[i].added < oldest.added) {
                oldest = session.oldRatchetList[i];
                index = i;
            }
        }
        console.log("Deleting chain closed at", oldest.added);
        delete session[util.toString(oldest.ephemeralKey)];
        session.oldRatchetList.splice(index, 1);
    }
}, _SessionRecord_removeOldSessions = function _SessionRecord_removeOldSessions() {
    const sessions = this.sessions;
    let oldestBaseKey;
    let oldestSession;
    while (Object.keys(sessions).length > ARCHIVED_STATES_MAX_LENGTH) {
        for (const key in sessions) {
            if (!Object.prototype.hasOwnProperty.call(sessions, key)) {
                continue;
            }
            const session = sessions[key];
            if (session.indexInfo.closed > -1 &&
                (!oldestSession || session.indexInfo.closed < oldestSession.indexInfo.closed)) {
                oldestBaseKey = key;
                oldestSession = session;
            }
        }
        console.log("Deleting session closed at", oldestSession.indexInfo.closed);
        delete sessions[util.toString(oldestBaseKey)];
    }
};

const jobQueue = {};
/** Ensures operations for a given address execute sequentially, preventing race conditions. */
function queueJobForNumber(number, runJob) {
    const runPrevious = jobQueue[number] ?? Promise.resolve();
    const runCurrent = (jobQueue[number] = runPrevious.then(runJob, runJob));
    return runCurrent.then((T) => {
        if (jobQueue[number] === runCurrent) {
            delete jobQueue[number];
        }
        return T;
    });
}

var Direction;
(function (Direction) {
    Direction[Direction["SENDING"] = 1] = "SENDING";
    Direction[Direction["RECEIVING"] = 2] = "RECEIVING";
})(Direction || (Direction = {}));

var _SessionBuilder_instances, _SessionBuilder_remoteAddress, _SessionBuilder_store, _SessionBuilder_profile, _SessionBuilder_registrationId, _SessionBuilder_initSession, _SessionBuilder_calculateSendingRatchet;
/**
 * Establishes a new OMEMO session from a PreKey bundle.
 */
class SessionBuilder {
    constructor(store, remoteAddress, version) {
        _SessionBuilder_instances.add(this);
        _SessionBuilder_remoteAddress.set(this, void 0);
        _SessionBuilder_store.set(this, void 0);
        _SessionBuilder_profile.set(this, void 0);
        __classPrivateFieldSet(this, _SessionBuilder_remoteAddress, typeof remoteAddress === "string"
            ? OMEMOAddress.fromString(remoteAddress)
            : remoteAddress, "f");
        __classPrivateFieldSet(this, _SessionBuilder_store, store, "f");
        __classPrivateFieldSet(this, _SessionBuilder_profile, getProtocolProfile(version), "f");
    }
    /** Process a PreKey bundle to establish a new session. */
    processPreKey(device) {
        return queueJobForNumber(__classPrivateFieldGet(this, _SessionBuilder_remoteAddress, "f").toString(), async () => {
            // Normalise the remote identity key: for omemo:2 the wire form is
            // Ed25519 and is converted to its Curve25519 equivalent for DH.
            const remoteId = await __classPrivateFieldGet(this, _SessionBuilder_profile, "f").normalizeRemoteIdentityKey(device.identityKey);
            // Trust is keyed on the form the consumer published in the bundle
            // (Ed25519 for omemo:2, Curve25519 for 0.3.0).
            const trustKey = remoteId.ed ?? remoteId.curve;
            const trusted = await __classPrivateFieldGet(this, _SessionBuilder_store, "f").isTrustedIdentity(__classPrivateFieldGet(this, _SessionBuilder_remoteAddress, "f").toString(), trustKey, Direction.SENDING);
            if (!trusted) {
                throw new Error("Identity key changed");
            }
            // Normalise the prekeys, which may be in the raw 32-byte curve
            // form, to the internal 33-byte form, since the DH path
            // no longer accepts unprefixed keys.
            const signedPreKeyPub = __classPrivateFieldGet(this, _SessionBuilder_profile, "f").normalizeRemotePreKey(device.signedPreKey.publicKey);
            const devicePreKey = device.preKey?.publicKey
                ? __classPrivateFieldGet(this, _SessionBuilder_profile, "f").normalizeRemotePreKey(device.preKey.publicKey)
                : undefined;
            await internalCrypto.Ed25519Verify(remoteId.curve, __classPrivateFieldGet(this, _SessionBuilder_profile, "f").signedPreKeySignatureData(signedPreKeyPub), device.signedPreKey.signature);
            const baseKey = await internalCrypto.createKeyPair();
            const session = await __classPrivateFieldGet(this, _SessionBuilder_instances, "m", _SessionBuilder_initSession).call(this, true, baseKey, undefined, remoteId.curve, devicePreKey, signedPreKeyPub, __classPrivateFieldGet(this, _SessionBuilder_instances, "m", _SessionBuilder_registrationId).call(this, device.registrationId), remoteId.ed);
            session.pendingPreKey = {
                signedKeyId: device.signedPreKey.keyId,
                baseKey: baseKey.pubKey,
            };
            if (device.preKey) {
                session.pendingPreKey.preKeyId = device.preKey.keyId;
            }
            const address = __classPrivateFieldGet(this, _SessionBuilder_remoteAddress, "f").toString();
            const serialized = await __classPrivateFieldGet(this, _SessionBuilder_store, "f").loadSession(address);
            const record = serialized !== undefined
                ? SessionRecord.deserialize(serialized)
                : new SessionRecord();
            record.archiveCurrentState();
            record.updateSessionState(session);
            await Promise.all([
                __classPrivateFieldGet(this, _SessionBuilder_store, "f").storeSession(address, record.serialize()),
                __classPrivateFieldGet(this, _SessionBuilder_store, "f").saveIdentity(__classPrivateFieldGet(this, _SessionBuilder_remoteAddress, "f").toString(), trustKey),
            ]);
            return;
        });
    }
    async processV3(record, message) {
        if (record.getSessionByBaseKey(message.baseKey)) {
            console.log("Duplicate PreKeyMessage for session");
            return;
        }
        // Trust is keyed on the form received on the wire (Ed25519 for omemo:2).
        const trustKey = message.identityKeyEd ?? message.identityKey;
        const trusted = await __classPrivateFieldGet(this, _SessionBuilder_store, "f").isTrustedIdentity(__classPrivateFieldGet(this, _SessionBuilder_remoteAddress, "f").toString(), trustKey, Direction.RECEIVING);
        if (!trusted) {
            const e = new Error("Unknown identity key");
            e.identityKey = trustKey;
            throw e;
        }
        const results = await Promise.all([
            message.preKeyId ? __classPrivateFieldGet(this, _SessionBuilder_store, "f").loadPreKey(message.preKeyId) : Promise.resolve(),
            __classPrivateFieldGet(this, _SessionBuilder_store, "f").loadSignedPreKey(message.signedPreKeyId),
        ]);
        const preKeyPair = results[0];
        const signedPreKeyPair = results[1];
        const session = record.getOpenSession();
        if (signedPreKeyPair === undefined) {
            if (session !== undefined && session.currentRatchet !== undefined) {
                return;
            }
            else {
                throw new Error("Missing Signed PreKey for PreKeyWhisperMessage");
            }
        }
        if (session !== undefined) {
            record.archiveCurrentState();
        }
        if (message.preKeyId && !preKeyPair) {
            console.log("Invalid prekey id", message.preKeyId);
        }
        const newSession = await __classPrivateFieldGet(this, _SessionBuilder_instances, "m", _SessionBuilder_initSession).call(this, false, preKeyPair ? preKeyPair.keyPair : undefined, signedPreKeyPair ? signedPreKeyPair.keyPair : undefined, message.identityKey, message.baseKey, undefined, __classPrivateFieldGet(this, _SessionBuilder_instances, "m", _SessionBuilder_registrationId).call(this, message.registrationId), message.identityKeyEd);
        record.updateSessionState(newSession);
        await __classPrivateFieldGet(this, _SessionBuilder_store, "f").saveIdentity(__classPrivateFieldGet(this, _SessionBuilder_remoteAddress, "f").toString(), trustKey);
        return message.preKeyId;
    }
}
_SessionBuilder_remoteAddress = new WeakMap(), _SessionBuilder_store = new WeakMap(), _SessionBuilder_profile = new WeakMap(), _SessionBuilder_instances = new WeakSet(), _SessionBuilder_registrationId = function _SessionBuilder_registrationId(wireRegistrationId) {
    return wireRegistrationId ?? __classPrivateFieldGet(this, _SessionBuilder_remoteAddress, "f").getDeviceId();
}, _SessionBuilder_initSession = async function _SessionBuilder_initSession(isInitiator, ourEphemeralKey, ourSignedKey, theirIdentityPubKey, theirEphemeralPubKey, theirSignedPubKey, registrationId, theirIdentityPubKeyEd) {
    const ourIdentityKey = await __classPrivateFieldGet(this, _SessionBuilder_store, "f").getIdentityKeyPair();
    if (!ourIdentityKey)
        throw new Error("No identity keypair to init session with");
    if (isInitiator) {
        if (ourSignedKey !== undefined) {
            throw new Error("Invalid call to initSession");
        }
        ourSignedKey = ourEphemeralKey;
    }
    else {
        if (theirSignedPubKey !== undefined) {
            throw new Error("Invalid call to initSession");
        }
        theirSignedPubKey = theirEphemeralPubKey;
    }
    let sharedSecret;
    if (ourEphemeralKey === undefined || theirEphemeralPubKey === undefined) {
        sharedSecret = new Uint8Array(32 * 4);
    }
    else {
        sharedSecret = new Uint8Array(32 * 5);
    }
    for (let i = 0; i < 32; i++) {
        sharedSecret[i] = 0xff;
    }
    const ecRes = await Promise.all([
        internalCrypto.ECDHE(theirSignedPubKey, ourIdentityKey.privKey),
        internalCrypto.ECDHE(theirIdentityPubKey, ourSignedKey.privKey),
        internalCrypto.ECDHE(theirSignedPubKey, ourSignedKey.privKey),
    ]);
    if (isInitiator) {
        sharedSecret.set(new Uint8Array(ecRes[0]), 32);
        sharedSecret.set(new Uint8Array(ecRes[1]), 32 * 2);
    }
    else {
        sharedSecret.set(new Uint8Array(ecRes[0]), 32 * 2);
        sharedSecret.set(new Uint8Array(ecRes[1]), 32);
    }
    sharedSecret.set(new Uint8Array(ecRes[2]), 32 * 3);
    if (ourEphemeralKey !== undefined && theirEphemeralPubKey !== undefined) {
        const ecRes4 = await internalCrypto.ECDHE(theirEphemeralPubKey, ourEphemeralKey.privKey);
        sharedSecret.set(new Uint8Array(ecRes4), 32 * 4);
    }
    const masterKey = await HKDF(sharedSecret.buffer, new ArrayBuffer(32), __classPrivateFieldGet(this, _SessionBuilder_profile, "f").x3dhInfo);
    const session = {
        registrationId: registrationId,
        protocolVersion: __classPrivateFieldGet(this, _SessionBuilder_profile, "f").version,
        ad: await __classPrivateFieldGet(this, _SessionBuilder_profile, "f").buildAssociatedData(ourIdentityKey, theirIdentityPubKeyEd, isInitiator),
        currentRatchet: {
            rootKey: masterKey[0],
            lastRemoteEphemeralKey: theirSignedPubKey,
            previousCounter: 0,
            ephemeralKeyPair: ourSignedKey,
        },
        indexInfo: {
            // Internal Curve form (MAC/DH); the Ed form, when present, is the
            // published omemo:2 identity key used for trust.
            remoteIdentityKey: theirIdentityPubKey,
            remoteIdentityKeyEd: theirIdentityPubKeyEd,
            closed: -1,
        },
        oldRatchetList: [],
    };
    if (isInitiator) {
        session.indexInfo.baseKey = ourEphemeralKey.pubKey;
        session.indexInfo.baseKeyType = BaseKeyType.OURS;
        const ourSendingEphemeralKey = await internalCrypto.createKeyPair();
        session.currentRatchet.ephemeralKeyPair = ourSendingEphemeralKey;
        await __classPrivateFieldGet(this, _SessionBuilder_instances, "m", _SessionBuilder_calculateSendingRatchet).call(this, session, theirSignedPubKey);
    }
    else {
        session.indexInfo.baseKey = theirEphemeralPubKey;
        session.indexInfo.baseKeyType = BaseKeyType.THEIRS;
        session.currentRatchet.ephemeralKeyPair = ourSignedKey;
    }
    return session;
}, _SessionBuilder_calculateSendingRatchet = async function _SessionBuilder_calculateSendingRatchet(session, remoteKey) {
    const ratchet = session.currentRatchet;
    const sharedSecret = await internalCrypto.ECDHE(remoteKey, ratchet.ephemeralKeyPair.privKey);
    const masterKey = await HKDF(sharedSecret, ratchet.rootKey, __classPrivateFieldGet(this, _SessionBuilder_profile, "f").rootChainInfo);
    session[util.toString(ratchet.ephemeralKeyPair.pubKey)] = {
        messageKeys: {},
        chainKey: { counter: -1, key: masterKey[1] },
        chainType: ChainType.SENDING,
    };
    ratchet.rootKey = masterKey[0];
};

var _SessionCipher_instances, _SessionCipher_remoteAddress, _SessionCipher_store, _SessionCipher_profile, _SessionCipher_getRecord, _SessionCipher_fillMessageKeys, _SessionCipher_trimSkippedMessageKeys, _SessionCipher_maybeStepRatchet, _SessionCipher_calculateRatchet, _SessionCipher_macContext, _SessionCipher_remoteTrustKey, _SessionCipher_doDecryptWhisperMessage, _SessionCipher_decryptWithSessionList;
/**
 * XEP-0384 MAX_SKIP: the max number of skipped message keys retained per
 * receiving chain. Once exceeded, the oldest (lowest-counter) keys are dropped
 * on a FIFO basis. This bounds the storage-flooding DoS described in the XEP's
 * "MAX_SKIP" / "deletion policy for skipped message keys" sections.
 *
 * The XEP wording is per-session; we cap per-chain (matching libsignal and the
 * library's existing per-chain pruning in record.ts), which is simpler and
 * serialization-compatible.
 *
 * This is independent of the per-message forward-jump cap (2000) in
 * #fillMessageKeys: that bounds the work a single message can force (CPU),
 * while this bounds the keys retained across messages (memory). The cap is
 * enforced by FIFO eviction regardless of the jump limit, so the two need no
 * particular relationship. The XEP RECOMMENDS ~1000 for both.
 */
const MAX_SKIPPED_MESSAGE_KEYS = 1000;
/** Encrypts and decrypts messages for established OMEMO sessions. */
class SessionCipher {
    constructor(store, remoteAddress, version) {
        _SessionCipher_instances.add(this);
        _SessionCipher_remoteAddress.set(this, void 0);
        _SessionCipher_store.set(this, void 0);
        _SessionCipher_profile.set(this, void 0);
        __classPrivateFieldSet(this, _SessionCipher_remoteAddress, typeof remoteAddress === "string"
            ? OMEMOAddress.fromString(remoteAddress)
            : remoteAddress, "f");
        __classPrivateFieldSet(this, _SessionCipher_store, store, "f");
        __classPrivateFieldSet(this, _SessionCipher_profile, getProtocolProfile(version), "f");
    }
    /** Encrypt a message for the remote device. */
    encrypt(buffer) {
        let buf;
        if (!(buffer instanceof ArrayBuffer)) {
            if (typeof buffer === "string") {
                buf = new TextEncoder().encode(buffer).buffer;
            }
            else if (buffer instanceof Uint8Array) {
                buf = toExactBuffer(buffer);
            }
            else {
                throw new Error("Expected buffer to be an ArrayBuffer, string, or Uint8Array");
            }
        }
        else {
            buf = buffer;
        }
        return queueJobForNumber(__classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString(), async () => {
            const address = __classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString();
            const [ourIdentityKey, myRegistrationId, record] = await Promise.all([
                __classPrivateFieldGet(this, _SessionCipher_store, "f").getIdentityKeyPair(),
                __classPrivateFieldGet(this, _SessionCipher_store, "f").getLocalRegistrationId(),
                __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_getRecord).call(this, address),
            ]);
            if (!ourIdentityKey)
                throw new Error("Can't encrypt: no identity key");
            if (!record)
                throw new Error(`Can't encrypt: no record for ${address}`);
            const session = record.getOpenSession();
            if (!session) {
                throw new Error(`No session to encrypt message for ${address}`);
            }
            const ephemeralKey = session.currentRatchet.ephemeralKeyPair.pubKey;
            const chain = session[util.toString(ephemeralKey)];
            if (chain.chainType === ChainType.RECEIVING) {
                throw new Error("Tried to encrypt on a receiving chain");
            }
            await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_fillMessageKeys).call(this, chain, chain.chainKey.counter + 1);
            const keys = await HKDF(chain.messageKeys[chain.chainKey.counter], new ArrayBuffer(32), __classPrivateFieldGet(this, _SessionCipher_profile, "f").messageKeyInfo);
            delete chain.messageKeys[chain.chainKey.counter];
            const counter = chain.chainKey.counter;
            const previousCounter = session.currentRatchet.previousCounter;
            const ciphertext = await encrypt(keys[0], buf, keys[2].slice(0, 16));
            const encodedInner = await __classPrivateFieldGet(this, _SessionCipher_profile, "f").encodeInner({
                ephemeralKey,
                counter,
                previousCounter,
                ciphertext,
            });
            const mac = await __classPrivateFieldGet(this, _SessionCipher_profile, "f").computeMac(keys[1], encodedInner, __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_macContext).call(this, session, ourIdentityKey.pubKey, Direction.SENDING));
            const result = await __classPrivateFieldGet(this, _SessionCipher_profile, "f").frameMessage(encodedInner, mac);
            const trustKey = __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_remoteTrustKey).call(this, session);
            const trusted = await __classPrivateFieldGet(this, _SessionCipher_store, "f").isTrustedIdentity(__classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString(), trustKey, Direction.SENDING);
            if (!trusted) {
                throw new Error("Identity key changed");
            }
            await __classPrivateFieldGet(this, _SessionCipher_store, "f").saveIdentity(__classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString(), trustKey);
            record.updateSessionState(session);
            await __classPrivateFieldGet(this, _SessionCipher_store, "f").storeSession(address, record.serialize());
            if (session.pendingPreKey !== undefined) {
                if (__classPrivateFieldGet(this, _SessionCipher_profile, "f").requiresRegistrationId && myRegistrationId === undefined) {
                    throw new Error("Can't encrypt key-exchange message: no local registrationId");
                }
                const kexBody = await __classPrivateFieldGet(this, _SessionCipher_profile, "f").encodeKeyExchange({
                    registrationId: myRegistrationId,
                    preKeyId: session.pendingPreKey.preKeyId,
                    signedPreKeyId: session.pendingPreKey.signedKeyId,
                    baseKey: session.pendingPreKey.baseKey,
                    ourIdentityKey,
                }, result);
                return __classPrivateFieldGet(this, _SessionCipher_profile, "f").wrapResult(kexBody, true, session.registrationId);
            }
            return __classPrivateFieldGet(this, _SessionCipher_profile, "f").wrapResult(result, false, session.registrationId);
        });
    }
    /** Decrypt a regular (non-key-exchange) message using an existing session. */
    async decryptWhisperMessage(buffer, encoding) {
        const normalized = util.normalizeBuffer(buffer, encoding);
        const exact = toExactBuffer(normalized);
        return queueJobForNumber(__classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString(), async () => {
            const address = __classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString();
            const record = await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_getRecord).call(this, address);
            if (!record)
                throw new Error(`No record for device ${address}`);
            const { session, result } = await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_decryptWithSessionList).call(this, exact, record.getSessions());
            if (session.indexInfo.baseKey !== record.getOpenSession().indexInfo.baseKey) {
                record.archiveCurrentState();
                record.promoteState(session);
            }
            const trustKey = __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_remoteTrustKey).call(this, session);
            const trusted = await __classPrivateFieldGet(this, _SessionCipher_store, "f").isTrustedIdentity(__classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString(), trustKey, Direction.RECEIVING);
            if (!trusted)
                throw new Error("Identity key changed");
            await __classPrivateFieldGet(this, _SessionCipher_store, "f").saveIdentity(__classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString(), trustKey);
            record.updateSessionState(session);
            await __classPrivateFieldGet(this, _SessionCipher_store, "f").storeSession(address, record.serialize());
            return result;
        });
    }
    /** Decrypt a key-exchange message, establishing a new session if needed. */
    decryptPreKeyWhisperMessage(buffer, encoding) {
        const normalized = util.normalizeBuffer(buffer, encoding);
        const exact = toExactBuffer(normalized);
        return queueJobForNumber(__classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString(), async () => {
            const address = __classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString();
            const parsed = await __classPrivateFieldGet(this, _SessionCipher_profile, "f").parseKeyExchange(exact);
            let record = await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_getRecord).call(this, address);
            if (!record) {
                if (__classPrivateFieldGet(this, _SessionCipher_profile, "f").requiresRegistrationId && parsed.registrationId === undefined) {
                    throw new Error("No registrationId");
                }
                record = new SessionRecord();
            }
            const builder = new SessionBuilder(__classPrivateFieldGet(this, _SessionCipher_store, "f"), __classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f"), __classPrivateFieldGet(this, _SessionCipher_profile, "f").version);
            const preKeyId = await builder.processV3(record, parsed);
            const session = record.getSessionByBaseKey(parsed.baseKey);
            const result = await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_doDecryptWhisperMessage).call(this, parsed.message, session);
            record.updateSessionState(session);
            await __classPrivateFieldGet(this, _SessionCipher_store, "f").storeSession(address, record.serialize());
            if (preKeyId !== undefined && preKeyId !== null) {
                await __classPrivateFieldGet(this, _SessionCipher_store, "f").removePreKey(preKeyId);
            }
            return result;
        });
    }
    getRemoteRegistrationId() {
        return queueJobForNumber(__classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString(), async () => {
            const record = await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_getRecord).call(this, __classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString());
            if (record === undefined)
                return undefined;
            const openSession = record.getOpenSession();
            if (openSession === undefined)
                return null;
            return openSession?.registrationId ?? null;
        });
    }
    hasOpenSession() {
        return queueJobForNumber(__classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString(), async () => {
            const record = await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_getRecord).call(this, __classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString());
            if (record === undefined)
                return false;
            return record.hasOpenSession();
        });
    }
    closeOpenSessionForDevice() {
        const address = __classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString();
        return queueJobForNumber(address, async () => {
            const record = await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_getRecord).call(this, address);
            if (record === undefined || record.getOpenSession() === undefined) {
                return;
            }
            record.archiveCurrentState();
            return __classPrivateFieldGet(this, _SessionCipher_store, "f").storeSession(address, record.serialize());
        });
    }
    deleteAllSessionsForDevice() {
        const address = __classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString();
        return queueJobForNumber(address, async () => {
            const record = await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_getRecord).call(this, address);
            if (record === undefined) {
                return;
            }
            record.deleteAllSessions();
            return __classPrivateFieldGet(this, _SessionCipher_store, "f").storeSession(address, record.serialize());
        });
    }
}
_SessionCipher_remoteAddress = new WeakMap(), _SessionCipher_store = new WeakMap(), _SessionCipher_profile = new WeakMap(), _SessionCipher_instances = new WeakSet(), _SessionCipher_getRecord = async function _SessionCipher_getRecord(encodedNumber) {
    const serialized = await __classPrivateFieldGet(this, _SessionCipher_store, "f").loadSession(encodedNumber);
    if (serialized === undefined)
        return undefined;
    return SessionRecord.deserialize(serialized);
}, _SessionCipher_fillMessageKeys = async function _SessionCipher_fillMessageKeys(chain, counter) {
    if (chain.chainKey.counter >= counter) {
        return Promise.resolve();
    }
    if (counter - chain.chainKey.counter > 2000) {
        throw new Error("Over 2000 messages into the future!");
    }
    if (chain.chainKey.key === undefined) {
        throw new Error("Got invalid request to extend chain after it was already closed");
    }
    // KDF_CK: HMAC(chainKey, 0x01) -> message key, HMAC(chainKey, 0x02) -> next chain key.
    let key = chain.chainKey.key;
    const byteArray = new Uint8Array(1);
    byteArray[0] = 1;
    const messageKey = await sign(key, byteArray.buffer);
    byteArray[0] = 2;
    key = await sign(key, byteArray.buffer);
    chain.messageKeys[chain.chainKey.counter + 1] = messageKey;
    chain.chainKey.key = key;
    chain.chainKey.counter += 1;
    __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_trimSkippedMessageKeys).call(this, chain);
    return __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_fillMessageKeys).call(this, chain, counter);
}, _SessionCipher_trimSkippedMessageKeys = function _SessionCipher_trimSkippedMessageKeys(chain) {
    delete chain.messageKeys[chain.chainKey.counter - MAX_SKIPPED_MESSAGE_KEYS];
}, _SessionCipher_maybeStepRatchet = async function _SessionCipher_maybeStepRatchet(session, remoteKey, previousCounter) {
    const remoteKeyStr = util.toString(remoteKey);
    if (session[remoteKeyStr] !== undefined) {
        return;
    }
    console.log("New remote ephemeral key");
    const ratchet = session.currentRatchet;
    const lastRemoteKeyStr = util.toString(ratchet.lastRemoteEphemeralKey);
    let previousRatchet = session[lastRemoteKeyStr];
    if (previousRatchet !== undefined) {
        await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_fillMessageKeys).call(this, previousRatchet, previousCounter);
        delete previousRatchet.chainKey.key;
        session.oldRatchetList[session.oldRatchetList.length] = {
            added: Date.now(),
            ephemeralKey: ratchet.lastRemoteEphemeralKey,
        };
    }
    await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_calculateRatchet).call(this, session, remoteKey, false);
    const ephemeralPubKeyStr = util.toString(ratchet.ephemeralKeyPair.pubKey);
    previousRatchet = session[ephemeralPubKeyStr];
    if (previousRatchet !== undefined) {
        ratchet.previousCounter = previousRatchet.chainKey.counter;
        delete session[ephemeralPubKeyStr];
    }
    const keyPair = await internalCrypto.createKeyPair();
    ratchet.ephemeralKeyPair = keyPair;
    await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_calculateRatchet).call(this, session, remoteKey, true);
    ratchet.lastRemoteEphemeralKey = remoteKey;
}, _SessionCipher_calculateRatchet = async function _SessionCipher_calculateRatchet(session, remoteKey, sending) {
    const ratchet = session.currentRatchet;
    const sharedSecret = await internalCrypto.ECDHE(remoteKey, ratchet.ephemeralKeyPair.privKey);
    const masterKey = await HKDF(sharedSecret, ratchet.rootKey, __classPrivateFieldGet(this, _SessionCipher_profile, "f").rootChainInfo);
    const ephemeralPublicKey = sending ? ratchet.ephemeralKeyPair.pubKey : remoteKey;
    const ephemeralKeyStr = util.toString(ephemeralPublicKey);
    session[ephemeralKeyStr] = {
        messageKeys: {},
        chainKey: { counter: -1, key: masterKey[1] },
        chainType: sending ? ChainType.SENDING : ChainType.RECEIVING,
    };
    ratchet.rootKey = masterKey[0];
}, _SessionCipher_macContext = function _SessionCipher_macContext(session, ourIdentityKey, direction) {
    return {
        ourIdentityKey,
        remoteIdentityKey: session.indexInfo.remoteIdentityKey,
        direction: direction === Direction.SENDING ? "sending" : "receiving",
        ad: session.ad,
    };
}, _SessionCipher_remoteTrustKey = function _SessionCipher_remoteTrustKey(session) {
    if (__classPrivateFieldGet(this, _SessionCipher_profile, "f").usesEdIdentityKey) {
        const ed = session.indexInfo.remoteIdentityKeyEd;
        if (!ed) {
            throw new Error(`Session is missing the Ed25519 identity key required by ${__classPrivateFieldGet(this, _SessionCipher_profile, "f").version}`);
        }
        return ed;
    }
    return session.indexInfo.remoteIdentityKey;
}, _SessionCipher_doDecryptWhisperMessage = async function _SessionCipher_doDecryptWhisperMessage(messageBytes, session) {
    if (!(messageBytes instanceof ArrayBuffer)) {
        throw new Error("Expected messageBytes to be an ArrayBuffer");
    }
    const parsed = await __classPrivateFieldGet(this, _SessionCipher_profile, "f").parseMessage(messageBytes);
    const remoteEphemeralKey = parsed.ephemeralKey;
    if (session === undefined) {
        return Promise.reject(new Error(`No session found to decrypt message from ${__classPrivateFieldGet(this, _SessionCipher_remoteAddress, "f").toString()}`));
    }
    if (session.indexInfo.closed !== -1) {
        console.log("decrypting message for closed session");
    }
    await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_maybeStepRatchet).call(this, session, remoteEphemeralKey, parsed.previousCounter);
    const chain = session[util.toString(parsed.ephemeralKey)];
    if (chain.chainType === ChainType.SENDING) {
        throw new Error("Tried to decrypt on a sending chain");
    }
    await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_fillMessageKeys).call(this, chain, parsed.counter);
    const messageKey = chain.messageKeys[parsed.counter];
    if (messageKey === undefined) {
        const e = new Error("Message key not found. The counter was repeated or the key was not filled.");
        e.name = "MessageCounterError";
        throw e;
    }
    delete chain.messageKeys[parsed.counter];
    const keys = await HKDF(messageKey, new ArrayBuffer(32), __classPrivateFieldGet(this, _SessionCipher_profile, "f").messageKeyInfo);
    const ourIdentityKey = await __classPrivateFieldGet(this, _SessionCipher_store, "f").getIdentityKeyPair();
    if (!ourIdentityKey)
        throw new Error("No identity keypair to verify MAC");
    await __classPrivateFieldGet(this, _SessionCipher_profile, "f").verifyMac(keys[1], parsed.encodedInner, __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_macContext).call(this, session, ourIdentityKey.pubKey, Direction.RECEIVING), parsed.mac);
    const plaintext = await decrypt(keys[0], parsed.ciphertext, keys[2].slice(0, 16));
    delete session.pendingPreKey;
    return {
        plaintext,
        ratchet: { counter: parsed.counter, key: parsed.ephemeralKey },
    };
}, _SessionCipher_decryptWithSessionList = async function _SessionCipher_decryptWithSessionList(buffer, sessionList, errors = []) {
    if (sessionList.length === 0) {
        return Promise.reject(errors[0]);
    }
    const session = sessionList.pop();
    try {
        return {
            result: await __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_doDecryptWhisperMessage).call(this, buffer, session),
            session,
        };
    }
    catch (e) {
        if (e.name === "MessageCounterError") {
            throw e;
        }
        errors.push(e);
        return __classPrivateFieldGet(this, _SessionCipher_instances, "m", _SessionCipher_decryptWithSessionList).call(this, buffer, sessionList, errors);
    }
};

var _FingerprintGenerator_instances, _FingerprintGenerator_iterations, _FingerprintGenerator_getEncodedChunk, _FingerprintGenerator_iterateHash, _FingerprintGenerator_getDisplayStringFor;
const VERSION = 0;
/** Generates fingerprints for identity verification. */
class FingerprintGenerator {
    constructor(iterations) {
        _FingerprintGenerator_instances.add(this);
        _FingerprintGenerator_iterations.set(this, void 0);
        __classPrivateFieldSet(this, _FingerprintGenerator_iterations, iterations, "f");
    }
    /**
     * Create a fingerprint string for two parties.
     * Returns a sorted concatenation of both parties' fingerprint codes.
     */
    async createFor(localIdentifier, localIdentityKey, remoteIdentifier, remoteIdentityKey) {
        if (typeof localIdentifier !== "string" ||
            typeof remoteIdentifier !== "string" ||
            !(localIdentityKey instanceof ArrayBuffer) ||
            !(remoteIdentityKey instanceof ArrayBuffer)) {
            throw new Error("Invalid arguments");
        }
        const fingerprints = await Promise.all([
            __classPrivateFieldGet(this, _FingerprintGenerator_instances, "m", _FingerprintGenerator_getDisplayStringFor).call(this, localIdentifier, localIdentityKey, __classPrivateFieldGet(this, _FingerprintGenerator_iterations, "f")),
            __classPrivateFieldGet(this, _FingerprintGenerator_instances, "m", _FingerprintGenerator_getDisplayStringFor).call(this, remoteIdentifier, remoteIdentityKey, __classPrivateFieldGet(this, _FingerprintGenerator_iterations, "f")),
        ]);
        return fingerprints.sort().join("");
    }
}
_FingerprintGenerator_iterations = new WeakMap(), _FingerprintGenerator_instances = new WeakSet(), _FingerprintGenerator_getEncodedChunk = function _FingerprintGenerator_getEncodedChunk(hashBytes, offset) {
    const chunk = (hashBytes[offset] * Math.pow(2, 32) +
        hashBytes[offset + 1] * Math.pow(2, 24) +
        hashBytes[offset + 2] * Math.pow(2, 16) +
        hashBytes[offset + 3] * Math.pow(2, 8) +
        hashBytes[offset + 4]) %
        100000;
    let s = chunk.toString();
    while (s.length < 5) {
        s = "0" + s;
    }
    return s;
}, _FingerprintGenerator_iterateHash = async function _FingerprintGenerator_iterateHash(data, key, count) {
    const combinedData = new Uint8Array(data.byteLength + key.byteLength);
    combinedData.set(new Uint8Array(data), 0);
    combinedData.set(new Uint8Array(key), data.byteLength);
    const result = await hash(combinedData.buffer);
    if (--count === 0) {
        return result;
    }
    return __classPrivateFieldGet(this, _FingerprintGenerator_instances, "m", _FingerprintGenerator_iterateHash).call(this, result, key, count);
}, _FingerprintGenerator_getDisplayStringFor = async function _FingerprintGenerator_getDisplayStringFor(identifier, key, iterations) {
    const versionUint16Array = new Uint16Array([VERSION]);
    const versionLength = versionUint16Array.buffer.byteLength;
    const keyUint8Array = new Uint8Array(key);
    const keyLength = keyUint8Array.buffer.byteLength;
    const identifierUint8Array = new TextEncoder().encode(identifier);
    const identifierLength = identifierUint8Array.buffer.byteLength;
    const combinedBuffer = new Uint8Array(versionLength + keyLength + identifierLength);
    combinedBuffer.set(versionUint16Array, 0);
    combinedBuffer.set(keyUint8Array, versionLength);
    combinedBuffer.set(identifierUint8Array, versionLength + keyLength);
    const output = new Uint8Array(await __classPrivateFieldGet(this, _FingerprintGenerator_instances, "m", _FingerprintGenerator_iterateHash).call(this, combinedBuffer.buffer, key, iterations));
    return (__classPrivateFieldGet(this, _FingerprintGenerator_instances, "m", _FingerprintGenerator_getEncodedChunk).call(this, output, 0) +
        __classPrivateFieldGet(this, _FingerprintGenerator_instances, "m", _FingerprintGenerator_getEncodedChunk).call(this, output, 5) +
        __classPrivateFieldGet(this, _FingerprintGenerator_instances, "m", _FingerprintGenerator_getEncodedChunk).call(this, output, 10) +
        __classPrivateFieldGet(this, _FingerprintGenerator_instances, "m", _FingerprintGenerator_getEncodedChunk).call(this, output, 15) +
        __classPrivateFieldGet(this, _FingerprintGenerator_instances, "m", _FingerprintGenerator_getEncodedChunk).call(this, output, 20) +
        __classPrivateFieldGet(this, _FingerprintGenerator_instances, "m", _FingerprintGenerator_getEncodedChunk).call(this, output, 25));
};

var _Curve25519Worker_instances, _Curve25519Worker_jobs, _Curve25519Worker_jobId, _Curve25519Worker_dead, _Curve25519Worker_consecutiveTimeouts, _Curve25519Worker_timeoutMs, _Curve25519Worker_onMessage, _Curve25519Worker_take, _Curve25519Worker_onTimeout, _Curve25519Worker_fail, _WorkerCurveBackend_instances, _WorkerCurveBackend_url, _WorkerCurveBackend_fallback, _WorkerCurveBackend_timeoutMs, _WorkerCurveBackend_onStatusChange, _WorkerCurveBackend_transport, _WorkerCurveBackend_stopped, _WorkerCurveBackend_restartAttempts, _WorkerCurveBackend_nextAttemptAt, _WorkerCurveBackend_offloaded, _WorkerCurveBackend_setOffloaded, _WorkerCurveBackend_connect, _WorkerCurveBackend_onTransportError, _WorkerCurveBackend_run, _WorkerCurveBackend_onRoundTrip;
/**
 * How long to wait for a worker reply before treating the worker as hung. A hung
 * worker (deadlocked, or killed by the browser without firing `onerror`) would
 * otherwise leave the operation pending forever. Curve operations take single-digit
 * milliseconds, so this is generous; the first call also covers worker startup and
 * wasm compilation. Configurable per `startWorker`; pass `0` (or a non-finite value)
 * to disable.
 */
const DEFAULT_WORKER_TIMEOUT_MS = 10000;
/**
 * How many consecutive timeouts, with no reply of any kind in between, mean the
 * worker is hung rather than briefly slow. A single timeout only fails its own
 * operation (which then completes on the fallback) and leaves the worker in place.
 * Reaching this count tears it down, so later operations go to the fallback.
 */
const MAX_CONSECUTIVE_TIMEOUTS = 2;
/**
 * How far past its own deadline a timer may fire before we stop trusting it.
 */
const TIMER_OVERSHOOT_GRACE_MS = 250;
/**
 * Backoff bounds for rebuilding a worker that failed. The delay doubles per
 * consecutive failure so a burst of operations cannot spawn a worker each, and
 * resets as soon as a worker completes a round trip.
 */
const WORKER_RESTART_BASE_DELAY_MS = 1000;
const WORKER_RESTART_MAX_DELAY_MS = 60000;
/**
 * A failure of the worker itself: the script failed to load, the worker crashed,
 * or the URL/CSP made it unconstructable. This is distinct from an operation the
 * worker ran and legitimately rejected (e.g. an invalid signature), which comes
 * back as a normal error reply. Only a transport failure triggers a fallback to
 * the local backend.
 */
class WorkerTransportError extends Error {
}
/**
 * Low-level message transport to the curve25519 Web Worker. Each `post()` is one
 * request/reply keyed by id. A normal error reply rejects just that job (an
 * operation error), as does a lone timeout. A worker-level failure (a crash, a
 * malformed reply, or repeated timeouts) rejects every pending job with a
 * WorkerTransportError and notifies the owner through `onTransportError`.
 */
class Curve25519Worker {
    constructor(url, timeoutMs) {
        _Curve25519Worker_instances.add(this);
        _Curve25519Worker_jobs.set(this, new Map());
        _Curve25519Worker_jobId.set(this, 0);
        _Curve25519Worker_dead.set(this, false);
        _Curve25519Worker_consecutiveTimeouts.set(this, 0);
        _Curve25519Worker_timeoutMs.set(this, void 0);
        this.onTransportError = () => { };
        __classPrivateFieldSet(this, _Curve25519Worker_timeoutMs, timeoutMs, "f");
        this.worker = new Worker(url); // may throw synchronously (bad URL / CSP)
        this.worker.onmessage = (e) => __classPrivateFieldGet(this, _Curve25519Worker_instances, "m", _Curve25519Worker_onMessage).call(this, e.data);
        this.worker.onerror = (e) => __classPrivateFieldGet(this, _Curve25519Worker_instances, "m", _Curve25519Worker_fail).call(this, new WorkerTransportError(e.message || "curve25519 worker error"));
        this.worker.onmessageerror = () => __classPrivateFieldGet(this, _Curve25519Worker_instances, "m", _Curve25519Worker_fail).call(this, new WorkerTransportError("curve25519 worker message error"));
    }
    post(methodName, args) {
        if (__classPrivateFieldGet(this, _Curve25519Worker_dead, "f")) {
            return Promise.reject(new WorkerTransportError("curve25519 worker is not available"));
        }
        return new Promise((resolve, reject) => {
            var _a, _b;
            const id = (__classPrivateFieldSet(this, _Curve25519Worker_jobId, (_b = __classPrivateFieldGet(this, _Curve25519Worker_jobId, "f"), _a = _b++, _b), "f"), _a);
            const timed = __classPrivateFieldGet(this, _Curve25519Worker_timeoutMs, "f") > 0 && isFinite(__classPrivateFieldGet(this, _Curve25519Worker_timeoutMs, "f"));
            const timer = timed
                ? setTimeout(() => __classPrivateFieldGet(this, _Curve25519Worker_instances, "m", _Curve25519Worker_onTimeout).call(this, id), __classPrivateFieldGet(this, _Curve25519Worker_timeoutMs, "f"))
                : undefined;
            __classPrivateFieldGet(this, _Curve25519Worker_jobs, "f").set(id, {
                resolve,
                reject,
                timer,
                deadline: timed ? Date.now() + __classPrivateFieldGet(this, _Curve25519Worker_timeoutMs, "f") : Infinity,
                regranted: false,
            });
            this.worker.postMessage({ id, methodName, args });
        });
    }
    terminate() {
        // Reject any in-flight jobs as a transport failure so the backend can
        // finish them on the fallback rather than leaving them pending forever.
        for (const job of __classPrivateFieldGet(this, _Curve25519Worker_jobs, "f").values()) {
            if (job.timer !== undefined)
                clearTimeout(job.timer);
            job.reject(new WorkerTransportError("curve25519 worker was stopped"));
        }
        __classPrivateFieldGet(this, _Curve25519Worker_jobs, "f").clear();
        __classPrivateFieldSet(this, _Curve25519Worker_dead, true, "f");
        this.worker.terminate();
    }
}
_Curve25519Worker_jobs = new WeakMap(), _Curve25519Worker_jobId = new WeakMap(), _Curve25519Worker_dead = new WeakMap(), _Curve25519Worker_consecutiveTimeouts = new WeakMap(), _Curve25519Worker_timeoutMs = new WeakMap(), _Curve25519Worker_instances = new WeakSet(), _Curve25519Worker_onMessage = function _Curve25519Worker_onMessage(data) {
    const job = __classPrivateFieldGet(this, _Curve25519Worker_instances, "m", _Curve25519Worker_take).call(this, data?.id);
    if (!job)
        return;
    // A reply of any shape proves the worker is alive and draining its queue.
    __classPrivateFieldSet(this, _Curve25519Worker_consecutiveTimeouts, 0, "f");
    if (data.ok === true) {
        job.resolve(data.result);
        return;
    }
    if (typeof data.error === "string" && data.error !== "") {
        job.reject(new Error(data.error)); // operation error: caller must not fall back
        return;
    }
    // Neither a well-formed success nor a well-formed failure.
    // Fail closed as a transport error.
    const malformed = new WorkerTransportError("curve25519 worker sent a malformed reply");
    job.reject(malformed);
    __classPrivateFieldGet(this, _Curve25519Worker_instances, "m", _Curve25519Worker_fail).call(this, malformed);
}, _Curve25519Worker_take = function _Curve25519Worker_take(id) {
    if (id === undefined)
        return undefined;
    const job = __classPrivateFieldGet(this, _Curve25519Worker_jobs, "f").get(id);
    if (!job)
        return undefined;
    __classPrivateFieldGet(this, _Curve25519Worker_jobs, "f").delete(id);
    if (job.timer !== undefined)
        clearTimeout(job.timer);
    return job;
}, _Curve25519Worker_onTimeout = function _Curve25519Worker_onTimeout(id) {
    var _a;
    const job = __classPrivateFieldGet(this, _Curve25519Worker_jobs, "f").get(id);
    if (!job)
        return;
    // The timer fired far later than it was due, so it measured a stalled main
    // thread rather than a stalled worker. Give the job one more full interval:
    // the reply may already be queued behind this callback.
    if (!job.regranted && Date.now() - job.deadline > TIMER_OVERSHOOT_GRACE_MS) {
        job.regranted = true;
        job.deadline = Date.now() + __classPrivateFieldGet(this, _Curve25519Worker_timeoutMs, "f");
        job.timer = setTimeout(() => __classPrivateFieldGet(this, _Curve25519Worker_instances, "m", _Curve25519Worker_onTimeout).call(this, id), __classPrivateFieldGet(this, _Curve25519Worker_timeoutMs, "f"));
        return;
    }
    __classPrivateFieldGet(this, _Curve25519Worker_jobs, "f").delete(id); // its timer has already fired, nothing to clear
    __classPrivateFieldSet(this, _Curve25519Worker_consecutiveTimeouts, // its timer has already fired, nothing to clear
    (_a = __classPrivateFieldGet(this, _Curve25519Worker_consecutiveTimeouts, "f"), _a++, _a), "f");
    job.reject(new WorkerTransportError("curve25519 worker timed out"));
    // Repeated timeouts with no reply in between: the worker really is hung, so
    // stop routing to it instead of making every later operation wait one out.
    if (__classPrivateFieldGet(this, _Curve25519Worker_consecutiveTimeouts, "f") >= MAX_CONSECUTIVE_TIMEOUTS) {
        __classPrivateFieldGet(this, _Curve25519Worker_instances, "m", _Curve25519Worker_fail).call(this, new WorkerTransportError("curve25519 worker timed out repeatedly"));
    }
}, _Curve25519Worker_fail = function _Curve25519Worker_fail(error) {
    if (__classPrivateFieldGet(this, _Curve25519Worker_dead, "f"))
        return;
    __classPrivateFieldSet(this, _Curve25519Worker_dead, true, "f");
    for (const job of __classPrivateFieldGet(this, _Curve25519Worker_jobs, "f").values()) {
        if (job.timer !== undefined)
            clearTimeout(job.timer);
        job.reject(error);
    }
    __classPrivateFieldGet(this, _Curve25519Worker_jobs, "f").clear();
    this.onTransportError(error);
};
/**
 * A CurveBackend that runs operations in the Web Worker and falls back to a local
 * backend when the worker fails at the transport level. Operation errors reported
 * by the worker (a rejected signature, an all-zero shared secret) propagate
 * unchanged. Method-name mapping: ECDHE -> calculateAgreement,
 * Ed25519Sign -> calculateSignature, Ed25519Verify -> verifySignature; the rest
 * share their names with the worker protocol.
 */
class WorkerCurveBackend {
    constructor(url, fallback, timeoutMs, onStatusChange) {
        _WorkerCurveBackend_instances.add(this);
        _WorkerCurveBackend_url.set(this, void 0);
        _WorkerCurveBackend_fallback.set(this, void 0);
        _WorkerCurveBackend_timeoutMs.set(this, void 0);
        _WorkerCurveBackend_onStatusChange.set(this, void 0);
        _WorkerCurveBackend_transport.set(this, null);
        _WorkerCurveBackend_stopped.set(this, false);
        _WorkerCurveBackend_restartAttempts.set(this, 0);
        _WorkerCurveBackend_nextAttemptAt.set(this, 0);
        _WorkerCurveBackend_offloaded.set(this, true); // Whether operations are currently reaching the worker.
        __classPrivateFieldSet(this, _WorkerCurveBackend_url, url, "f");
        __classPrivateFieldSet(this, _WorkerCurveBackend_fallback, fallback, "f");
        __classPrivateFieldSet(this, _WorkerCurveBackend_timeoutMs, timeoutMs, "f");
        // Assigned before #connect so a worker that fails to construct is reported.
        __classPrivateFieldSet(this, _WorkerCurveBackend_onStatusChange, onStatusChange, "f");
        __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_connect).call(this);
    }
    createKeyPair(privKey) {
        return __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_run).call(this, "createKeyPair", [privKey], () => __classPrivateFieldGet(this, _WorkerCurveBackend_fallback, "f").createKeyPair(privKey));
    }
    ECDHE(pubKey, privKey) {
        return __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_run).call(this, "calculateAgreement", [pubKey, privKey], () => __classPrivateFieldGet(this, _WorkerCurveBackend_fallback, "f").ECDHE(pubKey, privKey));
    }
    Ed25519Sign(privKey, message) {
        return __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_run).call(this, "calculateSignature", [privKey, message], () => __classPrivateFieldGet(this, _WorkerCurveBackend_fallback, "f").Ed25519Sign(privKey, message));
    }
    Ed25519Verify(pubKey, msg, sig) {
        return __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_run).call(this, "verifySignature", [pubKey, msg, sig], () => __classPrivateFieldGet(this, _WorkerCurveBackend_fallback, "f").Ed25519Verify(pubKey, msg, sig));
    }
    curvePubKeyToEd25519PubKey(pubKey) {
        return __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_run).call(this, "curvePubKeyToEd25519PubKey", [pubKey], () => __classPrivateFieldGet(this, _WorkerCurveBackend_fallback, "f").curvePubKeyToEd25519PubKey(pubKey));
    }
    ed25519PubKeyToCurvePubKey(edPubKey) {
        return __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_run).call(this, "ed25519PubKeyToCurvePubKey", [edPubKey], () => __classPrivateFieldGet(this, _WorkerCurveBackend_fallback, "f").ed25519PubKeyToCurvePubKey(edPubKey));
    }
    terminate() {
        __classPrivateFieldSet(this, _WorkerCurveBackend_stopped, true, "f"); // an explicit stop must not be undone by #connect
        __classPrivateFieldGet(this, _WorkerCurveBackend_transport, "f")?.terminate();
        __classPrivateFieldSet(this, _WorkerCurveBackend_transport, null, "f");
    }
}
_WorkerCurveBackend_url = new WeakMap(), _WorkerCurveBackend_fallback = new WeakMap(), _WorkerCurveBackend_timeoutMs = new WeakMap(), _WorkerCurveBackend_onStatusChange = new WeakMap(), _WorkerCurveBackend_transport = new WeakMap(), _WorkerCurveBackend_stopped = new WeakMap(), _WorkerCurveBackend_restartAttempts = new WeakMap(), _WorkerCurveBackend_nextAttemptAt = new WeakMap(), _WorkerCurveBackend_offloaded = new WeakMap(), _WorkerCurveBackend_instances = new WeakSet(), _WorkerCurveBackend_setOffloaded = function _WorkerCurveBackend_setOffloaded(offloaded, error) {
    if (__classPrivateFieldGet(this, _WorkerCurveBackend_offloaded, "f") === offloaded)
        return;
    __classPrivateFieldSet(this, _WorkerCurveBackend_offloaded, offloaded, "f");
    if (offloaded) {
        console.info("libomemo.js: the curve25519 worker recovered; operations are offloaded again.");
    }
    else {
        console.error("libomemo.js: the curve25519 worker failed; falling back to the local backend.", error);
    }
    try {
        __classPrivateFieldGet(this, _WorkerCurveBackend_onStatusChange, "f")?.call(this, error ? { offloaded, error } : { offloaded });
    }
    catch {
        // A broken status handler is the consumer's problem, not the crypto's.
    }
}, _WorkerCurveBackend_connect = function _WorkerCurveBackend_connect() {
    if (__classPrivateFieldGet(this, _WorkerCurveBackend_stopped, "f"))
        return null;
    if (Date.now() < __classPrivateFieldGet(this, _WorkerCurveBackend_nextAttemptAt, "f"))
        return null;
    try {
        const transport = new Curve25519Worker(__classPrivateFieldGet(this, _WorkerCurveBackend_url, "f"), __classPrivateFieldGet(this, _WorkerCurveBackend_timeoutMs, "f"));
        transport.onTransportError = (err) => __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_onTransportError).call(this, err);
        __classPrivateFieldSet(this, _WorkerCurveBackend_transport, transport, "f");
        return transport;
    }
    catch (err) {
        // `new Worker()` throws synchronously for a malformed URL or a CSP block.
        __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_onTransportError).call(this, err instanceof WorkerTransportError ? err : new WorkerTransportError(String(err)));
        return null;
    }
}, _WorkerCurveBackend_onTransportError = function _WorkerCurveBackend_onTransportError(error) {
    var _a;
    __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_setOffloaded).call(this, false, error);
    // Back off before the next attempt, doubling per consecutive failure, so a
    // permanently broken worker URL costs one spawn per interval rather than one
    // per operation. #run resets this the moment a worker completes a round trip.
    __classPrivateFieldSet(this, _WorkerCurveBackend_nextAttemptAt, Date.now() +
        Math.min(WORKER_RESTART_BASE_DELAY_MS * 2 ** __classPrivateFieldGet(this, _WorkerCurveBackend_restartAttempts, "f"), WORKER_RESTART_MAX_DELAY_MS), "f");
    __classPrivateFieldSet(this, _WorkerCurveBackend_restartAttempts, (_a = __classPrivateFieldGet(this, _WorkerCurveBackend_restartAttempts, "f"), _a++, _a), "f");
    // Terminate the failed worker before dropping the reference. A timed-out
    // worker is still a live thread, and `onerror` fires for any uncaught error
    // without killing the worker, so neither case is self-cleaning.
    const transport = __classPrivateFieldGet(this, _WorkerCurveBackend_transport, "f");
    __classPrivateFieldSet(this, _WorkerCurveBackend_transport, null, "f");
    transport?.terminate();
}, _WorkerCurveBackend_run = async function _WorkerCurveBackend_run(methodName, args, local) {
    const transport = __classPrivateFieldGet(this, _WorkerCurveBackend_transport, "f") ?? __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_connect).call(this);
    if (!transport)
        return local();
    try {
        const result = (await transport.post(methodName, args));
        __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_onRoundTrip).call(this);
        return result;
    }
    catch (error) {
        // The worker died mid-call; #onTransportError has already dropped it and
        // scheduled the next attempt, so just complete this operation locally.
        if (error instanceof WorkerTransportError)
            return local();
        __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_onRoundTrip).call(this); // an operation error also proves it is alive
        throw error; // operation error: propagate
    }
}, _WorkerCurveBackend_onRoundTrip = function _WorkerCurveBackend_onRoundTrip() {
    __classPrivateFieldSet(this, _WorkerCurveBackend_restartAttempts, 0, "f");
    __classPrivateFieldGet(this, _WorkerCurveBackend_instances, "m", _WorkerCurveBackend_setOffloaded).call(this, true);
};
let activeWorkerBackend = null;
/**
 * Offload curve operations to the Web Worker at `url` (typically the bundled
 * `dist/libomemo-worker.js`). Subsequent OMEMO crypto runs off the main thread.
 * If the worker cannot be loaded, or a call does not get a reply within
 * `options.timeout` ms, that call falls back to the local backend: the bundled wasm
 * in the default build, or a thrown error in the `worker-client` build, which has no
 * local wasm.
 *
 * A failure is not permanent. A single timeout fails only its own operation; the
 * worker is dropped after repeated timeouts or a crash, and is then rebuilt
 * automatically on a later operation (with backoff), so a transient outage does not
 * disable offloading, or, in the `worker-client` build, all cryptography, for the
 * lifetime of the page. `stopWorker()` is the only permanent stop.
 *
 * Because that movement is invisible from the outside, and in the default build it
 * means private-key operations have moved onto the main thread, pass
 * `options.onStatusChange` to observe it rather than relying on the console.
 *
 * @param url      URL of the worker script. It receives raw private keys, so it must
 *                 be a trusted same-origin, CSP-permitted script, not a URL derived
 *                 from remote input.
 * @param options.timeout  Per-operation reply timeout in milliseconds
 *                 (default 10000). Pass 0 to disable the timeout.
 * @param options.onStatusChange  Called whenever operations start or stop running in
 *                 the worker. See {@link WorkerStatus}.
 */
function startWorker(url, options = {}) {
    stopWorker();
    const timeoutMs = options.timeout ?? DEFAULT_WORKER_TIMEOUT_MS;
    const backend = new WorkerCurveBackend(url, getLocalCurveBackend(), timeoutMs, options.onStatusChange);
    activeWorkerBackend = backend;
    setCurveBackend(backend);
}
/** Stop offloading and revert curve operations to the local backend. */
function stopWorker() {
    if (activeWorkerBackend) {
        activeWorkerBackend.terminate();
        activeWorkerBackend = null;
    }
    resetCurveBackend();
}

/**
 * Reference in-memory implementation of the OMEMOStore interface for testing and development.
 * */
class InMemoryStore {
    constructor() {
        this.store = {};
    }
    getIdentityKeyPair() {
        return this.get("identityKey");
    }
    getLocalRegistrationId() {
        return this.get("registrationId");
    }
    put(key, value) {
        if (key === undefined || value === undefined || key === null || value === null)
            throw new Error("Tried to store undefined/null");
        this.store[key] = value;
    }
    get(key, defaultValue) {
        if (key === null || key === undefined)
            throw new Error("Tried to get value for undefined/null key");
        if (key in this.store) {
            return this.store[key];
        }
        else {
            return defaultValue;
        }
    }
    remove(key) {
        if (key === null || key === undefined)
            throw new Error("Tried to remove value for undefined/null key");
        delete this.store[key];
    }
    isTrustedIdentity(address, identityKey, _direction) {
        if (address === null || address === undefined) {
            throw new Error("tried to check identity key for undefined/null key");
        }
        if (!(identityKey instanceof ArrayBuffer)) {
            throw new Error("Expected identityKey to be an ArrayBuffer");
        }
        const trusted = this.get("identityKey" + address);
        if (trusted === undefined) {
            return Promise.resolve(true);
        }
        return util.toString(identityKey) === util.toString(trusted);
    }
    loadIdentityKey(address) {
        if (address === null || address === undefined)
            throw new Error("Tried to get identity key for undefined/null key");
        return this.get("identityKey" + address);
    }
    saveIdentity(address, identityKey) {
        if (address === null || address === undefined)
            throw new Error("Tried to put identity key for undefined/null key");
        const existing = this.get("identityKey" + address);
        this.put("identityKey" + address, identityKey);
        if (existing && util.toString(identityKey) !== util.toString(existing)) {
            return true;
        }
        else {
            return false;
        }
    }
    loadPreKey(keyId) {
        const res = this.get("25519KeypreKey" + keyId);
        if (res !== undefined) {
            return Promise.resolve({ keyPair: res });
        }
        return Promise.resolve(undefined);
    }
    storePreKey(keyId, keyPair) {
        return this.put("25519KeypreKey" + keyId, keyPair);
    }
    removePreKey(keyId) {
        return this.remove("25519KeypreKey" + keyId);
    }
    loadSignedPreKey(keyId) {
        const res = this.get("25519KeysignedKey" + keyId);
        if (res !== undefined) {
            return { keyPair: res };
        }
        return;
    }
    storeSignedPreKey(keyId, keyPair) {
        return this.put("25519KeysignedKey" + keyId, keyPair);
    }
    removeSignedPreKey(keyId) {
        return this.remove("25519KeysignedKey" + keyId);
    }
    loadSession(address) {
        return this.get("session" + address);
    }
    storeSession(address, record) {
        return this.put("session" + address, record);
    }
    removeSession(address) {
        return this.remove("session" + address);
    }
    removeAllSessions(jid) {
        for (const key in this.store) {
            if (key.startsWith("session" + jid)) {
                delete this.store[key];
            }
        }
    }
}

export { BaseKeyType, ChainType, FingerprintGenerator, InMemoryStore, KeyHelper, OMEMOAddress, SessionBuilder, SessionCipher, SessionRecord, curvePubKeyToEd25519PubKey, ed25519PubKeyToCurvePubKey, startWorker, stopWorker, util };
//# sourceMappingURL=libomemo.worker-client.esm.js.map
