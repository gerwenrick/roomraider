type Adress = 'europalaan';
export type Topics =
  | 'turing'
  | 'shannon'
  | 'engelbart'
  | 'lovelace'
  | 'conway'
  | 'hopper'
  | 'hamilton'
  | 'torvalds'
  | 'ritchie'
  | 'stallman'
  | 'bernerslee'
  | 'cerfkahn'
  | 'links'
  | 'hinton'
  | 'lecun'
  | 'bengio';

export type EuropalaanTopics = `${Adress}/${Topics}`;

export const EUROPALAAN_TOPICS: readonly EuropalaanTopics[] = [
  'europalaan/turing',
  'europalaan/shannon',
  'europalaan/engelbart',
  'europalaan/lovelace',
  'europalaan/conway',
  'europalaan/hopper',
  'europalaan/hamilton',
  'europalaan/torvalds',
  'europalaan/ritchie',
  'europalaan/stallman',
  'europalaan/bernerslee',
  'europalaan/cerfkahn',
  'europalaan/links',
  'europalaan/hinton',
  'europalaan/lecun',
  'europalaan/bengio',
] as const;
