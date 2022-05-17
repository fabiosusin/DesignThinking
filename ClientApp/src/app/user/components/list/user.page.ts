import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageTitleService } from 'src/app/core/services/page-title/page-title.service';
import { ProviderService } from 'src/app/core/services/provider/provider.service';
import { AddUserInput } from '../../models/input/add-user-input';
import { UserFilters } from '../../models/input/user-filters-input';
import { UserFiltersInput } from '../../models/input/user-list-input';
import { User } from '../../models/output/user';
import { UserService } from '../../services/user.service';
import { UserDialog } from '../edit/user.dialog';

@Component({
  selector: 'app-user-page',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss']
})
export class UserPage implements OnInit {
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private pageTitleService: PageTitleService,
    private providerService: ProviderService) {
  }

  form?: FormGroup;
  isLoading: boolean = false;
  isMasterUser: boolean = false;
  displayedColumns: string[] = ['name', 'username', 'email', 'edit', 'delete'];
  dataSource: User[] = [];
  filters: UserFiltersInput = new UserFiltersInput();
  name?: string;

  ngOnInit(): void {
    this.pageTitleService.changePageTitle('Usuários');
    this.getData();
    this.assignForm();
    this.isMasterUser = this.providerService.sessionService.getSession().user?.isMasterUser ?? false;
  }

  submit = async (input: UserFilters) => {
    this.filters.filters = input
    this.getData();
  }

  getData = async () => {
    try {
      this.isLoading = true;

      const result = await this.userService.getList(this.filters)
      if (!result?.success)
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar buscar os Usuários!')

      this.dataSource = result?.users ?? [];
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar buscar os Usuários!')
    }
    finally {
      this.isLoading = false;
    }
  }

  onClickDelete = async (id: string) => {
    if (!this.isMasterUser) {
      this.providerService.toast.warningMessage('Você não tem permissão para realizar esta ação!')
      return;
    }

    if (!confirm("Deseja deletar"))
      return;

    try {
      this.isLoading = true;
      const result = await this.userService.deleteUser(id);
      if (!result?.success) {
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar deletar o Usuário!')
        return;
      }

      this.providerService.toast.successMessage('Usuário deletado com sucesso!');
      this.getData();
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar deletar o Usuário!')
    }
    finally {
      this.isLoading = false;
    }
  }

  openDialog(input?: User): void {
    if (!this.isMasterUser) {
      this.providerService.toast.warningMessage('Você não tem permissão para realizar esta ação!')
      return;
    }

    const dialogRef = this.dialog.open(UserDialog, {
      width: '700px',
      data: new AddUserInput(input ?? {}),
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => { this.getData(); });
  }

  private assignForm = async () => {
    this.form = this.formBuilder.group({
      name: [''],
      username: ['']
    });
  };
}