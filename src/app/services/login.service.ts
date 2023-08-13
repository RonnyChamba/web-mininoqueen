import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class LoginService implements OnInit {
  ngOnInit(): void {}
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {}

  login({ ingUsuario, ingPassword }: any) {
    return this.afAuth.signInWithEmailAndPassword(ingUsuario, ingPassword);
  }

  register({  email, password }: any) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }



}
