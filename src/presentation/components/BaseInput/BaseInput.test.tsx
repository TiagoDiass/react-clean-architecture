import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import faker from 'faker';
import { FormContext } from '@/presentation/contexts';
import { BaseInput } from '..';

const makeSut = (fieldName: string) => {
  return render(
    <FormContext.Provider value={{ state: {} }}>
      <BaseInput name={fieldName} />
    </FormContext.Provider>
  );
};

describe('BaseInput Component', () => {
  it('should focus on the input element when clicking on the label', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const input = sut.getByTestId(`${fieldName}-input`);
    const label = sut.getByTestId(`${fieldName}-label`);
    fireEvent.click(label);
    expect(document.activeElement).toBe(input);
  });
});
