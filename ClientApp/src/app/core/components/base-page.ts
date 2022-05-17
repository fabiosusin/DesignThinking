import { HelperService } from 'src/app/core/services/helper/helper.service';
import { DocTypeEnum } from './../models/enum/doc-type-enum';
import { Directive, OnInit } from "@angular/core";
import { Location } from '@angular/common';
import { ProviderService } from "../services/provider/provider.service";
import { GeneralService } from '../services/general/general.service';
import { FilesService } from '../services/files/files.service';

@Directive()
export class BasePage<TDataReceive = {}> implements OnInit {

  constructor(
    protected location: Location,
    protected provider: ProviderService,
    protected generalService: GeneralService,
    protected filesService: FilesService) {
    if (this.provider.route.getCurrentNavigation() && this.provider.route.getCurrentNavigation()?.extras.state)
      this.dataReceived = this.provider.route.getCurrentNavigation()?.extras.state as TDataReceive;
  }

  isLoading?: boolean;
  dataReceived: Partial<TDataReceive> = {};
  async ngOnInit(): Promise<void> {
  }

  openLink = (link?: string) => link ? window.open(link) : {};
  initData = async (): Promise<void> => { };
  onClickBack = () => this.location.back();
  downloadDocument = async (id: string, type: DocTypeEnum) => {
    try {
      this.isLoading = true;
      const file = await this.generalService.generateDoc(id, type);
      this.filesService.openFile(file.fileContents, file.fileDownloadName, file.contentType);
    }
    catch { this.provider.toast.errorMessage('Ocorreu um erro ao Gerar o documento!') }
    finally { this.isLoading = false; }
  }
  generateReportPdf = (element: string, name: string) => HelperService.generatePDF(element, name);
}