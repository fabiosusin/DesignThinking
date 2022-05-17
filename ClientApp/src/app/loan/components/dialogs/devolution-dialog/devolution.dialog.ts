
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LoanService } from 'src/app/loan/services/loan.service';
import { ProviderService } from 'src/app/core/services/provider/provider.service';

import { LoanDetailsOutput } from 'src/app/loan/models/output/loan-details-output';
import { GeneralService } from 'src/app/core/services/general/general.service';
import { DocTypeEnum } from 'src/app/core/models/enum/doc-type-enum';

@Component({
  selector: 'app-devolution-dialog',
  templateUrl: './devolution.dialog.html',
  styleUrls: ['./devolution.dialog.scss']
})
export class DevolutionDialog implements OnInit {
  constructor(
    private loanService: LoanService,
    private providerService: ProviderService,
    protected generalService: GeneralService,
    public dialogRef: MatDialogRef<DevolutionDialog>,
    @Inject(MAT_DIALOG_DATA) public loanId: string,
  ) { }

  isLoading?: boolean;
  loanDetails?: LoanDetailsOutput;
  employeeName: string = '';
  creationDate: Date = new Date();
  devolutionDate: Date = new Date();

  async ngOnInit() {
    this._getLoanDetails();
  }

  onSubmit = async () => {
    try {
      this.isLoading = true;
      
      if (!this.devolutionDate)
        this.devolutionDate = new Date();

      if (this.loanDetails?.details)
        this.loanDetails.details.devolutionDate = this.devolutionDate;

      const result = await this.loanService.equipmentDevolution(this.loanDetails?.details ?? {});
      if (result.success) {
        this.providerService.toast.successMessage('Empréstimo finalizado com sucesso!')
        this.generalService.generateDoc(result.id ?? '', DocTypeEnum.LoanContract);
        this.closeDialog();
      }
      else
        this.providerService.toast.warningMessage(result.message ?? 'Erro não identificado!');
    }
    finally {
      this.isLoading = false;
    }
  }

  private _getLoanDetails = async () => {
    try {
      this.isLoading = true;
      this.loanDetails = await this.loanService.getLoanDetails(this.loanId);
      if (!this.loanDetails.success) {
        this.providerService.toast.warningMessage(this.loanDetails.message ?? 'Erro não identificado!')
        this.closeDialog();
        return;
      }

      this.employeeName = this.loanDetails.details?.employeeName ?? '';
      this.creationDate = this.loanDetails.details?.loanDate ?? new Date();
    }
    finally {
      this.isLoading = false;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
