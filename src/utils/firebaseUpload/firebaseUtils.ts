export const getFirebaseImageUrl = (imagePath: string | null) => {
  if (!imagePath) return null;
  return `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${imagePath}`;
};
