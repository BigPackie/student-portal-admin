import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { DataService } from '../services/data.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  addeItemId;

  testNewsItem = {
    validFrom: new Date(),
    validTo: new Date("1.1.2222"),
    //overviewImageBase64: Buffer   //added when picture is loaded
    overviewImagePath: "icon/favicon.png",
    detailText:""
  };

  constructor(private dataService : DataService) {  

  }

  ngOnInit(){
  }

  onSimulate(){
    this.dataService.createNewsItem(this.testNewsItem).subscribe((res) => {
      //TODO: handle creation failure
      this.addeItemId = res._id
      console.log(res);
    });
  }

    //TODO: manual file uploading, put it into own component
  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  imageReady : boolean = false;

 
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

        let newsItem = {
          validFrom: new Date(),
          validTo: new Date("1.1.2666"),
          overviewImageBase64: this.previewUrl,   //added when picture is loaded
          detailText:""
        };

        console.log(`Creating newsItem ${newsItem}`);
        this.dataService.createNewsItemManually(newsItem).subscribe((res) => {
          //TODO: handle creation failure
          this.addeItemId = res._id
          console.log(res);
        });

        this.imageReady = false;
  }

  //end of manual file uploading

}
