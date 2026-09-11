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

// This code implements the `-sMODULARIZE` settings by taking the generated
// JS program code (INNER_JS_CODE) and wrapping it in a factory function.

// When targeting node and ES6 we use `await import ..` in the generated code
// so the outer function needs to be marked as async.
async function Curve25519Module(moduleArg = {}) {
  var Module = moduleArg;
// include: shell.js
// include: minimum_runtime_check.js
// end include: minimum_runtime_check.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = !!globalThis.window;
var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != 'renderer';

if (ENVIRONMENT_IS_NODE) {
  // When building an ES module `require` is not normally available.
  // We need to use `createRequire()` to construct the require()` function.
  const { createRequire } = await import('node:module');
  /** @suppress{duplicate} */
  var require = createRequire(import.meta.url);

}

var _scriptName = import.meta.url;

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';

if (ENVIRONMENT_IS_NODE) {

  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  require('node:fs');

  if (_scriptName.startsWith('file:')) {
    scriptDirectory = require('node:path').dirname(require('node:url').fileURLToPath(_scriptName)) + '/';
  }
// end include: node_shell_read.js
  if (process.argv.length > 1) {
    process.argv[1].replace(/\\/g, '/');
  }

  process.argv.slice(2);

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL('.', _scriptName).href; // includes trailing slash
  } catch {
    // Must be a `blob:` or `data:` URL (e.g. `blob:http://site.com/etc/etc`), we cannot
    // infer anything from them.
  }
} else
;

console.log.bind(console);
var err = console.error.bind(console);

// end include: shell.js

// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary;

// Wasm globals

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// end include: runtime_exceptions.js
// include: runtime_debug.js
// end include: runtime_debug.js
// include: binaryDecode.js
// Prevent Closure from minifying the binaryDecode() function, or otherwise
// Closure may analyze through the WASM_BINARY_DATA placeholder string into this
// function, leading into incorrect results.
/** @noinline */
function binaryDecode(bin) {
  for (var i = 0, l = bin.length, o = new Uint8Array(l), c; i < l; ++i) {
    c = bin.charCodeAt(i);
    o[i] = ~c >> 8 & c; // Recover the null byte in a manner that is compatible with https://crbug.com/453961758
  }
  return o;
}



