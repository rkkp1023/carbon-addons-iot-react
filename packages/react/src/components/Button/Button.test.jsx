import React from 'react';
import { mount } from 'enzyme';
import { Loading } from 'carbon-components-react';
import { render, screen } from '@testing-library/react';
import { Add16 } from '@carbon/icons-react';

import { settings } from '../../constants/Settings';

import Button from './Button';

const { iotPrefix, prefix } = settings;

const commonProps = {
  onClick: jest.fn(),
};

const iconSelectionCommonProps = {
  kind: 'icon-selection',
  renderIcon: Add16,
  iconDescription: 'Button icon',
};

describe('Button', () => {
  it('loading', () => {
    const wrapper = mount(
      <Button loading {...commonProps}>
        Click Me
      </Button>
    );
    expect(wrapper.find(Loading)).toHaveLength(1);
    const notLoadingWrapper = mount(<Button {...commonProps}>Click Me</Button>);
    expect(notLoadingWrapper.find(Loading)).toHaveLength(0);
  });
  it('should render when kind icon-selection', () => {
    render(<Button {...commonProps} {...iconSelectionCommonProps} hasIconOnly />);
    expect(screen.getByRole('button')).toBeTruthy();
  });
  it('should render as hasIconOnly when kind icon-selection', () => {
    render(<Button {...commonProps} {...iconSelectionCommonProps} />);
    expect(screen.getByRole('button')).toBeTruthy();
    expect(screen.getByRole('button').classList.contains(`${prefix}--btn--icon-only`)).toBe(true);
  });
  it('should render when kind icon-selection recommended', () => {
    render(<Button {...commonProps} {...iconSelectionCommonProps} recommended hasIconOnly />);
    expect(screen.getByRole('button')).toBeTruthy();
    expect(
      screen.getByRole('button').classList.contains(`${iotPrefix}--btn-icon-selection--recommended`)
    ).toBe(true);
  });
  it('should render when kind icon-selection recommended selected', () => {
    render(
      <Button {...commonProps} {...iconSelectionCommonProps} recommended hasIconOnly selected />
    );
    expect(screen.getByRole('button')).toBeTruthy();
    expect(
      screen.getByRole('button').classList.contains(`${iotPrefix}--btn-icon-selection--recommended`)
    ).toBe(true);
    expect(
      screen.getByRole('button').classList.contains(`${iotPrefix}--btn-icon-selection--selected`)
    ).toBe(true);
  });
  it('should render when kind icon-selection selected', () => {
    render(<Button {...commonProps} {...iconSelectionCommonProps} hasIconOnly selected />);
    expect(screen.getByRole('button')).toBeTruthy();
    expect(
      screen.getByRole('button').classList.contains(`${iotPrefix}--btn-icon-selection--selected`)
    ).toBe(true);
  });
});
