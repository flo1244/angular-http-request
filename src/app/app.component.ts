import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = true;
  error = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postsService: PostsService) {}

  ngOnInit() {
    //using subject base approach. 
    this.errorSub = this.postsService.error.subscribe(errorMessage => {
      this.error = errorMessage;
    })

    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    });
  }

  onCreatePost(postData: Post) {
    // // Send Http request
    // console.log(postData);
    // this.http.post<{name: string}>('https://http-request-01-default-rtdb.firebaseio.com/posts.json', postData)
    //   .subscribe(responseData => {
    //     console.log(responseData);
    //   });
    // //takes two arguments the URL and the request body.
    // //http request use observables must subscribe to it or it will not send the data. 
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    // this.fetchPosts();
    // this.postsService.fetchPosts();
     this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.error = error.message; // error message when our fetch post fails how could we use other objects to display info?
      console.log(error);
    });
  }

  onClearPosts() {
    // Send Http request
    this.postsService.deletePosts().subscribe(
      () => {
        this.loadedPosts = [];
      }
    ); //we are subscribing here bc we want to be able to clear loaded post array.
  }

  onHandleError() {
    this.error = null;
  }
  // private fetchPosts() {
  //   this.isFetching = false;
  //   // this.http.get<{[key: string]: Post }>('https://http-request-01-default-rtdb.firebaseio.com/posts.json')
  //   //   .pipe(map(responseData  => {
  //   //     const postsArray: Post[]  = [];
  //   //     for (const key in responseData){
  //   //       if (responseData.hasOwnProperty(key)) {
  //   //         postsArray.push({ ...responseData[key], id: key });
  //   //       }
  //   //     }
  //   //     return postsArray;
  //   //   })
  //   // )
  //   //   .subscribe(posts => {
  //   //     console.log(posts);
  //   //     this.isFetching = false;
  //   //     this.loadedPosts = posts;
        
  //   //   })
  // }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }


}
//map allows us to get some data and return new data which is then automatically re-wrapped  into observable 