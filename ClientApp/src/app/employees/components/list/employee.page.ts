import { Employee } from '../../models/output/employee';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProviderService } from 'src/app/core/services/provider/provider.service';
import { EmployeeFilters } from '../../models/input/employee-filters-input';
import { EmployeeFiltersInput } from '../../models/input/employee-list-input';
import { EmployeeService } from '../../services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { PageTitleService } from 'src/app/core/services/page-title/page-title.service';
import { UserData } from 'src/app/core/models/output/session-output';
import { EmployeeDialog } from '../edit/employee.dialog';

@Component({
  selector: 'app-employee-page',
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss']
})
export class EmployeePage implements OnInit {
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private pageTitleService: PageTitleService,
    private providerService: ProviderService) {
  }

  form?: FormGroup;
  userSession?: UserData;
  isMasterUser: boolean = false;
  isLoading: boolean = false;
  displayedColumns: string[] = ['name', 'cpfCnpj', 'edit', 'delete'];
  dataSource: Employee[] = [];
  filters: EmployeeFiltersInput = new EmployeeFiltersInput();

  name?: string;

  ngOnInit(): void {
    this.pageTitleService.changePageTitle('Jogadores');
    this.getData();
    this.assignForm();
  }

  submit = async (input: EmployeeFilters) => {
    this.filters.filters = input
    this.getData();
  }

  getData = async () => {
    try {
      this.userSession = this.providerService.sessionService.getSession().user;
      this.isMasterUser = this.userSession?.isMasterUser ?? false;
      this.isLoading = true;

      if (!this.filters.filters)
        this.filters.filters = {};

      const result = await this.employeeService.getList(this.filters)
      if (!result?.success)
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar buscar os Clientes!')

      this.dataSource = result?.employees ?? [];
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar buscar os Clientes!')
    }
    finally {
      this.isLoading = false;
    }
  }

  onClickDelete = async (id: string) => {
    if (!confirm("Deseja deletar o Cliente?"))
      return;

    try {
      this.isLoading = true;
      const result = await this.employeeService.deleteEmployee(id);
      if (!result?.success) {
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar deletar o Cliente!')
        return;
      }

      this.providerService.toast.successMessage('Cliente deletado com sucesso!');
      this.getData();
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar deletar o Cliente!')
    }
    finally {
      this.isLoading = false;
    }
  }

  openDialog(data?: Employee): void {
    const dialogRef = this.dialog.open(EmployeeDialog, {
      width: '700px',
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => { this.getData(); });
  }

  private assignForm = async () => {
    this.form = this.formBuilder.group({
      name: [''],
      cpfCnpj: ['']
    });
  };
}