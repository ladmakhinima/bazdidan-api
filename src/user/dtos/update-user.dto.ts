import { CreateUserDTO } from './create-user.dto';

export type UpdateUserDTO = Omit<CreateUserDTO, 'isClient'>;
