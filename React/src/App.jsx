import React, { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");

  // Append value to input
  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  // Clear input
  const handleClear = () => {
    setInput("");
  };

  // Delete last character
  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  // Evaluate expression safely
  const handleEqual = () => {
    try {
      // Replace math symbols with JS equivalents
      let expression = input
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log")
        .replace(/√/g, "Math.sqrt")
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/\^/g, "**"); // for exponentiation

      setInput(eval(expression).toString());
    } catch (error) {
      setInput("Error");
    }
  };

  return (
    <div className="calculator">
      <div className="display">{input || "0"}</div>
      <div className="buttons">
        {/* First Row */}
        <button onClick={handleClear} className="function">C</button>
        <button onClick={handleBackspace} className="function">⌫</button>
        <button onClick={() => handleClick("(")}>(</button>
        <button onClick={() => handleClick(")")}>)</button>

        {/* Second Row */}
        <button onClick={() => handleClick("sin(")}>sin</button>
        <button onClick={() => handleClick("cos(")}>cos</button>
        <button onClick={() => handleClick("tan(")}>tan</button>
        <button onClick={() => handleClick("√(")}>√</button>

        {/* Third Row */}
        <button onClick={() => handleClick("log(")}>log</button>
        <button onClick={() => handleClick("ln(")}>ln</button>
        <button onClick={() => handleClick("^")}>x^y</button>
        <button onClick={() => handleClick("%")}>%</button>

        {/* Numbers & Basic Ops */}
        <button onClick={() => handleClick("7")}>7</button>
        <button onClick={() => handleClick("8")}>8</button>
        <button onClick={() => handleClick("9")}>9</button>
        <button onClick={() => handleClick("/")}>÷</button>

        <button onClick={() => handleClick("4")}>4</button>
        <button onClick={() => handleClick("5")}>5</button>
        <button onClick={() => handleClick("6")}>6</button>
        <button onClick={() => handleClick("*")}>×</button>

        <button onClick={() => handleClick("1")}>1</button>
        <button onClick={() => handleClick("2")}>2</button>
        <button onClick={() => handleClick("3")}>3</button>
        <button onClick={() => handleClick("-")}>−</button>

        <button onClick={() => handleClick("0")}>0</button>
        <button onClick={() => handleClick(".")}>.</button>
        <button onClick={() => handleClick("π")}>π</button>
        <button onClick={() => handleClick("+")}>+</button>

        {/* Last Row */}
        <button onClick={() => handleClick("e")}>e</button>
        <button onClick={handleEqual} className="equal">=</button>
      </div>
    </div>
  );
}

export default App;