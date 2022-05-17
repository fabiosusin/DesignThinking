import { Injectable } from '@angular/core';
import { MimeTypeEnum } from '../../models/enum/mime-type.enum';

@Injectable({ providedIn: 'root' })
export class FilesService {
  constructor() { }

  async openFile(file: string | ArrayBuffer | Blob, filename: string, mimeType: MimeTypeEnum | string): Promise<void> {
    if (typeof file == 'string')
      return await this.openBase64File(file, filename, mimeType);

    if (file instanceof ArrayBuffer)
      return await this.openArrayBufferFile(file, filename, mimeType);

    if (file instanceof Blob)
      return await this.openBlobFile(file, filename, mimeType);
  }

  private async openBase64File(base64File: string, filename: string, mimeType: MimeTypeEnum | string): Promise<void> {
    const blob = this.convertBase64ToBlob(base64File, `data:${mimeType};base64`);
    await this.openBlobFile(blob, filename, mimeType);
  }

  private async openArrayBufferFile(arrayBuffer: ArrayBuffer, filename: string, mimeType: MimeTypeEnum | string): Promise<void> {
    const blob = new Blob([new Uint8Array(arrayBuffer, 0, arrayBuffer.byteLength)]);
    await this.openBlobFile(blob, filename, mimeType);
  }

  private async openBlobFile(blobFile: Blob, _filename: string, _mimeType: MimeTypeEnum | string) {
    const url = window.URL.createObjectURL(blobFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = _filename;
    link.click();
  }

  private convertBase64ToBlob(b64Data: string, contentType: MimeTypeEnum | string): Blob {
    contentType = contentType || MimeTypeEnum.unknown;
    const sliceSize = 512;
    b64Data = b64Data.replace(/^[^,]+,/, '');
    b64Data = b64Data.replace(/\s/g, '');
    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++)
        byteNumbers[i] = slice.charCodeAt(i);
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }
}