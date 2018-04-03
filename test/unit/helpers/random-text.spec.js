import { expect } from 'chai';
import config from '../../../src/config/config';
import randomText from '../../../src/helpers/random-text';

describe('Helper: Random-Text', () => {
  it('should return a text from an array', () => {
    const array = config.philosophies;
    const random = randomText(array);
    expect(randomText).to.be.a('function');
    expect(random).to.be.a('string');
  });
});
