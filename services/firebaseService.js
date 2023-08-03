import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";



export default class FirebaseService {
  constructor() {
    const config = useRuntimeConfig();
    this.config = config.public;
    this.isFirebaseAvailable = config.public.FIREBASE_API_KEY !== undefined;
    this._setupFirebase();    
  }

  isFirebaseAvailable() {
    return this.isFirebaseAvailable;
  }

  get firestore() {
    return _firestore;
  }

  get serverTimestamp() {
    return serverTimestamp()
  }

  async addDocumentToCollection(_collection, document) {
    if (this.isFirebaseAvailable === false) return;  
    try {
      console.log(document);
      const ref = await addDoc(collection(this._firestore, _collection), document).then(ref => {console.log(ref);});
      console.log(ref);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  _setupFirebase() {
    const firebaseConfig = {
      apiKey: this.config.FIREBASE_API_KEY,
      authDomain: this.config.FIREBASE_AUTH_DOMAIN,
      projectId: this.config.FIREBASE_PROJECT_ID,
      storageBucket: this.config.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: this.config.FIREBASE_MESSAGING_SENDER_ID,
      appId: this.config.FIREBASE_APP_ID
    };

    console.log(firebaseConfig);

    this._firebaseApp = initializeApp(firebaseConfig);
    this._firestore = getFirestore(this._firebaseApp);
  }
};