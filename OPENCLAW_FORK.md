# OpenClaw reproducible-build fork

Canonical source: <https://github.com/soilDNRA/libomemo.js-openclaw>

The maintained release is the annotated tag `v3.0.0-openclaw.1`. Consumers
must pin its peeled commit rather than a branch or moving tag name.

This branch starts from the signed upstream `v3.0.0` source commit
`d5ba2a36abaa57662c27ac1c27c79cc1c3a8ada9`.

The historical generated WebAssembly committed in that tag cannot be recreated
exactly because the original Emscripten version and build environment were not
recorded. This branch deliberately does not claim to reproduce those bytes.
Instead, it provides a deterministic build from the tagged source with pinned
Emscripten `6.0.9` and explicitly exports the `HEAPU8` runtime view required by
`src/curve.ts`.

On Linux aarch64 with Node.js 22.23.2, two clean recompilations produced the
same generated `build/curve25519_compiled.js` SHA-256:

`d9bb3b21af7ef1225de03ce3897e95fdb0657df403c9c2823918b8ac7c68b526`

Verification recorded on 2026-09-10:

- typecheck, lint, and distribution build passed;
- Node suite: 286 passed, 3 skipped, repeated twice;
- Chromium suite: 297 passed, 1 failed because a worker-timeout fallback test
  did not observe an expected `console.error`; fallback key generation itself
  succeeded.

The source and generated artefact remain GPL-3.0 licensed. Any distributed
OpenClaw package using the generated artefact must include the corresponding
source, this patch, licence notices, and reproducible build instructions.
