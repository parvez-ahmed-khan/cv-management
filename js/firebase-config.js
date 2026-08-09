
const firebaseConfig = {
  apiKey: "AIzaSyB5n9UNmBB_8EN_zSEazVM03Y7IJ7O7d7U",
  authDomain: "cv-management-system-2f6fd.firebaseapp.com",
  projectId: "cv-management-system-2f6fd",
  storageBucket: "cv-management-system-2f6fd.firebasestorage.app",
  messagingSenderId: "256671945979",
  appId: "1:256671945979:web:0aba001913423b9db64c5e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
function deleteCV() {
  if (!confirm("Are you sure you want to delete your CV? This cannot be undone.")) {
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  db.collection('cvs').doc(user.uid).delete()
    .then(() => {
      alert("CV deleted successfully.");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}