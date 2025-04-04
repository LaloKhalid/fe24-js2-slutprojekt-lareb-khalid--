// Import Firebase SDK modules
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyA95iEQbXhSzi_0wKYM9Q64cwR5NnHDrvg",
    authDomain: "scrum-board-project.firebaseapp.com",
    projectId: "scrum-board-project",
    storageBucket: "scrum-board-project.appspot.com", // ✅ Fixed
    messagingSenderId: "250474773929",
    appId: "1:250474773929:web:66df348d30f377138398b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getFirestore(app);

// Export Firestore database for other files
export { db };

// Test Firestore connection by adding a document
async function addTestTask() {
    try {
        const docRef = await addDoc(collection(db, "tasks"), {
            title: "Test Task",
            description: "This is a test task",
            category: "UX",
            timestamp: new Date().toISOString(),
            assignedMember: null,
            status: "new"
        });
        console.log("✅ Task added with ID:", docRef.id);
    } catch (e) {
        console.error("❌ Error adding task:", e);
    }
}

// Run the test function
addTestTask();
