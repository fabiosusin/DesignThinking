import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';
import { HelperService } from 'src/app/core/services/helper/helper.service';
import { ProviderService } from '../../../core/services/provider/provider.service';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CpfCnpjValidator } from 'src/app/core/functions/cpf-cnpj-validator.function';
import { GeneralService } from 'src/app/core/services/general/general.service';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/output/employee';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee.dialog.html',
  styleUrls: ['./employee.dialog.scss']
})
export class EmployeeDialog implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private providerService: ProviderService,
    public dialogRef: MatDialogRef<EmployeeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Employee,
  ) {
    if (!this.data)
      this.data = new Employee();
  }

  form?: FormGroup;
  isLoading?: boolean;

  async ngOnInit() {
    this._assignForm();
  }

  onSubmit = async (item: Employee) => {
    if (!this._validateData())
      return;

    try {
      this.isLoading = true;

      const result = await this.employeeService.upsert(item);
      if (!result?.success) {
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar salvar o Funcionário!')
        return;
      }

      this.providerService.toast.successMessage(result.message ?? 'Funcionário salvo com sucesso!')
      this.closeDialog();
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar salvar o Funcionário!')
    }
    finally {
      this.isLoading = false;
    }
  }

  private _assignForm = async () => {

    this.form = this.formBuilder.group({
      id: [this.data.id],
      name: [this.data.name, [Validators.required]],
      cpfCnpj: [this.data.cpfCnpj, Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14), CpfCnpjValidator()])],
    });
  };

  private _validateData = (): boolean => {
    const invalidFields = [];
    if (!this.form?.valid)
      invalidFields.push('Informe os campos corretamente!')

    if (invalidFields.length) {
      this.providerService.toast.warningMessage('Nem todos os campos foram preenchidos corretamente:<br>' + invalidFields.join('<br>'));
      return false;
    }
    else
      return true;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
