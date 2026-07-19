import {
  computed,
  Injectable,
  signal,
} from '@angular/core';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';

import { firebaseAuth } from '../firebase/firebase.config';
import {
  AuthenticatedUser,
  LoginCredentials,
  RegisterCredentials,
} from '../models/auth-credentials.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentFirebaseUser = signal<User | null>(null);
  private readonly authInitialized = signal(false);

  readonly user = computed<AuthenticatedUser | null>(() => {
    const firebaseUser = this.currentFirebaseUser();

    return firebaseUser
      ? this.mapUser(firebaseUser)
      : null;
  });

  readonly isAuthenticated = computed(
    () => this.currentFirebaseUser() !== null,
  );

  readonly isInitialized = this.authInitialized.asReadonly();

  constructor() {
    onAuthStateChanged(firebaseAuth, (user) => {
      this.currentFirebaseUser.set(user);
      this.authInitialized.set(true);
    });
  }

  async waitUntilInitialized(): Promise<void> {
    await firebaseAuth.authStateReady();

    this.currentFirebaseUser.set(firebaseAuth.currentUser);
    this.authInitialized.set(true);
  }

  async login(
    credentials: LoginCredentials,
  ): Promise<AuthenticatedUser> {
    const persistence = credentials.rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence;

    await setPersistence(firebaseAuth, persistence);

    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      credentials.email.trim(),
      credentials.password,
    );

    this.currentFirebaseUser.set(credential.user);

    return this.mapUser(credential.user);
  }

  async register(
    credentials: RegisterCredentials,
  ): Promise<AuthenticatedUser> {
    const credential = await createUserWithEmailAndPassword(
      firebaseAuth,
      credentials.email.trim(),
      credentials.password,
    );

    await updateProfile(credential.user, {
      displayName: credentials.fullName.trim(),
    });

    await credential.user.reload();

    this.currentFirebaseUser.set(credential.user);

    return this.mapUser(credential.user);
  }

  async loginWithGoogle(): Promise<AuthenticatedUser> {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: 'select_account',
    });

    const credential = await signInWithPopup(
      firebaseAuth,
      provider,
    );

    this.currentFirebaseUser.set(credential.user);

    return this.mapUser(credential.user);
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(
      firebaseAuth,
      email.trim(),
    );
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth);
    this.currentFirebaseUser.set(null);
  }

  private mapUser(user: User): AuthenticatedUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoUrl: user.photoURL,
      emailVerified: user.emailVerified,
    };
  }
}