document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("input");
  const resultField = document.getElementById("result");
  let currentInput = "";
  let lastResult = "";

  // Function to update the display for both input and result
  const updateDisplay = () => {
    inputField.textContent = currentInput;
    resultField.textContent = lastResult || ""; // Show last result or nothing
  };

  // Add event listeners to each button
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const value = e.target.textContent;

      switch (value) {
        case "Enter":
          // Try to evaluate the expression when Enter (equals) is pressed
          try {
            currentInput = currentInput.replace(/x/g, "*").replace(/÷/g, "/");
            lastResult = eval(currentInput).toString(); // Evaluate the expression
            if (lastResult === Infinity || isNaN(lastResult)) {
              throw new Error("Invalid result");
            }
            currentInput = lastResult; // Set currentInput to the result for next calculations
          } catch {
            resultField.textContent = "Error"; // Handle invalid expressions
            currentInput = ""; // Reset the current input
            lastResult = "";
          }
          break;

        case "clear":
          currentInput = ""; // Clear input and result
          lastResult = "";
          resultField.textContent = "";
          break;

        case "del":
          currentInput = currentInput.slice(0, -1);
          break;

        case "ans":
          // Use last result and append it to the input
          currentInput += lastResult || "";
          break;

        case "√":
          // Calculate the square root of the current input expression
          try {
            currentInput = Math.sqrt(eval(currentInput)).toString();
            lastResult = currentInput;
          } catch {
            resultField.textContent = "Error";
            currentInput = "";
            lastResult = "";
          }
          break;

        // Handle all number and operator buttons
        case "+":
        case "-":
        case "x":
        case "÷":
        case "%":
          currentInput += ` ${value} `;
          break;

        // Handle number buttons (0-9) and decimal point
        default:
          currentInput += value;
          break;
      }

      updateDisplay();
    });
  });
});