function updateMemoryViews() {
  var b = wasmMemory.buffer;
  
  
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
  
  
  
  
  
  
  
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
function preRun() {
  var preRun = Module['preRun'];
  if (preRun) {
    if (typeof preRun == 'function') preRun = [preRun];
    onPreRuns.push(...preRun);
  }
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
  // End ATPRERUNS hooks
}

function initRuntime() {

  // No ATINITS hooks

  wasmExports['__wasm_call_ctors']();

  // No ATPOSTCTORS hooks

}

function postRun() {

  var postRun = Module['postRun'];
  if (postRun) {
    if (typeof postRun == 'function') postRun = [postRun];
    onPostRuns.push(...postRun);
  }

  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
  // End ATPOSTRUNS hooks
}

/**
 * @param {string|number=} what
 */
function abort(what) {
  Module['onAbort']?.(what);

  what = `Aborted(${what})`;
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;

  what += '. Build with -sASSERTIONS for more info.';

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

var wasmBinaryFile;

function findWasmBinary() {
  return binaryDecode(' asm   Z``  ` ` ` ` ```~`~``~`` envemscripten_resize_heap  FE   	\n\r \r  \rpAõmemory __wasm_call_ctors ,crypto_sign_ed25519_ref10_ge_scalarmult_base !malloc >free @curve25519_verify (#curve25519_pubkey_to_ed25519_pubkey ,#ed25519_pubkey_to_curve25519_pubkey -sph_sha512_init <\rxed25519_sign 2xed25519_verify 3curve25519_donna 8__indirect_function_table _emscripten_stack_restore C_emscripten_stack_alloc Demscripten_stack_get_current E\n§E %   B 7   B 7  B 7  B 7  B 7 ,   B 7  A6   B 7  B 7  B 7  A 6$ì ( ! ( ! (! (! (! (! (!	 (!\n (! (! (!\r (! (! (! (! (! ( ! ( !   ($ ($j6$    j6     j6    j6   \r j6    j6   	 \nj6    j6    j6    j6 ¯ ( !  ( ! (!  (! (!  (! (!	  (!\n (!  (! (!\r  (! (!  (! (!  (! ( !  ( !   ($  ($"sA  k"q s6$     s qs6      s qs6     s qs6    \r s qs6     s qs6   \n 	 \ns qs6     s qs6     s qs6     s qs6 F~ ) ! )! )! )!   ) 7    7   7   7   7 ô~ 5  ! 1 ! 1 ! 1 ! 1 ! 1 ! 1 ! 1 	!	 1 !\n 1 ! 1 ! 1 !\r 1 \n! 1 ! 1 ! 1 \r! 1 ! 1 ! 1 ! 1 ! 1 ! 1 !   1 B 1 B 1 B 5 "B|"B|" B|"Bà}>   B B\r B B"| B|"Bð}>   B B B B|" B|"Bà}>    B\n B B \rB B B"B|"\rB|" B|"Bà}>   \nB\r B 	B B B B"B|"B|" B|"Bà}>   B\n B BBð" B| B|"B}>$    B| Bð}>   B | \rBð }>    Bð}  BB~|"B|"B|>    Bà}> ÿ# AÀk"$  Aj   Aà j Aj  Aà j Aà j  Aà j  Aà j  Aj Aj Aà j  A0j Aj  Aà j Aà j A0j  A0j Aà j A!@ A0j A0j  Aj"! AG\r  Aà j A0j Aà j  A0j Aà j A!@ A0j A0j  Aj"! A\nG\r  A0j A0j Aà j   A0j A!@    Aj"! AG\r  A0j  A0j  A0j A0j A!@ A0j A0j  Aj"! A\nG\r  Aà j A0j Aà j  A0j Aà j A!@ A0j A0j  Aj"! A2G\r  A0j A0j Aà j   A0j A!@    Aj"! Aä G\r  A0j  A0j  A0j A0j A!@ A0j A0j  Aj"! A2G\r  Aà j A0j Aà j  Aà j Aà j A!@ Aà j Aà j  Aj"! AG\r    Aà j Aj  AÀj$ 6# A k"$      -  !  A j$   Aq<# A k"$      A § !  A j$   É	~~~~~~~~~~~~   ("¬" ("At¬"~ 4 " 4"~| ("	¬"\n 4"~| ("¬"\r ("At¬"~| ("¬" 4"~| ("¬" ("At¬"~| ("¬" 4 "~| ("Al¬" ($"At¬"~| ( "Al¬" 4 " ~| ($"Al¬"! ("At¬""~|  ~  ¬"#~| \n ¬"$~| \r ~|  ¬"%~|  ~| Al¬"& ¬"\'~|   ~|  ¬"(~| ! ~|  ~  ~| \n ~| \r ~|  ~| Al¬") ~| &  ~|  "~|  ~| ! ~|"*B|"+B|",B|"-B|". .B|"/Bà}>    ~  ~| \n ~| Al¬"0 ~|   Al¬".~| ) "~| & ~|  ~|  ~| ! ~|  ~  %~| 	Al¬"1 \'~| 0  ~| . (~| ) ~| & #~|  ~|  $~| ! ~| Al¬ ~  ~| 1  ~| 0 "~| . ~| ) ~| & ~|  ~|  ~| ! ~|"1B|"2B|"3B|"4B|"0 0B|"5Bà}>    ~  (~| \n #~| \r ~|  $~|  ~|  %~|  ¬"0~|  \'~| !  ~| /B|"/ /B|"/Bð}>    ~  $~| \n %~| \r ~| . \'~| )  ~| & (~|  ~|  #~| ! ~| 5B|" B|"Bð}>    "~   ~| \n ~| \r ~|  ~|  ~|  ~| 0 ~|  ¬"~| ! ~| /B|"! !B|"!Bà}>    , -Bð} B * +B`}|"B|"&B|>    &Bà}>     ~  \'~| \n (~| \r ~|  #~|  ~|  $~| 0 ~|  %~|  ¬~| !B|" B|"Bð}>$   3 4Bð} BB~ 1 2B`}|"B|"B|>    Bà}> ª	 ( ! (! (! (! (! (! (! (!	 ( !\n  A  ($k6$  A  \nk6   A  	k6  A  k6  A  k6  A  k6  A  k6  A  k6  A  k6  A  k6 ß# Ak"$  Aà j   A0j Aà j  A0j A0j  A0j  A0j  Aà j Aà j A0j  Aà j Aà j  Aà j A0j Aà j  A0j Aà j A!@ A0j A0j  Aj"! AG\r  Aà j A0j Aà j  A0j Aà j A!@ A0j A0j  Aj"! A\nG\r  A0j A0j Aà j   A0j A!@    Aj"! AG\r  A0j  A0j  A0j A0j A!@ A0j A0j  Aj"! A\nG\r  Aà j A0j Aà j  A0j Aà j A!@ A0j A0j  Aj"! A2G\r  A0j A0j Aà j   A0j A!@    Aj"! Aä G\r  A0j  A0j  A0j A0j A!@ A0j A0j  Aj"! A2G\r  Aà j A0j Aà j  Aà j Aà j  Aà j Aà j    Aà j   Aj$ ã~~~~~~~   ("At¬" ¬"~ ("¬" ("At¬"~| ("At¬"	 ("\nAt¬"~| ("¬"\r ( "At¬"~| ( "Al¬" ¬"~| ($"A&l¬" ("At¬"~|  ~  ~| ¬" ~|  ~|  \r~|  ~ ¬" ~|  ~| A&l¬" ¬"~|  At¬~|  	~|"B|"B|"B|"B|" B|"Bà}>    ~  \n¬"~| Al¬" \r~|  	~|  At¬" ~|  ~|  	~  ~|  ~|  ~|  ~| A&l¬ ~ ¬" ~|   ~|  ~|  ~|  ~|"B|"B|"!B|""B|"# #B|"#Bà}>    ~  ~| \r ~|  ~|  ~| B|" B|"Bð}>    ~  ~|  \r~|  	~|  ~| #B|" B|"Bð}>   \r ~  ~| 	 ~|  ~|  ~|  ¬"~| B|" B|"Bà}>     Bð} B  B`}|"B|"	B|>    	Bà}>   \r ~   ~|  ~|  ~|  ~| B|" B|"Bð}>$   ! "Bð} BB~  B`}|"B|"B|>    Bà}> ~~~~~~~~   ("At¬" ("At¬"~ ("¬" ~| ("¬"	 ( "\nAt¬"~| ("A&l¬"\r ¬"~| ( "Al¬" ("At¬~| ($"A&l¬" ("At¬"~|B"B|"B 	 ~ At¬" ¬"~| ¬" ~|  At¬"~|  ¬"~|B|"B|"B  ~ 	 ~|  ~|  ~|  ¬"~|  ~|B|" B|" Bà}>   A&l¬ ~ \n¬" ~| Al¬" At¬"!~| \r ~|  ~|  ~|B""B|"#B  ~  ¬"$~| \r 	~|  ~|  ~|B|"%B|"&B  ~  $~|  ~| \r ~|  !~|  ~|B|" B|"Bà}>    B  ~  	~|  ~|  ~|  ~|B|"   B|" Bð}>   B  ~  ~| \r ~|  ~|  	~|B|" B|"Bð}>    B  ~ 	 	~|  ~|  ~|  ~|  ¬"	~|B|" B|"Bà}>     Bð} B  B`}|"B|"B|>    Bà}>   B  ~ ! ~|  ~|  ~| 	 ~|B|" B|"Bð}>$   % &Bð} BB~ " #B`}|"B|"B|>    Bà}> ì ( ! ( ! (! (! (! (! (!	 (!\n (! (! (!\r (! (! (! (! (! ( ! ( !   ($ ($k6$    k6     k6    k6    \rk6    k6   \n 	k6    k6    k6    k6 è\n   ($"AlAjAu ( "jAu ("jAu ("jAu ("jAu ("jAu ("jAu ("	jAu ("\njAu ( "jAu jAuAl j":     Av:    Av:     Auj"Av:    Av:    At AvAqr:     Auj"A\rv:    Av:    At AqAvr:     Auj"Av:    Av: \n   At AqAvr: 	    Auj"Av:    A\nv:    Av: \r    Auj":    At AàqAvr:    Av:    Av:    	 Auj"Av:    Av:    At AvAqr:    \n Auj"A\rv:    Av:    At AqAvr:     Auj"Av:    Av:    At AqAvr:     Auj"A\nv:    Av:    AðqAv:    At AÀqAvr: Í# A0k"$    A(j"    A(j"     AÐ j"       A(j   Aø j" Aø j Aø j    AÐ j AÐ j                         A0j$ \n# Aàk"$ A !@ Aàj "j  Avj-   AqvAq:   Aj"! AG\r Aþ!A !@ !@ Aàj "j"	-  E\r  AþK\r  A AIAj!\n Aj!A!@ !@ Aàj "j",  "E\r @  t" 	,  "j"\rAJ\r  	 \r:   A :    k"AqH\r 	 :   !@@ Aàj "j"-  \r  A:   A :   Aj"! AG\r  Aj" j! !  \nG\r  Aj! Aj"! AG\r A !@ Aà\rj "j  Avj-   AqvAq:   Aj"! AG\r Aþ!A !@ !@ Aà\rj "j"	-  E\r  AþK\r  A AIAj!\n Aj!A!@ !@ Aà\rj "j",  "E\r @  t" 	,  "j"\rAJ\r  	 \r:   A :    k"AqH\r 	 :   !@@ Aà\rj "j"-  \r  A:   A :   Aj"! AG\r  Aj" j! !  \nG\r  Aj! Aj"! AG\r  Aàj   AÀj    AÀj  AÀj  Aàj  A j AÀj  Aj" A j  AÀj    A j AÀj  A j" A j  AÀj    A j AÀj  AÀj" A j  AÀj    A j AÀj  Aàj" A j  AÀj    A j AÀj  A\nj" A j  AÀj    A j AÀj  A j" A j  AÀj    A j AÀj  AÀj A j    Aÿ!@@@ Aàj "j-  E\r  !@ Aà\rj j-  E\r  ! Aj!A! \r @ "A H\r  !@ AÀj   @@ Aàj "j,  "AH\r  A j AÀj  AÀj A j Aàj AþqAvA lj  AJ\r  A j AÀj  AÀj A j Aàj A~mAÿqA lj£ @@ Aà\rj j,  "AH\r  A j AÀj  AÀj A j AþqAvAø lA° j  AJ\r  A j AÀj  AÀj A j A~mAÿqAø lA° j    AÀj  Aj! A J\r  Aàj$ ½# Aðk"$   A(j"    AÐ j"  AÀj   Aj AÀjA    AÀj AÀj   Aj Aj   Aà j Aj  Aà j Aà j Aj    Aà j      Aj      AÀj           Aà j      AÀj  A0j    A0j A0j Aj   A0j AÀj @@  E\r   A0j AÀj A!  \r    AÐ  @    - AvG\r        Aø j    A ! Aðj$  ¿# A0k"$    A(j"    A(j"     AÐ j"       A(j   Aø j" AÐ j Aø j   AÐ j"                    A0j$ ¿# A0k"$    A(j"    A(j"     AÐ j"   A(j       Aø j" AÐ j Aø j   AÐ j"                    A0j$ >    Aø j"   A(j A(j AÐ j"   AÐ j   P    Aø j"   A(j A(j" AÐ j"   AÐ j     Aø j   !      A(j   AÐ j # A0k"$       AÐ j" A(j"   Aø j" AÐ j   A(j"                          A0j$ -      A(j   AÐ j   Aø j <# Ak"$  Aj     Aj  Aj$ N   A(j"    A(j     AÐ j AÐ j   Aø j Aø jA  .       A(j A(j   AÐ j AÐ j }# Ak"$  Aà j AÐ j  A0j  Aà j   A(j Aà j        A0j At  - s:  Aj$ !      A(j   AÐ j é# AÐk"$ A !@ Aj "Atj"  j-  "Av:   Aq:   Aj"! A G\r A !A !@ Aj "j" -   j" Aj"Aðqk:   Aj"! ÀAu"! A?G\r   - Ï j: Ï   A!@  "Av Aj j,  ¢  Aðj       Aðj  Aj! A>I\r  Aðj    Aø j Aðj  Aðj Aø j  Aø j Aðj  Aðj Aø j  Aø j Aðj  Aðj Aø j    Aðj A !@  "Av Aj j,  ¢  Aðj       Aðj  Aj! A>I\r  AÐj$ ë# Ak"$        AÀl"Að j   AuqAtk"AsAÿqAjAv"   A(j" A j    AÐ j" AÀ j     Aè j AsAÿqAjAv"   A j    A¸ j     Aà j AsAÿqAjAv"   A j    A° j     AØ j AsAÿqAjAv"   A j    A¨ j     AÐ j AsAÿqAjAv"   Aø j    A  j     AÈ j AsAÿqAjAv"   Að j    A j     AÀ j AsAÿqAjAv"   Aè j    A j     A¸ j AsAÿqAjAv"   Aà j    A j   Aj   AjA(j"    AjAÐ j"     Aj AqAv"          Aj$ Í# A0k"$    A(j"    A(j"     AÐ j"   A(j       Aø j" Aø j Aø j    AÐ j AÐ j                         A0j$ }# Ak"$  Aà j AÐ j  A0j  Aà j   A(j Aà j        A0j At  - s:  Aj$ ½#8~   1 B 1 " 1 B 1 "BBBÿÿÿ " 1 B 1 " 1 "BBBÿÿÿ "	~ 3  BBü " 1 B  1 B 1 BB"~| 1 B  1 "\nBBBÿÿÿ " 1 B 1 " 1 B BBBÿÿÿ "~| 1 B \n 1 B 1 BB"\n 3  BBü "~|  	~ 1 B 1 " 1 BB"\r ~|  ~|  ~| \n 1 B 1 " 1 BB"~|"BÀ |"B|"BÀ |"B  	~  ~| \n ~|" BÀ |"Bÿÿÿÿÿÿ }|"BÚ~ \n 	~  ~| B|" BÀ |"Bÿÿÿÿÿÿ }"BØ(~|  B}"Bçö\'~| \r 	~ 1 B 1 " 1 B BBBÿÿÿ " ~|  ~|  ~|  ~| \n 1 B 1 " 1 B BBBÿÿÿ "~|  	~ 1 B 1 \r" BBBÿÿÿ " ~| \r ~|  ~|  ~|  ~| \n 1 B 1 \r" BBBÿÿÿ "~|"BÀ |"B|"BÀ |"B  B}|"BÓC~| 1 B 1 B 1 "B 1 "BBÿÿÿ " ~ 3   BBü " ~| 1 B  1 " BBBÿÿÿ " ~| 1 B   1 	B 1 \n"!BBBÿÿÿ "  ~| 1 B ! 1 B BBBÿÿÿ " ~|  1 B 1 \n"! 1 B BBBÿÿÿ "~|  1 B 1 "" 1 	B !BBBÿÿÿ "!~| \r 1 B 1 "# "BBBÿÿÿ ""~|  1 B 1 B #B 1 "$BBÿÿÿ "#~|  3   $BBü "$~| 1 B 1 "% 1 B 1 "&BBBÿÿÿ |  ~  ~|  ~|   ~|  ~|  !~|  "~| \r #~|  $~| 3 | %BBü |"%BÀ |"\'B|"(| (BÀ |"(B} BÚ~ BØ(~| Bçö\'~|  ~  ~|  ~|   ~|  !~|  "~|  #~| \r $~| 1 B 1 ") 1 BB|  ~  ~|  ~|   !~|  "~|  #~|  $~| 1 B 1 "* 1 B )BBBÿÿÿ |")BÀ |"+B|",BÀ |"-B| %| \'B}"\'BÀ |".B|"/BÀ |"0B  \n ~"1BÀ |"2B"%B¡V~| B}  	~  ~|  ~| \r ~|  ~|  ~|  ~| \n ~|  	~   ~|  ~|  ~| \r ~|  ~|  ~|  ~| \n !~|"BÀ |"3B|"4BÀ |"5B|"6BÀ |"7B  B}|"B¡V~| BÚ~ B 1 2Bÿÿÿÿ}|"BØ(~| Bçö\'~| BÓC~| BÑ«~| (B|  ~  	~|  ~|   ~|  ~|  ~|  ~| \r !~|  "~|  #~|  $~| 1 B & 1 "BBBÿÿÿ |"| BÀ |"&B}"| BÀ |"(B}"1 B¡V~ %BÑ«~| 4| 5B}  %BÓC~| BÑ«~| B¡V~| 3B}   	~  ~|  ~|  ~|  ~| \r ~|  ~|  ~|  !~| \n "~|  	~  ~|   ~|  ~|  ~|  ~| \r ~|  ~|  !~|  "~| \n #~|"2BÀ |"3B|"4BÀ |"5B|"8BÀ |"9B|"BÀ |":B 6 7B}|"B¡V~ BÑ«~| /| 0B} BÑ«~ BÓC~|  :B}"B¡V~| BÚ~ BØ(~| ,| -B}  ~  ~|  !~|   "~|  #~|  $~| 1 B 1 \r", *BBBÿÿÿ |  !~  ~|  "~|   #~|  $~| 1 B 1 \n"* 1 B ,BBBÿÿÿ |",BÀ |"-B|"/BÀ |"0B BØ(~| )| +B}")BÀ |"+B|"6BÀ |"7B| \'| .B}"\'BÀ |".B|":BÀ |";B| 1BÀ |"1B} \' .B} BÓC~ Bçö\'~| BÑ«~| 6| 7B} BÓC~ %Bçö\'~| BÑ«~| B¡V~| 4| 5B} Bçö\'~ %BÚ~| BÓC~| 2| BÑ«~| B¡V~| 3B}  	~  ~|  ~|   ~|  ~|  ~|  ~| \r ~|  !~|  "~|  #~| \n $~| 1 B  1 B 1 BB| &B|"BÀ |"B|"BÀ |"B|"	BÀ |"\nB 8 9B}|"B¡V~| Bçö\'~ BÚ~| BÓC~| )| +B} BÑ«~| 	 \nB}"	B¡V~|"\nBÀ |"B|"\rBÀ |"B| \n B} BÚ~ BØ(~| Bçö\'~| /| 0B} BÚ~ %BØ(~| Bçö\'~| BÓC~| BÑ«~| B¡V~| | B} (B|"BÀ |"\nB  B}|"B¡V~| BÓC~| 	BÑ«~| ,  "~  !~|  #~|   $~| 1 B 1 " 1 	B *BBBÿÿÿ |  #~  "~|  $~| 1 B 1 " BBBÿÿÿ |"BÀ |"B|"BÀ |"B| -B} BØ(~| BÚ~| BÑ«~| Bçö\'~| 	BÓC~|"BÀ |"B|"BÀ |" B|   \nB} 1B|"\nBÀ |"B"B¡V~|  B}  BÑ«~| B}  B} BØ(~| BÓC~| BÚ~| 	Bçö\'~|  $~  #~| 3   1 "BBü   $~|"BÀ |"B| 1 B 1 B B BBÿÿÿ |"BÀ |"B | B} Bçö\'~| BØ(~| 	BÚ~|"BÀ |"B|"BÀ |"B|  BÓC~| B}  Bçö\'~| B}  B} BÚ~| 	BØ(~| BØ(~  Bÿÿÿ}|"BÀ |"	B|"BÀ |"B|  BÚ~| B}  	B} BØ(~|"	B|"B|"B|"B|"B|"B|"B \r B}|"\rB|"B : ;B}|"B|"B \n B}|"B"BØ(~ 	Bÿÿÿ |"<     B<    BÚ~ Bÿÿÿ | B|"	B<    	B<    	B BB<    Bçö\'~ Bÿÿÿ | 	B|"B<    B 	Bà B<    BÓC~ Bÿÿÿ | B|"	B	< 	   	B<    	B Bÿ B<    BÑ«~ Bÿÿÿ | 	B|"B<    B<    B 	Bø B< \n   B¡V~ Bÿÿÿ | B|"	B<    	B BÀ B< \r   	B Bÿÿÿ |"B\n<    B<    B 	Bþ B<    B \rBÿÿÿ |"	B\r<    	B<    	B Bÿÿÿ |"<    	B Bð B<    B<    B Bÿÿÿ |"B<    B<    B BB<    B Bÿÿÿ |"	B<    	B Bà B<    	B" Bÿÿÿ |"B<    B	<    B 	Bÿ B<    § §jAv­< µ~    1 0B  1 /"  1 1"BBBÿÿÿ "BÑ«~  1 B  1 "  1 "BBBÿÿÿ |  1 2B   1 3B  1 4"BBBÿÿÿ "BÓC~|  1 5B   1 6B  1 7"BBBÿÿÿ "Bçö\'~|  1 8B   1 9"BBBÿÿÿ "BÚ~|  1 :B   1 ;B  1 <"	BBBÿÿÿ "BØ(~|"\n BÓC~  1 B  1 "  1 B BBBÿÿÿ | Bçö\'~| BÚ~| BØ(~| BBü   3  Bçö\'~| BÚ~| BØ(~|"BÀ |"B|"\rBÀ |"B| \nBÀ |"B}  1 =B 	  1 >B  1 ?BB"B¡V~  3 *  1 ,"	BBü |"\nBÀ |"B  1 -B 	  1 .B BBBÿÿÿ |"B¡V~|"	 	BÀ |"B} \r B} BÑ«~| B¡V~  1 (B  1 \'"	  1 )BB| BÑ«~| B¡V~  1 %B  1 $"\r  1 &B 	BBBÿÿÿ | BÑ«~| BÓC~|"BÀ |"B|"BÀ |"B \n B}|"	B¡V~|  BÚ~  1 B  1 "\n  1 BB| BØ(~  1 B  1 "  1 B \nBBBÿÿÿ |"BÀ |"B| BØ(~|"BÀ |"B| Bÿÿÿ} BÓC~| 	BÑ«~|  B}"\nB¡V~|"BÀ |"B|"BÀ |"B|  B}  Bÿÿÿÿÿÿ } Bçö\'~| 	BÓC~| \nBÑ«~| B¡V~  1 #B  1 "" \rBBBÿÿÿ | BÑ«~| BÓC~| Bçö\'~| B¡V~  1  B  1 "\r  1 !B BBBÿÿÿ | BÑ«~| BÓC~| Bçö\'~| BÚ~|"BÀ |"B|"BÀ |"B  B}|"B¡V~|  Bÿÿÿ} BÚ~| 	Bçö\'~| \nBÓC~| BÑ«~|  B}"B¡V~|"BÀ |"B|"BÀ |"B|  B} BØ(~  1 B  1 \r" BBBÿÿÿ | 	BÚ~| \nBçö\'~| B¡V~  1 B   1 B \rBBBÿÿÿ | BÑ«~| BÓC~| Bçö\'~| BÚ~| BØ(~| B|"BÀ |"B  B}|"B¡V~| BÓC~| BÑ«~| 	BØ(~  1 B  1 \n"  1 B BBBÿÿÿ | \nBÚ~| BÑ«~| Bçö\'~| BÓC~|"BÀ |"B|"BÀ |"	B|   B} B|"BÀ |"B"B¡V~| 	B}  BÑ«~| B} \nBØ(~  1 B  1 "  1 	B BBBÿÿÿ | BÓC~| BÚ~| Bçö\'~| Bçö\'~  1 B  1 " BBBÿÿÿ | BØ(~| BÚ~|"BÀ |"B|"BÀ |"	B|  BÓC~| 	B}  Bçö\'~| B} BÚ~  1 B  1 B B  1 "BBÿÿÿ | BØ(~| BØ(~  3   BBü |"BÀ |"B|"BÀ |"B|  BÚ~| B}  B} BØ(~|"B|"B|"B|"B|"	B|"\nB|"B  B}|"B|"\rB  B}|"B|"B  B}|"B"BØ(~ Bÿÿÿ |"<     B<    BÚ~ Bÿÿÿ | B|"B<    B<    B BB<    Bçö\'~ Bÿÿÿ | B|"B<    B Bà B<    BÓC~ Bÿÿÿ | B|"B	< 	   B<    B Bÿ B<    BÑ«~ 	Bÿÿÿ | B|"B<    B<    B Bø B< \n   B¡V~ \nBÿÿÿ | B|"B<    B BÀ B< \r   B Bÿÿÿ |"B\n<    B<    B Bþ B<    B Bÿÿÿ |"B\r<    B<    B \rBÿÿÿ |"<    B Bð B<    B<    B Bÿÿÿ |"B<    B<    B BB<    B Bÿÿÿ |"B<    B Bà B<    B" Bÿÿÿ |"B<    B	<    B Bÿ B<    § §jAv­<   -   - s -    -  sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr - 	  - 	sr - \n  - \nsr -   - sr -   - sr - \r  - \rsr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - sr -   - srAjAvAjÙ# Ak"$ @@ AÀ j"¾ "\r A !A!A !A! ¾ "	E\r  AÐ j   A j AÐ j«   A j   - Aÿ q":    - ?Aq r:    ) 87 8   ) 07 0   ) (7 (   )  7     ) 7    ) 7    ) 7    )  7    - ?Aÿ q: ?@ E\r  AÀ j  ü\n   	! 	  ­ ® ! ! ! @ E\r  À @  E\r   À  Aj$  j# Ak"$  Aà j   Aà j   A0j Aà j        A0j   Aj$ K# AÐ k"$  A j     A j    § !  AÐ j$   Ej# Ak"$  Aà j  A0j  Aà j    Aà j       A0j   Aj$ F# Aà k"$  A0j    A0j«      Aà j$ F# Aà k"$  A0j    A0j©      Aà j$ ú# Aàk"$ @@ BÀ T\r  - ?AK\r  Aj  \r   ) 7Ø  ) 7Ð  ) 7È  )  7À  )  7   ) 7¨  ) 7°  ) 7¸  )  7  ) (7  ) 07  ) 87@ §"E\r     ü\n     )Ø7 8   )Ð7 0   )È7 (   )À7   AÀj   ·  AÀj¦  Aj AÀj Aj Aj  A j Aj¤  A j A j§ \r A !A! Aàj$  ¤# A k!A !@  "j  j-     j-  s:   Aj"! A G\r A  k!A !@  "j" -   q:   Aj"! A G\r A !@   "j"  j-   -  s:   Aj"! A G\r N# A k"$  B 7 B 7 B 7 B 7   Að   ¥  A j$ Ä~# A k"$ @ §"E\r   AÀ j  ü\n   )  ! ) !	 ) !\n   ) 7 8   \n7 0   	7 (   7    B7   Aþ:    B7 	  B7   B7  )  ! ) !	 ) !\n ) ! )  ! ) (!\r ) 0!   j" ) 87 x  7 p  \r7 h  7 `  7 X  \n7 P  	7 H  7 @ Aàj   B|·  )  ! ) !	 ) !\n   ) 7 8   \n7 0   	7 (   7   Aàj¦   Aàj¡      A j   BÀ |·  A j¦   A j A j  Aàj¥ µ  AàjAÀ ´  A j$ A # Ak"$ @@ Aj¾ "\r   B 7 8  B 7 0  B 7 (  B 7    B 7   B 7   B 7   B 7  A!   ¡  A j    )  7à  ) 7è  ) 7ð  ) 7ø - ¿! AÀj Aàj°  Aàj AÀj Av¯   - ¿Aÿ q: ¿   ­ Aàj A j ±    ) 87 8   ) 07 0   ) (7 (   )  7     ) 7    ) 7    ) 7    )  7   AàjA ´  AÀjA ´  À A !  Aj$   # Ak"$ @@ AM\r A!A! ª E\r  AÐj   A j AÐj«  Aj A j    ) 87ø   ) 07ð   ) (7è   )  7à   ) 7Ø   ) 7Ð   ) 7È   )  7À@ E\r  AÀjAÀ j  ü\n    AÀj AÀ j­ Aj® ! Aj$  /@ E\r A !@   "jA :   Aj"!  G\r F# Ak" $ A !@   "jA :   Aj"! AG\r   Aj$ ûa~P~  ) 8"B8 BþB( BüB BøB BBø BBü B(Bþ B8!  ) 0"B8 BþB( BüB BøB BBø BBü B(Bþ B8!  ) ("B8 BþB( BüB BøB BBø BBü B(Bþ B8!  )  "B8 BþB( BüB BøB BBø BBü B(Bþ B8!  ) "B8 BþB( BüB BøB BBø BBü B(Bþ B8!  ) "B8 BþB( BüB BøB BBø BBü B(Bþ B8!	  ) "B8 BþB( BüB BøB BBø BBü B(Bþ B8!\n  )  "B8 BþB( BüB BøB BBø BBü B(Bþ B8!@@ BZ\r  ! \n! 	!	 ! ! ! ! ! ! ! !\r ! ! ! ! 	! \n! !@ "Aj! B|"! ) "B8 BþB( BüB BøB BBø BBü B(Bþ B8"B? B8 B )  "B8 BþB( BüB BøB BBø BBü B(Bþ B8"| ) H"B8 BþB( BüB BøB BBø BBü B(Bþ B8"| ) p"B8 BþB( BüB BøB BBø BBü B(Bþ B8"B- B B|"	B? 	B8 	B ) x"B8 BþB( BüB BøB BBø BBü B(Bþ B8"| B? B8 B ) @"B8 BþB( BüB BøB BBø BBü B(Bþ B8"| ) "B8 BþB( BüB BøB BBø BBü B(Bþ B8"B? B8 B | ) P"B8 BþB( BüB BøB BBø BBü B(Bþ B8"| B- B B|"| ) 8"B8 BþB( BüB BøB BBø BBü B(Bþ B8"B? B8 B ) 0"B8 BþB( BüB BøB BBø BBü B(Bþ B8"| | ) ("B8 BþB( BüB BøB BBø BBü B(Bþ B8"B? B8 B )  "B8 BþB( BüB BøB BBø BBü B(Bþ B8"| ) h"B8 BþB( BüB BøB BBø BBü B(Bþ B8" | ) "B8 BþB( BüB BøB BBø BBü B(Bþ B8"!B? !B8 !B | ) X"B8 BþB( BüB BøB BBø BBü B(Bþ B8""| 	B- 	B 	B|"B- B B|"B- B B|"B- B B|"\n| B? B8 B  | | ) `"B8 BþB( BüB BøB BBø BBü B(Bþ B8"#B? #B8 #B "| | B? B8 B | | B? B8 B | 	| B? B8 B | | B? B8 B !| #| B- B B|"$B- $B $B|"%B- %B %B|"&B- &B &B|"\'B- \'B \'B|"(B- (B (B|")B- )B )B|"*B? *B8 *B B? B8 B | &|  B?  B8  B #| %| "B? "B8 "B | $| \nB- \nB \nB|"+B- +B +B|",B- ,B ,B|"-| \nB? \nB8 \nB &| B? B8 B 	| \'| -B- -B -B|".| B? B8 B %| -| B? B8 B $| ,| B? B8 B | +| *B- *B *B|"/B- /B /B|"0B- 0B 0B|"1B- 1B 1B|"2| )B? )B8 )B ,| 1| (B? (B8 (B +| 0| \'B? \'B8 \'B \n| /| &B? &B8 &B | *| %B? %B8 %B | )| $B? $B8 $B | (| .B- .B .B|"3B- 3B 3B|"4B- 4B 4B|"5B- 5B 5B|"6B- 6B 6B|"7B- 7B 7B|"8B- 8B 8B|"9B? 9B8 9B -B? -B8 -B )| 5| ,B? ,B8 ,B (| 4| +B? +B8 +B \'| 3| 2B- 2B 2B|":B- :B :B|";B- ;B ;B|"<| 2B? 2B8 2B 5| .B? .B8 .B *| 6| <B- <B <B|"=| 1B? 1B8 1B 4| <| 0B? 0B8 0B 3| ;| /B? /B8 /B .| :| 9B- 9B 9B|">B- >B >B|"?B- ?B ?B|"@B- @B @B|"A| 8B? 8B8 8B ;| @| 7B? 7B8 7B :| ?| 6B? 6B8 6B 2| >| 5B? 5B8 5B 1| 9| 4B? 4B8 4B 0| 8| 3B? 3B8 3B /| 7| =B- =B =B|"BB- BB BB|"CB- CB CB|"DB- DB DB|"EB- EB EB|"FB- FB FB|"GB- GB GB|"HB? HB8 HB <B? <B8 <B 8| D| ;B? ;B8 ;B 7| C| :B? :B8 :B 6| B| AB- AB AB|"IB- IB IB|"JB- JB JB|"K| AB? AB8 AB D| =B? =B8 =B 9| E| KB- KB KB|"L| @B? @B8 @B C| K| ?B? ?B8 ?B B| J| >B? >B8 >B =| I| HB- HB HB|"MB- MB MB|"NB- NB NB|"OB- OB OB|"P| GB? GB8 GB J| O| FB? FB8 FB I| N| EB? EB8 EB A| M| DB? DB8 DB @| H| CB? CB8 CB ?| G| BB? BB8 BB >| F| LB- LB LB|"QB- QB QB|"RB- RB RB|"SB- SB SB|"TB- TB TB|"UB- UB UB|"VB- VB VB|"W U S Q K I @ > 8 6 4 . , \n "B2 B. B \r"X| " "  | |B¢Ü¢¹óÅÂ |" "|"        | B2 B. B| |BÍË½Ññ |"Y "|"\r | \rB2 \rB. \rB| |B¯ö´âþù¾àµ|"Z "|" \r   \r  | B2 B. B| !|B¼·§ØôöÚi|"[ "|"! \r| !B2 !B. !B| |B¸ê¢¿Ë°«9|"      B$ B B| |"|"   ! \r   ! | B2 B. B| |B °¾ÄøÙ |" B$ B B     | Y|"\r|" !| B2 B. B| |BåøÊÔà|"Y \rB$ \rB \rB \r    | Z|"|"  !    | B2 B. B| |B¶ÓÝÚ«|" B$ B B  \r  \r | [|"|"! | !B2 !B. !B| |BÂÓêX|" B$ B B   \r  \r| |"\r|"   !    ! | B2 B. B| |B¾ßÁ«àÖÁ|" \rB$ \rB \rB \r    | |"|" !| B2 B. B| |Bå÷ä·á$|" B$ B B  \r  \r | Y|"|"  !    | B2 B. B| "|Bâéþ¯½¸Õ |"" B$ B B   \r  \r| |"\r|"! | !B2 !B. !B| #|BïîÏ®ßò |"# \rB$ \rB \rB \r    | |"|" 	|   !   !  | B2 B. B|  |B±­ÚØã¿¬ï|" B$ B B  \r  \r | |"	|" !| B2 B. B| |Bµ¤®òÔî|" 	B$ 	B 	B 	  \r  \r| |"|"\r  !   \r | \rB2 \rB. \rB| |BÍ¤ûÌ®üÍA|" B$ B B  	  	 | "|"|" | B2 B. B|BÒÅ÷¸ÚÍd|" B$ B B   	  	| #|"	|"! | \r | !   |  \r ! \r| !B2 !B. !B|BãË¼Âãðßo|" 	B$ 	B 	B 	    | |"|" | B2 B. B|Bµ«³Üè¸çà|"\r B$ B B  	  	 | |"|"   $|  !  !| B2 B. B|Bå¸²½Ç¹¨$|" B$ B B   	  	| |"	|" | B2 B. B|Bõ¬ÉõËô-|"! 	B$ 	B 	B 	    | |"|"$|  | $   %|   $ | $B2 $B. $B|BÉõ¦¡ºÊ |"\n B$ B B  	  	 | |"|" | B2 B. B|BÔ÷êË»ªØÜ |"% B$ B B   	  	| \r|"	|"  & |  $  $| B2 B. B|Bµ§Å¨âüö |"$ 	B$ 	B 	B 	    | |"|" | B2 B. B|B«¿ó®ª|"& B$ B B  	  	 | !|"|"| + |   \' |    | B2 B. B|BäÐíÒÍñ¨|"\' B$ B B   	  	| \n|"	|" | B2 B. B|B¿ÂìÇùÉ°|"\n 	B$ 	B 	B 	    | %|"|"  ( |    | B2 B. B|Bä¼÷ûøß¬¿|"% B$ B B  	  	 | $|"|" | B2 B. B|BÂ¢í³þðF|"$ B$ B B   	  	| &|"	|"| - |   ) |    | B2 B. B|B¥Îªù¨äÓU|"& 	B$ 	B 	B 	    | \'|"|" | B2 B. B|Bïêå|"\' B$ B B  	  	 | \n|"|"  * |    | B2 B. B|BðÜ¹Ðð¬Ê|"\n B$ B B   	  	| %|"	|" | B2 B. B|BüßÈ¶ÔÐÂÛ\'|"% 	B$ 	B 	B 	    | $|"|"| 3 |   / |    | B2 B. B|B¦á§È.|"$ B$ B B  	  	 | &|"|" | B2 B. B|BíÕÖÅ¿Í |"& B$ B B   	  	| \'|"	|"  0 |    | B2 B. B|BßçÖì¹¢Ó |"\' 	B$ 	B 	B 	    | \n|"|" | B2 B. B|BÞÇ½ÝÈêå |"\n B$ B B  	  	 | %|"|"| 5 |   1 |    | B2 B. B|B¨åÞã³×µö |"% B$ B B   	  	| $|"	|" | B2 B. B|BæÝ¶¿ä¥²á|"$ 	B$ 	B 	B 	    | &|"|"  2 |    | B2 B. B|B»ê¤Ñ¹|"& B$ B B  	  	 | \'|"|" | B2 B. B|BäÄçúß¢|"\' B$ B B   	  	| \n|"	|"| 7 |   : |    | B2 B. B|Bàâ»É¨|"\n 	B$ 	B 	B 	    | %|"|" | B2 B. B|B¯âîâ¥B|"% B$ B B  	  	 | $|"|"  ; |    | B2 B. B|B°üÒ²°´¶G|"$ B$ B B   	  	| &|"	|" | B2 B. B|B¤½·ºÉQ|"& 	B$ 	B 	B 	    | \'|"|"| 9 |   < |    | B2 B. B|BÒ«ÅÄÁÌV|"\' B$ B B  	  	 | \n|"|" | B2 B. B|BªÀÄ»Õ°t|"\n B$ B B   	  	| %|"	|"  = |    | B2 B. B|B¸£ï¨µ|"% 	B$ 	B 	B 	    | $|"|" | B2 B. B|BÈ¡ËÆë¢°Ò|"$ B$ B B  	  	 | &|"|"| ? |   B |    | B2 B. B|BÓÖÛ|"& B$ B B   	  	| \'|"	|" | B2 B. B|B×»üÍé¤\'|"\' 	B$ 	B 	B 	    | \n|"|"  C |    | B2 B. B|B¨íÞ¯Ø4|"\n B$ B B  	  	 | %|"|" | B2 B. B|Bã´¥®¼9|"% B$ B B   	  	| $|"	|"| A |   D |    | B2 B. B|BË®ÉªìÎ |"$ 	B$ 	B 	B 	    | &|"|" | B2 B. B|BóÆ»÷É²ÎÛ |"& B$ B B  	  	 | \'|"|"  E |    | B2 B. B|B£ñÊµ½þè |"\' B$ B B   	  	| \n|"	|" | B2 B. B|Büå¾ïåÝàÇô |"\n 	B$ 	B 	B 	    | %|"|"| J |   F |    | B2 B. B|BàÞÜôíØÒø |"% B$ B B  	  	 | $|"|" | B2 B. B|BòÖÂÊä|"$ B$ B B   	  	| &|"	|"  G |    | B2 B. B|BìóÓÁÀã|"& 	B$ 	B 	B 	    | \'|"|" | B2 B. B|B¨¼¢ÿ¿ß|"\' B$ B B  	  	 | \n|"|"| L |   H |    | B2 B. B|Béûô½¨¤|"\n B$ B B   	  	| %|"	|" | B2 B. B|Bòûþèü¾|"% 	B$ 	B 	B 	    | $|"|"  M |    | B2 B. B|B«¦É®Þ¸F|"$ B$ B B  	  	 | &|"|" | B2 B. B|BÃÑîÙÏJ|"& B$ B B   	  	| \'|"	|"| R |   N |    | B2 B. B|Bò®ÃQ|"\' 	B$ 	B 	B 	    | \n|"|" | B2 B. B|BÖïìºíj|"\n B$ B B  	  	 | %|"|"  O |    | B2 B. B|Bø¢»óþïÓ¾u|"% B$ B B   	  	| $|"	|" | B2 B. B|BºßÝ§õø|"$ 	B$ 	B 	B 	    | &|"|"| T |   P |    | B2 B. B|B¦±¢Ú¸ß±\n|"& B$ B B  	  	 | \'|"|" | B2 B. B|B®ä÷Ëæ|"\' B$ B B   	  	| \n|"	|"  IB? IB8 IB E| Q| PB- PB PB|"\n |    | B2 B. B|BñÑæÂ¸|"( 	B$ 	B 	B 	    | %|"|" | B2 B. B|BûÒþÝí(|"% B$ B B  	  	 | $|"|"| V |   JB? JB8 JB F| R| \nB- \nB \nB|"$ |    | B2 B. B|BÉ´ïªå2|") B$ B B   	  	| &|"	|" | B2 B. B|B¼ý¦®¡Á¯Ï<|"& 	B$ 	B 	B 	    | \'|"|"  KB? KB8 KB G| S| $B- $B $B|"$ |    | B2 B. B|BÌÀàÉøÙÃ |"\' B$ B B  	  	 | (|"|" | B2 B. B|B¶ùÙìõâÌ |"( B$ B B   	  	| %|"	|" X|"%!\r LB? LB8 LB H| T| $B- $B $B|"$ |    | B2 B. B|BªüãÏ³Ê¿Ù |"* 	B$ 	B 	B 	    | )|"|" |")! L MB? MB8 MB| \n| WB- WB WB| |    | B2 B. B|BìõÛÖ³õÛåß |"\n B$ B B  	  	 | &|"|" |"&! B$ B B   	  	| \'|"	 | M QB? QB8 QB| U| $B- $B $B| |    | B2 B. B|B°ÒÄ±¢ì |"|"! 	B$ 	B 	B 	    | (|" |"! B$ B B  	  	 | *|" |"! B$ B B   	  	| \n|"	 |"\n! 	     | 	B$ 	B 	B| |"! ! \n! !	 ! ! &! )! %! Bÿ V\r    "<    	"	<    "B <    B(<    B0<    B8<     B<    B< \r   B<    B <    B(< \n   B0< 	   B8<    	B<    	B<    	B<    	B <    §" AxsAþxqAv Axs6    	B(<    	B0<    "<    	B8<    B<    B<    B<    B <    B(<    B0<    "< \'   B8<    B< &   B< %   B< $   B < #   B(< "   B0< !   "< /   B8<     B< .   B< -   B< ,   B < +   B(< *   B0< )   "< 7   B8< (   B< 6   B< 5   B< 4   B < 3   B(< 2   B0< 1   "< ?   B8< 0   B< >   B< =   B< <   B < ;   B(< :   B0< 9   B8< 8A ²~# AÀk"$  A )° 7 A )¸ 7 A )À 7 A )È 7 A )Ð 7  A )Ø 7¨ A )à 7° A )è 7¸ Aj  ¶  Bÿ "§!@ P\r  E\r    §j k ü\n    j"A:  @Aö Aö Bð T" k"E\r  AjA  ü  A÷ A÷ j B=<   Aø Aø j B5<   Aù Aù j B-<   Aú Aú j B%<   Aû Aû j B<   Aü Aü j B<   Aý Aý j B\r<   Aþ Aþ j B<   Aÿ Aÿ j §At:   Aj BB ¶    )¸7 8   )°7 0   )¨7 (   ) 7     )7    )7    )7    )7   AÀj$ A ó6~# Aðk"$   ) 7  ) 7  ) 7  )  7   3   1 B 1 "BB7    1 B 1 B 1 "BBBÿÿÿ7(   1 B 1 B 1 	"BBBÿÿÿ70   1 \nB 1 B 1 "BBBÿÿÿ78   1 \rB 1 B 1 BB7@  3  1 B 1 "BB7H   1 B 1 B 1 "BBBÿÿÿ7P   1 B 1 B 1 "BBBÿÿÿ7X   1 B 1 B 1 "BBBÿÿÿ7`   1 B 1 B 1 BBBÿÿÿ7h A°jA Aü  B7° AjA Aü  B7 AðjA Aü  AÐjA Aü  A°jA Aü  B7° AjA Aü  Að jA Aü  B7p AÐ	jAÐ jA AÈ ü  AÐ	j A jAÐ ü\n   A°jAÐ j! AÐ	j!A ! Að j!	 Aj!\n A°j! AÐj! Aðj!\r Aj! A°j!@ !  "kAj-  !A ! 	! \n! ! ! \r! ! !@ ! !\n !	 !\r ! ! ! ! ! "ÀAu!A !@ \n "At"j"  j") " ) "§ q" §s¬7    §s¬7  Aj"! A\nG\r A !@ 	 "At"j"  j") " ) "§ q" §s¬7    §s¬7  Aj"! A\nG\r  A j \nAÐ ü\n  A !@ \n "At"j" 	 j)  ) |7  \n Ar"j" 	 j)  ) |7  Aj! AI\r A !@ 	 "At"j" A j j)  ) }7  Aj"! A\nG\r  AÐj AÐ ü\n  A !@  "At"j"  j)  ) |7   Ar"j"  j)  ) |7  Aj! AI\r A !@  "At"j" AÐj j)  ) }7  Aj"! A\nG\r  AÐj  	¹  A°\rj \n ¹   ) )à"| B~|7  ) )Ø"| B~|7  ) )Ð"| B~|7  )ø )È"| B~|7ø  )ð )À"| B~|7ð  )è )¸"| B~|7è  )à )°"| B~|7à  )Ø )¨"| B~|7Ø )Ð! ) ! B 7    | B~|7ÐA !@ AÐj "Atj" ) "  B §AuAv­|"B`}7   B )|"  B §AuAv­|"Bp}7 AÐj Aj"Atj" B ) |7  ! AI\r  ) ! B 7   )ð\r )À"| B~|7ð\r  )è\r )¸"| B~|7è\r  )à\r )°"| B~|7à\r  )Ø\r )¨"| B~|7Ø\r   )Ð| B~|"  B?§Av­|"B`}7Ð  B )Ø|7Ø  )Ð\r ) "| B~|7Ð\r  )È\r )"| B~|7È\r  )À\r )"| B~|7À\r  )¸\r )"| B~|7¸\r )°\r! )! B 7   | B~|7°\rA !@ A°\rj "Atj" ) "  B §AuAv­|"B`}7   B )|"  B §AuAv­|"Bp}7 A°\rj Aj"Atj" B ) |7  ! AI\r  )! B 7   )°\r| B~|"  B?§Av­|"B`}7°\r  B )¸\r|7¸\r AÐj AÐjAÐ ü\n  A !@ AÐj "At"j" A°\rj j)  ) |7  AÐj Ar"j" A°\rj j)  ) |7  Aj! AI\r A !@ A°\rj "At"j" AÐj j)  ) }7  Aj"! A\nG\r  Að\nj AÐjº  Aj A°\rjº  A°\rj Aj A j¹   )ð\r )À"| B~|7ð\r  )è\r )¸"| B~|7è\r  )à\r )°"| B~|7à\r  )Ø\r )¨"| B~|7Ø\r  )Ð\r ) "| B~|7Ð\r  )È\r )"| B~|7È\r  )À\r )"| B~|7À\r  )¸\r )"| B~|7¸\r )°\r! )! B 7   | B~|7°\rA !@ A°\rj "Atj" ) "  B §AuAv­|"B`}7   B )|"  B §AuAv­|"Bp}7 A°\rj Aj"Atj" B ) |7  ! AI\r  )! B 7   )°\r| B~|"  B?§Av­|"B`}7°\r  B )¸\r|7¸\r \r Að\njAÐ ü\n    A°\rjAÐ ü\n   Aj \nº  Aðj 	º   Aj Aðj¹   )@ )"| B~|7@  )8 )"| B~|78  )0 )"| B~|70  )( )x"| B~|7(  )  )p"| B~|7   ) )h"| B~|7  ) )`"| B~|7  ) )X"| B~|7 ) ! )P! B 7P   | B~|7 A !@  "Atj" ) "  B §AuAv­|"B`}7   B )|"  B §AuAv­|"Bp}7  Aj"Atj" B ) |7  ! AI\r  )P! B 7P   ) | B~|"  B?§Av­|"B`}7   B )|7A !@ Aðj "At"j" Aj j)  ) }7  Aj"! A\nG\r  A AÈ ü A !@ A°j "At"j Aðj j) BÁ¶~7  Aj"! A\nG\r  B 7A !@ A°j "Atj" ) "  B §AuAv­|"B`}7   B )|"  B §AuAv­|"Bp}7 A°j Aj"Atj" B ) |7  ! AI\r  )! B 7   )°| B~|"  B?§Av­|"B`}7°  B )¸|7¸A !@ A°j "At"j" Aj j)  ) |7  A°j Ar"j" Aj j)  ) |7  Aj! AI\r   Aðj A°j¹   )@ )"| B~|7@  )8 )"| B~|78  )0 )"| B~|70  )( )x"| B~|7(  )  )p"| B~|7   ) )h"| B~|7  ) )`"| B~|7  ) )X"| B~|7 ) ! )P! B 7P   | B~|7 A !@  "Atj" ) "  B §AuAv­|"B`}7   B )|"  B §AuAv­|"Bp}7  Aj"Atj" B ) |7  ! AI\r  )P! B 7P   ) | B~|"  B?§Av­|"B`}7   B )|7A !@  "At"j" \r j") " ) "§ q" §s¬7    §s¬7  Aj"! A\nG\r A !@  "At"j"  j") " ) "§ q" §s¬7    §s¬7  Aj"! A\nG\r  \r! At! Aj"! 	! \n! ! ! ! ! ! AG\r  \r! Aj"! 	!	 \n!\n ! ! !\r ! ! A G\r  A j AÐ ü\n   A°j AÐ ü\n   Aj A°jº  Aðj Ajº  Aj Aðjº  Aðj Aj A°j»  AÐj Aðj Aj»  Aj AÐjº  A°\rj Aj Aðj»  Aj A°\rjº  Aðj Ajº  Aj Aðjº  Aðj Ajº  Aj Aðjº  Aj Aj A°\rj»  Aj Ajº  Aðj Ajº A!@ Aj Aðjº  Aðj Ajº  "Aj! AI\r  Að\nj Aðj Aj»  Aj Að\njº  Aðj Ajº A!@ Aj Aðjº  Aðj Ajº  "Aj! AI\r  Aj Aðj Að\nj»  Aðj Ajº  Aj Aðjº A!@ Aðj Ajº  Aj Aðjº  "Aj! AI\r  AÐ	j Aj Aj»  Aj AÐ	jº  Aðj Ajº A!@ Aj Aðjº  Aðj Ajº  "Aj! A0I\r  A°j Aðj AÐ	j»  Aðj A°jº  Aj Aðjº A!@ Aðj Ajº  Aj Aðjº  "Aj! Aâ I\r  Aðj Aj A°j»  Aj Aðjº  Aðj Ajº A!@ Aj Aðjº  Aðj Ajº  "Aj! A0I\r  Aj Aðj AÐ	j»  Aðj Ajº  Aj Aðjº  Aðj Ajº  Aj Aðjº  Aðj Ajº  AÐj Aðj AÐj»  A°j A j AÐj» A !@ Aj "Atj A°j Atj) >  Aj"! A\nG\r A !@ !A !@ Aj "Atj" ( "	 	 	Auq"	ApA` Aq"qk6   ( 	A kuj6 Aj"! A	G\r   (´"  Auq"Apqk6´  AuAl (j"6 Aj! E\r     Auq"A`qk6  ( Auj6A !@ !A !@ Aj "Atj" ( "	AÿÿÿAÿÿÿ Aq"q6   ( 	A kuj6 Aj"! A	G\r   (´"Aÿÿÿq6´  ( AuAlj"6 Aj! E\r A!AA  AìÿÿJ!	@ "Aj"! Aj Atj( "At ApA` Aqsq"At q"At q"At q"At qAu 	q"!	 A\nG\r    Aíÿÿqk"	6A!@ Aj "Atj" (  AÿÿÿAÿÿÿ Aqqk6  Aj"! A\nG\r   (¨"At"6¨  (¬"At"\r6¬  (°"At"6°  (´"At"6´  ("At"6  ("\nAt"6  ("At"6  ( "At"6   A :    Av:    A\nv:    Av: \r   Av:    Av: \n   \nA\rv:    \nAv:    Av:    Av:    	Av:    	Av:    	:      Avr:     \nAvr: 	    Avr:     	Avr:  (¤!   Av:    A\nv:    Av:     Avr:    Av:    Av:     Avr:    A\rv:    Av:    \r Avr:    Av:    Av:    :    Av:    Av:    Av r:  Aðj$ A ¢\n    4  4 ~7    4  4~ 4 4 ~|7   4 4 ~ 4 )B B~| 4  4~|7   4 4~ 4 4~| 4 4 ~| 4  4~|7   4 4~ 4 4~|B 4 4~| 4  4 ~| 4  4 ~|7    4 4~ 4 4~| 4  4~| 4 4 ~| 4( 4 ~| 4  4(~|7(   4( 4~ 4 4~| 4 4(~|B 4  4~| 4 4 ~| 40 4 ~| 4  40~|70   4 4 ~ 4  4~| 4( 4~| 4 4(~| 40 4~| 4 40~| 48 4 ~| 4  48~|78   4 4(~ 4( 4~| 48 4~| 4 48~|B 4  4 ~| 40 4~| 4 40~| 4@ 4 ~| 4  4@~|7@   4  4(~ 4( 4 ~| 40 4~| 4 40~| 48 4~| 4 48~| 4@ 4~| 4 4@~| 4H 4 ~| 4  4H~|7H   48 4~ 4( 4(~| 4 48~| 4H 4~| 4 4H~|B 40 4 ~| 4  40~| 4@ 4~| 4 4@~|7P   4( 40~ 40 4(~| 48 4 ~| 4  48~| 4@ 4~| 4 4@~| 4H 4~| 4 4H~|7X   4( 48~ 48 4(~| 4H 4~| 4 4H~|B 40 40~| 4@ 4 ~| 4  4@~|7`   40 48~ 48 40~| 4@ 4(~| 4( 4@~| 4H 4 ~| 4  4H~|7h   4H 4(~ 48 48~| 4( 4H~|B 4@ 40~| 40 4@~|7p   48 4@~ 4@ 48~| 4H 40~| 40 4H~|7x   48 4H~ 4H 48~|B 4@ 4@~|7   4@ 4H~ 4H 4@~|7   4H )HB B~7ü~# A k"$   ) "Ä" ~"7   )"Ä" B B"~"	7  4" ~  ~|B"\n7  4" ~  ~|B"7   B "B~  ~| ) "\rÄ" ~|"7    ~  ~| )("Ä" ~|B"7(   ~  ~|  B~| 40" ~|B"70   ~  ~|  ~| )8"Ä" ~|B"78   ~  ~|B  ~| )@"Ä" ~  ~|B|"7@ )H! B 7P   ~  ~|  ~|  ~| Ä" ~|B7H   B B~"7   | B~|78  B B ~"7  B~ |7@   B B~  ~|"7   | B~|70   ~  ~|"B"7x   | B$~|7(   ~  ~|  B B~|"B"7p   | B$~|7    ~  ~|  ~|"B"7h   | B$~|7   ~  ~|  ~|  ~|"B"7X   	| B$~|7   ~  ~|B  ~  ~|  ~|B|" | B~|7    \rB B~  ~|  ~  ~|B|"7`   \n| B~|7A !@  "Atj" ) "  B §AuAv­|"B`}7   B )|"  B §AuAv­|"Bp}7  Aj"Atj" B ) |7  ! AI\r  )P! B 7P   ) | B~|"  B?§Av­|"B`}7   B )|7   AÐ ü\n   A j$ ÷~# A k"$    ¹   )@ )"| B~|7@  )8 )"| B~|78  )0 )"| B~|70  )( )x"| B~|7(  )  )p"| B~|7   ) )h"| B~|7  ) )`"| B~|7  ) )X"| B~|7 ) ! )P! B 7P   | B~|7 A !@  "Atj" ) "  B §AuAv­|"B`}7   B )|"  B §AuAv­|"Bp}7  Aj"Atj" B ) |7  ! AI\r  )P! B 7P   ) | B~|"  B?§Av­|"B`}7   B )|7   AÐ ü\n   A j$    B 7À  A )¨ 7¸  A )  7°  A ) 7¨  A ) 7   A ) 7  A ) 7  A )ø 7  A )ð 7 A Í$# Ak"$ @@@@@@@@@@@@@  AôK\r @A ( "A  AjAøq  AI"Av"v" AqE\r @@  AsAq j"At"AÀ j"  (È "("G\r A  A~ wq6    6   6 Aj!   Ar6  j" (Ar6\r A (  "M\r@  E\r @@   tA t" A   krqh"At"AÀ j" (È " ("G\r A  A~ wq"6   6  6   Ar6   j"  k"Ar6   j 6 @ E\r  AxqAÀ j!A (¬ !@@ A Avt"q\r A   r6  ! (!  6  6  6  6  Aj! A  6¬ A  6  \rA ( "	E\r 	hAt(È "(Axq k! !@@@ (" \r  (" E\r  (Axq k"   I"!    !  !  (!\n@ ("  F\r  ("  6   6@@ ("E\r  Aj! ("E\r Aj!@ ! " Aj!  ("\r   Aj!  ("\r  A 6 A!  A¿K\r   Aj"Axq!A ( "\nE\r A!@  AôÿÿK\r  A& Avg" kvAq  AtkA>j!A  k!@@@@ At(È "\r A ! A !A !  A A Avk AFt!A !@@ (Axq k" O\r  ! ! \r A ! ! !    ("   AvAqj("F   !  At! ! \r @   r\r A !A t" A   kr \nq" E\r  hAt(È !   E\r@  (Axq k" I!@  ("\r   (!   !    ! !  \r  E\r  A (   kO\r  (!@ ("  F\r  ("  6   6\n@@ ("E\r  Aj! ("E\r Aj!@ ! " Aj!  ("\r   Aj!  ("\r  A 6 	@A (  "  I\r A (¬ !@@   k"AI\r   j" Ar6   j 6   Ar6   Ar6   j"   (Ar6A !A !A  6  A  6¬  Aj! @A (¤ " M\r A   k"6¤ A A (° "  j"6°   Ar6   Ar6  Aj! @@A (ð E\r A (ø !A B7ü A B 7ô A  AjApqAØªÕªs6ð A A 6 A A 6Ô A !A !   A/j"j"A  k"q" M\r\nA ! @A (Ð "E\r A (È " j"\n M\r \n K\rA - Ô Aq\r@@@A (° "E\r AØ ! @@   ( "I\r     (jI\r  (" \r A Â "AF\r !@A (ô " Aj" qE\r   k  jA   kqj!  M\r@A (Ð " E\r A (È " j" M\r   K\r Â "  G\r  k q"Â "  (   (jF\r ! @  AF\r   A0jO\r   kA (ø "jA  kq"Â AF\r  j!  !  !  AG\rA ! A !  AG\rA A (Ô Ar6Ô  Â !A Â !  AF\r  AF\r   O\r   k" A(jM\rA A (È  j" 6È @  A (Ì M\r A   6Ì @@@@A (° "E\r AØ ! @   ( "  ("jF\r  (" \r @@A (¨ " E\r    O\rA  6¨ A ! A  6Ü A  6Ø A A6¸ A A (ð 6¼ A A 6ä @  At" AÀ j"6È   6Ì   Aj" A G\r A  AXj" Ax kAq"k"6¤ A   j"6°   Ar6   jA(6A A ( 6´   O\r   I\r   (Aq\r     j6A  Ax kAq" j"6° A A (¤  j"  k" 6¤    Ar6  jA(6A A ( 6´ @ A (¨ O\r A  6¨   j!AØ ! @@@  ( " F\r  (" \r   - AqE\rAØ ! @@@   ( "I\r     (j"I\r  (!  A  AXj" Ax kAq"k"6¤ A   j"6°   Ar6   jA(6A A ( 6´   A\' kAqjAQj"    AjI"A6 A )à 7 A )Ø 7A  Aj6à A  6Ü A  6Ø A A 6ä  Aj! @  A6  Aj!  Aj!   I\r   F\r   (A~q6   k"Ar6  6 @@ AÿK\r  AøqAÀ j! @@A ( "A Avt"q\r A   r6   !  (!   6  6A!A!A! @ AÿÿÿK\r  A& Avg" kvAq  AtrA>s!    6 B 7  AtAÈ j!@@@A ( "A  t"q\r A   r6   6   6 A A  Avk  AFt!  ( !@ "(Axq F\r  Av!  At!   Aqj"("\r  Aj 6   6A!A! ! !  ("  6  6   6A ! A!A!  j 6   j  6 A (¤ "  M\r A    k"6¤ A A (° "  j"6°   Ar6   Ar6  Aj! ½ A06 A !    6     ( j6   ¿ ! @ E\r @@  ("At"(È G\r  AÈ j  6   \rA  \nA~ wq"\n6 @@ ( G\r    6   6  E\r   6@ ("E\r    6   6 ("E\r    6   6@@ AK\r    j" Ar6   j"   (Ar6  Ar6  j" Ar6  j 6 @ AÿK\r  AøqAÀ j! @@A ( "A Avt"q\r A   r6   !  (!   6  6   6  6A! @ AÿÿÿK\r  A& Avg" kvAq  AtrA>s!    6 B 7  AtAÈ j!@@@ \nA  t"q\r A  \n r6   6   6 A A  Avk  AFt!  ( !@ "(Axq F\r  Av!  At!   Aqj"("\r  Aj 6   6  6  6 ("  6  6 A 6  6   6 Aj! @ \nE\r @@  ("At"(È G\r  AÈ j  6   \rA  	A~ wq6 @@ \n( G\r  \n  6 \n  6  E\r   \n6@ ("E\r    6   6 ("E\r    6   6@@ AK\r    j" Ar6   j"   (Ar6  Ar6  j" Ar6  j 6 @ E\r  AxqAÀ j!A (¬ ! @@A Avt" q\r A   r6  ! (!   6   6   6   6A  6¬ A  6   Aj!  Aj$   ¡  Ax  kAqj" Ar6 Ax kAqj"  j"k! @@ A (° G\r A  6° A A (¤   j"6¤   Ar6@ A (¬ G\r A  6¬ A A (    j"6    Ar6  j 6 @ ("AqAG\r  Axq! (!@@ AÿK\r @  ("G\r A A ( A~ Avwq6   6  6 (!@@  F\r  (" 6  6@@@ ("E\r  Aj! ("E\r Aj!@ !	 "Aj! ("\r  Aj! ("\r  	A 6 A ! E\r @@  ("At"(È G\r  AÈ j 6  \rA A ( A~ wq6 @@ ( G\r   6  6 E\r  6@ ("E\r   6  6 ("E\r   6  6   j!   j"(!  A~q6   Ar6   j  6 @  AÿK\r   AøqAÀ j!@@A ( "A  Avt" q\r A    r6  !  (!   6   6  6   6A!@  AÿÿÿK\r   A&  Avg"kvAq AtrA>s!  6 B 7 AtAÈ j!@@@A ( "A t"q\r A   r6   6   6  A A Avk AFt! ( !@ "(Axq  F\r Av! At!  Aqj"("\r  Aj 6   6  6  6 (" 6  6 A 6  6  6 Aj\r@  E\r   Axj"  A|j( "Axq" j!@ Aq\r  AqE\r  ( "k"A (¨ I\r   j! @@@@ A (¬ F\r  (!@ AÿK\r   ("G\rA A ( A~ Avwq6  (!@  F\r  (" 6  6@@ ("E\r  Aj! ("E\r Aj!@ ! "Aj! ("\r  Aj! ("\r  A 6  ("AqAG\rA   6    A~q6   Ar6   6   6  6A ! E\r @@  ("At"(È G\r  AÈ j 6  \rA A ( A~ wq6 @@ ( G\r   6  6 E\r  6@ ("E\r   6  6 ("E\r   6  6  O\r  ("AqE\r @@@@@ Aq\r @ A (° G\r A  6° A A (¤   j" 6¤    Ar6 A (¬ G\rA A 6  A A 6¬ @ A (¬ "G\r A  6¬ A A (    j" 6     Ar6   j  6  Axq  j!  (!@ AÿK\r @  ("G\r A A ( A~ Avwq6   6  6 (!@  F\r  (" 6  6@@ ("E\r  Aj! ("E\r Aj!@ ! "Aj! ("\r  Aj! ("\r  A 6   A~q6   Ar6   j  6 A ! E\r @@  ("At"(È G\r  AÈ j 6  \rA A ( A~ wq6 @@ ( G\r   6  6 E\r  6@ ("E\r   6  6 ("E\r   6  6   Ar6   j  6   G\r A   6  @  AÿK\r   AøqAÀ j!@@A ( "A  Avt" q\r A    r6  !  (!   6   6  6   6A!@  AÿÿÿK\r   A&  Avg"kvAq AtrA>s!  6 B 7 AtAÈ j!@@@@A ( "A t"q\r A   r6   6 A! A!  A A Avk AFt! ( !@ "(Axq  F\r Av! At!  Aqj"("\r  Aj 6 A! A! ! ! ! (" 6  6A !A! A!  j 6   6   j 6 A A (¸ Aj"A 6¸  ? Atd~@@  ­B|BøÿÿÿA ( " ­|"BÿÿÿÿV\r Á  §"O\r  \r½ A06 AA  6   \n   $ #   kApq"$   # ¤ú A°                                ¶xYÿrÓ ½nÿ\nj )À èyÿ¼< ÿqÎÿ ·âþ´\rHÿ        ° þÓÉÿ i5 `½ §×ûÿLþjeáÿü ®         Yñ²þ\nå¦ÿ{Ý*þÔ R 0Ñó wy@ÿ2ãÿ nÅg         j	ægó¼É»g®Ê§;<nórþø+¥Oõ:_6ñQR­æÑh+>lÙ«ûA½k[àÍ~!yÉ¼ógæ	j;§Ê®g»+øþrón<ñ6_:õO¥Ñæ­RQl>+hk½Aû«Ùy!~Íà[ A°\nä÷;½ñ$ÿø%Ã`Ü7 ·L>ÿÃB= 2L¤á¤LÿL=£ÿu> Q@ÿvA ¢sÖÿ. |æôÿ\n 4Â ¸ôL )¾ôÿ{ªzÿbD yÕ Veÿ¡g YCÿïå¾Cµ ÆðþîE¼ÿCî *lÿåUq2Dÿj	 2gÿP¨#ÿ¨¹8YèÿeÒü )úG ÌªOÿ.ïÿPMï ½ÖKÿù &PLÿ¾Uu Väª ØÐÃÏ¤ÿBLÿ¯áÿPbLÛò Æ¢r .Ú +ñþ hÿ3»¥ ¯ BT ÷: #A5þEì¿ -õ£{Ý  nÿ4¥ ºÖG é°` òï69Y S Tÿ d \\xþh|¾ µ±>ÿú)U *`üö ?þï>  8 -§½ÿ³VÓ »³þúªÿÒ£N %4 cM îÕÿÕÀÑI.T A)6ÎO Éþªoÿ±!2þ«&ËÿN÷t ÑÝ ²:, É\';½ü 1åÒu»u µ³¸ rÛ 0^ õ)8 }\rÌþô­w ,Ý þTê ù Æì~êÿ/c¨þªâÿf³Ø âzÿzBþ¶õ ãäÖ9ëÿØ­8ÿµçÒ wÿ_ÿn~3 ©·ÿbþE°^ÿtãÙòÿÊ­i\'ÿ.¯E ä/:ÿ×àEþÏ8EÿþÿÏÔÿÊ~ÿ_Õ`ÿ	°! ÈÏÿñ*þ#!ÀÿøåÄx ûgÿ4pÿ8Bÿ(âõÿÙF%þ¬Ö	ÿHCÀÖÿ,&p D¸KÿÎZû ë µª: tôï \\ f­b é`1Ë  	ÿÓz "ÿÛÌ )ÿàS+þU÷ m þ©0 îwÛÿç­Õ Îþþºÿ~	o*H o4ìþ`? ¿þÍNÀÿjí»ÛL ¯ó»þiY­ UY¢ó vÑþ!	 £.ÿ]F( l*þoüÿß 3å§ÿIüÿ^tÿ Úÿî%ÿ³êÏÿÅ ³ÿ¤ áÄh \n#þÑÔòÿaýÞþ¸eå Þ¤ÿÏþaó ÀþÉT!ÿo\nNÿQ²ÿ ¡î×ÿ! 5×ÿ)µÐÿç ³ËÝÿÿ¹q ½â¬ÿqBÖÿÊ>-ÿf@ÿN®þuDÿ;½ñ$ÿø%Ã`Ü7 ·L>ÿÃB= 2L¤á¤LÿL=£ÿu> Q@ÿvA ¢sÖÿ. |æôÿ\n 4Â ¸ôL )¾ôÿ{ªzÿbD yÕ Veÿ¡g YCÿïå¾Cµ ÆðþîE¼ÿêq<ÿ%ÿ9ÿE²¶þÐ³ v}þÖÿñ2MÿUËÅÿÓúÿ0dÿ»Õ´þXi SÑsb ®<þ«7nÿÙµÿ¼ª fþWÖ®ÿrzé,ª ïÖìê ¯Û 1j=ÿBÐÿjnÿQêÿ×kÀÿCî *lÿåUq2Dÿj	 2gÿP¨#ÿ¨¹8YèÿeÒü )úG ÌªOÿ.ïÿPMï ½ÖKÿù &PLÿ¾Uu Väª ØÐÃÏ¤ÿBLÿ¯áÿPbLÛò Æ¢r .Ú +ñþ hÿ²	üþdnÔ § éï£ÿe\nÿþFþGùä X2 D: ÿ¿hBÿÀ2Uÿ³ÿ&úÉ sP  æq }X ZDÇ ýL ÿv qúþ BK. æÚ+ åxºD+ |î»kÅÿT5öÿ3tþÿ3»¥ ¯ BT ÷: #A5þEì¿ -õ£{Ý  nÿ4¥ ºÖG é°` òï69Y S Tÿ d \\xþh|¾ µ±>ÿú)U *`üö ?þï>  8 -§½ÿ³VÓ »³þúªÿDqÿÞº;ÿBñEH Vlþ7§Y m4Ûþ\r°ÿÄ,jÿïGÿ¤}ÿ­ 3)ç >! o]¹SE s. aÿä 1Ùâ qKêþÁÿ¶0`ÿ\r ÃùþEÁ; %Qþ}j< Öð©¤ãB Ò£N %4 cM îÕÿÕÀÑI.T A)6ÎO Éþªoÿ±!2þ«&ËÿN÷t ÑÝ ²:, É\';½ü 1åÒu»u µ³¸ rÛ 0^ õ)8 }\rÌþô­w ,Ý þTê ù Æì~êÿ>Ý YÖÿ7þD¿ÿÌ²#ÃÙ /3Î&ö¥ ÎþW$ Ù4ÿ}{×ÿU<ÿ«\r ÚõXþü#< 7Ö ÿe8 à þ@ê ¢rv} øüú e^ÄÿÆâþ3*¶ 	þm¬ÒÿÅìÂñA 0/ÿC7ÿÚ¥"þJ´³ ÚBGXzc ÔµÛÿ\\*çÿï  õM·ÿ^QªÕØ «]G 4^ø ¡þÅÑBÿ®ôþ¢0· 1=ðþ¶]Ã ÇäÈÿ-íÿl ZOíÿ\'?Mÿ5RÏvÿeè\\C ÈXÿ!¨ÿáH Ñÿ,õ¨ÜíÿÓiþîÝ Põþoþ Þ_¾ß	ñ LÔÿlÍhÿ?u E0 #äo À!ÁÿpÖ¾þs fX 3Jø âÇþÌ¢eÿÐa½õh æöÿE nX4þâµYÿÐ/Zþr¡Pÿ!tø ³WÿE±Xîÿ: qME ;y4ÿîS 4Á ç\'éÿÇ" ÞD­ [9òþÜÒÿÀöþ#» Ãì¥ o]Î Ô÷Ñÿç\n @N& zùdaÿ>[ùøM Å?¨þt\nR ¸ìqþÔËÂÿ=düþ$Êÿw[ÿO gg«þí×oÿØ5E ïð ÂÝÿ&áÞ èÿ´þvRÿ9Ñ±è °.þÂs. X÷åg¿ ÝÞ¯þë, äþÚig UÒ ¾ÿÕA^þuàÿRÆu ÝÜ £e$ År% h¬¦þ¶  QH¼ÿa¼ÿE\n Çÿ	sAÖ¯ÿÙ­Ñ P¦ ÷åþ§·|ÿZÌþ¯;ðÿ)øl(3ÿ±Ãþú~ [Ax<ÞÿõÁï Ö½ÿ P¢ MÜkêÍJÿ6¦gÿtH	 ä^/ÿÈÿ#ÖYÿ=°ÿSâ£ÿK¬ & _ÿ×|O]  RþÃûÿ(ÊLÿû~à c>þÏáÿ`DÃ ºÿçÿ*þ 4Û=þfËH ÿº¤Õ zw ò Ðüèÿ[Õ¶ÿúþù×J ¥o«	ß å{"\\ÿM-Ãÿ;àN ÷ ly  Oú½ÿ`ãüþ&ñ> >®}ÿo]ÿ\næÎaÅ(ÿ 19þAú\r ûÿÜmÒÿ®¦þ,½ ë#ÿ%÷ÿHÿgkÿ ÷Z 5,* ð ;? XN$ q§´ ¾GÁÿÇ¤ÿ:¬ M! A? M!ÿ¬þfäÝÿWþ)VÿÌïþlÿ»ò ÒÐ D-þI`> Q<ÿª$ÿù #Õm 6ÿ#áÿê=8ÿ:Ù |X ì~B Ñ&·ÿ"îÿ®f _Ó Äþ.Tèÿu"çúJÿd\\»ÃÿªÆp x* ÑFC Q ¨d©­  k#u >`;ÿQEï¾ÿÜü £Ü:ÿ¼ÿSfm `L êÞÒÿ¹®Í<Õÿ\rñÖ ¬ ]hò Àû +u áQ èÚ âË éÿu+ÿò/ÿ! û,þõÿ·Ö}þ(y ºÕÿYã EX þËá É®Ë G¸ y)þ^N àÖðþ$´ ûç£Ô ÒùtþX» 1þ>ÿLÓ Ö3R muäþgßËÿKüGÜÿ\r[¨`ÿµ¶ ú37 êêÔþ¯? \'ð4½$ÿÕ(U ´÷ÿfTaÿEÞ zÿÜÕëèËÿ y9 ã 5Há R0þS<ÿH© "gï Æé/ tÿ¸j	ÿ·S $°æ"gH Û¢ õ*  `þ¥, ÊïHþ× *B$×¯ V®VÿÅÿ1èþg¶R ý°²z õú\n ì² j () 2ÿ|i& æ¿K +ª ,ÿ,\rÿíÿmdÿpµÿhÜl 7Ó cÕÿÿî a !lQ g >m"ÿú´  GÃÿ&F_õ Eåeð Oà Nnyÿø¨| »÷ ëþO F:µ£ÿOÿ%ªÿóUÿ°ç×ÿÌ¤ÿï×\'ÿ.Wþ£Xÿ¬"è B,fÿ6)þìcWÿ){©4r+ u(  çÏ[þ#&ÿf}þ$ãÿvqÿ\r| `JXÎÿ§¿Üþ¢Xÿ¶d u4 Q.j EPÉÑö¬ 0àÓX tâ zb Aìêáâ	ÿÏâ{YÖ; pXZôËÿ1&lº Ype.ÌÿÌ-þOÿÝÿ3Iÿ*eÿñÊ  ã i2ì O4ÅÿhÊÐ´ eÅNÿbMË )¹ñ#Á| #ÿÏ5À }£ù¹ÿ0 ]oÿ=yçEÈ$ÿ¹0¹ÿoîÿ\'2ÿc×£ÿWÔÿ¤ÿ#lßnÿÂL² Je´ ó/0 ®+ÿR­ý6rÀÿ(7[ ×l°ÿ8 àéL ÑbÊþò} ,Á]þË± ° pGÕÿÎ;°C Õþ*7Ðÿ<Cx Á£ c¤s \nv ÔÞþ ÙÿrõLu;{ °ÂVþÕ° NÎÏþÕ; éû`7ÿìÿÿÅYTÿ] ® q êc©ÿtX ¤Sÿ_Æÿ"/ÿcxÿìÁ ù÷~ÿ» 2æuÿlÙÛÿ£Q¦ÿH©þyOÿYþ~ A!/êý 3 iSÇÿ£Äæ qø¤ âþÚ ½ÑËÿ¤÷Þþÿ#¥ ¼ó³G %íþÿdºð 9GþgHIÿôQþåÒÿî´ÿå®ÿãÝÀ1 £×Äþ	vÿ3ðG qmÿLðç ¼± }G,¯ó ^©þæ w¨ªºÿ¬ÅLÿüK¼ |Ä H`ÿ-ùÜd @Àÿxïâ ²  À} ëê · SÇÀÿ¸¬HÿIá MúÿºAC höÏ ¼ ÿÚò CQþíyÿÏ)Çÿ v µÿÜ& @þI\r Wä9Ì| +ß ÛcÇ Kÿ~ >× næ ³§ÿ6ü¾ ÝÌ¶þ³AÿQ ÂÚ ªß  à ÿ&Åb ¨¤% X¤ºn `$ êòå úy òþpÿ/^	ïÿQþÖý¨ÿC|à õ_J ,þmÜÿ²YY ü$L Æ.ÿLMo êÿ\'^ ¹HêÿFDÿçfþMç §/:avÿá¦Îÿn²Öÿ´¢ á\rÚNÿr!bhÌ ¯ru§ÎK ÊÄS:@C /oÄ÷ÿààþpÏ dÿ%k ÆOÿÑÿ£þ¹þ<ó ÛpþÙA È\rtþ{<Äÿà;¸þòYÄ {KþÎ Eþ0çtßÿÑ AÈPb %Â¸þ?" ðAÿÙÿ8&-þÇxÒ l±¦ÿ Þ Ü~wþ¥k ÿRÜøñ¯ ÿ©T  NÿâvPÿ4ÿ?`ÿú\' ¼ è3þ(èÿðå	ÿ¯ÿKIaÚÔ ¢k¹Õ ùkÿ(òF ÛÈ \r CRPÿÄùÿ 2H ^LûA À ¸ÔÉÿ{é¢÷­H ¢WÛþ~Y þ¦i Iäqx·ÿB£mÔÿç¨ÿZ 9:þY4\nÿý£ Òÿ\nU.µ g þ~¼Ñÿ"#o ×ÛÿÔÖþev èÅÿß§mÿíPVÿF^ Á¿3ÿ¾s NÏÿù\nµ}é _¬\rþªÕ¡ÿ\'ìÿ_]Wÿ¾_ }Î ¦ ãÿÎxÿ* e²xm Ú,þ÷¨ÎÿÔp päÿZ%ÅÞl þÏSÿ	Zóÿóô¬ XsÿÍtz ¿æÁ ´dÙ%`ÿN ëêÿÎ²²ÿÀû ¶ú öi |ÁmÿÒÿ©ª  `nÿu	2{(ÿÁ½c "ã  0PFþÓ3ì -zõþ,® ­%éÿA« zE×ÿZPÿj`þãr Í1wþ°>@ÿR3ÿñóÿ\rþÙóÿ¢þZvñ öÆöÿ7vÿÈ £ ky U¡vÿ&  /î 	¦¦Kbµÿ2J B/ á Lÿî¸ Ï5ÿ·Àº« ®ÿ¿LÝ÷ªÛ ¬2þÙ	é Ë~Dÿ·\\0 §·A1þ ?þªÿ;àþ0?ÿNþ(Ã úpþ#Ë h©¨ Ïýÿh(&þ^äX ÎÿÔ7zÿßê ßÅ ýµµfv ì$ÿÔÙHÿ&þ>>  æÜcÿÔÿÉç ô{	þ «Ò 3:%ÿÿÿô·þ ò¦ J yØ) _Ãrþÿâçÿ÷Mÿösþá\\QÿÞPöþª{YÿJÇ ÿFÿ]K\\ Ý1þ4~â å| .	µ Í@4þ Ô @N Î«  æ ¿ýnþg÷§ @((*¥ñÿ;Käþ|ó½ÿÄ\\²ÿVÿY8ÆÿËøþ¢ ¬â *ÿ§ÿ$$ÿ0X¤þ¨ªÜ bGÖ [ÐO LÉ¦*ÖÿEÿ ÿ}ÿ¾ SÚÿ×îHz5 ½t¥ÿTBÿÖÐÿÕn Ã¨,çE ¢@Èþ[:h ¶:»þùä ËLþcÝé KþÖþPE @øþìÊÿiþ¯ #ÿ|yé ºúÆþå P®ÿ¥}D Êþëïø ¸v e^ÿzHFþE ÞøEvÿR×þ¼Jÿå§ÂþuBÿAê8þÕ ;]þ-ÿº~¤ÿ ï rcÛ4ÿc`¦þ>¾~ÿlÞ¨Kâ® æâÇ <uÚÿüøÖ¼Ì Âþ{EÀÿ©­$þ7b[ ß*fþf Z ïz@ÿüé 6ÿRt® %6ÿº} ãp¯ÿd´áÿ*íôÿô­âþø! «cÿJë2ÿuR þj¨í ÏmÐä	º <©þ³\\ ôªhÿë-|ÿFcº u· à× (	d _DÙW ÿd:ÿ°¥Ë4vF  þþôþõÿ§Âÿ}qÿ°yµ TÑ ÿY0 !ÿð ÍmFs>ÿ(kþÇÿ^ßâÿ«& £±þ-vÿÞÑ¾Qÿv{è\rÕeÿ{7{þö¥ 2cLÿÖ ÿaACÿ ®VN@÷`  C B7óÿÌ`ÿ!ÿb3SÕÐÿ¸6ÿÚ 1CöþHÿ\rH *OÖ *&ÿ» ¤ õT¸þxÆhÿ~Ú` 8uêÿ\rÖþD/\nÿ§þ&Æ B²YÿÈ.«ÿ\rcSÿÒ»ýÿª-*Ñ| Ö¢ æ f$pþC 4×{ÿé«6ÿb> ÷Ú\'ÿçÚì ÷¿ ÃT ¥°\\ÿÔ^ÿJã X(ÆÿÎCõþðÚÿ=Õÿa·j Ãèëþ_V Ñ0ÍþvÑñÿðxßÕ £ÿ\rÚ] UDþFPÿ½Raþÿcc¿ÿTÿkÚtÿpz. i  Â ?ÿDÞ\'Øý\\ ±iÍÿÉÃ *áÿ(¢s 	Q ¥ÚÛ ´ þüÿÏá´` £p ±ÛÿÁþ+N2 Aqy;Ùÿn^p¬o ` $U{ GÿÐI¼ À§Õõ" 	æ\\ ¢\'ÿ×Z baY ^OÓ Zð _Ü~f°â $àþ# çèsUS ÒIõÿ/rÿDAÅ ;H>ÿ·­þ]yvÿ;±QÿêE­ÿÍ± Üô3 ôÑIÞMÿ£`þÓ þË6 ¡à; mÿÞ*-ÿÐfÿì» 2Íõÿ\nJYþ0O ÞLÿ¦? ì\rÿ1¸ô »qf Úeý 9¶þ * Æíñ8 D [¤¬ÿNºþC4Í ÛÏms 6:øxÿ³ÿ ÁìBÿÿÿýÀ0ÿEÙÖ ÿ@eß}#ÿëI³ÿù§â á¯\na¢: jp«T¬ÿ²ÿõ aZ}ÿºË¹ÿßMÿÀ\\j ÆsÿÙø «²xÿä5 °6Áúû5 Õ\nd"Çj ôþ¬àWÿíÿýUÿ\'tÿ¬hd ûFÿÔÐÿýÓú °1¥ L{ÿ%Ú ÿ\\\n~rÿFàÿ÷ù D<ñÒ½ÿÃÙ»q \\® ç>²ÿÛ·á !ÿÍµP 9¸øÿC´ÿZ{]ÿ\' ¢ÿ`ø4ÿTB "äÿÂ¦n¼ ¾ÆÿÖP;ÿ HâÇÙù è¡G¾É Ù¯_þqCÿÇÿÌ ¶SÎæÿºÌ< \n}Uÿè`ÿÿY÷ÿÕþ¯èÁQ +þE ø Æ1 <# vöÿ1Xþþäºÿ¶ApÛÿ~4ÿ½51ÿp &7ÿâe£þÐ=ÿE®¾vÿ<bÛÿÙ\rõÿú\n Tþâ É}ð3ûÿÿ2ÿ××±ßîÿü8ÿ|[DÿH~ªþwÿd èÿO² úÅ ÆÐ yØþw$ÿÁz *-ÿÕðëæ¾©ÿÆ#äþn­H ÖÝñÿ8 ÀuNþ]ÏÿA bÿ_,ôj¿M þUþÖn°ÿI­þ ÄÇÿíZ Á¬qÿÈþäZÝ 1J¤Ý×ÿÑ½ÿiì7ÿ*Áÿì .Ù< X»ÿâRìÿQEÿ¾\r z0ÿQ@ «ó í#ö zÁþÔz _)ÿWM Ô N \'-­þÙÿ_	ÿãS b;þ>! sÓ¢aÿ¸þt¨ÿøÿbôð ºv røëÿi­È |Gÿ^$¤¯AÿîñªþÊÆÅ äGþ-ömÿÂ4 »° SüþY½ÝÿªIü :} $D3þ*E±ÿ¨LVÿ&dÌÿ&5# ¯a áîýÿQQ ÒÿþëIk Ïs R TcþÏ d¤e PÐMÿÏíÿÿ!¦n _Uÿ%¹oj#ÿ¦L rWÿÂ@ zÿèeþ­wb GÜþ¿95ÿ¨è ÿà cÿÚ¥ £ Ù\rÅqY ¡þÏ iãÿ6æ^ÿ­Ìÿ\\·ÿXüþf!Z a µÚÿðrw jÖ5ÿ¥¾s[áÿXj,ÿÐ=q 4| ¿ÿn6ì¦ÿ\'ÏåÇ ¼ä¼þdë öÚ·kÁÿÎ _ Lï Ï¡u 3¦ÿ4u\nþI8ãÿÁá ^ÿe¿Ñ  kåÿÆ+´dÒv rCÿXÿY\\ÜxÿrÏÿüsúÿ"ÎH ÿ²|WKa å\\þðCÿv{ãþxhÿÕÿ»FÿÛw6 ­ -øSH Ëé©k8 ÷ù&-òPÿég `RF Éo Q\'ÿ¡·NÿÂê!ÿDãþØÎt FëÿhO ¤æ]þÖ »òþ¼ÿ$m® pñ n$¥Ú ¦².I ]+ þø½í f É]ÃÿñýÿobÿlA£þO¾ÿI®Áþö(0ÿkXþÊaUÿýÌÿqòB n ÂþÐº Q< ¼h§ÿ|¦aþÒ 8òþ)o o:oÕÿ·¬ñÿ&Äÿ¹{ÿ.ö õiw¡ÿÎ-ÿÊJÿS|sÔ SÑþèÿ¬6­þ2÷ Ö½Õ ¸i ßþø ÿðÿ¼H 36 ¼´þÜ´ ÿS  £½óÿ:ÑÂÿWI< j1 õùÜ ­§ vÃÿ~í n%ÿ;R/ ´»V ¼Ðd%ÿpÁ ¼ÿTjÿáÊ ìoÿ(e ¬¬1þ36Jÿû¹¸ÿ]àÿ´ùàæ² H96þ²>¸ wÍH ¹ïýÿ=Ú ÄC8ÿê «.Ûä Ðlêÿ?èÿ¥5Çäÿ4Ík JîÿÛþï¬²ÿû½ßþ ÓÿÚñÄP $bþêÇ =íÜÿö9% ÿ> +î_þÙÿÕð\'Ü®ÿÍ0þ\rÀÿô"6þ ðµþÁ< ¦ÿ$8ÿðÛ x3 R*ì k\\ø½\n ?ò Ó\' Ê¡­ºÿÒÌïþ)Ñ¢ÿ¶þÿ¬t4 ÃgÞþÍE; 5)Ú0Â PÒò Ò¼Ï »¡¡þØ áq ú¸? ßbþM¨¢ ;5¯ É\nÿàÂ ÁÿÔ½þÈ®ÿ2q^³Z ­¶ ^±q +Y×ÿüjÿ{SþõBÿR1\'Üà a± M;Y =Ë«Üÿ\\N !µÿ©7³ <PÿÚ\'a kÿ<øH ­æ/S¶ÿi¢þÔQÿ´¸\'Þ¤ÿÝiûïp} ?a ?hãÿ: Z<àÿTÔü O×¨ øÝÇsy $¬x  ¢»ÿ9k1ÿ* jÆ+9JW ~ËQÿÃ ± ÝÂ Þ× Dç ±V²þ|´ ¸|&F£ ùûµ*7ã â¡, ìn 3]ì Ú·jþCM (õÑÿÞy ¥9 S}< F&Rå¼ mÞÿ7v?ÿÍº ã!ÿþ°öã±ã "j£þ°+O j_N¹ñzÿ¹= $Ê \r²¢ÿ÷ ¡æ\\A¹ÿÔ2¥@ÿòÚ ¤} ÕzCGW Ë²\\+ oÿ\'ïÿÙÿúÿ°?GÿJõMú®ÿ"1ãÿö.ûÿ#0}=ÿj$Nÿaì »xÿq«ÿÕÙþØ^Ñÿü= ^Ê ·ÿ@¿+ÿ MÿfxÂL ¼¯4ÿQ èV7á0¬ **ÿî2/ ©þ WÿÃïÿE÷ îåÿ±1p ¨bûÿyGø óþöãÿÛ©±þû¥ÿ£¹ÿ¤(«ÿþóm[ÿÞpÖç kµþÃ ÿÂchÿY¾ÿ±B~þj¹B 1Ú ü® ¼Oæî)à Ôêµ ¦uSÿDÃ^ .É ðX ¤9Eþ à*ÿ;×CÿwÃÿ$´yþÏ/ÿ®Òß eÅDÿÿRúé aVPE  t]d - ¬ÿZ+[ G. \'pÿÙaÿÜÆþ±51 ÞXÿ< ÏÀ©ÿÀtÑÿjNÓÈÕ·ÿzþÞË<ÿ!nÇþûju äáx:ÿÝÁTþp ½ÈÉÿ ê7°ÿ=2A l©ÿÜUÿpã ¢º Ï`¹þôk ]2Æa nVÿu®ÿsÔÈ Ê· í¤\nþ¹ï> ìxþb{cÿ¨ÉÂþ.êÖ ¿1ÿc©w ¾»#s-ÿùH p{ÿÖ1µþ¦é" \\ÅfþýäÍÿ;É*b. Û%#ÿ©Ã& ^|Á+ß _HþxÎ¿ zÅïÿ±»Oÿþ.ú§¾ T Ëq¦ÿù½þHÊÿÐGIÿÏH \nÒQLÿXÐÀÿ~ókÿîxÿÇyêÿ;ÿ$Ü{ÿ³<þð B a$&ÿs]ÿ`gçÿÅ;À¤ð ÊÊ9ÿ®0 YM*L× ôé 0Q ï4þã%ÿøt]|v ­þÀëSÿn¯çû¶ ù]þT¸ Lµ> ¯º d5þmâ Ýé:cJ    \r 	47ÿY ¯"; T¥wÿàâêÿH¦ÿ{sÿÖö úGÙÜ¹ Ô#Lÿ&}¯ ½aÒ rî,ÿ)¼©þ-º Q\\  Á yÐbÿ\rQ,ÿËR G:ÿÐr¿þ2& ØÃ e <ú×ÿéëÿg¯\\ nþîñ-ÿÙïa¨/ÿùU¯>ÿ9þ6 Þç~ ¦-uþ½`ÿäL2 Èô^ ÆxD"EÿA þeZ §ÅxÿD6¹ÿ)Ú¼ q¨0 Xi½R ÿ¹]¤äðíÿB¶5 «Å\\ÿk	éÇxÿN1\nÿmªiÿZÿôqÿJ: >ÜöÿyÈþÒ²ÿ~9+úÿeo/Vñÿ=Fÿ5Iÿ ÑV íJ ¤_¼ <þ¢tøÿ»¯   ÑoAþË\'ÿXl1ÿGÿÝ×þhi]ÿìþ ÓÿnÔIå éC§þÃÐÿÝÿ3ÙZ Cë2ÿßÒ ³5éjÆ Ù­Üÿpåÿ¯]þGËöÿ0BÿæÿÝqþëoÕ ªx_þûÝ -þi^Ùÿò4´þÕD-ÿh& ôL ¡È`ÿÏ5\rÿ»C ª6ø w¢²ÿS **À£ÿ·èo MåÿG5 L" ö/ÿÛ\'¶ÿ\\àÉÿE¶ñÿ£võ 	mjªµ÷ÿN/îÿTÒ°ÿÕk \'& H HE ÍMþ Go¬þâ*;ÿ³ ×!ñ êü\r¸O nIÿö½ ªÏÚJEÿö1ÿ d }JiÿZU=ÿ#å±ÿ>}ÁÿV¼IxÔ Ñ{öþÑ&ÿ:,\\EÖÿXÿü¦ÿýÏpÿ<NSÿã|n ´`üÿ5u!þ¤ÜRÿ)ÿ&¤¦ÿ¤c©þ=FÿÀ¦ kúB ÅA2 ³ÿÿhÿ+#ÿPo¨ n¯¨ )i-ÿÛÍÿ¤éþ+v éCÃ ²RÿWzÿÔîZÿ#|þ¤ û×,þFkÿeãPþ\\©7 ×*1 r´Uÿ!è¬Õ >°{þ ÿá¿> ]F µ*h¿àÿÈÈÿùê% 9 Ã8ÐÿþFÿ ­ðÿÜÇ ndsÿåù äéßÿ%ØÑþ²±Ñÿ·-¥þàar a¨ÿáÞ¬ ¥\r1ÒëÌÿüþF  è¾4þSø]ÿ>×M¯¯³ÿ 2B y0Ð ?©Ñÿ ÒÈ à»,I¢R 	°ÿLÁÿ;§+ ¾¾ ¼ èëËÿê mÿ6A <XèÿyýþüéÿÆn)SMGÿÈ;þjýòÿÏÿíB½ ZÆÊá¬ 5Ê 8æ V· m¾* óD®mä È±z# ·ÿ±0UÿZÚ©ÿøN Êþn 4+ bAÿ? Fj] èkn³=ÿÓÚòÑ\\ #ZÙ¶jÿteÙÿrúÝÿ­Ì <£ I¬,ÿïnPÿíLþ¡ù èå (ÿ®¤w q3Ö äþ@"ó kãôÿ®jÈÿTF2# úJØþì½Bÿù\r æ²ÿÝ)î vãyÿ^Wþþw\\ IïöþuW Óÿ±.ü å[öE÷ÿÊM6	ÿ`¦ ÙÖ­ÿÀ Ï  ½®kd Áó¶f« ë3 {ÿ<¨YÙ\\ÿÖÓ§þ ,Êþxìÿq¸ÿ¸ß (±wþ¶{Zÿ°¥° ÷MÂ êx ç Öÿ;\' }cÿDDÞø {Òÿnÿå!ÖÝÅ a ÌÿQ)¼ sOÿ^ ¯»ÿ|\nÿ~À³ÿgÆ - ÛU»æ²ÿH¶ Æ¸ÿpàa¡æ þc&ÿ:Å BÛ ;Eÿ¹pù w/ÿ{ ¨G_ÿq°(è¹­ Ï]uDlÿfþ1a! YAoþ÷£ÿ|ÙÝfúØ Æ®Kþ97 ãìåÕ­ ÉmÚ1éï 7²j o¼^~ ×îMð Õò&G¨ Íº]þ1ÓÿÛ ´ÿv¥  ÿnº#ÿÆó* ów ë£ñÿÁ.Áþg´Oÿá¸þòv °êo EBÕþ)`{ y^*ÿ²¿Ãÿ.* uTÿé1Öþîzm GYìÓ{ ô\r0þw rVÿKíÿåþd5ÿxþ¨2 Hhÿà1 ÿ{ÿ¹ÿªP¸¶ )de! LoVÎêÿÀ ¤þ¥{]ÿØ¤þC¯ÿ©;ÿ)=ÿI¼ÿÃÿÿgÿöãÿz( â/þ#$  º·ÿEÊ ÃÃ Þ3÷ ©«^·  ÿ@ÍSÿÅ:ùþûYnÿ2\nXþ3+Ø bòÆõq «ìÂÅÇÿåQ&); ýhæ ]ÿöòþÖ©ðÿðflþ §ì Ú¼ éÊÿúGÿ¯?·Æ hxsÿû÷ Ô§ÿ>{ÿ÷d½ ß Å! ;,ÿ]ðWÿ_GÏ§Uÿ¼tÿ\n Ã]6ba ð ¨ÿ¼ k Lý« ZÀ 6 àB6þæºåÿ\'¶Ä ûÿAlþ  ©1§þÇþÿû »þÿUR> ²:ÿþ ¤Õ\' üþ%5QÿR Í§îÿ^-´ÿ(¡ þop6KÙ ³æÝë^¿ÿó0ÊËÿ\'v*ÿuý þ Þ +û2 6©êPDÐ Ëóþ þ  ü¹ bÿ&#HÿÓ$Ü(Y ¨@ÅþÞïÿS×þ´i :sÂ ºtjÿå÷ÛÿvÁ Ê®·¦¡H ÉkþíJ éæjio¨ @àå f¯ÿÂîäÿþúÔ »íy Cû`Å ·_Ì ÍY @Ý%ÿßÿ²0ÓÿñÈZÿ§Ñ`ÿ9Ý .rÈÿ=¸B 7¶þn¶! «¾èÿr^ Ý /çþ ÿpS v×ÿ­(þÀÁÿîÿ«Ávÿeê5þÔp YÀkÐ µÙÿçè ì~ 	ÇÿOµþ¶Êÿm¶ÿ1Ôá J£Ë ¯é p3 ÁÁ	ÿù ã Ì ÛòÍ îÐuÿôp å" %P¼ÿ&-ÎþðZáÿ/ÿ*àL ºó§  ÿ3}  ñÛ ¬åÿöÖ2 çÏÿ¿~S´£ªÿõ8²¤ÓÿÊb9vÿYþ!3 ó[ÿý4 #©Cþ1Xÿ³$ÿ¥· :½ X  K©B BeÇÿØÇyÄÿOËþðâQÿ^\nÿSÁðÿÌÁÿ^V Ú( 3ÁÑ  ò± f¹÷ mt &[ ß¯ ÜBÿV<è `%ÿáz¢×»¨ÿ. 8«¢ èðez	 3	ÿ5îÿÙèþ}© \rèf 	% ¥aä) Þóÿþ <íjq ;½ \\p iÐÕ 0T³ÿ»yçþØmÿ¢ÝkþIïÃÿú9ÿYÿ¹s£ÿpú 9»ÿ¡`¤ /ó ûþCê¸ÿ)¡ ¯`ÿ ¬4þ°·ÿÆÁU|yÿ2rÿÜË<ÿÏï &kÿ7î^þF^ ÕÜMxEÿU¤¾ÿËêQ &1%þ=| N1þ¨÷0 _¤ü i© ýä @¦K QIÿÏÒ\n êjÿ^"Zÿþ9þÜc ´þ¹ )9ÿ½aL A»ßÿà¬%ÿ">_çð Mj~þ@[ b âû5ÿêÓÿËÞÿ¤°Ýþç ³zÍ $ÿ}Fþaäü ¬þ0ZÑÿàRT ñÄ. gqêÿ.eyþ(|úÿ-òþ	ù¨ÿlÿ£« 2­ÇÿXÞÿÈ_ À£ÿu o| ìAþD&Aÿã®þ ôõ& ð2Ðÿ¡?ú <Ñï z# !æþq jÿäÍ` Ò®þ´ÔÿYb"X §¢pAnÅ ñ%© B8ÿ\nÉSþý»ÿ±p-þÄû  ÄúÿîèÖÿÑÍ ðv GLSìc[ *ú`@ÿvÞ# qÖËÿzw¸ÿB$ Ì@ù Y >hée ¼T 1ù ÐÖKÿÏMÿs¯ë «ÿ¯º7õÿVµd:öÿmÇ<ÿRÌÿ×1æåÀÿÞÁûÿQÿ³¢ÿ\'ÿ_Kþ¿QÞ ñQZÿk1ÉÿôÓ ÞÿAÛ8þ½öZÿ²;0Û4 b"× »ÿ¯© \\O¡ÿìÈÂê åáÅ¨ ë35ýx® Å¨ÿÊu« £Î rUZÿ)\nÿÂc A7Øþ¢t 2ÎÔÿ@ÿd¥ÿ¬ÿ}5	ÿÁ1ÿµ®ÉÉÿd ÛbO *cþ` 0ÿÅùSþhOÿënþR,ÿA)$þXÓ\n »y» bÇ «¼³þÒîÿB{þ4ê= 0qþVxÿw²õ WÉ òÑ ÊrU ¡ gÃ0 1«ÿC ¶Izþ Óå   Ti= ±Â	ÿ¦YV6S» ù(uÿm×ÿ5,?/³ ÂØþT ±\rÿHóºÿu}ÿÓ:Óÿ]Oß ZXõÿÑoÿFÞ/ \nöOÿÆÙ² ãáN~³ÿ>+~ g# ¥þõð =3 QÐ sÿÓwìÿõøÿÿæ: ¤þ rUÿ1¦¶ÿFTU¶ .5] 	¦¡ÿ7¢²ÿ-¸¼ ,þ©Z1 x²ñ{ÿñÇ½B2ÿÆeþ½óÿþKaW vûí6 «ÏÿÄöÿ@qè9 ðÚs 1=ÿ@Iü©ÿ(\nZÉÁÿüyðºÎ) +Æa d· ÌØPþ¬A ùåÄþh{IÿMh`þ´ h{9 ÜÊåÿfùÓ Vèÿ¶NÑ ïá¤ j\r ÿxIÿCé Sþµ ·ìp0@ÿñØóÿAÁâ Îñdþd¦ÿíÊÅ 7\rQ  |fÿ(ä± vµç ÿw»Ê  <ÿ&½ÿ¦É Ïx6¸¬ òÌþBæ "&¸pP  3¥þ¿ó7 :Iþ§ÍÿdhÿÅþÏÿ­÷ î\nÊ ïò ^;\'ÿðfÿ\n\\ÿåTÛÿ¡P ÐZÌðÛ®ÿf5²Lÿ4l¨SÞk Ó$m v:8  í Ç ªÑ G/ V  Æò Ô0\\¬º æi`¿å P¿þðØÿb+þ¨Ä1 ý[Iy =\'?hÿ¸¥pþ~ëb PÕbÿ{<WÿRõßx­ÿÆÎ<ï çê\\ÿ!îÿ¥q°w&  +¦þï[i k=ÂD 3 ¤jÿ"t.þ¨_Å Ô H: pEþiÿìÉ ÔÿRãþâ;Ýÿ_À Qv4ÿ!+×KÿYyþO ÐÚ>ÿXÒ¸bÿ¯{ÿfSå ÜAtúÿ\\Üÿ"÷BÿÌá³þQ G(ìÿ?> Oðÿ·¹µ v2 ?ãÀ {c:2àÿáßþÜàMÿ,{¯ øÔÈ ;·ÿa Ìµ ý%G Uw Èº ùÿS| W ¨3õ|çÿÐðÅ|¾¹ 0:ö éè }bÿ\rþÿõ±ÿl# «}òþ"ÿ¥¡¢ ÎÍe ÷"d9 \'F9 vÌËÿò ¢ ¥ô Ætâ oÿ6¶<zÿ:962Æ «Óÿk§ÿ­kÇÿm¡Á YHòÿÎsYÿúþþ±Ê^ÿQY2 iBÿþÿþË@ÿOÞlÿ\'ùK ñ|2 ï Ýñi b Õ¡yþò1 é%ùþ*· ¸wæÿÙ £ÿÐûä>ÿO@	þ^0q 2þÁÿ ÷ÅC7h Í_ÿ0%B 7?@RJÿÈ5GþïC} àÞ ß]ÿàÊÿ	Ü Æ&ëfV <+Q é$þÏò ¤¢? 3.àÿr0Oÿ	¯â ÞÁÿ/ èÿÿ]iþ*æ RÐ+ô \'&ÿbÐÿ@¶ÿúÑ »<þ1Úÿ©tÍÿwx tÿ5mÿ\r\nÊ nS§ Ûÿÿ2§ÿ</ÿþ^½ ¦D Sß× ZÂ¨A ãS3ÿÍ«Bÿ6»<f-ÿwá ð÷ dÅ²ÿGßÿÌR)Î*ÿÀÝÿØ{ôÿÚÚ¹ÿ»ºïÿü¬ ÿÃ4 ®µþ»dsÿÓN°ÿÁ ÕhÿZÉ\nÿP{B!º cþÎ\n åê 5Ò ÜþG7§ HáVv¾¼ þÁe«ù¬ÿ^·þ]lÿ°]LÿIcOÿJ@þö.A cñþöfÿ,5Ðþ;fê ¯¤ÿXò  o& ÿ¶¾ÿs°þ©< zíñ ZL? >JxÿzÃn w² ÞòÒ !.þ() §p1£oÿy°ë LÏÿÆ)ëÕ U$Ö1\\mÿÈþ¨ìÃ \'|ìÃ Z$¸ÿCUªÿ&#þ|Dÿï#ÿ6É¤ Äuÿ1Í à~q u¶ Ë ßM °æ°ÿ¾å×ÿc%µÿ3ÿ½Yÿ10¥þ-÷ ªlÞ PÊ EgþÌÿ´ü>þÒ[ÿnþÿÛ¢ ßüÕ;! Îô Ó0 k Ð p;Ñ mMØþ"¹ÿöc8ÿ³ÿ¹2ÿTY Júbÿá*ÈÿÀÙÍÿÒ§ c_+æ9 þËÿc¼?ÿwÁûþPi6 èµ½·EpÿÐ«¥ÿ/m´ÿ{S¥ ¢4ÿÿãZÿaþ=é)ÿ^*7ÿl¤ì Dþ \nÿ\njOþó C²Bþ±{Æÿ>" ÅX*ÿ_±ÿ ÆÿþqÿáZ£ÿ}Ù÷ à BxþÀ	ÿ2ÝÍ 1ÔF éÿ¤ Ñ	 Ý4Ûþ¬àôÿ^8Îò³ÿ[¤æ.ÿ½æÜ 9/=ÿo ±[ æb aW~ ÆYÿ§Ok ùM éæÿVþ<Á %$þ¹óÿäÔS¬´ É© ô<ê ëCÚ< ÀqKtóÏÿA¬ QÿPH!þçmÿkþ}ÿ°;ÿÉ: Î©É Ðyâ (¬ÿ=^ÿ89ÿ<ÿ-lÿîÿÑUþÀÒ cb]þ á¹Ü ë,ÿ ¬þGÿ\r@]þ8Æ ±>ø¶ñ ¦eÿNQÿÞ×¼©ÿèa 1p<ÿÙåû wl \'{þ1ë T æÿJ» õ6ÿ¹ÛñÂäÿñÊf iqÊ ëO 	²ÿï È= s÷Òÿ1Ý :½#.	 QAÿ4¹ÿ}t.ÿJ\rÿÒ\\¬þG Ùàýþsl´ÿ:0þÛ±ÿÿ<ò ýW 5Kå 0ÃÞÿ¯2ÿÒxÿÐ#Þÿø³\neÿÂøÿÌeÿhþÅÿO> ²¬e`ûÿA\n ¥ÿtç ò× #ÿ+¡O ;öûB° È!ÿPnÿÃ¡ä8Bÿ{/þ¤ C®¬ ýr WaWúÜT `[Èÿ%}; Av ¡4ñÿí¬ÿ°¿ÿÿAþß¾æ eýçÿ#m úM1  {ZV ÿÚÕA o] <]©ÿ¶ ºþýöÿÕ0þLî ÿø\\Fÿcà ¸	ÿ¤Ð ÍÆWÖÇ Ö_ ÝÞ &«þÅnÕ +sþ×±v `4Buí @¶ÿ.?®ÿ_¾ÿáÍ±ÿ+ÿ¬cÔÿô» 3ÿätþeÏ öÿç }âMAb ì!ÿn> Elÿq SþÂ¡çÿµ< ÙÑ±ÿåÔþ¸ u±»ÿ°fP 2Tÿ}6ÿÿ³àè "uªÿ§ü«ÿIÎþú# HOìÜåÿ)Ê­ÿcLîÿÆàÿlÆÃÿ$`ì;ÿjdW nâ ãêÞ ]wÿJp¤ÿC[ÿ!ÿfÖÿ¯ægþ£ö¦ ]÷tþ§àÿÜ9«ÎT {äÿxw w´/áÿhÈ¹þ¥r MNÔ -±ÿÄyþR¶ Z¾Å _ïÿëG Vwÿ¬Ö <Ä ¡á xþ_È3 içÒÿ:	ÿ+¨Ýÿ|í ÆÓ2þ.õg ¤øT FÐÿ´u± FO¹ óJ  Ï ÅÄ¡õ5ï ]öþð1ÿÄX$ÿ¢&{ È®Lgÿ­©"þØ«ÿr3 äÂ n8þjö ¸OÿMðÿP¢  5©ÿV D^ \\nþbuÿùMæÿý\n Ö|\\þ#vë Y095¦ ¸=ÿ³ÿÂ Öø=þ;nö yQþ¦ä j@ÿEèÿòÜ5þ.ÜU q÷ÿa³gÿ¾ Ñ¶ _4ªÎÿzÈÌÿ¨d <þF<( z4±ÿöÓeÿ®í 3x ­ ~ïÿ½Ë ÄXÿéâÿ}­ÿÉl2 {d;ÿþ£ÝµÿÖ9þÞ´ÿÏX6ÿ!ûÿCÖ4ÒÐd Qª^ (5 àoçþ#ôÿâÇÃþîæ ÙÙ¤þ©Ý Ú.¢ÇÏ£ÿls¢`»ÿv<L ¸ ÑçGþ*¤ºÿº3þÝ«¶ÿ¢­ ë/Á _¤@ÿÝ¦ ÛÅ ,ÿdEuÿ<ëXþ(Q­ G¾=ÿ»X ç íu¤ á¨ßÿrtÿ£ò ª }bqþ¨L Üþ4 o¡ÿGZüÿ­nð \nÆyÿýÿðÿB{Ò ÝÂ×þy£ÿác ¾1¶ s	èÿÕD ,wzÿ³b3 Zj G2æÿ\nvÿ±F ¥WÍ 7ê îa qÏ b "kÛþur¬ÿL´ÿþò9³ÿÝ"¬þ8¢1ÿSÿÿqÝ½ÿ¼äþXYÿGÆþÿóyþÿkÊcÿ	ÎÜ/ k\'a1Âÿ3Åþº:ÿk+èÈÿµAþÝä«ÿ{>çãê³ÿ"½Ôþô»ù ¾\rPY ß­ 	ÞÆÿBJ §Ø]ÿ¨ÆB  Df.¬Z ØKÿ (3 |ð1 ìÊ°ÿ|Àÿ&Á¾ _¶= £|ÿÿ¥3ÿ(þ×`N VÚþ$ÊÿV	 o)Èÿíla 9>, u¸-ñt Üÿ¥¼ ú<,}ÿAÜûÿK2¸ 5ZÿçPÂÿ»ÿ-:¡ÿG" ®ùþ# ïD±ÿsn: î¾±Wõ¦ÿ¾1÷ÿS¸ÿ­\'ÿ×h ßx ÈÿÔÏµÙ ­ Wÿÿ#µ wß¡Èß^ÿFºÿÀCUÿ2© {ÿ8ó³þD \'¼þýÐÿÈs+¬åÿh» û§ 4 H ÅkþÿîÎ ~ÿXÅþD§ ü¥ÿïN6ÿ?7ÿ&Þ^ í·ÿÎÌÒ \'öþJç l³s  uvtüÿ¡iC R%âÿîâäÿÌÖþ¢{dÿ¹yê -lç B8ÿ ¬àBþ¯¼ æßâþòÛE ¸wR¢8 r{ ¢gUÿ1ïcþ× oÿ§þ\'ÄÖ &Où¨} aÿ4Ûÿ ,¥ÿ(· ÄMéÿvÒÿªæÿÖwÆ éð# ý4ÿuf0ÿÌÿ³±ÿYÿüF< k ´¾<ÿ8¶;ÿnG6ÿÆÿàWÿßÿ¶ÿúÍ ì-ÐÿOòeFÑ gN® e¬ÿí¿Â qP} 5ÿÄtõ ïrIþRÿ|}êÿ(4¿ *Òÿ¥ ²*@\\(ÿ$UMÿ²äv B`þsâB nðEþoP §®ìÿãlkÿ¼òAÿ·Qÿ 9Îµÿ/"µÿÕðGK_ (ÿfÒQ «Çäÿ") ã¯K ïÃ å_LÀ1 u{Wãá }>?ÿÆ« þ$\rþºÎ ÿôÿ# ¦ Û\\äÔ \\Æ<þ>ÈÿÉ); }îmÿ´£îzR 	XÿÅ/ÿ^9 X¶ T¡U ²| ¦¦ÿÐß ¶ò y¹ S®þvÿºSèß:yÿX #}ÿªþ¤ÿÄ ¡` #¢%û .òÿ Ù¼ 9®âÎé 9»þ{½	ÿÉuÿº$Ì çØ PNi ÿËD Q}þø¥ÈÿÖ 7¦ÿ&ë[ . ßþÿ#´ÿ}°+bÿØzæÿé  9¹þðqÿ	þ[l mÆË ( äÿ|º(ÿrbþ¦ cE, 	òîÿ¸5; fÿ4 óþßÈÿ{S³þÉÿ%8<ãÿZIË¬» P/ÿ^çÿ$¿;ÿáÑµÿJ×Õþv³ÿ6Á2 ç hHãÿ¶âþ`á\\ÿsªþúN øK­ÿ5Yÿ ´v H­ @Î®ß ¹>ÿÖb ÅÐ «§ôÿçµÚ¹ ÷©a¥÷ÿ/xgø3 <Eþ³Ä |Úþ:kQ ¸éÿüJ$ v¼C _5ÿÞ^¥þ.=5 Î;sÿ/ìúÿJ îÿj â y»=ÿ¦ñþCª¬ÿØ²ÿÉü ýnó È}9 mÀ`ÿ4sî &yóÿÉ8! Âv K`ÿªæþ\'?ý $-úÿûï  Ô\\-Ñí ó!WþíTÉÿÔþÔcÿÙbþ¬ï ¨ÉÿÁ©ÿîÁ×h) ï=¥þò Ë±þ±Ì Õþ)ÿ yþ rÿ¢PÈ  NØ6ü 0g iÜÅ ý¨Mþ5³ yðÿ.`ÿk<þbÍùÿ?ùwÿx;Óÿr´7þ[Uí ÔM8I1 VÆ ]Ñ  EÍ¶ÿôZ+ $° ztÝ 3§\'ç?ÿ\rÅ Ñ"ÿ;Ê §dN /ßL ¹<> ²¦{¡ÿ=®+ ÃE /¿",N 9ê4ÿ(ÿö^ Sä <Nàÿ `Òÿ¯ì I ´sÄþáj ÿ§ pÿxDÂÿ°ÄÆÿv0¨ÿ]© pÈfJþ þ>? ³»ÿMÿwV¤ ªÐÿÐÿ:ÿ¢xèþüÕ ñ\r* ^2 ³ªp Sÿ7wT#ïÿ-Cì¯\' 6gÿ*AÿÄïþV5Ë a/þØ#ÿFFg$Zÿ(­ ¸0\r £ÛÙÿQÿÝªlþéÐ] dÉùþV$#ÿÑãÉûÿ½§þd9 \r) ÅdK Ìëÿ®; xøÿU7á rÒ5þÇÌw ÷J?û ChP OY7ÿuæÿ` Õ Eñxó_ÿr* H 5ÿI>m Äf )Ìÿz&ú\n Ï} öôÞÿ) UpÕ~ ¢ùVGÆÿQ	b\'ÿÌG-Ko ê;ç  0_ÿÌrÄµÿ3ñ§þ]m h- ëµÿ4p¤ LþÊÿ®¢ =ëÿ+@¹þé}Ù óX§þJ1 ÌB |Ö{ &Ývpì rb± YÇ WÅp ¹¡ ,`¥ ø³ÿ¼ÛØþ(>\r ó åãÎÿ¬Ê#ÿu°áÿRn&*õÿSa 1«\n òwx è= Ôðÿs8ÿïþÊûÿùõÿcuï ¸³ÿöí3ÿ%ïÿ¦p¦ÿQ¼!ÿ¹úÿ6»­ ÐpÉ ö+äh¸XÿÔ4Äÿ3ulÿþu .[ÿWÿWãÌ SSLã Õl u³þÑR &\n sÉ ß¶nÄ]ÿ9<é §iÿÅ¤ `"ºÿ%Üc¾ §Tÿ« ÂÅûþ_Nÿüøóÿá]ÿ»ÄÿØª vþv V-Ó)ÿdþqtLÿÓlg0 ÁfE3_ÿk «é Z|j¡¶ ¯LìÈ¬ÿ£:h é´4ÿðýÿ¢qþÿ&ïþ4.¦ ñe!þº oÐ>ÿ|^ ÿ¬þ p®8ÿ¼cÿCû }:®ÿ²÷ÿüT RÅþ¬ÈSÿ%\'.jÏ§ ½" ² ÎÕ ¡âÒ H3iÿa-»ÿN¸ßÿ°û O Vÿt%² RMÕRTÿâeÔ¯XÇÿõ^÷¬vmÿ¦¹¾ µx Wþ]ÿðIÿ õÿ¢gÿ³bþÙÌp ßxÿ5\nó ¦ }PÈÿmÛÿ[Úÿüü/þmtÿs1ÌWÓÿÊÙÿUùÿõLY©ÿò-æ ;b¬ÿrIþN1ÿ~T 1¯+ÿ¶Tÿg# hÁmÿCÝ É¬þ¢X ¥ÿ}åÿÜgï\\ ÜmÿÊÆ ^$6, ëâÿªûÖÿ¹M	 aJò Û£ÿð#vÿßrXþÀÇ j%ÿÉ¡vÿaYcà:gÿeÇþÞ<c ê;4 f[þ¨Øë åè h< .¨î \'¿C K£/ abÿ8Ø¨¨éüÿ#oÿ\\T+ ÈW[ý Ê8F M P\n¯üÇL nRÿÂ =WÿýÞ¾H® U£Vþ:c,ÿ-¼þÍ åÒþøCÃ cG¸ Ç%ÿóyÿ&3KÿÉUþ,Aú 9óþ+;ÿY5 !Tÿ³3þ½FS ³bw oo wIÿÈ?þ-\r\rÿÀþQH* . ¹þ,p ×°h DWì2ÿ³úþÎÁ¿ÿ¦\\þ5(ï ÒÌþ¨­# ó-$2mÿòÂÿãzÿ°¯ÊþF9H (ß8 Ð¢:ÿ·b] o Lÿöÿ-òg Eµÿ\nÑ ³y ñèÚ{ÇXÿÒÊ¼Qÿ^eÐg$- LÁ_ñÿ¥¢» $r ÊBÿ%8 óUèÿúÔ¹±q ZÜKÿEø 2o2 \\P ô$sþ£dRÿÁ=$ ýCþAìªÿ¡×þ?¯ 7 Opé m ( SÿAîÿÙ©ÿN^½ÿ ¾ÿGºþjMÿééWíÿÐ\rìm$ÿ´dÚ ´£ ¾n	?{ÿ³´ÿ¥{{ÿ¼QþGðlÿpÿãÚ3ÿ§2êÿrOlÿsÿ·ðc ãWÿHÙøÿf©_ îãÌ# Ðsfê pXù ð¬þdpw Âþ(8Sÿy°. *5Lÿ¿ [Ñ\\ ­\rHâÿÌþ P¸Ï d	zþve«ÿüË þ Ï6 8Hù8\rÿ\n@kþ[e4ÿáµøÿ æ é8 wñÿÕ©ÿcc	þ¹¿ÿ­gm®\rûÿ²Xþ;Dÿ\n!ÿøa; °\n _yÏ¼X ¹^þþs7É 2F x5 B äâùÿhÀÞ­DÛ ¢¸$ÿfÿ }-b ë]áþ8p ÿFtóù7ÿ\'ñPô WE^äIÿNBAÿÂãç =Wÿ­ÿptÛþØ&ÿº ^Ô» d/[ Ìþ¯ÿÞ×þ­DlÿãäOÿ&ÝÕ £ãþ¾  ³\nZ^ÿÜ®X £ÓåÿÇ4 _Ýÿ¼çþqÿu«ìþ1Üÿ;«ÿäm¼ á þÃ® ãþ\'i MÎÿÒîâ 7Ôþï9| ªÂ]ÿù÷ÿ>ÿ\n\n O²ÿxòÊ ÛÕ >}#ÿlÿæ!SÿQ-Øà> ÖÙ} bÿ³°jþ]ÿm>$ÿ²y ÿxüF Üø% ÌXgÜûÿìãj1Æÿ<8k crî ÜÌ^I» Y" NÙ¥ÿÃùÿ	æýÿÍõ üÿTÍp %  ç[íÿ¿ªÌÿÞ mÀ1 Á¦ÿèµÿi4ÿgýÈ¥ ÃÙÿ4½ÿ{ þW6ÿNx=ÿ8) )}ÿW¨õ Ö¥F Ô©ÿÛÓÂþH]¤ÿÅ!gÿ+ á¬ ôi DDá T\rÿ9(þM8 T5 6_ \r±þ_sº uvÿô¦ñÿº ²jËÿaÚ] +ý- ¤ vï `þëÓÿ¨nÿ2ï° r)è Áú5 þ oþz)ÿalC ×ÿÑÔ *½£ Ê*2ÿjj½ÿ¾DÙÿé:u åÜóÅ %x6þÿ$=«þ¥dÿÔè Z®\n ØÆAÿ@ tqsÿøg ç}ÿ Å ¸#ßIùÿ{.þ8%ÿ­\råw¡"ÿõ=I Í}p h Ùöÿí Afÿl¤¾ Ûu­ÿ"%xþÈEP |ÚþJ ÿºÇÿGÇü hQÈ\' Ó=Àî[ Ù ;[ÕÿQ·ÿæzÿrËw´BÿH´ àj wRhÿÐ+ b	¶ÿÍeÿe& _Å¦ÿËñ >Ðÿöû © \r÷¸ þ $ÈÿXÍß [4ÿº äÒ÷êøÿæEþ°ºÿîÍ4O+ °Ùþ óC òoé ,#	ÿãrQGÿ&i¿ u2ÿQO ?DAÿ$nÿMñÿâ-ûÎ x{Ñþîÿ~ÿ[Þ×ÿ¢¿ VðI ¹Qþ,ñ£ ÔÛÒÿp¢ Ïev ¨H8ÿÄ4 H¬òÿ~ÿ`;ÿ¢yþ_ ÃþÈþR¢ w+þÌ¬Nÿ¦à híÿõ~Ðÿâ;Õ uÙÅ Hí ÜþZçÿ¼Ô@<eöÿUV ±m S K¶À wñà ¹íÿ¸eRë%Mÿý èöz <j³ Ã mBë}q; =(¤ ¯hð /»ÿ2 Âµÿúh a\\ÞÿÙÉÿËñvÿOC zÚÿõï *ÈþP%aÿ|p§ÿ$WÿÿñWNÿÌa±Ñÿ÷ãþcwSÿÔÆ³³ M¬þYÿÚ½§ ké;ÿ#!óþ,ppÿ¡OÌ¯\n (þhtä Ç_ÿ¾¨ÿ¥ê·c\' ·Ü6þÿÞ ¢Ûyþ?ï áf6ÿûö "$ Î2;a· «Øÿe+ÿû[ &_ "Ì&þ²SÿóÿL% j$þv¬ÿDºåÿk¡Õÿ.£Dÿªý » Ú ¥ÿ«#ö`\r ¥Ëu ÖkÀÿô{±dh ²òaÿûLÿÓM*úOFÿ?ôPieö =:î[Õ ;bÿ§TM .þ9¯Åÿ¹>¸ L@Ï ¬¯Ðþ¯J% Óþ}Â \nYQ ¨Ëeÿ+ÕÑëõ6 #âÿ	~F â}^þuÿ9øpæ0@ÿ¤\\¦àÖæÿ$x 7+ÿûõjb¥ Jkjþ56ÿZ²x{ÿôYrú=ÿþRM 9îZ_ßæ ì4/þg¤ÿyÏ$¹ÿKJ »e .0ÿïÒÿMìÿoMÌÿ=HaÿÇÙûÿ*×Ì Éÿ9æëdÆ I#þlÆÿ¶OÒÿRg öl° "<ÿJrþ¨ªNÿïÿ)¨ :y O³ÿçyÿ®Ñbÿóz¾ «¦Í Ôt0 lBÿ¢Þ¶w Õ\'ùÿþßäÿ·¥Æ ¾0 |Ðmÿw¯Uÿ	Ñy0«½ÿÃGÛ3ÿ¶[þ1H #võÿpºãÿ; ,£ rg<þÕ ¢\nqÿÂhH Ütÿ²O\\ ËúÕþ]Á½ÿÿ"þÔ¼ ÿeSÿÔÎ¦ åîIÿJÿ¨W× ¼ÿ¦I ðOÿ²ÓQÿËH£þÁ¨¥ ¤ÇþÿÌ AH[¦JfÿÈ* ÿÂqãÿBÐ åØdÿï \né>ÿ{\n²$®ÿwÛÇ-£¾ ¨* ¦9Æÿ ~¥ç ûldÿ=åyÿ:v LÏ \r"pþY¨ %Ðiÿ#É×ÿ(jeþïr (gâþönÿ?§: ð XÿIÿ^Y æ6 -­ O© sº÷ T@ CàýÿÏ½@ Q-¸6ÿWÔàÿ `Iÿ!ë4BPÿû®ÿ³% ê¤]þ]¯ý ÆEWÿàj. cÒ >¼rÿ,ê ©¯÷ÿmÿå¶\' À¥^þõeÙ ¿X` Ä^cÿjîþ5~ó ^eÿ. É||ÿÚ \r¦0ûíÿú|ÿjÿ¶\rÊ =§ ÙþÜ-ÿÈæÿ7AWÿ]¿aþrû  i\\Ï Ï\rþ20ÿºtÿÓ+á %"¢þ¤Ò*ÿD`ÿ¶ÖÿõuÿBÃ2 KSþP¤ 	¥$änã ñZ4Ô ßÿó9 qKö·¿ÿÕ¿Eÿæ ÃÄÿ«/ÿ@?j©ÖÿÏ®8XIÿ¶ ±ÿ¸5ÿ\nã¡ÿxØôÿIMé î;Aé FûØ)¸ÿ Ëp ý Wem,Rÿô5ÿ^èÿ;]\'ÿXÜÿNQ\r /üÿ rÿ]k\'ÿvÓ¹wÑÿãÛþXiìÿ¢nÿ$¦nÿ[ìÝÿBêt oôþ\né  ·þ¿ò Ú5þ)<Fÿ¨ìo y¹~ÿîÏÿ7~4 ÜÐþPÌ¤ÿCþÚ(lÿÊ¤ Ë!ÿ  %`¼ÿÀ1J m  o§\nþ[ÚÿËB­ÿÂâ Éýÿ®fy Í¿n 5Â Q(-þ#fÿlÆÿèÿüGº°nr uqM Å\\/ü 5è6ë .#½ÿìÔ `ÐþÈîÇÿ;¯¤ÿ+ç ÂÙ4ÿß 6²þUëÏ èÏ" 142ÿ¦qYÿ\n-Øÿ>­ o¥ö vs[ÿT< §Ë W\ró ä±qÿªæþüÿá+ Fçÿzi~þVöÿn%þÑ[ D> ä¥ÿ7Ýùþ²Ò[ SâþEº ]Òhþ­ çº& ½zÿû\rpÿin] ûHª ÀßÿÊá]ä Çþmª øeöÿ²|ÿ²þfþ7A }Ö´ ·` -uþ¿ù °Ëþ·6ÿê± eVÿ,{!Ñ ÀZ)þS}ÿÕ¬R ×© \r"  ÑdÿTùÅìÿÙºæ 1 °ÿovaÿíhë O;\\þEùÿ#¬JvD Þ|¥ÿ´B#ÿV®ö +Joÿ~Vÿäê[ òÕþE,ëÿÜ´# øÿf/\\ÿðÍfÿqæ«¹ÉÿÂöFÿz» FÇÿÿu?g Ah{ÿÔ6X Sóÿ5g ©´ ±1 o6§ Ã=×ÿl<*F ¹¢ÿÂ(ÿö&þ¾w&ÿ=w`¡Ûÿ*ËÝ±ò¤ÿõ\n tÄ  ]Íþ³ }íöÿ¢ÙÿW%þîÀ 		Á aâ &\n  ?ÿåHÒþ&\\ÿNÚÐh$TÿÁÿò¯=ÿ¿©.³ÿq¾þ}¬ Küþ×$ ÁÿEÿnv Ë]ù @þ&F tÞ ¡J{ ÁcOÿv;^ÿ=+± .¿ ÿ& 3<:bÿoÂM[ô (­\nû ËÑ2þlN ä´Z ®ú ®< )« tcRÿvÁÿ»­ÆþÚo8 ¹{Ø ù4 4´]ÿÉ	[ÿ8-¦þËÿ:èn 4ÓYÿý ¢	W· ,^zõ U¼«\\Æ  h _® Ýæ4÷÷ëÿ®5ÿ#ÌÿGãÖèRÂ 0ãÿªI¸ÿÆûüþ,p" eÿH¨» }ÿhaÿî¸¨ÿóhTÿØâÿí ¼P8ÿV©§ÿÂNÿÜ´ÿ\rÁ uÔÿà 1ô¯ Ác¯ÿcÿA>ÿÒ7ÿòôÿú XÙÿÏþûè .ûÿ«8¸ÿï3ê ÿþó\nÉÂ ?aK Òï¢ ÀÈuÖó GÞþ6(èÿL·oþWÿÖOÿØÄÔ þý |lÿ×K LÞ7þé¶? D«¿þ4oÞÿ\niMÿPªë Xÿ-çy à=öT ý.ÛÿïL! 1þæ%E Cþ^ ÓþÕ*ÿä÷þü°\rÿ\' þñôÿÿª-\nþýÞù Þr ÿ/ÿ´£³T^ÿYÑRþå4©ÿÕì Ö8äÿwÿpÉÁ S 5þB ¢ éa[ Nµx5ÿu_?ÿíu¹ ¿~ÿwé ·9a/É»ÿ§¥w-d~ bþ_ÿx6 Ñbh oþ¸ù ëØ. øÊÿ9_ òá£ é÷èÿG«ÿgô1ÿTg]ÿDyôRà\r )O+ÿùÎ§ÿ×4þÀ ÿ÷o< eJ&ÿ[Tþ\rÿÆç×þôÈ ßí Ó _@Îÿ>÷ÿéy]M ÍÌ4þQ½ ´Û^ Ì+þ¼¯Û obÿ?¢ÿÓ2Gþ5 -Sþ²RîÿTÿâÆ]ÿÉaÿxv#ÿr2çÿ¢åÿÓ r\'sÿÎÔ ÅÙ ÿt^þÇ×ÛÿKßùýtµÿè×hÿäöÿ¹uV  ï=íWÿ}þÌ¨ß .¨õ i ÜÔ¡ÿkEÿÚµÿñTÆÿzÓÿÿ¾±v `Y² ÿ0þz`iÿu6èÿ"~iÿÌC¦ è4ÿÓ 6 ,×þ3ì- ¾Djá ]-þìÿ=¡ ÜsÀ ìþo¨© à:?ÿ¤¼ RêKà ÑDnÙ¦Ù Fá¦»ÁÿXÿ\nÍ uÀ8& |l«×7ÿ_ýÔ ¨ÿö²þDJ è=`þi; !LÇ½°ÿ	hþKÆfÿép lÜÿræF Âÿ9¤þPÿ©ÄaU· FÞ;íêÿ`ÿè¯aÿyøþX#Â Û´üþJã ÃãI¸n¡ÿ1é¤5/ RyÿÁ¾: 0®uÿ  (\n3ÿð°ÿn9 uïevÿ6TL Í¸ÿ/HÿNpUÿÁ2B]4ÿi mHÿ:û #Ì , uþ2kÂ D¥ÿon¢ S(þLÖê :ØÍÿ«`ÿ(ãr°ãñ Fù·Tÿ<z÷þ	uÿ±®þI÷ ì¹~ÿ>÷ÿ-@8ÿ¡ô "98iÊS Ð g\nÿJAÿaPdÿÖ®!ÿ2JÿnþoT¬ TÇKþø;pÿØ²	·_ îþªÍÜ Ãå bLíÿâ[RÛ\'ÿá¾ÇÙÈyÿQ³ÿAÎ ²ÏWþúü.ÿhYný½ÿÖÿ õ6ÿ5·\\ÈÂÿ!qÑÿ ëj+ÿ§4è åÝ 3 úÝAWÿO{Ä AÄßÿL,UñD Ê·ùÿAÔÔÿ	!G;P ¯Â;ÿH	 d ô æÐ8 ;KþPÂÂ Èþ s ÷o]9ÿ:íÞÿz£l{+¾ÿû½ÎþP¶HÿÐöà<	 ¡Ï& m[ ØÓÿNn b£hÿPyÿ­²· h<RþÖ\rÿ`î!æÿ>ÿ3ÿÒÿ>ìþ7àÿr\'ô À¼úÿäL5 bTQÿ­Ë=þ27ÿÌë¿ 4Åô X+Óþ¿w ¼ç BQ¡ \\Á úãx {7â ¸H ¨\nþÿ)gÿ0Ê: ºQÿ¼ï ëµ½þÙ¼ÿJ0R .Úå ½ýû 2åÿÓ¿ôÿ©çzþV/½ÿ·ÿ%²ÿ3ý ÈN i2 <  £[þç» ÀOï f¤ÿÀRµgÿð	ê {¤ÿé ÿÊòò <ºõ ñÇÿàtþ¿}[ÿàVÏ y%çÿã	ÆÿïÿyèÙþKpR _9þ3ÖiÿÜaÇb$ Ñþ\nÔ4 Ù´7þÔªèÿØTÿú cþÎ) $F6ÄÉÿWt þë« £ê Ê´ Ð_ þ{] ·>K ë¶ ÌáÿÿÖÒÿsÿo 4 ýûÿ%¥þÓ j5þ*c Ù=þØ\\ÿÈÅpþ&Ç $üxþk©M {ÿÏKf £¯Ä ,ð xº°þ\rbLÿí|ñÿè¼ÿÈ`à Ì) ÐÈ\r á`ÿ¯Ä ÷Ð~ >¸ôþ«Q Us 6@-ÿr GÍ ã/ÚçB ýÑ ô­ÿvþÐÿ¹2ÿVpÏÿKq×?+ÿáþã>ÿÿÖþ-ÍÿWÅþÒR×ÿõø÷ÿøF á÷W ZxF Õõ\\ \râ /µ\\£iÿþè²=ÿæÿ1 äd=þtóûÿMK\\QÛÿL£þþÕö è%þa,d É%2Ôô9 ®«·ÿùJp ¦ ÞÝaÿó]IþûedÿØÙ]ÿþ»ÿ¾4ÿ;Ë±ÿÈ^4 srÿ¥h~câÿvôkÈ ÁZå yX  ]þ}ñÓÿíÿ¥ÿ¸àÿúÿqM ÷«ÿí±Ìÿ4ÿÂ¶r àê \nogÉ îN 4(ÿnÕ¥þ<Ïý >×E `a ÿ1-Ê xyÿë0Æ-"ÿ¶2Ò[ÿ.6 ¯{iÿÆNþCôïÿõ6gþN&òÿ\\ùþû®Wÿ? lÿ"f" Båvþ2c ©v ²y Zeæÿw D$è·7 ÿ`ÿ¡)Áÿ?Þ ³ó ÿdÿR5 9cðªÿæäþ1´Rÿ=R+ nõÙ Ç}= .ý4 ÅÛ ÓÁ 7yiþ· ©wªÿË²ÿ(¶ÿ¬\rÊÿA² Ï+ z5J¡0 ãÖþVóÿdVõDÿ=+T^ÿ¾<úþïvèÿÖ%qLkÿ]hdÎÿnäg¹ Ú12þMÿ¹N  ¡ÿaéÿÏÿ ¨  [«ÿþo÷ \'»ÿè u>Dÿ?Ø¼ÿëê þ9 ÿñ©<¿  ÿí{ÿ^Å^þtþÿ\\³aþya\\ÿªp ø øã P`m KÀJZâÿ¡jDÐrÿr*ÿþJJÿ÷³þy< FÈÿÖ(¡ÿ¡¼ÉÿAÿòsü >/Ê ´ÿþ7í ¥ºÿ\n©Â mÚÿp{ÿhßþ±lÿy%ÛÿMÿol[ÀK ®õÿì>ÿ+@ã­þ ízYºÿRþüT® Z³±óÖWÿg<¢ÿÐÿ ÎÛÿ^Ùÿïææÿtsþ¤k_ 3ÚØ}ÆÿÊþ_Dÿ7	]þ®ÿÌ¬` E n Õ&1þPÕ v}r FFCÿIÿz¹ÿó2þí( ÒÅAÿTB Ã~Z îìv»fÿÿ»Eæ 8Å\\ÕE^ÿPåÎæ Þoæ[éwÿ	Yb Jÿ3ö´ÿä±p:½lÿÂËíþÑÃ \n#Vâ £þ8Kÿ>Zt µ<© ¢ÔþQ§ ÍZpÿ!pã Su±àIÿ®ÙÿæÌOÿMèÿrNê à9~þ	1 ò¥h¶ÿ§{D áW\'ûl ÆÁyÏÿ¬F 2Dtÿe¯(ÿøié ¦Ë nÅÚ ×þþ¨âý ` g) ·Ëþd÷JÿÕ~ Ò, Çê/µ [6i¯ÿNþf_ Ïþ4|ìÿTG ÝóÓ ªÏ ÞjÇ ·T^þ\\È8ÿ¶s` ä a 7ûB f Êg øÿ3¸Ï ÊÆY 7Åáþ©_ùÿBADÿ¼ê~ ¦ßdpïô Â :\'¶ ô,þ¯D³ÿv°¢ ÙrÌþ­~Nÿ!Þÿ$[ÿó 	ë× «×õÿ¨/¤þñÏ E´ Dóq 5Hþû- n¨ DDOÿnF_þ®[ÿ!Î_ÿ)ÿ»þ#ÿpÿ	¹þ2% p1f¾ÿêó©<U J\'½ t1ï ­ÕÒ .¡lÿ% Äx¹ÿ"bÿÃ>ÿaæGÿf=L Ôìÿ¤a Æ; £Ä 8= µbÁ ûåÿb½ÿ.6ÎÿêRö ·g&m>Ì \nðà uÿx EÔ# ÐcvyÿÿHÂ uÅÿ} O Ö^Åÿ¹7ÿ>þNþR nf?ÿlR¡ÿi»ÔP\' <ÿ]ÿHº Òû¾§ÿä,þCè ÖùkþVÿ.° ½»ãÿÐ ÙÓt 2Qºþú @Æd  Îþ»¢Óÿ¼? þÐ1 UT¿ ñÀòÿ~ê¢¢ÿæaØ@~ ¾ß4 +ÿ\'½@î ¯Ä¹ bâÕÿôâ¯<  é´óÏÿEYe ¤þ¿Ñ [y   \'º{ÿ?sæÿ]§ÆÿÕÜÿ³ÿBz Ö Ùÿ->ÿjOþ3cÿWdçÿ¯èÿe¸ÿ®	} R%¡$rÿ0Þÿõº ®Ýþ?rÿ7 P ~ú³ìÚ- I ù½½ÀÿßÆÿHÿú5íþ ÓqþÕk8ÿ®ÿ`~0 Ám%¢^ Çùþ»ÿÍ1²þ]¤*ÿ+wëX·íÿÚÒÿkþ* æ\ncÿ¢ â Ûí[ ²Ë Ð2_þÎÐ_ÿ÷¿YþnêOÿ¥=ó zpÿöö¹þg{ écæÛ[üÿÇÞÿ³õéÿÓñê oúÀÿUT e:2ÿ­þw-3ÿvéþòZÖ ^ÛêÿbL\\þP6æ äçþ5ßÿq8vÿ«Òì 8ñÿºsÿå® 0, rr¦ÿIâÿÍYô ãKø­8 JxöþwÿQxÆÿzbÿñÝmÂNÿßñFÖÈ©ÿa¾/ÿ/g®ÿc\\Hþvé´ÿÁ#éþå ÿÞüÆ Ì+GÿÇT¬ f¾ oîaþæ(æ ãÍ@þÈá ¦Þ qE3ÿ §¸J àtþÐé Át~ÿÔÿ:Ì$3ÿè+ ëFµÿ@8þ©Tÿâ\rÿÈ2°ÿ4Õõþ¨Ña ¿G7 "N è:¹J½ ºþ@Eÿ¡Ëÿ°¿ çËþ£¶ ¡~ûþé B DÏB % ]r`þ\\÷ÿ,«E Êwÿ¼v2ÿSÿGR Fã  ëyµ) GåþÊÿ$ ) ?Iÿ"¶| yÝÿÌÕ)¬W Zÿm GkÈÿóf½ Ãþ.Xu Îã ¿nýÿmþU3ÿ±pØ"ÿÐÿyª r¦Pÿqðz è³ú Dn´þÒªw ßl¤ÿÏOéÿåâþÑbQÿOD ¹d ª¢ÿ¢kÿ9dÈµÿA¦¥Ì h§¨ ¤O ;F2ÿfw\rþã ¢³ÿ dÞ àÛ]Ãÿê }ÿîÎ/ÿabÿtnÿ`sM [ãèÿøþOÿ\\åþXÆ ÎK úMÎÿô{EÜ  §ÿíD§þÇ½ £«ÿ3¼ÿ_þâ³ µkÐÿRÿe-ÿÊá àH 0ÿÃ@ÎþíÚ jþý½éÿgÿÂaÿ ²-©þÆá \'0uÿjs a&µ /AÿSåþö& \\ïþ[c ¡o!ÿîÙòÿ¹ÃÿÕ¿ÿ)Ú © YTü«Fÿ£øËþ2´ÿ|LUûoP cBïÿí¶ÿÝ~þJÌcÿAwÿc8§ÿOøÿtäÿí+þEÿúñ[zÿÍùó Ô<ÿ0¶°0¿ÿËyþ-JÕÿ>Zþõ£æÿ¹jtÿS# !ÿP"> W®ÿ­eU Ê$Qþ EÌÿ@á» :Î^ V/ åVõ ?¾%\' mû ê ¢yÿtÎÿÅè¹ÿ·¾ÿIþÿòÿªZïÿaB»ÿõµþÞ4 õ3þË/N eØ I} þ`!ëÒIÿ+ÑXm zhäþªòË òÌÿÊéÿA G d_ N\r ûkv¶:}ÿ&lÿ½Ñÿ}q£[ÿyO¾ÿïlÿL/ø £äï o\n XKÿ×ëï §ÿ/lÿkÑ¼ éçcþÊÿ®#ÿnDÿEµ kfR fí \\$íÿÝ¢S7ÊÿêÿúÞ A^¨þõøÒÿ§lÉþÿ¡o Íþ \rt d°ÿ+×~ÿ±ÿO Cà%Îÿ>"níh¯ÿPoÿ®H Tå´þi³ @øÿé õC{þÚyÔÿ?_ÚÕÿ¶Rÿ0 ôrÑ¯Lÿµÿºåÿ¤oç½ wÊ¾ÿÚj@ÿDë?þ`¬ÿ»/×ûÿQTY D: ^q\\ÐÿaSþ	¼ ï	¤ <Í À£bÿ¸< Ù¶ m;xÿÀû ©Òðÿ%¬\\þÓõÿ³A4 ý\rs ¹®Îr¼ÿíZ­ +ÇÀÿXlq 4#L BÿÝÿñrÿ¾Ñè b2Ç ÕÿJ$5( Aÿ¬E ®íU c_) 8 \' ±ÿÈjÚþ¹DTÿ[º=þCÿ\rô¦ÿcrÆ Çn£ÿÁº |ïönD ë.Ô<k i*iæ  hÿÕ ä¢ÿ³dç{UÿÎßý`æ &bz ÖÍÿâ³ÿ Eÿq¢ÿ´ó¬ÿ½sÿ.ÜÿÕáÿ~E ¼+òF	 ZÌÿÿçª 8þ8}ÿ0³ÚÿO¶ýÿ&Ô¿)ë| ` ¾ Íù\'þ4`ÿÔ,ÿCÑÿüÿÛÿÆv le ²>dÿµì^þ¤ LpÿxfO ÊÀåÈ°× )@ôÿÎ¸N §-? # ÿ;ÿÌ	ÿÛ^åzp ½imÿ@ÐJÿû7âÆ ,LÑ MÿÒ.É«Eÿ,Óç ¾%àÿõÄ>ÿ©µÞÿ"Ó wñÅÿå#E(ÿ²â¡ ³Á ÛÂþ(Î3ÿç\\úCª ñ ªERÿyçÿ\\r ¸>æ áÉWÿ`¢ÿµòÜ ­»Ýâ>ªÿ8~Ùu\rãÿ³,ï ÿÝS ëÑÐ *¥ûQ |õÉþaÓÿSÖ¦ $	ÿø/ ZÛÿ¡Ù&þÔ?ÿBTÏ æYNzÿàÿRJ ²Ðÿº1ÿÞÒå¾ÿU¢4ÿ)TÿI{Tþ] w ×ÿÌÿñ4ÿä4} LÏ ×§úþ¯¤æ 7Ïim»õÿ¡,Ü)eÿ§^ ]ÖkÿvH þP=êÿy¯} ©û a\'þúÄ1ÿ¥³nþßF»ÿ}³ÿv°*\n® \\f ¨\r¡ÿ  úÅ´ÿË£,W $ ¡ÿ{ü ãP <X ÉÍMÿ\'?/ z ¶þÌ\'ÿpÿ$ÿÒêtþ52?ÿy«hÿ Û^ WRþç* ¥þVN& <BþË-ÿ.Äzù5¢ÿgþ×Òr ç þ©*ÿo-ö ÿGÌÿ$â  òÿáÕÿ÷.Øþõ· lüJÎ0ÿÍ6öÿÓÆ$ÿy#2 4ØÊÿ&þòI Cçÿ*/Ì Ntá¿ÿä :X± z¥åÿüSÉÿà§`±¸ÿòi³øÆð BËþ$/ -sÿw>þ Äáºþ{¬ U)ÿâo· Õç ;ÿî B!ÿöÿÑtÿhp X¡¬ S×æþ/o -&4-Ì mþéuÿó¾­þñìð Rìþ(ß¡ÿn¶áÿ{®ï ò3Ñ sþÙ¤üÿ7ET^ÿÿèI-Ôÿ`Å;þ`û! &ÇI@¬÷ÿut8ÿä >göå¤ÿôvÉþV ÿm"UÓº \nÁÁþzÂ± zîfÿ¢Ú« lÙ¡ª" °/µäÿ  K] Îbÿ:# ó¸þCuBÿæå{ É*n ä²þºlvÿ:ÿR©>ÿrsïÄ2ÿ­0ÁÿTÿþ_èI mã4þ¿\n (ÌþL4aÿ¤ë~ þ|¼ J¶y#ÿñþUÚÖÿTþQuÿ þBÝÿã\n<f Ð½u³\\ ÿxÇ Oþ¶	A Ú£© öÆÿk&N¯ÍÿÖúþ/Xÿ¤/Ìÿ+7ÿÏþtdÖ `KjÜ Ã ¬QÿÇ³4ÿ%TË ªp® [ Eôu\\ !¯ÿkÿû+þWÿÆêþyTÿÍe	 Hjþl ÿ½åº Á°ÿ®Ñ î éÖ~=âf 9£Æo3ÿ-ONsÒ\nÿÚ	ÿÆÿÓR»þPS æóÿ( MkOÿ·U\\±ÌÊ £GÿE¾ ¬3¼úÒ¬ÿÓòqYYÿ@Boþt* ¡\'ÿ6Pþ jÑsg|a Ýæbÿç ²ÀxþÙËÿ|O p÷ \\ú0£µÁÿ%/þ½¥ÿ.ð K )ÈþWyÕ qì -ú R lç áïwÿ§½ÿ»äÿn½" ^,Ì¢4Å N¼ñþ9 ô/Îd3 }kþÃM ýZÿ3% "w&ÿÅv ¼Ó tþõA4ÿ´ýn/±Ñ ¡cÿvÞÊ }³ü{6~ÿ9¿ 7ºy \nó ÍÓåÿ}ñþ¹ÿã¼ÿ|) ÿ"Îþ9S Ì%ÿ*`b wf¸¾ nRÚÿÈÌÀÿÉv uÌ  bÀÂy j¡øíX| Ô Í«Zÿø0Ø%æÿ|Ë þ¨ÿÖø p»ÿKïÿJãóÿúF Öx¢ §	³ÿ ÚMÑamQÿô!³ÿ949ÿA¬ÒÿùGÑÿ©î ½ÿ®þgþb! Læÿq4ÿ:Ô ¨×ÉÿøÌ×ßD ÿ9·þ/çy j¦ Q ¥+3 ç= 9_;þvbÿ?ì^¾úÿ©¹rú:ÿKia×ß qc£>p cj £Ã\n !Í¶ Ö®ÿ&çÿ5¶ß b*ÿ÷\r( ¼Ò± ÿÿ=þ-ÿYtþ~&r û2òþyÿÌù§þ¥ë× Ê±ó > ð¾n¯ÿ  %Òyÿ\' úTÿÈÏ 	_hÿô® è~ §{þÁÿèéïÕFpÿüt þòÞÜÿÍUã ¹: v÷?tM±ÿ>õÈþ?%ÿk5èþ2ÝÓ ¢Ûþ^+ ¶>¶þ NÈÿª ë¸ä ¯5þP:MÿÉ?Ä" ¸ «° y;Î &c\' ¬PMþ  º!ñþ^ýßÿ,rü l~9ÿÉ(\rÿ\'åÿ\'ïy3ÿø \nê®ÿvöþÈõ& E¡ò² q8 «i Xlÿ1*j û©B E] 9þ ¤o Z¼ZÿÌÅ (Õ2Ô`ÿX´þä|ÿ¸ö÷ AuVÿýfÒþþy$ sÿ<Ø  ;âa °G Ñ¡ ½T3þúH ÕTëÿ-Þà îÿª*5ÿN§u º (ÿ}±gÿEáB ãXK¬ ©-ã$Fÿ2	ÿÁ ·çþÚE2 ì8¡Õ* ,þå(ÿ1?#ÿ=õÿeÀþè§q h&y¹Ú yÓþwð# A½Ùþ»³¢ÿ »æ >øÿ<Na ÿ÷£ÿá;[ÿkG:ÿñ/!2uì Û±?þôZ³ #Â×ÿ½C2ÿ h½%ÿ¹9Â #>çÿÜøl ç² P[]eÿ\'ÿú² ìþ . Ì¼&þõs4ÿ¿qIþ¿lEÿEõË² ªcª Aøo %lÿ@%E  X>þYÿ¿Dàñ\'5 )Ëíÿ~ÂÿÝ*ýÿc aýßJs1ÿ¯Hÿ;°Ë |·ùääc Ïþ¨ÀÃÿÌ°þê« M%Uÿ!xÿÂãÖ: Õ»}ÿè.<ÿ¾t*þ²ÿ3>íþÌìÁ Âè< ¬"ÿ½¸þg_ÿé$þ)ÿÃ¦ võ- CÕÿÿ»¤ã  NÃ+Åá 0)þÄ<ÿßÇ üu©þâî ïk mµ¼ÿæp1þIªíÿç·ãÿPÜ ÂkÍe .4ÅÒ«$ÿXZÿ8 `»ÿÿ*NÈ þFFô}¨ ÌD|×F fBÈþ4ä uÜþËø{ 8®ÿº¤ÿ3èÐ ä+ÿùD¾? ìÓõ\\cXÖ÷¢ÞùÞ                 target_features+bulk-memory+bulk-memory-opt+call-indirect-overlong+\nmultivalue+mutable-globals+nontrapping-fptoint+reference-types+sign-ext');
}

function getBinarySync(file) {
  return file;
}

async function getWasmBinary(binaryFile) {

  // Otherwise, getBinarySync should be able to get it synchronously
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);

    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  // prepare imports
  var imports = {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  };
  return imports;
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  function receiveInstance(instance) {
    wasmExports = instance.exports;

    assignWasmExports(wasmExports);

    updateMemoryViews();

    return wasmExports;
  }

  // Prefer streaming instantiation if available.
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    return receiveInstance(result['instance']);
  }

  var info = getWasmImports();

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  var instantiateWasm = Module['instantiateWasm'];
  if (instantiateWasm) {
    return new Promise((resolve) => {
        instantiateWasm(info, (inst) => resolve(receiveInstance(inst)));
    });
  }

  wasmBinaryFile ??= findWasmBinary();
  var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
  var exports = receiveInstantiationResult(result);
  return exports;
}

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };
  var onPostRuns = [];

  var onPreRuns = [];

  

  var abortOnCannotGrowMemory = (requestedSize) => {
      abort('OOM');
    };
  
  /** @type {!Uint8Array} */
  var HEAPU8;
  var _emscripten_resize_heap = (requestedSize) => {
      HEAPU8.length;
      abortOnCannotGrowMemory();
    };

