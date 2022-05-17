export class OpenFileOutput {
  constructor(){
    this.contentType = '';
    this.fileContents = '';
    this.fileDownloadName = '';
  }
  
  contentType: string;
  fileContents: string | ArrayBuffer;
  fileDownloadName: string;
}