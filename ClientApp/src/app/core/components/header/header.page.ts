import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component, Input } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { IconTypeEnum } from '../../models/enum/icon-type-enum';
import { FlatNode, SideMenuNode } from '../../models/side-menu';
import { ProviderService } from '../../services/provider/provider.service';

@Component({
  selector: 'app-header-page',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss']
})
export class HeaderPage implements AfterViewInit {

  constructor(private providerService: ProviderService) {

  }

  isMobile: boolean = false;
  userName?: string;
  @Input() public pageTitle?: string;

  get IconType() {
    return IconTypeEnum;
  }

  ngAfterViewInit(): void {
    this.getData();
  }
  
  updateData = (data: SideMenuNode[]) => this.dataSource.data = data;
  
  getData = () => {
    this.isMobile = screen.width <= 1023;
    this.userName = this.providerService.sessionService.getSession()?.user?.name;
  }

  onClickNode = (node: SideMenuNode) => {
    if (!node?.route)
      return;

    this.providerService.route.navigateByUrl(node.route);
  }

  logout = () => {
    this.providerService.sessionService.clearSession();
    this.providerService.route.navigateByUrl('/login')
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