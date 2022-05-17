import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProviderService } from 'src/app/core/services/provider/provider.service';
import { MatDialog } from '@angular/material/dialog';
import { PageTitleService } from 'src/app/core/services/page-title/page-title.service';
import { UserData } from 'src/app/core/models/output/session-output';
import { LoanFiltersInput } from '../../models/input/loan-list-input';
import { LoanDateFilterEnum, LoanFilters, LoanReturnedFilterEnum } from '../../models/input/loan-filters-input';
import { LoanService } from '../../services/loan.service';
import { LoanListOutput } from '../../models/output/loan-list-output';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LoanDialog } from '../dialogs/loan-dialog/loan.dialog';
import { DevolutionDialog } from '../dialogs/devolution-dialog/devolution.dialog';
import { LoanOutput } from '../../models/output/loan-list-output-data';
import { BasePage } from 'src/app/core/components/base-page';
import { GeneralService } from 'src/app/core/services/general/general.service';
import { FilesService } from 'src/app/core/services/files/files.service';
import { Location } from '@angular/common';
import { DocTypeEnum } from 'src/app/core/models/enum/doc-type-enum';

@Component({
  selector: 'app-loan-page',
  templateUrl: './loan.page.html',
  styleUrls: ['./loan.page.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])],
})
export class LoanPage extends BasePage implements OnInit {
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private loanService: LoanService,
    private pageTitleService: PageTitleService,
    private providerService: ProviderService,
    protected generalService: GeneralService,
    protected filesService: FilesService,
    protected location: Location) { super(location, providerService, generalService, filesService) }

  form?: FormGroup;
  userSession?: UserData;
  isMasterUser: boolean = false;
  isLoading: boolean = false;
  displayedColumns: string[] = ['employeeName', 'loanDate', 'devolutionDate', 'devolutionBtn', 'generateDocument', 'expanded'];
  dataSource: LoanOutput[] = [];
  filters: LoanFiltersInput = new LoanFiltersInput();
  expandedElement: LoanListOutput | null = {};
  name?: string;
  disabledDataTypeBtn: boolean = true;

  get docType() {
    return DocTypeEnum;
  }

  get dateType() {
    return LoanDateFilterEnum;
  }

  get returnedType(){
    return LoanReturnedFilterEnum;
  }

  async ngOnInit(): Promise<void> {
    this.pageTitleService.changePageTitle('Empréstimos');
    this.getData();
    this.assignForm();
  }

  submit = async (input: LoanFilters) => {
    this.filters.filters = input

    if(input.dateFilterType ==  LoanDateFilterEnum.Unknown){
      input.startDate = input.endDate =  undefined;
      this.form?.get('startDate')?.setValue(undefined);
      this.form?.get('endDate')?.setValue(undefined);
    }

    this.getData();
  }

  getData = async () => {
    try {
      this.userSession = this.providerService.sessionService.getSession().user;
      this.isMasterUser = this.userSession?.isMasterUser ?? false;
      this.isLoading = true;

      if (!this.filters.filters)
        this.filters.filters = {};

      const result = await this.loanService.getList(this.filters)
      if (!result?.success)
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar buscar os Empréstimos!')

      this.dataSource = result?.loans ?? [];
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar buscar os Empréstimos!')
    }
    finally {
      this.isLoading = false;
    }
  }

  openLoanDialog(data?: LoanOutput): void {
    const dialogRef = this.dialog.open(LoanDialog, {
      width: '700px',
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => { this.getData(); });
  }

  openDevolutionDialog(id?: string): void {
    const dialogRef = this.dialog.open(DevolutionDialog, {
      width: '700px',
      data: id,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => { this.getData(); });
  }

  private assignForm = async () => {
    this.form = this.formBuilder.group({
      employeeName: [''],
      startDate: [],
      endDate: [],
      dateFilterType: [LoanDateFilterEnum.Unknown],
      returnedFilterType: [LoanReturnedFilterEnum.Unknown]
    });
  };
}
