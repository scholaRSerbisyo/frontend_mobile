# 📱 scholaRSerbisyo Mobile

A React Native + Expo mobile application for scholars and attendees.

---

## 🚀 Getting Started

### 📦 Install Dependencies

```bash
npm install
```

### ▶️ Start Expo

```bash
npx expo start
```

### 📱 Requirements

- Install **Expo Go** on your mobile device (iOS or Android).
- Enable **local network access** on your device.

### 🌍 Environment Variables

Locate your wifi or LAN IP address for the API_URL
example - 192.168.1.139

use it to the constants

Locate the `constants.tsx` file from the constants folder:

```constants.tsx
const API_URL = {wifi or LAN ip-address}:8000/api;

export default API_URL;
```

---

## 🛠️ Tech Stack

- **React Native**
- **Expo**
- **REST API Integration**
- **Environment-based configuration**

---

## 🔍 Notes

- Make sure your Laravel API server is running before testing network requests.
- For real devices, use your computer’s local IP instead of `localhost`.
