import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { DataService } from '../services/data.service';
import { stringify } from 'querystring';
import { HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  news$: Observable<any[]>;

  addeItemId: any;

  addeItemDetailId: any;

  testNewsItem = {
    validFrom: new Date(),
    validTo: new Date("1.1.2222"),
    //overviewImageBase64: Buffer   //added when picture is loaded
    overviewImagePath: "icon/favicon.png",
    detailText:""
  };

  testNewsItemDetails = {
    imageBase64: "somebase64string",
    description:"A detail for news."
  };

  constructor(private dataService : DataService) {  

  }

  ngOnInit(){
    this.loadNews();
  }

  loadNews(){
    this.news$ = this.dataService.getNews();
  }

  onSimulate(){
    this.dataService.createNewsItem(this.testNewsItem).subscribe((res) => {
      //TODO: handle creation failure
      this.addeItemId = res._id
      console.log(res);
    });
  }

  onSimulateDetail(){
    let newsDetails = {...this.testNewsItemDetails};
    console.log(`using ${this.addeItemId} for newsDetailID`)
    newsDetails['_id'] = this.addeItemId;
    this.dataService.createNewsItemDetails(newsDetails).subscribe((res) => {
      //TODO: handle creation failure
      this.addeItemDetailId = res._id
      console.log(res);
    });
  }

    //TODO: manual file uploading, put it into own component
  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  imageReady : boolean = false;

  newsItemSavedId: string;

 
  fileProgress(fileInput: any) {
        this.fileData = <File>fileInput.target.files[0];
        this.preview();
  }
 
  preview() {
      // Show preview 
      var mimeType = this.fileData.type;
      if (mimeType.match(/image\/*/) == null) {
        return;
      }
  
      var reader = new FileReader();      
      reader.readAsDataURL(this.fileData); 
      reader.onload = (_event) => { 
        this.previewUrl = reader.result; 
        this.imageReady = true;
      }
  }
  
  //TODO temporar solution, should be refactored
  onSubmit() {
      const formData = new FormData();
        formData.append('file', this.fileData);
        // this.dataService.post('url/to/your/api', formData)
        //   .subscribe(res => {
        //     console.log(res);
        //     this.uploadedFilePath = res.data.filePath;
        //     alert('SUCCESS !!');
        //   })

        this.fileUploadProgress = '0%';

        let newsItem = {
          name:"test news",
          validFrom: new Date(),
          validTo: new Date("1.1.2666"),
          overviewImageBase64: this.previewUrl,   //added when picture is loaded
         // testArray: new Array(20000000)  //to simulate high payload, so that progress is visible
        };

        //TODO: handle creation failure
        console.log(`Creating newsItem ${newsItem}`);
        this.dataService.createNewsItemManually(newsItem).subscribe((res) => {
          if(res.type === HttpEventType.UploadProgress) {
            this.fileUploadProgress = Math.round(res.loaded / res.total * 100) + '%';
            console.log(this.fileUploadProgress);
          } else if (res.type === HttpEventType.Response) {
            this.fileUploadProgress = '';
            this.newsItemSavedId = res.body._id;
            this.loadNews();
            console.log(res);      
            alert('News succesfully saved!');
          }
        
        });

        this.imageReady = false;
  }

  //end of manual file uploading

   //TODO: manual file uploading, put it into own component
   detailFileData: File = null;
   detailPreviewUrl:any = null;
   detailFileUploadProgress: string = null;
   uploadedDetailFilePath: string = null;
   detailImageReady : boolean = false;

   selectedNewsId: string;
 
   newsDetailItemSavedId: string;
 
  
   detailProgress(fileInput: any) {
         this.detailFileData = <File>fileInput.target.files[0];
         this.detailPreview();
   }
  
   detailPreview() {
       // Show preview 
       var mimeType = this.detailFileData.type;
       if (mimeType.match(/image\/*/) == null) {
         return;
       }
   
       var reader = new FileReader();      
       reader.readAsDataURL(this.detailFileData); 
       reader.onload = (_event) => { 
         this.detailPreviewUrl = reader.result; 
         this.detailImageReady = true;
       }
   }
   
   //TODO temporar solution, should be refactored
   onSubmitDetail() {
       const formData = new FormData();
         formData.append('file', this.detailFileData);
         // this.dataService.post('url/to/your/api', formData)
         //   .subscribe(res => {
         //     console.log(res);
         //     this.uploadedFilePath = res.data.filePath;
         //     alert('SUCCESS !!');
         //   })
 
         this.detailFileUploadProgress = '0%';
 
         let newsItemDetail = {
           _id: this.selectedNewsId,
           description:"some optional details description",  
           imageBase64: this.detailPreviewUrl,   //added when picture is loaded
          // testArray: new Array(20000000)  //to simulate high payload, so that progress is visible
         };
 
         //TODO: handle creation failure
         console.log(`Creating newsItemDetail ${newsItemDetail}`);
         this.dataService.createNewsItemDetails(newsItemDetail).subscribe((res) => {
           if(res.type === HttpEventType.UploadProgress) {
             this.detailFileUploadProgress = Math.round(res.loaded / res.total * 100) + '%';
             this.newsDetailItemSavedId = '';
             console.log(this.detailFileUploadProgress);
           } else if (res.type === HttpEventType.Response) {
             this.detailFileUploadProgress = '';
             this.newsDetailItemSavedId = res.body._id;
             console.log(res);      
             alert('NewsDetail succesfully saved!');
           }
         
         });
 
         this.detailImageReady = false;
   }
 
   //end of manual file uploading
 
  

}
