import { EventEmitter, Injectable, Output } from "@angular/core";
import { SideMenuNode } from "../../models/side-menu";

@Injectable()
export class MenuEventService {
  @Output() pageMenu: EventEmitter<SideMenuNode[]> = new EventEmitter();
  constructor() { }

  changePageMenu = (menu: SideMenuNode[]) =>
    this.pageMenu.emit(menu);

  getPageMenu = () => this.pageMenu

}