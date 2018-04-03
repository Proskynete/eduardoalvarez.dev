import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Description from '../../../src/app/views/Description/';
import config from '../../../src/config/config';

describe('<Description />', () => {
  it('should render the component', () => {
    const wrapper = shallow(<Description />);
    expect(wrapper.find('.description__logo')).to.be.equal(config.description.logoName);
  });
});
