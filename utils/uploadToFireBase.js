const crypto = require("crypto");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");

const firebase = require("firebase/app");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const storage = getStorage();

const uploadFileToFirebase = async (file, chapterId, studentId) => {
  console.log("File: ", file);
  const fileContent = file.buffer;

  const fileExtension = file.originalname.split(".").pop();
  const randBytes = crypto.randomBytes(16);
  const uniqueBy = randBytes.toString("hex");
  const filename = file.originalname.replace(`.${fileExtension}`, "");
  const ufilename = `${filename}_${chapterId}_${studentId}_${uniqueBy}.${fileExtension}`;

  const storageRef = ref(storage, `submissions/${ufilename}`);
  const metadata = {
    contentType: "image/*", // Specify the content type as image/*
  };

  const res = {};
  await uploadBytes(storageRef, fileContent, metadata).then(
    async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((url) => {
        res.Location = url;
        // return { Location: url };
      });
    }
  );

  console.log("uploaded File Result Url: ", res.Location);

  return { Location: res.Location };
};

const deleteFromFirebase = async (filePath) => {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    console.log("File deleted successfully");
  } catch (error) {
    console.log("Error deleting file:", error);
    throw error;
  }
};

module.exports = { uploadFileToFirebase, deleteFromFirebase };
