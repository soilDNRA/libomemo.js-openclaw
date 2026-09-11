type BinaryData = string | ArrayBuffer | Uint8Array;
declare function toString(thing: BinaryData): string;
declare function toArrayBuffer(thing: BinaryData | undefined): ArrayBuffer | undefined;
declare function normalizeBuffer(input: BinaryData, encoding: string): Uint8Array;
declare function isEqual(a: BinaryData, b: BinaryData): boolean;
declare const util: {
    toString: typeof toString;
    toArrayBuffer: typeof toArrayBuffer;
    normalizeBuffer: typeof normalizeBuffer;
    isEqual: typeof isEqual;
};

declare enum ChainType {
    SENDING = 1,
    RECEIVING = 2
}
declare enum BaseKeyType {
    OURS = 1,
    THEIRS = 2
}
interface KeyPair {
    pubKey: ArrayBuffer;
    privKey: ArrayBuffer;
}
type PreKey = {
    keyId: number;
    keyPair: KeyPair;
};
type PublicPreKey = {
    publicKey?: ArrayBuffer;
    keyId: number;
};
interface SignedPreKey {
    keyId: number;
    keyPair: KeyPair;
    signature: ArrayBuffer;
}
/**
 * The curve operations a backend must implement so `internalCrypto` can run them
 * either on the main thread (local WebAssembly) or off it (a Web Worker).
 *
 * The `internalCrypto` layer fills defaults (e.g. generates the private key for a keypair)
 * before delegating, so no backend needs its own RNG and the two backends stay interchangeable.
 */
/**
 * Where curve operations are running, reported to `startWorker`'s `onStatusChange`
 * whenever that changes.
 */
interface WorkerStatus {
    offloaded: boolean;
    error?: Error;
}
interface StartWorkerOptions {
    /**
     * Per-operation reply timeout in milliseconds (default 10000). Pass 0 to
     * disable the timeout.
     */
    timeout?: number;
    /**
     * Called when operations start or stop running in the worker. Edge-triggered:
     * it fires on a change, not per operation, and not for `stopWorker()`, which
     * the caller already knows about. Throwing from it is contained and ignored.
     */
    onStatusChange?: (status: WorkerStatus) => void;
}

/**
 * The OMEMO protocol versions this library supports, identified by their XML
 * namespace.
 *
 * - `"eu.siacs.conversations.axolotl"` — XEP-0384 v0.3.0 (the libsignal "v3"
 *   wire format).
 * - `"urn:xmpp:omemo:2"` — the latest XEP-0384.
 */
type OMEMOVersion = "eu.siacs.conversations.axolotl" | "urn:xmpp:omemo:2";
declare enum Direction {
    SENDING = 1,
    RECEIVING = 2
}
interface EncryptResult {
    type: number;
    body: string;
    registrationId?: number;
    /**
     * omemo:2 only: whether `body` is an `OMEMOKeyExchange` (`true`) or a plain
     * `OMEMOAuthenticatedMessage` (`false`). Consumers place this in the `kex`
     * attribute of the `<key>` element.
     */
    kex?: boolean;
}
/**
 * The result of decrypting a (pre-key or regular) ratchet message.
 *
 * `ratchet` exposes the Double Ratchet state of the decrypted message, which
 * consumers need to implement protocol rules such as the OMEMO heartbeat
 * (XEP-0384: "the first message for a given ratchet key with a counter of 53
 * or higher" must trigger a heartbeat).
 */
