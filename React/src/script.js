// script.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quadForm");
  const output = document.getElementById("output");
  const exampleBtn = document.getElementById("exampleBtn");
  const aInput = document.getElementById("a");
  const bInput = document.getElementById("b");
  const cInput = document.getElementById("c");

  function formatNum(n) {
    // format number: limit to 8 decimals, remove trailing zeros
    if (Number.isInteger(n)) return String(n);
    return Number.parseFloat(n.toFixed(8)).toString();
  }

  function show(message, isError = false) {
    output.innerHTML = isError
      ? `<div class="error">${message}</div>`
      : `<pre>${message}</pre>`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const a = parseFloat(aInput.value);
    const b = parseFloat(bInput.value);
    const c = parseFloat(cInput.value);

    // Validate
    if (Number.isNaN(a) || Number.isNaN(b) || Number.isNaN(c)) {
      show("Please enter valid numeric coefficients for a, b and c.", true);
      return;
    }

    if (a === 0) {
      // Not quadratic
      if (b === 0) {
        if (c === 0) {
          show("All coefficients are 0 → every number is a solution (0 = 0).");
        } else {
          show("a = 0 and b = 0 but c ≠ 0 → no solution (inconsistent).", true);
        }
      } else {
        // Linear bx + c = 0 -> x = -c/b
        const x = -c / b;
        show(
          `Since a = 0, equation is linear: ${formatNum(b)}x + ${formatNum(
            c
          )} = 0\nRoot: x = -c/b = ${formatNum(x)}`
        );
      }
      return;
    }

    // Quadratic case
    const discriminant = b * b - 4 * a * c;
    const twoA = 2 * a;
    let resultText = `Equation: ${formatNum(a)}x² + ${formatNum(b)}x + ${formatNum(c)} = 0\n`;
    resultText += `Discriminant (D) = b² - 4ac = ${formatNum(
      b
    )}² - 4·${formatNum(a)}·${formatNum(c)} = ${formatNum(discriminant)}\n`;

    // Explain discriminant meaning
    if (discriminant > 0) {
      resultText += "➡ D > 0 → Roots are real and distinct.\n\n";
      const sqrtD = Math.sqrt(discriminant);
      const x1 = (-b + sqrtD) / twoA;
      const x2 = (-b - sqrtD) / twoA;
      resultText += `x₁ = (-b + √D) / (2a) = (${formatNum(-b)} + ${formatNum(
        sqrtD
      )}) / ${formatNum(twoA)} = ${formatNum(x1)}\n`;
      resultText += `x₂ = (-b - √D) / (2a) = (${formatNum(-b)} - ${formatNum(
        sqrtD
      )}) / ${formatNum(twoA)} = ${formatNum(x2)}`;
      show(resultText);
    } else if (discriminant === 0) {
      resultText += "➡ D = 0 → Roots are real and equal (repeated root).\n\n";
      const x = -b / twoA;
      resultText += `x = -b / (2a) = ${formatNum(x)}`;
      show(resultText);
    } else {
      resultText += "➡ D < 0 → Roots are complex conjugates.\n\n";
      const absD = Math.abs(discriminant);
      const sqrtAbsD = Math.sqrt(absD);
      const realPart = -b / twoA;
      const imagPart = sqrtAbsD / twoA;
      resultText += `x₁ = ${formatNum(realPart)} + ${formatNum(imagPart)}i\n`;
      resultText += `x₂ = ${formatNum(realPart)} - ${formatNum(imagPart)}i`;
      show(resultText);
    }
  });

  exampleBtn.addEventListener("click", () => {
    // example: 1x^2 - 3x + 2 = 0 -> roots 1 and 2
    aInput.value = "1";
    bInput.value = "-3";
    cInput.value = "2";
  });
});
