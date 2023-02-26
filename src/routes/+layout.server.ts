/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  return {
    secrets: {
      // FIREBASE_URL: process.env.FIREBASE_URL,
      // FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      // DATA_SERVICE_URL: process.env.DATA_SERVICE_URL
      FIREBASE_URL: process.env.FIREBASE_URL || "one-track-333621.firebaseapp.com",
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || "AIzaSyDrRlI8JZLxl-a0lLDA09HsTCyyAY5gNWA",
      DATA_SERVICE_URL: process.env.DATA_SERVICE_URL || "https://app.one-track.io/api/"
    }
  };
}
export const prerender = false;