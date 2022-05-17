export class ImageFormat {
  webp?: ListResolutions;
  jpeg?: ListResolutions;
  imageUrl?: string;
}

export class ListResolutions {
  url32?: string;
  url64?: string;
  url128?: string;
  url256?: string;
  url512?: string;
  url1024?: string;
  url2048?: string;
}

export class ListResolutionsSize {
  url32 = 32 << 0;
  url64 = 32 << 1;
  url128 = 32 << 2;
  url256 = 32 << 3;
  url512 = 32 << 4;
  url1024 = 32 << 5;
  url2048 = 32 << 6;
}

export enum FileType {
  Png = 0,
  Jpeg = 1
}
