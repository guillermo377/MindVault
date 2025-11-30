# 🧠 Mind Vault - Stateless Password Generator

> **"Your mind is your fortress."**

**Mind Vault** is a browser extension that generates unbreakable, unique passwords using **SHA-256** cryptography. It is completely **stateless**, meaning it never stores, saves, or transmits your passwords.

![Mind Vault Logo](MindVault_128.png)

## 🛡️ Why Mind Vault?

Traditional password managers store your keys in a database (cloud or local). If that database is hacked, your secrets are exposed.

**Mind Vault works differently:**
* **No Database:** Passwords are calculated mathematically on-the-fly.
* **No Cloud:** Everything happens locally in your browser using the Web Crypto API.
* **Deterministic:** `Master Seed` + `Service Name` will *always* generate the same password.

## ✨ Key Features

* **Cloudless Sync:** Access your passwords on any device without internet. Since the math is deterministic, you get the same password everywhere without needing a cloud account.
* **Military-Grade Encryption:** Uses **SHA-256** to hash your inputs.
* **Stateless & Offline:** Zero data storage. It works completely offline.
* **"Safe Set" Characters:** Generates passwords compatible with 99% of websites (letters, numbers, and standard symbols like `!@#$%*-_+=`).
* **Anti-Typo Safety:** Includes a visibility toggle ("Eye" icon) that auto-hides after **5 seconds** to prevent shoulder surfing.
* **Smart Clipboard:** Copies the password and encourages "copy & forget".
* **Multi-Language:** Native support for **English 🇺🇸** and **Spanish 🇪🇸**.

## 🚀 Installation

### From the Chrome Web Store
*(Link pending - Coming soon!)*

### For Developers (Manual Installation)
1.  **Clone** this repository or download the ZIP.
2.  Open Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** (top right switch).
4.  Click **Load unpacked**.
5.  Select the folder containing the `manifest.json` file.

## 🛠️ How it Works (The Math)

The generation process is transparent and auditable:

1.  **Input:** Takes your `Master Seed` and the `Service Name` (e.g., "gmail.com").
2.  **Salting:** Concatenates them: `Seed || Service`.
3.  **Hashing:** Applies **SHA-256** to the result string.
4.  **Mapping:** Converts the resulting hash bytes into a human-readable string using a custom "Safe Character Set" to ensure strong entropy.

## 🔒 Security Architecture

* **Permissions:** Minimal permissions required (`clipboardWrite`). We do not ask for "Read/Write data on all websites".
* **Local Processing:** All logic runs in `popup.js`. No external API calls are made.
* **Memory Hygiene:** The extension popup is destroyed immediately after use, clearing variables from memory.

## ☕ Support the Project

Mind Vault is free and open source. If you find it useful, you can support its development:

[**💙 Donate via PayPal**](https://paypal.me/MindVaultDev)

## 📄 License

This project is licensed under the **GPLv3 License** - see the LICENSE file for details.

---
*Created with ❤️ for privacy enthusiasts.*
