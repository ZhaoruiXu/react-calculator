import React from "react";
import { calculatorButtons } from "../data/calculator-bonus-03-button-data";

const Keypad = ({ handleButton }) => {
  return (
    <div className='keypad'>
      {calculatorButtons.map((button, index) => {
        return (
          <button
            key={index}
            onClick={() => {
              handleButton(button.type, button.text.toString());
            }}
            className={`${button.type} ${button.className}`}
            style={{ gridArea: button.className }}
            value={button.value}>
            {button.text}
          </button>
        );
      })}
    </div>
  );
};

export default Keypad;
