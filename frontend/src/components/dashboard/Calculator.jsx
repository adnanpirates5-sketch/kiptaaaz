import React, { useState } from 'react';
import './Calculator.css';

const Calculator = ({ onUseResult, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState('');
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [operator, setOperator] = useState(null);
  const [prevValue, setPrevValue] = useState(null);

  const handleDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const handleDoubleZero = () => {
    if (waitingForOperand) {
      setDisplay('0');
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? '0' : display + '00');
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setHistory('');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const clearDisplay = () => {
    setDisplay('0');
  };

  const performCalculation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
    setHistory(`${prevValue === null ? inputValue : calculate(prevValue, inputValue, operator)} ${nextOperator}`);
  };

  const calculate = (op1, op2, op) => {
    switch (op) {
      case '+': return op1 + op2;
      case '-': return op1 - op2;
      case '×': return op1 * op2;
      case '÷': return op2 !== 0 ? op1 / op2 : 0;
      case '%': return (op1 * op2) / 100;
      default: return op2;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (operator && prevValue !== null) {
      const result = calculate(prevValue, inputValue, operator);
      setDisplay(String(result));
      setHistory('');
      setPrevValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  const handleUseResult = () => {
    if (onUseResult) {
      onUseResult(display);
    }
    if (onClose) onClose();
  };

  return (
    <div className="kipta-calc-container">
      <div className="kipta-calc-display">
        <div className="kipta-calc-history">{history}</div>
        <div className="kipta-calc-result">{display}</div>
      </div>
      <div className="kipta-calc-grid">
        <button className="kipta-calc-btn clear" onClick={clearAll}>AC</button>
        <button className="kipta-calc-btn" onClick={clearDisplay}>C</button>
        <button className="kipta-calc-btn operator" onClick={() => performCalculation('%')}>%</button>
        <button className="kipta-calc-btn operator" onClick={() => performCalculation('÷')}>÷</button>
        
        <button className="kipta-calc-btn" onClick={() => handleDigit(7)}>7</button>
        <button className="kipta-calc-btn" onClick={() => handleDigit(8)}>8</button>
        <button className="kipta-calc-btn" onClick={() => handleDigit(9)}>9</button>
        <button className="kipta-calc-btn operator" onClick={() => performCalculation('×')}>×</button>
        
        <button className="kipta-calc-btn" onClick={() => handleDigit(4)}>4</button>
        <button className="kipta-calc-btn" onClick={() => handleDigit(5)}>5</button>
        <button className="kipta-calc-btn" onClick={() => handleDigit(6)}>6</button>
        <button className="kipta-calc-btn operator" onClick={() => performCalculation('-')}>-</button>
        
        <button className="kipta-calc-btn" onClick={() => handleDigit(1)}>1</button>
        <button className="kipta-calc-btn" onClick={() => handleDigit(2)}>2</button>
        <button className="kipta-calc-btn" onClick={() => handleDigit(3)}>3</button>
        <button className="kipta-calc-btn operator" onClick={() => performCalculation('+')}>+</button>
        
        <button className="kipta-calc-btn" onClick={() => handleDigit(0)}>0</button>
        <button className="kipta-calc-btn" onClick={handleDoubleZero}>00</button>
        <button className="kipta-calc-btn" onClick={handleDecimal}>.</button>
        <button className="kipta-calc-btn equals" onClick={handleEquals}>=</button>
      </div>
      <div className="kipta-calc-actions">
        <button className="kipta-use-result-btn" onClick={handleUseResult}>
          Use Result
        </button>
      </div>
    </div>
  );
};

export default Calculator;
