import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InvoiceDetailsDialog } from '../components/payment-details/invoice-details.dialog';

@NgModule({
  imports: [CommonModule],
  exports: [InvoiceDetailsDialog],
  declarations: [InvoiceDetailsDialog],
  entryComponents: [InvoiceDetailsDialog]
})
export class AppDialogCommonModule { }
