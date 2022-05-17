import { SideMenuNode } from './../../../core/models/side-menu';
import { ProviderService } from '../../../core/services/provider/provider.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { States } from 'src/app/core/models/input/states-input';
import { UserService } from '../../services/user.service';
import { AddUserInput } from '../../models/input/add-user-input';
import { IconTypeEnum } from 'src/app/core/models/enum/icon-type-enum';
import { RouteType } from 'src/app/core/models/enum/route-type';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user.dialog.html',
  styleUrls: ['./user.dialog.scss']
})
export class UserDialog implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private providerService: ProviderService,
    public dialogRef: MatDialogRef<UserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddUserInput,
  ) {
    if (!this.data)
      this.data = new AddUserInput({});
  }

  form?: FormGroup;
  isLoading?: boolean;
  observableAlly?: Observable<string[]>;
  permissionItems?: SideMenuNode[];
  isMasterAlly?: boolean;

  get States() {
    return States
  }

  get IconType() {
    return IconTypeEnum;
  }

  async ngOnInit() {
    this.isMasterAlly = this.data.isMasterAdmin;
    if (this.data)
      this.data.passwordValidation = this.data.password;

    this.assignForm();
  }

  onSubmit = async (item: AddUserInput) => {
    if (!this._validateData())
      return;

    try {
      this.isLoading = true;

      item.permissions = RouteType.Unknown;
      this.permissionItems?.forEach(x => item.permissions += x.children?.filter(x => x.hasPermission).reduce((partial_sum, a) => partial_sum + (a.type ?? 0), 0) ?? 0);

      const result = await this.userService.upsert(item);

      if (!result?.success) {
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar salvar o Usuário!')
        return;
      }

      this.providerService.toast.successMessage(result.message ?? 'Usuário salvo com sucesso!')
      this.closeDialog();
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar salvar o Usuário!')
    }
    finally {
      this.isLoading = false;
    }
  }

  private _validateData = (): boolean => {
    const invalidFields = [];
    if (!this.data.userId && !this.form?.get('password')?.value)
      invalidFields.push('Informe a senha!');
    if (this.form?.get('password')?.value && !this.form?.get('passwordValidation')?.value)
      invalidFields.push('Informe a senha de verificação!');
    if (!this.form?.valid)
      invalidFields.push('Informe os campos corretamente!')

    if (invalidFields.length) {
      this.providerService.toast.warningMessage('Nem todos os campos foram preenchidos corretamente:<br>' + invalidFields.join('<br>'));
      return false;
    }
    else
      return true;
  }

  private assignForm = async () => {
    this.data.password = this.data.passwordValidation = '';

    this.form = this.formBuilder.group({
      userId: [this.data.userId],
      isMasterAdmin: [this.data.isMasterAdmin ?? false],
      email: [this.data.email, [Validators.required]],
      name: [this.data.name, [Validators.required]],
      username: [this.data.username, [Validators.required]],
      password: [this.data.password],
      passwordValidation: [this.data.passwordValidation],
      tempPassword: [this.data.tempPassword]
    });
  };

  closeDialog(): void {
    this.dialogRef.close();
  }
}
