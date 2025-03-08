const crypto = require('crypto');

// Generate Ed25519 key pair
const keyPair = crypto.generateKeyPairSync('ed25519');

// Extract raw public key (32 bytes)
const publicKeyRaw = keyPair.publicKey.export({ format: 'der', type: 'spki' }).slice(-32);

// Extract raw private key (32 bytes) from the 64-byte secret key
const privateKeyRaw = keyPair.privateKey.export({ format: 'der', type: 'pkcs8' }).slice(-64, -32);

// Convert buffer to BigInt
const bufferToBigInt = (buffer) => BigInt('0x' + buffer.toString('hex'));

const publicKeyBigInt = bufferToBigInt(publicKeyRaw);
const privateKeyBigInt = bufferToBigInt(privateKeyRaw);

console.log('Public Key (BigInt):', publicKeyBigInt);
console.log('Private Key (BigInt):', privateKeyBigInt);

const generateHash = () => {
  return crypto.createHash('sha256').update(crypto.randomBytes(32)).digest();
};
const messageHash = generateHash();
console.log('Message Hash (hex):', messageHash.toString('hex'));

// Sign the message hash
const signature = crypto.sign(null, messageHash, keyPair.privateKey);
console.log('Signature (hex):', signature.toString('hex'));

// Verify the signature
const isValid = crypto.verify(null, messageHash, keyPair.publicKey, signature);
console.log('Signature Valid:', isValid);
