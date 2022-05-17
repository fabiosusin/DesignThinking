
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { EmployeeService } from 'src/app/employees/services/employee.service';
import { EmployeeFiltersInput } from 'src/app/employees/models/input/employee-list-input';
import { Equipment } from 'src/app/equipment/models/output/equipment';
import { EquipmentService } from 'src/app/equipment/services/equipament.service';
import { LoanService } from 'src/app/loan/services/loan.service';
import { ProviderService } from 'src/app/core/services/provider/provider.service';
import { Loan } from 'src/app/loan/models/output/loan';
import { Employee } from 'src/app/employees/models/output/employee';
import { GeneralService } from 'src/app/core/services/general/general.service';
import { DocTypeEnum } from 'src/app/core/models/enum/doc-type-enum';

@Component({
  selector: 'app-loan-dialog',
  templateUrl: './loan.dialog.html',
  styleUrls: ['./loan.dialog.scss']
})
export class LoanDialog implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private loanService: LoanService,
    private equipmentService: EquipmentService,
    private providerService: ProviderService,
    private employeeService: EmployeeService,
    protected generalService: GeneralService,
    public dialogRef: MatDialogRef<LoanDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Loan,
  ) {
    if (!this.data)
      this.data = new Loan();
  }

  form?: FormGroup;
  isLoading?: boolean;
  currentEquipment?: string;

  employees: Employee[] = [];
  observableEmployee?: Observable<string[]>;

  equipments: Equipment[] = [];
  observableEquipments?: Observable<string[]>;

  selectedEquipments: Equipment[] = [];

  async ngOnInit() {
    if (this.data) {
      this.data.userId = this.providerService.sessionService.getSession()?.user?.userId;
    }

    const result = await this.employeeService.getList(new EmployeeFiltersInput());
    if (!result.success) {
      this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar buscar os Funcionários!')
      this.closeDialog();
    }

    this.employees = result?.employees ?? [];
    if (this.data) {
      this.data.employeeName = this.employees.find(x => x.id == this.data.employeeId)?.name;
    }

    const equipments = await this.equipmentService.getList({ filters: { loaned: false } })
    if (!equipments.success) {
      this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar buscar os Equipamentos!')
      this.closeDialog();
    }
    this.equipments = equipments?.equipments ?? [];

    this._assignForm();
    if (this.form) {
      this.observableEmployee = this.form.get('employeeName')?.valueChanges.pipe(startWith(''), map((value: any) => this._filterEmployees(value)));
      this.observableEquipments = this.form.get('equipments')?.valueChanges.pipe(startWith(''), map((value: any) => this._filterEquipments(value)));
    }
  }

  onClickAddEquipment = (): void => {
    if (!this.currentEquipment) {
      this.providerService.toast.warningMessage('Equipamento não encontrado!');
      return
    }

    const current = (this.currentEquipment?.split('-')[1])?.trim();
    const existing = this.equipments?.find(x => x.code == current);
    if (existing) {
      this.selectedEquipments?.push(existing);
      this.equipments = this.equipments.filter(value => value.code != current);
    }
    else
      this.providerService.toast.warningMessage('Equipamento não encontrado!');

    this.currentEquipment = '';
  }

  onSubmit = async (item: Loan) => {
    if (!this._validateData())
      return;

    let equipmentIds: String[] = [];
    this.selectedEquipments.forEach(arr => equipmentIds.push(arr.id ?? ''));

    item.equipmentsIds = equipmentIds;
    item.employeeId = this.employees.find(x => x.name == item.employeeName)?.id;
    item.userId = this.data.userId;

    try {
      this.isLoading = true;

      const result = await this.loanService.upsertLoan(item);
      if (!result?.success) {
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar salvar o Empréstimo!')
        return;
      }

      if (result.id)
        this.generalService.generateDoc(result.id, DocTypeEnum.LoanContract);

      this.providerService.toast.successMessage(result.message ?? 'Empréstimo salvo com sucesso!')
      this.closeDialog();
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar salvar o Empréstimo!')
    }
    finally {
      this.isLoading = false;
    }
  }

  public removeEquipment = (id?: string) => {
    let equipmentToRemove = this.selectedEquipments.find(x => x.id == id);
    if (!equipmentToRemove)
      return;

    this.selectedEquipments = this.selectedEquipments.filter(x => x.id != id);

    this.equipments.push(equipmentToRemove);
    this.observableEquipments = this.form?.get('equipments')?.valueChanges.pipe(startWith(''), map((value: any) => this._filterEquipments(value)));
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

  private _assignForm = async () => {
    this.data.loanDate = new Date();

    this.form = this.formBuilder.group({
      employeeName: [this.data.employeeName, [Validators.required]],
      equipments: [this.data.equipmentsIds],
      loanDate: [this.data.loanDate, [Validators.required]],
    });
  };

  private _validateData = (): boolean => {
    const invalidFields = [];

    if (!this.form?.valid)
      invalidFields.push('Informe os campos corretamente!')

    if (!this.selectedEquipments.length)
      invalidFields.push('Selecione pelo menos um equipamento!')

    if (invalidFields.length) {
      this.providerService.toast.warningMessage('Nem todos os campos foram preenchidos corretamente:<br>' + invalidFields.join('<br>'));
      return false;
    }
    else
      return true;
  }

  private _filterEmployees = (value: string): string[] => this.employees.filter(option => option.name?.toLowerCase().includes(value.toLowerCase())).map(x => x.name ?? '');
  private _filterEquipments = (value: string): string[] => this.equipments.filter(option => option.name?.toLowerCase().includes(value.toLowerCase()) || option.code?.toLowerCase().includes(value.toLowerCase())).map(x => `${x.name} - ${x.code}`);
}
