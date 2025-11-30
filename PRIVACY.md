# Privacy Policy for Mind Vault

**Last Updated:** November 30, 2025

**Mind Vault** ("we", "our", or "us") is dedicated to protecting your privacy and security. This Privacy Policy explains how our Chrome Extension handles your data.

## 1. Zero Data Collection (Stateless Architecture)
Mind Vault operates as a **stateless** application.
* We **do not** collect, store, or transmit any personal data.
* We **do not** have a database.
* We **do not** use cookies or tracking pixels.
* We **do not** have access to your "Master Seed" or the passwords you generate.

All calculations (SHA-256 hashing) are performed locally on your device using the Web Crypto API. Once you close the extension popup, all data entered is immediately cleared from your browser's temporary memory.

## 2. Permissions and Usage

Mind Vault requests the minimum permissions necessary to function:

* **`clipboardWrite`**: This permission is required solely to allow the extension to copy the generated password to your clipboard when you click the "Copy" button. The extension does not read your clipboard history.

## 3. Third-Party Services
Mind Vault functions 100% offline and does not connect to any external third-party servers, analytics services, or advertising networks.

## 4. Your Responsibility
Since Mind Vault does not store your data, we cannot recover your "Master Seed" or passwords if you forget them. You are solely responsible for remembering your Master Seed and the parameters used for each service.

## 5. Contact Us
If you have any questions about this Privacy Policy or the security of Mind Vault, you may contact us via our GitHub Repository or at:
mindvaultdev@yourmindvault.com
