import * as Faker from 'faker';

export const commonEntityMockData = {
  id: Faker.random.uuid(),
  deletedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
