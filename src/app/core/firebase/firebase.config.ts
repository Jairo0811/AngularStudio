import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

import { environment } from '../../../environments/environment.development';

function initializeFirebaseApp(): FirebaseApp {
  const existingApp = getApps()[0];

  return existingApp ?? initializeApp(environment.firebase);
}

export const firebaseApp = initializeFirebaseApp();
export const firebaseAuth: Auth = getAuth(firebaseApp);