// End JS library code

// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.

{

  // Begin ATMODULES hooks
  if (Module['noExitRuntime']) Module['noExitRuntime'];
if (Module['print']) Module['print'];
if (Module['printErr']) err = Module['printErr'];
  // End ATMODULES hooks

  if (Module['arguments']) Module['arguments'];
  if (Module['thisProgram']) Module['thisProgram'];

  var preInit = Module['preInit'];
  if (preInit) {
    if (typeof preInit == 'function') Module['preInit'] = preInit = [preInit];
    // Written as a loop so that preInit functions that themselves add more
    // preInit functions.  Is this actually needed?
    while (preInit.length > 0) {
      preInit.shift()();
    }
  }
}

// Begin runtime exports
  // End runtime exports
  // Begin JS library exports
  // End JS library exports

// end include: postlibrary.js


// Imports from the Wasm binary.
var wasmMemory;


function assignWasmExports(wasmExports) {
  Module['_crypto_sign_ed25519_ref10_ge_scalarmult_base'] = wasmExports['crypto_sign_ed25519_ref10_ge_scalarmult_base'];
  Module['_malloc'] = wasmExports['malloc'];
  Module['_free'] = wasmExports['free'];
  Module['_curve25519_verify'] = wasmExports['curve25519_verify'];
  Module['_curve25519_pubkey_to_ed25519_pubkey'] = wasmExports['curve25519_pubkey_to_ed25519_pubkey'];
  Module['_ed25519_pubkey_to_curve25519_pubkey'] = wasmExports['ed25519_pubkey_to_curve25519_pubkey'];
  Module['_sph_sha512_init'] = wasmExports['sph_sha512_init'];
  Module['_xed25519_sign'] = wasmExports['xed25519_sign'];
  Module['_xed25519_verify'] = wasmExports['xed25519_verify'];
  Module['_curve25519_donna'] = wasmExports['curve25519_donna'];
  wasmExports['_emscripten_stack_restore'];
  wasmExports['_emscripten_stack_alloc'];
  wasmExports['emscripten_stack_get_current'];
  wasmMemory = wasmExports['memory'];
  wasmExports['__indirect_function_table'];
}

