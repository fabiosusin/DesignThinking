import { IconTypeEnum } from './../../models/enum/icon-type-enum';
import { SideMenuNode, FlatNode } from './../../models/side-menu';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { ProviderService } from '../../services/provider/provider.service';

@Component({
  selector: 'app-sidebar-page',
  templateUrl: './sidebar.page.html',
  styleUrls: ['./sidebar.page.scss']
})
export class SidebarPage {

  showFullDrawer: boolean = false;
  openSideMenuFunc: any;
  closeAllMenusFunc: any;
  @ViewChild('bgSideMenu') bgSideMenu: ElementRef = new ElementRef({});

  get IconType() {
    return IconTypeEnum;
  }

  constructor(
    public hostElement: ElementRef,
    public providerService: ProviderService,
    public router: Router) {
  }

  ngAfterViewChecked(): void {
  }

  updateData = (data: SideMenuNode[]) => this.dataSource.data = data;

  openMenu = () => {
    if (!this.bgSideMenu.nativeElement.classList.contains('bgSideMenuOpen')) {
      this.bgSideMenu.nativeElement.classList.add('bgSideMenuOpen');
      this.showFullDrawer = true;
    }
  }

  hoveredMenu() {
    clearTimeout(this.closeAllMenusFunc);

    this.openSideMenuFunc = setTimeout(() => {
      this.openMenu();
    }, 200);
  }

  closeAllMenus() {
    clearTimeout(this.openSideMenuFunc);
    this.closeAllMenusFunc = setTimeout(() => {
      if (this.bgSideMenu.nativeElement.classList.contains('bgSideMenuOpen')) {
        this.bgSideMenu.nativeElement.classList.remove('bgSideMenuOpen');
        this.showFullDrawer = false;
        this.treeControl.collapseAll()
      }
    }, 400);
  }

  onClickNode = (node: SideMenuNode) => {
    if (!node?.route)
      return;

    this.providerService.route.navigateByUrl(node.route);
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  private _drawerTransformer = (node: SideMenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      iconData: node.iconData,
      route: node.route
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._drawerTransformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
}
