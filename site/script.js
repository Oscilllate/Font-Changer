const editor = document.getElementById("textInput");
const output = document.getElementById("output"); // NEW output div
const buttons = document.querySelectorAll(".toolbar button");
const copyButton = document.getElementById("copyButton");

let currentFont = "default"; // null = normal font

const charMaps = {
  default: { offsetUpper: 0, offsetLower: 0 },
  bold: { offsetUpper: 0x1D400, offsetLower: 0x1D41A },
  italic: { offsetUpper: 0x1D434, offsetLower: 0x1D44E },
  boldItalic: { offsetUpper: 0x1D468, offsetLower: 0x1D482 },
  script: { offsetUpper: 0x1D49C, offsetLower: 0x1D4B6 },
  boldScript: { offsetUpper: 0x1D4D0, offsetLower: 0x1D4EA },
  fraktur: { offsetUpper: 0x1D504, offsetLower: 0x1D51E },
  boldFraktur: { offsetUpper: 0x1D56C, offsetLower: 0x1D586 },
  monospace: { offsetUpper: 0x1D670, offsetLower: 0x1D68A },
  doubleStruck: { offsetUpper: 0x1D538, offsetLower: 0x1D552 },

  // 🔥 New Gothic-ish variant (heavier, sharp, edgy)
  retro: { offsetUpper: 0x1D5D4, offsetLower: 0x1D5EE }, 

  // 🏰 Old English / Medieval (decorative serifs)
  oldEnglish: { offsetUpper: 0x1D504, offsetLower: 0x1D51E } 
};
const oldEnglishMap = {
  A: "𝔄", B: "𝔅", C: "ℭ", D: "𝔇", E: "𝔈", F: "𝔉", G: "𝔊",
  H: "ℌ", I: "ℑ", J: "𝔍", K: "𝔎", L: "𝔏", M: "𝔐", N: "𝔑",
  O: "𝔒", P: "𝔓", Q: "𝔔", R: "ℜ", S: "𝔖", T: "𝔗", U: "𝔘",
  V: "𝔙", W: "𝔚", X: "𝔛", Y: "𝔜", Z: "ℨ",
  a: "𝔞", b: "𝔟", c: "𝔠", d: "𝔡", e: "𝔢", f: "𝔣", g: "𝔤",
  h: "𝔥", i: "𝔦", j: "𝔧", k: "𝔨", l: "𝔩", m: "𝔪", n: "𝔫",
  o: "𝔬", p: "𝔭", q: "𝔮", r: "𝔯", s: "𝔰", t: "𝔱", u: "𝔲",
  v: "𝔳", w: "𝔴", x: "𝔵", y: "𝔶", z: "𝔷"
};

const retroMap = {
  'A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝',
  'K':'𝗞','L':'𝗟','M':'𝗠','N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧',
  'U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗭',
  'a':'𝗮','b':'𝗯','c':'𝗰','d':'𝗱','e':'𝗲','f':'𝗳','g':'𝗴','h':'𝗵','i':'𝗶','j':'𝗷',
  'k':'𝗸','l':'𝗹','m':'𝗺','n':'𝗻','o':'𝗼','p':'𝗽','q':'𝗾','r':'𝗿','s':'𝘀','t':'𝘁',
  'u':'𝘂','v':'𝘃','w':'𝘄','x':'𝘅','y':'𝘆','z':'𝘇'
};
// Convert normal letters to Unicode
function convertUnicode(text, style = "default") {
  const map = charMaps[style];
  if (!map || style === "default") return text;
  if (style === "oldEnglish") {
  return [...text].map(c => oldEnglishMap[c] || c).join("");
}
  if (style === "retro") {
  return [...text].map(c => retroMap[c] || c).join("");
}


  return [...text].map(c => {
    if (c >= "A" && c <= "Z") return String.fromCodePoint(map.offsetUpper + (c.charCodeAt(0) - 65));
    if (c >= "a" && c <= "z") return String.fromCodePoint(map.offsetLower + (c.charCodeAt(0) - 97));
    return c;
  }).join("");
}

// Apply font to the output div (does NOT touch editor)
function applyFontToOutput(style) {
  currentFont = style;

  const baseText = editor.textContent; // read from input
  output.innerHTML = ""; // clear previous output

  if (!style || style === "default") {
    output.textContent = baseText;
  } else {
    const span = document.createElement("span");
    span.dataset.base = baseText;
    span.dataset.font = style;
    span.textContent = convertUnicode(baseText, style);
    output.appendChild(span);
  }

  updateActiveButton();
}

// Update toolbar buttons
function updateActiveButton() {
  buttons.forEach(btn => btn.classList.toggle("active", btn.dataset.style === currentFont));
}
buttons.forEach(btn => btn.addEventListener("click", () => {
  currentFont = btn.dataset.style || "default";
  updateOutput();
}));
function updateOutput() {
  const baseText = editor.textContent;
  output.innerHTML = "";

  if (!currentFont || currentFont === "default") {
    output.textContent = baseText;
  } else {
    const span = document.createElement("span");
    span.dataset.base = baseText;
    span.dataset.font = currentFont;
    span.textContent = convertUnicode(baseText, currentFont);
    output.appendChild(span);
  }
}
editor.addEventListener("input", () => {
  updateOutput();
});
// Toolbar button clicks
buttons.forEach(btn => btn.addEventListener("click", () => {
  const style = btn.dataset.style || null;
  applyFontToOutput(style);
}));

// Copy output to clipboard
copyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(output.innerText);
});

// Disable unwanted buttons
function disableButtonByName(name = "") {
  if (!name) return;
  const button = document.querySelector(`button[name="${name}"]`);
  if (button) button.disabled = true;
  button.style.opacity = 0.5;
  button.style.cursor = "not-allowed";
}

disableButtonByName("script");
disableButtonByName("italic")
updateActiveButton();
