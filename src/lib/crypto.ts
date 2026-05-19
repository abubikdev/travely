import CryptoJS from "crypto-js";
import { STORAGE_KEYS } from "./constants";

function getOrCreateDeviceSalt(): string {
  if (typeof window === "undefined") return "server";
  let salt = localStorage.getItem(STORAGE_KEYS.DEVICE_SALT);
  if (!salt) {
    salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
    localStorage.setItem(STORAGE_KEYS.DEVICE_SALT, salt);
  }
  return salt;
}

export function encryptApiKey(apiKey: string): string {
  const salt = getOrCreateDeviceSalt();
  return CryptoJS.AES.encrypt(apiKey, salt).toString();
}

export function decryptApiKey(encrypted: string): string | null {
  try {
    const salt = getOrCreateDeviceSalt();
    const bytes = CryptoJS.AES.decrypt(encrypted, salt);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch {
    return null;
  }
}

export function isValidOpenAIKeyFormat(key: string): boolean {
  return /^sk-[a-zA-Z0-9_-]{20,}$/.test(key.trim());
}