interface DecryptResult {
    /** The decrypted plaintext. */
    plaintext: ArrayBuffer;
    ratchet: {
        /** The message counter (index within the sender's current chain). */
        counter: number;
        /**
         * The sender's ratchet (DH) public key for this message, in the
         * internal 33-byte `0x05`-prefixed curve form.
         */
        key: ArrayBuffer;
    };
}
interface RatchetState {
    rootKey: ArrayBuffer;
    lastRemoteEphemeralKey: ArrayBuffer;
    previousCounter: number;
    ephemeralKeyPair: KeyPair;
}
interface OldRatchetEntry {
    added: number;
    ephemeralKey: ArrayBuffer;
}
interface PreKeyBundle {
    identityKey: ArrayBuffer;
    signedPreKey: {
        publicKey: ArrayBuffer;
        signature: ArrayBuffer;
        keyId: number;
    };
    preKey?: PublicPreKey;
    registrationId: number;
}
type SessionState = {
    registrationId: number;
    /** The OMEMO protocol version this session speaks. Absent ⇒ legacy 0.3.0. */
    protocolVersion?: OMEMOVersion;
    /** omemo:2 session-fixed associated data (`IK_A ‖ IK_B`, Ed25519). */
    ad?: ArrayBuffer;
    currentRatchet: RatchetState;
    indexInfo: {
        baseKey?: ArrayBuffer;
        baseKeyType?: BaseKeyType;
        closed: number;
        /** Remote identity key, always the internal 33-byte 0x05-Curve form. */
        remoteIdentityKey: ArrayBuffer;
        /** omemo:2 only: the published 32-byte Ed25519 form, used for trust. */
        remoteIdentityKeyEd?: ArrayBuffer;
    };
    oldRatchetList: OldRatchetEntry[];
    pendingPreKey?: {
        signedKeyId: number;
        baseKey: ArrayBuffer;
        preKeyId?: number;
    };
    [ephemeralKey: string]: unknown;
};
interface SerializedSessionState {
    registrationId: number;
    protocolVersion?: OMEMOVersion;
    ad?: string;
    currentRatchet: {
        rootKey: string;
        lastRemoteEphemeralKey: string;
        previousCounter: number;
        ephemeralKeyPair: {
            pubKey: string;
            privKey: string;
        };
    };
    indexInfo: {
        baseKey?: string;
        baseKeyType?: BaseKeyType;
        closed: number;
        remoteIdentityKey: string;
        remoteIdentityKeyEd?: string;
    };
    oldRatchetList: {
        added: number;
        ephemeralKey: string;
    }[];
    pendingPreKey?: {
        signedKeyId: number;
        baseKey: string;
        preKeyId?: number;
    };
    [ephemeralKey: string]: unknown;
}
type KeyPairWrapper = {
    keyPair: KeyPair;
};
interface IdentityKeyError extends Error {
    identityKey: ArrayBuffer;
}
type KeyId = number | string;
/**
 * Persistent storage backend for OMEMO session state.
 *
 * Parameters named `address` accept a serialized {@link OMEMOAddress} in the
 * form `"${name}.${deviceId}"` — use `OMEMOAddress.toString()` to produce one.
 * Parameters named `jid` accept the bare JID only (no device ID suffix).
 */
interface OMEMOStore {
    store: Record<string, unknown>;
    put(key: string, value: unknown): void;
    get<T = unknown>(key: string, defaultValue?: T): T | undefined;
    remove(key: string): void;
    isTrustedIdentity(address: string, identityKey: ArrayBuffer, direction: Direction): Promise<boolean> | boolean;
    loadIdentityKey(address: string): Promise<ArrayBuffer | undefined> | ArrayBuffer | undefined;
    saveIdentity(address: string, identityKey: ArrayBuffer): Promise<boolean> | boolean;
    loadPreKey(keyId: KeyId): Promise<KeyPairWrapper | undefined>;
    storePreKey(keyId: KeyId, keyPair: KeyPair): Promise<void> | void;
    removePreKey(keyId: KeyId): Promise<void> | void;
    loadSignedPreKey(keyId: number): Promise<KeyPairWrapper | undefined> | KeyPairWrapper | undefined;
    storeSignedPreKey(keyId: KeyId, keyPair: KeyPair): Promise<void> | void;
    removeSignedPreKey(keyId: KeyId): Promise<void> | void;
    loadSession(address: string): Promise<string | undefined> | string | undefined;
    removeAllSessions(jid: string): Promise<void> | void;
    removeSession(address: string): Promise<void> | void;
    storeSession(address: string, record: string): Promise<void> | void;
    getIdentityKeyPair(): Promise<KeyPair | undefined> | KeyPair | undefined;
    getLocalRegistrationId(): Promise<number | undefined> | number | undefined;
}

/** Helpers for generating cryptographic keys for OMEMO. */
declare const KeyHelper: {
    generateIdentityKeyPair(): Promise<KeyPair>;
    generateRegistrationId(): number;
    generateSignedPreKey(identityKeyPair: KeyPair, signedKeyId: number, version: OMEMOVersion): Promise<SignedPreKey>;
    generatePreKey(keyId: KeyId): Promise<PreKey>;
};

/** Identifies a specific OMEMO device by name and device ID. */
declare class OMEMOAddress {
    #private;
    constructor(name: string, deviceId: number);
    getName(): string;
    getDeviceId(): number;
    toString(): string;
    equals(other: unknown): boolean;
    static fromString(encodedAddress: string): OMEMOAddress;
}

/** Manages session state persistence, including serialization, deserialization, and lifecycle. */
declare class SessionRecord {
    #private;
    sessions: Record<string, SessionState>;
    version: string;
    static deserialize(serialized: string): SessionRecord;
    static deserializeSession(serialized: SerializedSessionState): SessionState | null;
    static isChainLike(value: unknown): boolean;
    static isSessionOpen({ indexInfo }: SessionState | SerializedSessionState): boolean;
    serialize(): string;
    hasOpenSession(): boolean;
    getSessionByBaseKey(baseKey: ArrayBuffer | string | Uint8Array): SessionState | undefined;
    getSessionByRemoteEphemeralKey(remoteEphemeralKey: ArrayBuffer): SessionState | undefined;
    getOpenSession(): SessionState | undefined;
    detectDuplicateOpenSessions(): void;
    updateSessionState(session: SessionState): void;
    getSessions(): SessionState[];
    archiveCurrentState(): void;
    promoteState(session: SessionState): void;
    deleteAllSessions(): void;
}