var wasmImports = {
  /** @export */
  emscripten_resize_heap: _emscripten_resize_heap
};


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

async function run() {

  preRun();

  var setStatus = Module['setStatus'];
  if (setStatus) {
    setStatus('Running...');
    // Yield to the event loop to allow the browser to paint "Running..."
    await new Promise((resolve) => setTimeout(resolve, 1));
    // Then we want to clear the status text, but only after the rest of this function runs.
    setTimeout(setStatus, 1, '');
  }

  if (ABORT) return;

  initRuntime();

  Module['onRuntimeInitialized']?.();

  postRun();
}

var wasmExports;

// In modularize mode the generated code is within a factory function so we
// can use await here (since it's not top-level-await).
wasmExports = await createWasm();
await run();

// end include: postamble.js

// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.

// end include: postamble_modularize.js



  return Module;
}

var _Curve25519_instances, _Curve25519_module, _Curve25519_getModule, _Curve25519_allocate, _Curve25519_readBytes, _Curve25519_keyPair, _Curve25519_sharedSecret, _Curve25519_sign, _Curve25519_verify, _Curve25519_curvePubKeyToEd25519PubKey, _Curve25519_ed25519PubKeyToCurvePubKey, _Curve25519_processKeys, _Curve25519_generateRandomBytes, _Curve25519_validatePrivKey, _Curve25519_validatePubKeyFormat;
const basepoint = new Uint8Array(32);
basepoint[0] = 9;
/** Wrapper around the compiled Curve25519 WebAssembly module for cryptographic operations. */
class Curve25519 {
    constructor() {
        _Curve25519_instances.add(this);
        _Curve25519_module.set(this, void 0);
        __classPrivateFieldSet(this, _Curve25519_module, __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_getModule).call(this), "f");
    }
    async ECDHE(pubKey, privKey) {
        pubKey = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_validatePubKeyFormat).call(this, pubKey);
        __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_validatePrivKey).call(this, privKey);
        return __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_sharedSecret).call(this, await __classPrivateFieldGet(this, _Curve25519_module, "f"), pubKey, privKey);
    }
    async Ed25519Sign(privKey, message) {
        __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_validatePrivKey).call(this, privKey);
        if (message === undefined)
            throw new Error("Invalid message");
        return __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_sign).call(this, await __classPrivateFieldGet(this, _Curve25519_module, "f"), privKey, message);
    }
    /**
     * Convert a Curve25519 public key to its 32-byte Ed25519 public key (with the
     * Edwards sign bit forced to zero, matching XEdDSA / libomemo-c). Used by
     * OMEMO 2 (urn:xmpp:omemo:2), which transfers the IdentityKey and builds the
     * authentication associated data in Ed25519 form. Accepts the 33-byte
     * 0x05-prefixed form or the raw 32-byte form.
     */
    async curvePubKeyToEd25519PubKey(pubKey) {
        const raw = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_validatePubKeyFormat).call(this, pubKey, true);
        return __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_curvePubKeyToEd25519PubKey).call(this, await __classPrivateFieldGet(this, _Curve25519_module, "f"), raw);
    }
    /**
     * Convert a 32-byte Ed25519 public key into the corresponding 32-byte Curve25519
     * (Montgomery u-coordinate) public key, for performing X25519/DH in OMEMO 2.
     * The returned key is the raw 32-byte form, without the 0x05 type prefix.
     */
    async ed25519PubKeyToCurvePubKey(edPubKey) {
        if (!(edPubKey instanceof ArrayBuffer) || edPubKey.byteLength !== 32) {
            throw new Error("Invalid Ed25519 public key: expected a 32-byte ArrayBuffer");
        }
        return __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_ed25519PubKeyToCurvePubKey).call(this, await __classPrivateFieldGet(this, _Curve25519_module, "f"), edPubKey);
    }
    async generateKeyPair() {
        const privKey = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_generateRandomBytes).call(this, 32);
        return await this.createKeyPair(privKey);
    }
    async createKeyPair(privKey) {
        __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_validatePrivKey).call(this, privKey);
        const raw_keys = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_keyPair).call(this, await __classPrivateFieldGet(this, _Curve25519_module, "f"), privKey);
        return __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_processKeys).call(this, raw_keys);
    }
    async calculateAgreement(pubKey, privKey) {
        __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_validatePubKeyFormat).call(this, pubKey);
        __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_validatePrivKey).call(this, privKey);
        return await this.ECDHE(pubKey, privKey);
    }
    async verifySignature(pubKey, msg, sig) {
        pubKey = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_validatePubKeyFormat).call(this, pubKey);
        if (msg === undefined) {
            throw new Error("Invalid message");
        }
        if (sig === undefined || sig.byteLength !== 64) {
            throw new Error("Invalid signature");
        }
        if (!__classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_verify).call(this, await __classPrivateFieldGet(this, _Curve25519_module, "f"), pubKey, msg, sig)) {
            throw new Error("Invalid signature");
        }
    }
    async calculateSignature(privKey, message) {
        __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_validatePrivKey).call(this, privKey);
        if (message === undefined) {
            throw new Error("Invalid message");
        }
        return await this.Ed25519Sign(privKey, message);
    }
}
_Curve25519_module = new WeakMap(), _Curve25519_instances = new WeakSet(), _Curve25519_getModule = async function _Curve25519_getModule() {
    return await Curve25519Module();
}, _Curve25519_allocate = function _Curve25519_allocate(module, bytes) {
    const address = module._malloc(bytes.length);
    module.HEAPU8.set(bytes, address);
    return address;
}, _Curve25519_readBytes = function _Curve25519_readBytes(module, address, length, array) {
    array.set(module.HEAPU8.subarray(address, address + length));
}, _Curve25519_keyPair = function _Curve25519_keyPair(module, privKey) {
    // Copy before clamping: `new Uint8Array(privKey)` would be a view over
    // the caller's buffer, so clamping in place would mutate their input and
    // alias it into the returned key. slice() gives us an independent buffer.
    const priv = new Uint8Array(privKey.slice(0));
    priv[0] &= 248;
    priv[31] &= 127;
    priv[31] |= 64;
    const publicKey_ptr = module._malloc(32);
    const privateKey_ptr = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_allocate).call(this, module, priv);
    const basepoint_ptr = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_allocate).call(this, module, basepoint);
    const err = module._curve25519_donna(publicKey_ptr, privateKey_ptr, basepoint_ptr);
    const res = new Uint8Array(32);
    __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_readBytes).call(this, module, publicKey_ptr, 32, res);
    module._free(publicKey_ptr);
    module._free(privateKey_ptr);
    module._free(basepoint_ptr);
    // Fail closed: a nonzero status means the output is undefined and must
    // not be used as a key. Memory is freed above so throwing leaks nothing.
    if (err) {
        throw new Error("curve25519_donna (key generation) failed");
    }
    return { pubKey: res.buffer, privKey: priv.buffer };
}, _Curve25519_sharedSecret = function _Curve25519_sharedSecret(module, pubKey, privKey) {
    const sharedKey_ptr = module._malloc(32);
    const privateKey_ptr = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_allocate).call(this, module, new Uint8Array(privKey));
    const basepoint_ptr = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_allocate).call(this, module, new Uint8Array(pubKey));
    const err = module._curve25519_donna(sharedKey_ptr, privateKey_ptr, basepoint_ptr);
    const res = new Uint8Array(32);
    __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_readBytes).call(this, module, sharedKey_ptr, 32, res);
    module._free(sharedKey_ptr);
    module._free(privateKey_ptr);
    module._free(basepoint_ptr);
    // Fail closed: a nonzero status means the agreement is undefined and
    // must not be used as a shared secret. Memory is freed above.
    if (err)
        throw new Error("curve25519_donna (ECDH) failed");
    // Reject the all-zero shared secret that low-order / small-subgroup
    // public keys yield (RFC 7748 §6.1 contributory-behaviour check). The
    // OR-accumulate runs over all 32 bytes regardless, so the check itself
    // leaks nothing about the secret.
    let nonzero = 0;
    for (let i = 0; i < res.length; i++) {
        nonzero |= res[i];
    }
    if (nonzero === 0) {
        throw new Error("Invalid public key: produced an all-zero shared secret");
    }
    return res.buffer;
}, _Curve25519_sign = function _Curve25519_sign(module, privKey, message) {
    const signature_ptr = module._malloc(64);
    const privateKey_ptr = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_allocate).call(this, module, new Uint8Array(privKey));
    const message_ptr = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_allocate).call(this, module, new Uint8Array(message));
    const err = module._xed25519_sign(signature_ptr, privateKey_ptr, message_ptr, message.byteLength);
    const res = new Uint8Array(64);
    __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_readBytes).call(this, module, signature_ptr, 64, res);
    module._free(signature_ptr);
    module._free(privateKey_ptr);
    module._free(message_ptr);
    // Fail closed: a nonzero status means the signature is undefined and
    // must not be emitted. Memory is freed above.
    if (err) {
        throw new Error("xed25519_sign failed");
    }
    return res.buffer;
}, _Curve25519_verify = function _Curve25519_verify(module, pubKey, message, sig) {
    const publicKey_ptr = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_allocate).call(this, module, new Uint8Array(pubKey));
    const signature_ptr = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_allocate).call(this, module, new Uint8Array(sig));
    const message_ptr = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_allocate).call(this, module, new Uint8Array(message));
    const res = module._curve25519_verify(signature_ptr, publicKey_ptr, message_ptr, message.byteLength);
    module._free(publicKey_ptr);
    module._free(signature_ptr);
    module._free(message_ptr);
    return res === 0;
}, _Curve25519_curvePubKeyToEd25519PubKey = function _Curve25519_curvePubKeyToEd25519PubKey(module, pubKey) {
    const edPubKey_ptr = module._malloc(32);
    const curvePubKey_ptr = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_allocate).call(this, module, new Uint8Array(pubKey));
    module._curve25519_pubkey_to_ed25519_pubkey(edPubKey_ptr, curvePubKey_ptr);
    const res = new Uint8Array(32);
    __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_readBytes).call(this, module, edPubKey_ptr, 32, res);
    module._free(edPubKey_ptr);
    module._free(curvePubKey_ptr);
    return res.buffer;
}, _Curve25519_ed25519PubKeyToCurvePubKey = function _Curve25519_ed25519PubKeyToCurvePubKey(module, edPubKey) {
    const curvePubKey_ptr = module._malloc(32);
    const edPubKey_ptr = __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_allocate).call(this, module, new Uint8Array(edPubKey));
    module._ed25519_pubkey_to_curve25519_pubkey(curvePubKey_ptr, edPubKey_ptr);
    const res = new Uint8Array(32);
    __classPrivateFieldGet(this, _Curve25519_instances, "m", _Curve25519_readBytes).call(this, module, curvePubKey_ptr, 32, res);
    module._free(curvePubKey_ptr);
    module._free(edPubKey_ptr);
    return res.buffer;
}, _Curve25519_processKeys = function _Curve25519_processKeys(raw_keys) {
    const origPub = new Uint8Array(raw_keys.pubKey);
    const pub = new Uint8Array(33);
    pub.set(origPub, 1);
    pub[0] = 5;
    return { pubKey: pub.buffer, privKey: raw_keys.privKey };
}, _Curve25519_generateRandomBytes = function _Curve25519_generateRandomBytes(size) {
    const array = new Uint8Array(size);
    globalThis.crypto.getRandomValues(array);
    return array.buffer;
}, _Curve25519_validatePrivKey = function _Curve25519_validatePrivKey(privKey) {
    if (!(privKey instanceof ArrayBuffer)) {
        throw new Error("Invalid private key: expected ArrayBuffer");
    }
    if (privKey.byteLength !== 32) {
        throw new Error("Invalid private key");
    }
}, _Curve25519_validatePubKeyFormat = function _Curve25519_validatePubKeyFormat(pubKey, allowRawKey = false) {
    if (!(pubKey instanceof ArrayBuffer)) {
        throw new Error("Invalid public key: expected ArrayBuffer");
    }
    if (pubKey.byteLength === 33 && new Uint8Array(pubKey)[0] === 5) {
        return pubKey.slice(1);
    }
    if (allowRawKey && pubKey.byteLength === 32) {
        return pubKey;
    }
    throw new Error("Invalid public key");
};

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
//# sourceMappingURL=libomemo.esm.js.map
