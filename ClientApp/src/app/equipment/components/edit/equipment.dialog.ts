import { EquipmentHistory } from './../../models/output/equipment-history';
import { ProviderService } from '../../../core/services/provider/provider.service';
import { Component, Inject, OnInit, Pipe } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { States } from 'src/app/core/models/input/states-input';
import { EquipmentService } from '../../services/equipament.service';
import { IconTypeEnum } from 'src/app/core/models/enum/icon-type-enum';
import { Equipment } from '../../models/output/equipment';
import { ImageListResolutionsSize } from 'src/app/core/models/enum/image-list-resolution-enum';
import { HelperService } from 'src/app/core/services/helper/helper.service';
import { EquipmentHistoryService } from '../../services/equipament-history.service';

@Component({
  selector: 'app-equipment-dialog',
  templateUrl: './equipment.dialog.html',
  styleUrls: ['./equipment.dialog.scss']
})
export class EquipmentDialog implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private equipmentService: EquipmentService,
    private equipmentHistoryService: EquipmentHistoryService,
    private providerService: ProviderService,
    public dialogRef: MatDialogRef<EquipmentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Equipment,
  ) {
    if (!this.data)
      this.data = new Equipment();
  }

  form?: FormGroup;
  isLoading?: boolean;
  history?: EquipmentHistory[];

  get States() {
    return States
  }

  get IconType() {
    return IconTypeEnum;
  }

  async ngOnInit() {
    this.assignForm();
    await this._getImages();
    await this._getEquipmentHistory();
  }

  onSubmit = async (item: Equipment) => {
    if (!this._validateData())
      return;

    try {
      this.isLoading = true;
      item.images = this.data.images;
      item.imagesBase64 = this.data.imagesBase64;

      const result = await this.equipmentService.upsert(item);
      if (!result?.success) {
        this.providerService.toast.warningMessage(result?.message ?? 'Ocorreu um erro ao tentar salvar o Equipamento!')
        return;
      }

      this.providerService.toast.successMessage(result.message ?? 'Equipamento salvo com sucesso!')
      this.closeDialog();
    }
    catch (e) {
      console.error('e => ', e)
      this.providerService.toast.errorMessage('Ocorreu um erro ao tentar salvar o Equipamento!')
    }
    finally {
      this.isLoading = false;
    }
  }

  async attachFile(event: any) {
    const base64Output = await HelperService.GetBase64FromFile(event);
    if (!base64Output?.success) {
      this.providerService.toast.errorMessage(base64Output?.message ?? 'Não foi possível salvar a imagem');
      return;
    }

    if (!this.data.imagesBase64)
      this.data.imagesBase64 = [];

    this.data.imagesBase64?.push(base64Output.base64 ?? '');
  }

  private _getImages = async () => {
    try {
      this.isLoading = true;
      this.data.images = await this.equipmentService.getImageList(this.data.id ?? '', ImageListResolutionsSize.Url512)
    }
    finally {
      this.isLoading = false;
    }
  }

  private _validateData = (): boolean => {
    const invalidFields = [];
    if (!this.form?.get('code')?.value)
      invalidFields.push('Informe o Código!');
    if (!this.form?.get('name')?.value)
      invalidFields.push('Informe o Nome!');
    if (!this.form?.valid)
      invalidFields.push('Informe os campos corretamente!')

    if (invalidFields.length) {
      this.providerService.toast.warningMessage('Nem todos os campos foram preenchidos corretamente:<br>' + invalidFields.join('<br>'));
      return false;
    }
    else
      return true;
  }

  private _getEquipmentHistory = async () => {
    try {
      if (!this.data.id)
        return;

      this.isLoading = true;
      this.history = (await this.equipmentHistoryService.getList({ filters: { equipmentId: this.data.id } }))?.equipmentsHistory;
      console.log('history => ', this.history)
    }
    finally {
      this.isLoading = false;
    }
  }

  private assignForm = async () => {
    this.form = this.formBuilder.group({
      id: [this.data.id],
      code: [this.data.code, [Validators.required]],
      name: [this.data.name, [Validators.required]],
      userId: [this.data.userId ?? this.providerService.sessionService.getSession().user?.userId, [Validators.required]],
      note: [this.data.note],
      damageNote: [this.data.damageNote],
      loaned: [this.data.loaned ?? false]
    });
  };

  closeDialog(): void {
    this.dialogRef.close();
  }
}
