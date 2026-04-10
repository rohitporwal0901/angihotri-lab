# How to get API Keys for Agnihotri Lab App

## 1. Firebase Configuration (Firestore, Auth, RTDB)
1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add Project"** and follow the steps (name it `agnihotri-lab`).
3.  Once the project is ready, click on the **Web icon (`</>`)** to register a new web app.
4.  After naming the app, you will see a `firebaseConfig` object.
5.  Copy the values (`apiKey`, `authDomain`, `projectId`, etc.) from that object.
6.  Open `src/environments/environment.ts` in this project and paste the values into the `firebase` object.

**Enable Services in Firebase Console:**
- **Authentication:** Go to Build > Authentication > Get Started. Enable **Email/Password** and **Google** (you'll need to select a support email).
- **Firestore:** Go to Build > Firestore Database > Create Database. Choose "Start in Test Mode" (or use the rules provided in `firestore.rules`).
- **Realtime Database:** Go to Build > Realtime Database > Create Database.

## 2. Google Maps API Key
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Select or create a project.
3.  Go to **APIs & Services > Library**.
4.  Search for and Enable:
    - **Maps JavaScript API**
    - **Places API** (Required for Address Autocomplete)
    - **Geolocation API**
5.  Go to **APIs & Services > Credentials**.
6.  Click **"Create Credentials" > "API Key"**.
7.  Copy this key and paste it into:
    - `src/environments/environment.ts` under `googleMapsApiKey`.
    - `src/index.html` in the script tag: `key=YOUR_API_KEY`.

---
### 🚨 Important Security Note
For production, you SHOULD restrict your Google Maps API key to only your app's domain in the Google Cloud Console to prevent unauthorized usage.
