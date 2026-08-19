import { FIREBASE_CONFIG } from './config.js';
import { toast } from './state.js';

let auth = null;
let initialized = false;
let firebaseApp = null;

const missingConfigMessage = 'Firebase não está configurado. Atualize js/core/config.js com as credenciais do seu projeto.';

export async function initAuth(onChange) {
  if (initialized) return;
  initialized = true;
  if (!FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.authDomain) {
    if (onChange) onChange(null);
    return;
  }

  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js');
    const { getAuth, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js');
    firebaseApp = initializeApp(FIREBASE_CONFIG);
    auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, user => {
      if (onChange) onChange(user);
    });
  } catch (error) {
    console.error('Firebase init error', error);
    toast('Firebase não pôde ser inicializado. Verifique as credenciais.');
    if (onChange) onChange(null);
  }
}

export function authEnabled() {
  return !!FIREBASE_CONFIG.apiKey && !!FIREBASE_CONFIG.authDomain && !!FIREBASE_CONFIG.projectId;
}

export function currentUser() {
  return auth ? auth.currentUser : null;
}

export async function signIn(email, password) {
  if (!auth) throw new Error(missingConfigMessage);
  const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js');
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email, password) {
  if (!auth) throw new Error(missingConfigMessage);
  const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js');
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function sendPasswordReset(email) {
  if (!auth) throw new Error(missingConfigMessage);
  const { sendPasswordResetEmail } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js');
  return sendPasswordResetEmail(auth, email);
}

export async function logout() {
  if (!auth) throw new Error(missingConfigMessage);
  const { signOut } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js');
  return signOut(auth);
}

export async function updateUserProfile(data) {
  if (!auth) throw new Error(missingConfigMessage);
  const { updateProfile } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js');
  return updateProfile(auth.currentUser, data);
}

export async function updateUserPassword(password) {
  if (!auth) throw new Error(missingConfigMessage);
  const { updatePassword } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js');
  return updatePassword(auth.currentUser, password);
}
