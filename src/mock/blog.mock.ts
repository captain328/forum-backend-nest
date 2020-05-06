import * as Faker from 'faker';

import { commonEntityMockData } from './common-entity.mock';

export const blogsMockData = [
  {
    ...commonEntityMockData,
    title: Faker.lorem.sentence(10),
    content: Faker.lorem.sentence(30),
  }
];