/** A decoded incoming key-exchange message. */
interface ParsedKeyExchange {
    registrationId?: number;
    preKeyId?: number;
    signedPreKeyId: number;
    /** Remote base/ephemeral key, normalised to the internal 33-byte curve form. */
    baseKey: ArrayBuffer;
    /** Remote identity key, internal 33-byte curve form (for DH/storage). */
    identityKey: ArrayBuffer;
    /** Remote identity key in 32-byte Ed25519 form (omemo:2, for the AD). */
    identityKeyEd?: ArrayBuffer;
    /** The framed ratchet message to decrypt. */
    message: ArrayBuffer;
}

/**
 * Establishes a new OMEMO session from a PreKey bundle.
 */
declare class SessionBuilder {
    #private;
    constructor(store: OMEMOStore, remoteAddress: OMEMOAddress | string, version: OMEMOVersion);
    /** Process a PreKey bundle to establish a new session. */
    processPreKey(device: PreKeyBundle): Promise<void>;
    processV3(record: SessionRecord, message: ParsedKeyExchange): Promise<number | undefined>;
}

/** Encrypts and decrypts messages for established OMEMO sessions. */
declare class SessionCipher {
    #private;
    constructor(store: OMEMOStore, remoteAddress: OMEMOAddress | string, version: OMEMOVersion);
    /** Encrypt a message for the remote device. */
    encrypt(buffer: ArrayBuffer | string | Uint8Array): Promise<EncryptResult>;
    /** Decrypt a regular (non-key-exchange) message using an existing session. */
    decryptWhisperMessage(buffer: string | ArrayBuffer | Uint8Array, encoding: string): Promise<DecryptResult>;
    /** Decrypt a key-exchange message, establishing a new session if needed. */
    decryptPreKeyWhisperMessage(buffer: string | ArrayBuffer | Uint8Array, encoding: string): Promise<DecryptResult>;
    getRemoteRegistrationId(): Promise<number | undefined | null>;
    hasOpenSession(): Promise<boolean>;
    closeOpenSessionForDevice(): Promise<void>;
    deleteAllSessionsForDevice(): Promise<void>;
}

/** Generates fingerprints for identity verification. */
declare class FingerprintGenerator {
    #private;
    constructor(iterations: number);
    /**
     * Create a fingerprint string for two parties.
     * Returns a sorted concatenation of both parties' fingerprint codes.
     */
    createFor(localIdentifier: string, localIdentityKey: ArrayBuffer, remoteIdentifier: string, remoteIdentityKey: ArrayBuffer): Promise<string>;
}

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
declare function startWorker(url: string, options?: StartWorkerOptions): void;
/** Stop offloading and revert curve operations to the local backend. */
declare function stopWorker(): void;

declare const curvePubKeyToEd25519PubKey: (pubKey: ArrayBuffer) => Promise<ArrayBuffer>;
declare const ed25519PubKeyToCurvePubKey: (edPubKey: ArrayBuffer) => Promise<ArrayBuffer>;

/**
 * Reference in-memory implementation of the OMEMOStore interface for testing and development.
 * */
declare class InMemoryStore implements OMEMOStore {
    store: Record<string | number, unknown>;
    constructor();
    getIdentityKeyPair(): KeyPair | undefined;
    getLocalRegistrationId(): number | undefined;
    put(key: string, value: unknown): void;
    get<T = unknown>(key: string, defaultValue?: T): T | undefined;
    remove(key: string): void;
    isTrustedIdentity(address: string, identityKey: ArrayBuffer, _direction: Direction): boolean | Promise<boolean>;
    loadIdentityKey(address: string): ArrayBuffer | undefined;
    saveIdentity(address: string, identityKey: ArrayBuffer): boolean;
    loadPreKey(keyId: number): Promise<{
        keyPair: KeyPair;
    }> | Promise<undefined>;
    storePreKey(keyId: number, keyPair: KeyPair): void;
    removePreKey(keyId: number): void;
    loadSignedPreKey(keyId: number): {
        keyPair: KeyPair;
    } | undefined;
    storeSignedPreKey(keyId: number, keyPair: KeyPair): void;
    removeSignedPreKey(keyId: number): void;
    loadSession(address: string): string | undefined;
    storeSession(address: string, record: string): void;
    removeSession(address: string): void;
    removeAllSessions(jid: string): void;
}

export { BaseKeyType, ChainType, Direction, FingerprintGenerator, InMemoryStore, KeyHelper, OMEMOAddress, SessionBuilder, SessionCipher, SessionRecord, curvePubKeyToEd25519PubKey, ed25519PubKeyToCurvePubKey, startWorker, stopWorker, util };
export type { DecryptResult, EncryptResult, IdentityKeyError, KeyId, KeyPair, OMEMOStore, OMEMOVersion, PreKey, PreKeyBundle, PublicPreKey, SignedPreKey, StartWorkerOptions, WorkerStatus };
