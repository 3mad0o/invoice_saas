import React from 'react';
import Select, { Props as SelectProps } from 'react-select';

export interface Option {
  value: string;
  label: string;
}

export interface StyledSelectProps extends SelectProps<Option, false> {
  // You can add any custom props here if needed
}

const StyledSelect: React.FC<StyledSelectProps> = (props) => {
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: '0.5rem',
      borderColor: 'hsl(var(--border))',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'hsl(var(--ring))',
      },
    }),
    input: (provided: any) => ({
      ...provided,
      color: 'hsl(var(--foreground))',
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '0.5rem',
      backgroundColor: 'white',
      borderColor: 'hsl(var(--border))',
    }),
    option: (provided: any, state: { isSelected: any; isFocused: any; }) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'hsl(var(--primary))'
        : state.isFocused
        ? 'hsl(var(--accent))'
        : 'hsl(var(--background))',
      color: state.isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
      '&:active': {
        backgroundColor: 'hsl(var(--primary))',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'hsl(var(--foreground))',
    }),
  };

  return <Select styles={customStyles} {...props} />;
};

export default StyledSelect;
