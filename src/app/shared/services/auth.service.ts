import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import 'firebase/compat/auth'; // Import Firebase Authentication
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TokenStorageService } from './token-storage.service';
import { ToastrService } from 'ngx-toastr';
import { users } from '../model/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // URL to a server-side endpoint that returns the user's IP address
  private ipLookupUrl = 'https://api.ipify.org/?format=json';

  // Define the range of office IP addresses
  private officeIpRanges: string[] = ['49.37.25.44'];

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, private tokenStorage: TokenStorageService, private toster: ToastrService, private http: HttpClient) { }

  // Sign in with email and password
  login(email: string, password: string): Observable<{ userCredential: firebase.default.auth.UserCredential, token: string, uid: string, role: any } | null> {
    return new Observable(observer => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          if (!userCredential || !userCredential.user) {
            observer.next(null);
            observer.complete();
          } else {
            userCredential.user.getIdToken()
              .then(token => {
                this.getUserData(userCredential.user!.uid)
                  .subscribe(userrole => {
                    observer.next({ userCredential, token, uid: userCredential.user!.uid, role: userrole });
                    observer.complete();
                  }, error => {
                    console.error('Error getting user data:', error);
                    this.toster.error(error.message);
                    observer.next(null);
                    observer.complete();
                  });
              })
              .catch(error => {
                console.error('Error getting ID token:', error);
                this.toster.error(error.message);
                observer.next(null);
                observer.complete();
              });
          }
        })
        .catch(error => {
          console.error('Error signing in:', error);
          this.toster.error(error.message);
          observer.next(null);
          observer.complete();
        });
    });
  }

  // change password
  // Change password with old password, new password, and confirmation
  changePasswordWithConfirmation(oldPassword: string, newPassword: string, confirmPassword: string): Observable<boolean> {
    // Get the current user as a promise
    const currentUserPromise = this.afAuth.currentUser;

    // Convert the promise to an observable
    const currentUser = from(currentUserPromise);

    // Now we can use pipe and switchMap to handle the async operation
    return currentUser.pipe(
      switchMap(user => {
        // Check if user exists
        if (!user) {
          console.error('No user is signed in.');
          return of(false);
        }

        // Check if new password matches confirmation
        if (newPassword !== confirmPassword) {
          console.error('New password does not match confirmation.');
          this.toster.error('New password does not match confirmation.');
          return of(false);
        }

        // Update password after getting user

        return from(user.updatePassword(newPassword)).pipe(
          map(() => true),
          catchError(error => {
            console.error('Error changing password:', error);
            this.toster.error(error.message);
            return of(false);
          })
        );
      }),
      catchError(error => {
        console.error('Error getting current user:', error);
        this.toster.error('Error getting current user.');
        return of(false);
      })
    );
  }

  // Register user with email and password
  registerWithEmailAndPassword(email: string, password: string): Observable<firebase.default.auth.UserCredential | null> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      catchError(error => {
        // console.error('Error registering user:', error.message);
        this.toster.error(error.message)
        return of(null);
      })
    );
  }

  // Function to add a document to a Firestore collection
  addUsers(data: users): Observable<any> {
    return new Observable<any>(observer => {
      this.firestore.collection("users").add(data)
        .then(docRef => {
          observer.next(docRef);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // Sign out
  signOut(): Observable<boolean> {
    return from(this.afAuth.signOut()).pipe(
      map(() => true),
    );
  }

  logout() {
    // remove user from local storage to log user out
    this.tokenStorage.signOut();
  }
  // Get the current user
  getCurrentUser(): Observable<firebase.default.User | null> {
    return this.afAuth.authState;
  }
  getUserData(uid: string): Observable<any[]> {
    return this.firestore.collection('users').snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          var data = action.payload.doc.data() as any;
          const id = action.payload.doc.id;
          if (data.uid === uid) {
            return data.role;
          } else {
            return null; // return null for non-matching uids
          }
        }).filter(role => role !== null); // filter out null values
      })
    );
  }
  getCurrentDateTime(): Observable<any> {
    // Use Firebase server timestamp
    return from(this.firestore.firestore.collection('timestamp').doc('serverTime').get());
  }
  getUserIpAddress(): Observable<string> {
    return this.http.get<any>(this.ipLookupUrl)
      .pipe(
        map(response => response.ip),
        catchError(error => {
          // Handle errors gracefully
          console.error('Error retrieving user IP address:', error);
          return of('');
        })
      );
  }

  isUserAtOffice(userIpAddress: string): boolean {
    // Check if the user's IP address matches any of the office IP ranges
    for (const range of this.officeIpRanges) {
      if (userIpAddress.startsWith(range)) {
        return true;
      }
    }
    // User is not at the office
    return false;
  }

}
