import { IconTypeEnum } from "./enum/icon-type-enum";
import { RouteType } from "./enum/route-type";

export interface FlatNode {
  expandable: boolean;
  name: string;
  route: string;
  iconData: IconData;
  level: number;
}

export class IconData {
  constructor(icon: string, type: IconTypeEnum) {
    this.icon = icon;
    this.type = type;
  }
  icon?: string;
  type?: IconTypeEnum;
}

export class SideMenuNode {
  constructor(name: string, icon: IconData, route: string, hasPermission: boolean) {
    this.name = name;
    this.iconData = icon;
    this.route = route;
    this.hasPermission = hasPermission;
  }

  hasPermission: boolean;
  name: string;
  iconData: IconData;
  children?: SideMenuNode[];
  type?: RouteType;
  route: string;
}

