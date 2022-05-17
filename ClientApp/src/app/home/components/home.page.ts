import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/core/services/helper/helper.service';
import { PageTitleService } from 'src/app/core/services/page-title/page-title.service';
import { ProviderService } from 'src/app/core/services/provider/provider.service';
import { HomeDataOutput } from '../models/output/home-data-output';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  constructor(
    private homeService: HomeService,
    private pageTitleService: PageTitleService,
    private providerService: ProviderService) { }

  data?: HomeDataOutput;
  isLoading?: boolean;

  ngOnInit(): void {
    this.pageTitleService.changePageTitle('');
    this.getData();
  }

  getData = async () => {
    try {
      this.isLoading = true;
      this.data = await this.homeService.getData();
      if (!this.data?.success) {
        this.providerService.toast.warningMessage(this.data?.message ?? 'Ocorreu um erro ao buscar dados da Home!')
        return;
      }

      this.data.date = HelperService.getCompleteDateOutput();
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao buscar dados da Home!')
    }
    finally {
      this.isLoading = false;
    }
  }
}