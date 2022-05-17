import { Md5 } from 'ts-md5';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApiOutput } from 'src/app/core/models/output/base-api-output';
import { BaseApiRequestsService } from 'src/app/core/services/api/base-api-requests.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { Equipment } from '../models/output/equipment';
import { EquipmentFiltersInput } from '../models/input/equipment-list-input';
import { EquipmentListOutput } from '../models/output/equipment-list-output';
import { ImageListResolutionsSize } from 'src/app/core/models/enum/image-list-resolution-enum';
import { ImageFormat } from 'src/app/core/models/output/image-format';

@Injectable({ providedIn: 'root' })
export class EquipmentService extends BaseApiRequestsService {
  constructor(
    protected session: SessionService,
    protected http: HttpClient
  ) {
    super(session, http);
    this.baseUrl = 'Equipment/';
  }

  private baseUrl: string;

  getList = async (input: EquipmentFiltersInput): Promise<EquipmentListOutput> => await this.post(this.baseUrl + 'list', input);

  getImageList = async (id: string, size: ImageListResolutionsSize): Promise<ImageFormat[]> => await this.get(`${this.baseUrl}get-equipment-images/${id}/${size}`);

  deleteEquipment = async (id: string): Promise<BaseApiOutput> => await this.delete(this.baseUrl + 'delete/' + id);

  upsert = async (input: Equipment): Promise<BaseApiOutput> => await this.post(this.baseUrl + 'upsert-equipment', input);
}
