import * as RepositoryUtil from './repository.util';
import { addUserMockData } from '../../mock/add-user.mock';


describe('Repository Util', () => {
  it('getFromDto should make same object when fields is not specified', () => {
    const result = RepositoryUtil.getFromDto(addUserMockData, {});
    expect(result).toStrictEqual(result);
  });

  it('getFromDto should make same object with specific fields when fields parameter is provided', () => {
    const result = RepositoryUtil.getFromDto(addUserMockData, {}, ['email', 'password']);
    const expectedResult = addUserMockData;
    delete expectedResult.fullName;
    expect(result).toStrictEqual(expectedResult);
  });
});
