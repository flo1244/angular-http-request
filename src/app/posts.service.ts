import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PostsService {
  error = new Subject<string>();
constructor(private http: HttpClient){}


    createAndStorePost(title: string, content: string) {
        const postData: Post = { title: title, content: content };
         // Send Http request
    console.log(postData);
      this.http.post<{ name: string }>('https://http-request-01-default-rtdb.firebaseio.com/posts.json', postData, {
      observe: 'response' //gets extracted as a JS object
    })
      .subscribe(responseData => {
        console.log(responseData.body);
      },error => {
        this.error.next(error.message);
      });
    //takes two arguments the URL and the request body. 
    //http request use observables must subscribe to it or it will not send the data.
    }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
      return this.http.get<{ [key: string]: Post }>('https://http-request-01-default-rtdb.firebaseio.com/posts.json', {
        headers: new HttpHeaders({ "Custom-Header": "Hello" }),//setting custom headers. 
        params:  searchParams//new HttpParams().set('print', 'pretty') //changes our format of the data.
      } )
        .pipe(map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
        );
    //   .subscribe(posts => {
    //     console.log(posts);
    //     // this.isFetching = false;
    //     // this.loadedPosts = posts;
        
    //   })
    }
  
  deletePosts() {
    return this.http.delete('https://http-request-01-default-rtdb.firebaseio.com/posts.json', {
      observe: 'events',
      responseType: 'json' //data in the body is json or text or blob 
    }).pipe(tap(event => {
      console.log(event); //tap allows you to do something and automatically lets teh response pass through. 
      if (event.type == HttpEventType.Sent) {
        //... can use sent and response to update the UI on whether data is sent or waiting on response etc. 
      }
      if (event.type == HttpEventType.Response) {
        console.log(event.body);
      }
    }));
  }
}