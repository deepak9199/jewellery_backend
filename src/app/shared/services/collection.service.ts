import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';


import { Observable, from, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { forkJoin, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getData(collectionName: string): Observable<any[]> {
    return this.firestore.collection(collectionName).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as any;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getDocumentById(collectionName: string, documentId: string): Observable<any> {
    return this.firestore.collection(collectionName).doc(documentId).valueChanges();
  }

  // Function to add a document to a Firestore collection
  addDocumnet(collectionName: string, data: any): Observable<any> {
    return new Observable<any>(observer => {
      this.firestore.collection(collectionName).add(data)
        .then(docRef => {

          observer.next(docRef);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
  addDocumentsarray(collectionName: string, dataArray: any[]): Observable<any[]> {
    return new Observable<any[]>(observer => {
      const observables: any = [];
      dataArray.forEach(data => {
        observables.push(new Observable<any>(innerObserver => {
          this.firestore.collection(collectionName).add(data)
            .then(docRef => {
              innerObserver.next(docRef);
              innerObserver.complete();
            })
            .catch(error => {
              innerObserver.error(error);
            });
        }));
      });

      // Combining observables using forkJoin
      forkJoin(observables).subscribe({
        next: (results: any) => {
          observer.next(results); // Array of results
          observer.complete();
        },
        error: error => {
          observer.error(error);
        }
      });
    });
  }

  deleteDocument(collectionName: string, docId: string): Observable<void> {
    return new Observable<void>(observer => {
      this.firestore.collection(collectionName).doc(docId).delete()
        .then(() => {
          // const deleteAttendancePromise = this.deleteData('sub_category', 'category_id', docId);
          observer.next();
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  updateDocument(collectionName: string, docId: string, data: any): Observable<void> {
    return new Observable<void>(observer => {
      this.firestore.collection(collectionName).doc(docId).update(data)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
  uploadFile(file: File, path: string): Observable<number | null | undefined> {
    const filePath = path + '/' + file.name;
    const fileRef = this.storage.ref(filePath);
    const task: AngularFireUploadTask = this.storage.upload(filePath, file);

    // Return an observable to track upload progress
    return task.percentageChanges();
  }
  deleteFile(fileUrl: string): Observable<void> {
    const fileRef = this.storage.refFromURL(fileUrl); // Get reference from URL
    return fileRef.delete();
  }
  getDownloadUrl(filePath: string): Observable<string> {
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }
  // Method to delete data from a specific collection based on UID
  private deleteData(collection: string, id: string, index: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.firestore.collection(collection, ref => ref.where(index, '==', id)).get().toPromise()
        .then((querySnapshot) => {
          const deletePromises: any[] = [];
          if (typeof querySnapshot != 'undefined') {
            querySnapshot.forEach(doc => {
              deletePromises.push(doc.ref.delete());
            });
            // console.log(deletePromises)
            return Promise.all(deletePromises);
          }
          else {
            return Promise.all(deletePromises);
          }

        })
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }
}
