document.getElementById("quadForm").addEventListener("submit", function (event) {
  event.preventDefault();

  let a = parseFloat(document.getElementById("a").value);
  let b = parseFloat(document.getElementById("b").value);
  let c = parseFloat(document.getElementById("c").value);
  let resultBox = document.getElementById("result");

  if (a === 0) {
    resultBox.innerHTML = "⚠️ This is not a quadratic equation (a ≠ 0).";
    return;
  }

  let discriminant = b * b - 4 * a * c;
  let root1, root2;

  if (discriminant > 0) {
    root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    resultBox.innerHTML = `✅ Roots are real and distinct:<br> x₁ = ${root1.toFixed(2)}, x₂ = ${root2.toFixed(2)}`;
  } else if (discriminant === 0) {
    root1 = -b / (2 * a);
    resultBox.innerHTML = `✅ Roots are real and equal:<br> x = ${root1.toFixed(2)}`;
  } else {
    let realPart = (-b / (2 * a)).toFixed(2);
    let imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);
    resultBox.innerHTML = `✅ Roots are complex:<br> x₁ = ${realPart} + ${imagPart}i, x₂ = ${realPart} - ${imagPart}i`;
  }
});