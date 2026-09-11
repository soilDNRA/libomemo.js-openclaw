// Shim for Emscripten: provide document in worker context
if (typeof document === 'undefined') { self.document = { baseURI: self.location.href }; }
(function () {
    'use strict';

    var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
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
      var require = createRequire((_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('libomemo-worker.js', document.baseURI).href));

    }

    var _scriptName = (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('libomemo-worker.js', document.baseURI).href);

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

    const curve = new Curve25519();
    const ALLOWED_METHODS = new Set([
        "createKeyPair",
        "calculateAgreement",
        "calculateSignature",
        "verifySignature",
        "curvePubKeyToEd25519PubKey",
        "ed25519PubKeyToCurvePubKey",
    ]);
    /**
     * Reduce a thrown value to a non-empty message string.
     */
    function toErrorMessage(error) {
        if (error instanceof Error && error.message)
            return error.message;
        if (typeof error === "string" && error)
            return error;
        return "curve25519 worker operation failed";
    }
    self.onmessage = (e) => {
        const { id, methodName, args } = e.data;
        if (!ALLOWED_METHODS.has(methodName)) {
            postMessage({ id, ok: false, error: "Unsupported method." });
            return;
        }
        const method = curve[methodName];
        if (typeof method !== "function") {
            postMessage({ id, ok: false, error: "Unsupported method." });
            return;
        }
        Promise.resolve(method.bind(curve)(...args))
            .then((result) => {
            // `ok: true` is what makes success explicit rather than inferred from
            // the absence of an error. See the manager's #onMessage.
            postMessage({ id, ok: true, result });
        })
            .catch((error) => {
            postMessage({ id, ok: false, error: toErrorMessage(error) });
        });
    };

})();
//# sourceMappingURL=libomemo-worker.js.map
