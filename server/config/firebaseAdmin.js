
const {
  initializeApp,
  cert,
  getApps,
} = require("firebase-admin/app");

const { getAuth } = require("firebase-admin/auth");

let firebaseApp;

if (getApps().length > 0) {
  firebaseApp = getApps()[0];
} else {
  const serviceAccountBase64 =
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!serviceAccountBase64) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_BASE64 is missing from server environment"
    );
  }

  const serviceAccount = JSON.parse(
    Buffer.from(serviceAccountBase64, "base64").toString("utf8")
  );

  firebaseApp = initializeApp({
    credential: cert(serviceAccount),
  });
}

const verifyFirebaseToken = async (idToken) => {
  return getAuth(firebaseApp).verifyIdToken(idToken);
};

module.exports = {
  verifyFirebaseToken,
};
