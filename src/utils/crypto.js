const encoder = new TextEncoder();
const decoder = new TextDecoder();

const PBKDF2_SALT = 'SpendMetra::Encryption::v1';
const PBKDF2_ITERATIONS = 210000;

function toBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(base64Value) {
  const binary = atob(base64Value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveEncryptionKey(userId) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(`SpendMetra::${userId}`),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(PBKDF2_SALT),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256
    },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptPayload(userId, value) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto API is not available in this environment.');
  }

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveEncryptionKey(userId);
  const plaintext = encoder.encode(JSON.stringify(value));

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext
  );

  return {
    v: 1,
    iv: toBase64(iv),
    ct: toBase64(new Uint8Array(encryptedBuffer))
  };
}

export async function decryptPayload(userId, payload) {
  if (!payload?.iv || !payload?.ct) {
    return null;
  }

  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto API is not available in this environment.');
  }

  const key = await deriveEncryptionKey(userId);
  const iv = fromBase64(payload.iv);
  const ciphertext = fromBase64(payload.ct);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return JSON.parse(decoder.decode(decryptedBuffer));
}
