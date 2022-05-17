import { EventEmitter, Injectable, Output } from "@angular/core";

@Injectable()
export class PageTitleService {
  @Output() pageTitle: EventEmitter<string> = new EventEmitter();
  constructor() { }

  changePageTitle = (title: string) =>
    this.pageTitle.emit(title);

  getPageTitle = () => this.pageTitle

}