import { CreateHouseAdDTO } from './create-house-ad.dto';

export type UpdateHouseAdDTO = Omit<CreateHouseAdDTO, 'estateAgency'>;
