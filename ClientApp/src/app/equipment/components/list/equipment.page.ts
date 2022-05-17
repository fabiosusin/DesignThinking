import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageTitleService } from 'src/app/core/services/page-title/page-title.service';
import { ProviderService } from 'src/app/core/services/provider/provider.service';
import { EquipmentFilters } from '../../models/input/equipment-filters-input';
import { EquipmentFiltersInput } from '../../models/input/equipment-list-input';
import { Equipment } from '../../models/output/equipment';
import { EquipmentService } from '../../services/equipament.service';
import { EquipmentDialog } from '../edit/equipment.dialog';

@Component({
  selector: 'app-equipment-page',
  templateUrl: './equipment.page.html',
  styleUrls: ['./equipment.page.scss']
})
export class EquipmentPage implements OnInit {
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private equipmentService: EquipmentService,
    private pageTitleService: PageTitleService,
    private providerService: ProviderService) {
  }

  form?: FormGroup;
  isLoading: boolean = false;
  isMasterUser: boolean = false;
  displayedColumns: string[] = ['code', 'name', 'edit', 'delete'];
  dataSource: Equipment[] = [];
  filters: EquipmentFiltersInput = new EquipmentFiltersInput();
  name?: string;

  ngOnInit(): void {
    this.pageTitleService.changePageTitle('Equipamentos');
    this.getData();
    this.assignForm();
    this.isMasterUser = this.providerService.sessionService.getSession().user?.isMasterUser ?? false;
  }

  submit = async (input: EquipmentFilters) => {
    this.filters.filters = input
    this.getData();
  }

  getData = async () => {
    try {
      this.isLoading = true;

      const result = await this.equipmentService.getList(this.filters)
      if (!result?.success)
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar buscar os Equipamentos!')

      this.dataSource = result?.equipments ?? [];
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar buscar os Equipamentos!')
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
      const result = await this.equipmentService.deleteEquipment(id);
      if (!result?.success) {
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar deletar o Equipamento!')
        return;
      }

      this.providerService.toast.successMessage('Equipamento deletado com sucesso!');
      this.getData();
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar deletar o Equipamento!')
    }
    finally {
      this.isLoading = false;
    }
  }

  openDialog(input?: Equipment): void {
    if (!this.isMasterUser) {
      this.providerService.toast.warningMessage('Você não tem permissão para realizar esta ação!')
      return;
    }

    const dialogRef = this.dialog.open(EquipmentDialog, {
      width: '700px',
      data: input,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => { this.getData(); });
  }

  private assignForm = async () => {
    this.form = this.formBuilder.group({
      name: ['']
    });
  };
}