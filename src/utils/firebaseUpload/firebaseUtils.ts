import { config } from "../../config/config.js";

export const getFirebaseImageUrl = (imagePath: string | null) => {
  if (!imagePath) return null;
  return `https://storage.googleapis.com/${config.firebase.firebaseImgUrl}/${imagePath}`;
};
