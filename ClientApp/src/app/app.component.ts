import { SidebarPage } from './core/components/sidebar/sidebar.page';
import { PageTitleService } from './core/services/page-title/page-title.service';
import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, ViewChild } from '@angular/core';
import { SideMenuNode } from './core/models/side-menu';
import { MenuEventService } from './core/services/menu/menu-event.service';
import { ProviderService } from './core/services/provider/provider.service';
import { HeaderPage } from './core/components/header/header.page';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewChecked {
  constructor(
    private pageTitleService: PageTitleService,
    private menuEventService: MenuEventService,
    private providerService: ProviderService,
    private cdRef: ChangeDetectorRef
  ) {

  }

  @ViewChild(SidebarPage) sidebarPage?: SidebarPage;
  @ViewChild(HeaderPage) headerPage?: HeaderPage;

  pageTitle?: string;
  isMobile: boolean = false;

  async ngOnInit(): Promise<void> {
    this.isMobile = screen.width <= 1023;
    this._updateMenu(await this.providerService.getSideMenu());
  }

  ngAfterViewChecked(): void {
    this.subscribeEvents();
    this.cdRef.detectChanges();
  }

  subscribeEvents() {
    this.pageTitleService.getPageTitle()
      .subscribe((title: string) => {
        this.pageTitle = title
      });

    this.menuEventService.getPageMenu()
      .subscribe((menu: SideMenuNode[]) => {
        this._updateMenu(menu);
      });
  }

  private _updateMenu = (menu: SideMenuNode[]) => {
    this.headerPage?.updateData(menu);
    this.sidebarPage?.updateData(menu);
  }
}
