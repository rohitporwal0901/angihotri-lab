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

## 2. Map Configuration (Leaflet + OpenStreetMap)
This app uses **Leaflet** and **OpenStreetMap** for map displays, which is **completely free** and does not require a credit card or API key.

- **Styles:** Leaflet CSS is imported in `src/styles.css`.
- **Logic:** Map initialization and markers are handled in `booking-details.component.ts`.

> [!NOTE]
> Google Maps was previously used but has been replaced to avoid the credit card/billing requirement for development.

---
### 🚨 Important Security Note
For production, you SHOULD restrict your Google Maps API key to only your app's domain in the Google Cloud Console to prevent unauthorized usage.
