// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCuNnjMB_Cs7FjoKkMg25_mMcGDyDhL58E",
  authDomain: "futebol-amigos-76eae.firebaseapp.com",
  projectId: "futebol-amigos-76eae",
  storageBucket: "futebol-amigos-76eae.appspot.com",
  messagingSenderId: "773688579515",
  appId: "1:773688579515:web:92711fd01a1f8e79f4e09e",
  measurementId: "G-WJ5ELEG7SY"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Serviços do Firebase que serão utilizados
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };