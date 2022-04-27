import React from "react";
import Display from "./Display";
import Keypad from "./Keypad";
import { useState, useEffect } from "react";
const mathjs = require("mathjs");

function App() {
  const [numberInput1, setNumberInput1] = useState("");
  const [numberInput2, setNumberInput2] = useState("");
  const [operatorInput, setOperatorInput] = useState("");
  const [memory, setMemory] = useState("");
  const [result, setResult] = useState("");
  const [display, setDisplay] = useState("");

  const handleButton = (userInputType, userInputValue) => {
    // number and deicmal input
    if (userInputType === "number" || userInputType === "decimal") {
      if (
        !result ||
        result === "Syntax Error" ||
        result === "NaN" ||
        result === "Infinity"
      ) {
        // first numebr input
        setNumberInput1(userInputValue);
        setResult(userInputValue);
      } else {
        // following input
        if (result.length < 16) {
          // check for duplicated "."
          if (userInputValue === ".") {
            if (!numberInput2 && !operatorInput && numberInput1.includes(".")) {
              return;
            } else if (numberInput2.includes(".")) {
              return;
            }
          }
          // avoid two 0's in the beginning
          if (
            !operatorInput &&
            numberInput1.length === 1 &&
            userInputValue === "0" &&
            numberInput1.charAt(0) === "0"
          ) {
            return;
          } else if (
            numberInput2.length === 1 &&
            userInputValue === "0" &&
            numberInput2.charAt(0) === "0"
          ) {
            return;
          }

          // concate following number input to first number input
          if (!operatorInput) {
            setNumberInput1(prev => {
              return prev.concat(userInputValue);
            });
          } else {
            // there is an operatorInput then set second number input
            setNumberInput2(prev => {
              return prev.concat(userInputValue);
            });
          }

          setResult(prev => {
            return prev.concat(userInputValue);
          });
        }
      }
    }

    // operator and equal input
    else if (userInputType === "operator" || userInputType === "enter") {
      if (
        !result ||
        result === "Syntax Error" ||
        result === "NaN" ||
        result === "Infinity"
      ) {
        // not allowing operator before number input and with error
        return;
      } else {
        if (!operatorInput) {
          if (userInputValue !== "=") {
            setOperatorInput(userInputValue);
            //display
            setResult(prev => {
              return prev.concat(userInputValue);
            });
          }
        } else if (!numberInput2) {
          // if want to overwrite operator
          if (userInputValue !== "=") {
            setOperatorInput(userInputValue);
            setResult(prev => {
              return prev.substring(0, prev.length - 1).concat(userInputValue);
            });
          }
        }
      }
      if (numberInput1 && operatorInput && numberInput2) {
        // if not including number, signs only
        if (
          /\d/.test(numberInput1) === false ||
          /\d/.test(numberInput2) === false
        ) {
          setResult("Syntax Error");
          setNumberInput2("");
          setOperatorInput("");
          return;
        } else if (numberInput2 === "0") {
          setResult("Infinity");
          setNumberInput2("");
          setOperatorInput("");
          return;
        }

        let result;

        switch (operatorInput) {
          case "+":
            result = mathjs.evaluate(`${numberInput1} + ${numberInput2}`);
            break;
          case "-":
            result = mathjs.evaluate(`${numberInput1} - ${numberInput2}`);
            break;
          case "\u00d7":
            result = mathjs.evaluate(`${numberInput1} * ${numberInput2}`);
            break;
          case "\u00f7":
            result = mathjs.evaluate(`${numberInput1} / ${numberInput2}`);
            break;
          default:
            return result;
        }

        setNumberInput1(result.toString());
        setNumberInput2("");
        if (userInputValue !== "=") {
          setOperatorInput(userInputValue);
          setResult(result.toString().concat(userInputValue));
        } else {
          setOperatorInput("");
          setResult(result.toString());
        }
      }
    }

    // clear input
    else if (userInputValue === "C") {
      if (
        result === "Syntax Error" ||
        result === "NaN" ||
        result === "Infinity"
      ) {
        setResult("");
        setNumberInput2("");
        setOperatorInput("");
      }
      if (numberInput2) {
        setNumberInput2(prev => {
          return prev.substring(0, prev.length - 1);
        });
      } else if (operatorInput) {
        setOperatorInput(prev => {
          return prev.substring(0, prev.length - 1);
        });
      } else if (numberInput1) {
        setNumberInput1(prev => {
          return prev.substring(0, prev.length - 1);
        });
      }
      // display
      setResult(prev => {
        return prev.substring(0, prev.length - 1);
      });
    }

    // all clear input
    else if (userInputValue === "AC") {
      setResult("");
      setNumberInput1("");
      setNumberInput2("");
      setOperatorInput("");
    }

    // sign-change input
    else if (userInputType === "sign") {
      if (numberInput1 && !operatorInput && !numberInput2) {
        setNumberInput1(prev => {
          const reverseSign = parseInt(prev) * -1;
          return reverseSign.toString();
        });
        setResult(prev => {
          const reverseSign = parseInt(prev) * -1;
          return reverseSign.toString();
        });
      }
    }

    // percent operator input
    else if (userInputType === "percent-operator") {
      if (numberInput1 && !operatorInput && !numberInput2) {
        setNumberInput1(prev => {
          const percentInput = parseInt(prev) * 0.01;
          return percentInput.toString();
        });
        setResult(prev => {
          const percentInput = parseInt(prev) * 0.01;
          return percentInput.toString();
        });
      }
    }

    // square-root operator input
    else if (userInputType === "square-root-operator") {
      if (numberInput1 && !operatorInput && !numberInput2) {
        setNumberInput1(prev => {
          const squareRootInput = mathjs.sqrt(parseInt(prev));
          return squareRootInput.toString();
        });
        setResult(prev => {
          const squareRootInput = mathjs.sqrt(parseInt(prev));
          return squareRootInput.toString();
        });
      }
    }

    // memory input
    else if (userInputType === "memory") {
      if (!operatorInput && !numberInput2) {
        if (
          result === "Syntax Error" ||
          result === "NaN" ||
          result === "Infinity"
        ) {
          setResult("");
          setNumberInput2("");
          setOperatorInput("");
          return;
        }
        let memoryMath;
        switch (userInputValue) {
          case "MS":
            setMemory(numberInput1);
            break;
          case "MC":
            setMemory("");
            break;
          case "MR":
            setNumberInput1(memory);
            setResult(memory);
            break;
          case "M-":
            if (result !== "" && memory !== "") {
              setMemory(prev => {
                memoryMath = mathjs.evaluate(`${prev} - ${result}`);
                return memoryMath.toString();
              });
            }
            break;
          case "M+":
            if (result !== "" && memory !== "") {
              setMemory(prev => {
                memoryMath = mathjs.evaluate(`${prev} + ${result}`);
                return memoryMath.toString();
              });
            }
            break;
          default:
            return;
        }
      }
    }
  };

  useEffect(() => {
    console.log(numberInput1, operatorInput, numberInput2, result, memory);
    setDisplay(result);
  }, [numberInput2, operatorInput, numberInput1, result, memory]);

  return (
    <div className='App'>
      <header>
        <h1>React Calcualtor</h1>
      </header>
      <Display displayInput={display} />
      <Keypad handleButton={handleButton} />
      <footer>
        <p>&copy; {new Date().getFullYear()} Rui Xu</p>
      </footer>
    </div>
  );
}

export default App;
