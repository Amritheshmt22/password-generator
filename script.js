const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  number: "0123456789",
  symbol: "!@#$%^&*()-_=+[]{}"
};
const SIMILAR = new Set(["l", "1", "I", "O", "0"]);

const passwordOutput = document.getElementById("passwordOutput");
const copyButton = document.getElementById("copyButton");
const lengthRange = document.getElementById("lengthRange");
const lengthValue = document.getElementById("lengthValue");
const optUpper = document.getElementById("optUpper");
const optLower = document.getElementById("optLower");
const optNumber = document.getElementById("optNumber");
const optSymbol = document.getElementById("optSymbol");
const optNoSimilar = document.getElementById("optNoSimilar");
const generateButton = document.getElementById("generateButton");
const strengthFill = document.getElementById("strengthFill");
const strengthLabel = document.getElementById("strengthLabel");
const errorText = document.getElementById("errorText");

let currentPassword = "";

function randomIndex(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function buildCharset(options) {
  let chars = "";
  if (options.upper) chars += SETS.upper;
  if (options.lower) chars += SETS.lower;
  if (options.number) chars += SETS.number;
  if (options.symbol) chars += SETS.symbol;
  if (options.noSimilar) {
    chars = chars.split("").filter((ch) => !SIMILAR.has(ch)).join("");
  }
  return chars;
}

function rateStrength(length, setCount) {
  const score = length >= 20 ? 3 : length >= 12 ? 2 : length >= 8 ? 1 : 0;
  const variety = setCount >= 3 ? 2 : setCount >= 2 ? 1 : 0;
  const total = score + variety;
  if (total >= 4) return { label: "Strong", className: "strong", width: 100 };
  if (total >= 3) return { label: "Good", className: "good", width: 72 };
  if (total >= 2) return { label: "Fair", className: "fair", width: 45 };
  return { label: "Weak", className: "weak", width: 22 };
}

function readOptions() {
  return {
    length: Number(lengthRange.value),
    upper: optUpper.checked,
    lower: optLower.checked,
    number: optNumber.checked,
    symbol: optSymbol.checked,
    noSimilar: optNoSimilar.checked
  };
}

function setError(message) {
  errorText.textContent = message || "";
  errorText.hidden = !message;
}

function renderStrength(rating) {
  strengthFill.className = `strength-fill ${rating.className}`;
  strengthFill.style.width = `${rating.width}%`;
  strengthLabel.textContent = `Strength: ${rating.label}`;
}

function generate(options) {
  const opts = options || readOptions();
  const charset = buildCharset(opts);
  if (charset.length === 0) {
    setError("Select at least one character set.");
    return null;
  }
  setError("");
  let password = "";
  for (let i = 0; i < opts.length; i += 1) {
    password += charset[randomIndex(charset.length)];
  }
  if (!options) {
    currentPassword = password;
    passwordOutput.textContent = password;
    const setCount = [opts.upper, opts.lower, opts.number, opts.symbol].filter(Boolean).length;
    renderStrength(rateStrength(opts.length, setCount));
    copyButton.textContent = "Copy";
  }
  return password;
}

async function copyPassword() {
  if (!currentPassword) {
    copyButton.textContent = "Nothing to copy";
    return "empty";
  }
  try {
    await navigator.clipboard.writeText(currentPassword);
    copyButton.textContent = "Copied!";
    return "copied";
  } catch (error) {
    const helper = document.createElement("textarea");
    helper.value = currentPassword;
    document.body.appendChild(helper);
    helper.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    helper.remove();
    copyButton.textContent = ok ? "Copied!" : "Copy failed";
    return ok ? "copied" : "failed";
  }
}

lengthRange.addEventListener("input", () => {
  lengthValue.textContent = lengthRange.value;
});

generateButton.addEventListener("click", () => generate());
copyButton.addEventListener("click", copyPassword);

[optUpper, optLower, optNumber, optSymbol].forEach((box) => {
  box.addEventListener("change", () => {
    if (!optUpper.checked && !optLower.checked && !optNumber.checked && !optSymbol.checked) {
      setError("Select at least one character set.");
    } else {
      setError("");
    }
  });
});

window.pwGen = {
  generate,
  buildCharset,
  rateStrength,
  copyPassword,
  getState() {
    return {
      password: currentPassword,
      options: readOptions(),
      strengthLabel: strengthLabel.textContent,
      error: errorText.hidden ? "" : errorText.textContent
    };
  }
};

generate();
