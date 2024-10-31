import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { updateCustomerAddress } from "../../../api/customers";

const CheckboxWrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const StyledCheckbox = styled.input`
  display: none;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgb(var(--purple-dark));
  cursor: pointer;
  position: relative;
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.75px;
  font-style: italic;
`;

const CheckboxSpan = styled.span`
  display: inline-block;
  position: relative;
  background-color: transparent;
  width: 25px;
  height: 25px;
  border: 2.5px solid rgb(var(--purple-dark));
  border-radius: 50%;
  margin-bottom: 5px;
  transition: background-color 150ms 200ms, transform 350ms cubic-bezier(0.78, -1.22, 0.17, 1.89);

  &:before,
  &:after {
    content: "";
    width: 0;
    height: 2px;
    border-radius: 2px;
    background: rgb(var(--purple-dark));
    position: absolute;
    transition: width 50ms ease;
    transform-origin: 0% 0%;
  }

  &:before {
    transform: rotate(45deg);
    top: 10px;
    left: 7px;
  }

  &:after {
    transform: rotate(305deg);
    top: 14px;
    left: 8px;
  }

  ${Label}:hover & {
    &:before {
      width: 5px;
      transition: width 100ms ease;
    }

    &:after {
      width: 10px;
      transition: width 150ms ease 100ms;
    }
  }
`;

const CheckboxLabel = styled(Label)`
  ${StyledCheckbox}:checked + & ${CheckboxSpan} {
    background-color: rgb(var(--purple-dark));
    transform: scale(1.25);
  }

  ${StyledCheckbox}:checked + & ${CheckboxSpan}:before {
    width: 5px;
    background: rgb(var(--cream));
    transition: width 150ms ease 100ms;
  }

  ${StyledCheckbox}:checked + & ${CheckboxSpan}:after {
    width: 10px;
    background: rgb(var(--cream));
    transition: width 150ms ease 100ms;
  }
`;

const AddressCheckbox = ({ onSave }) => {
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = async () => {
    setChecked((prevChecked) => !prevChecked);
    if (!checked) {
      await onSave(() => setChecked(false)); // Pass reset function
    }
  };

  useEffect(() => {
    setChecked(false); // Ensure checkbox is reset on each render
  }, []);

  return (
    <CheckboxWrapper>
      <StyledCheckbox type="checkbox" id="check-24" checked={checked} onChange={handleCheckboxChange} />
      <Label htmlFor="check-24">
        <CheckboxSpan />
        <span>Update</span>
      </Label>
    </CheckboxWrapper>
  );
};


export default AddressCheckbox;
