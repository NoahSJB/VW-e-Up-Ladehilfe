const chargeLevels = [
  { display: 100.0, kwh: 0 },
  { display: 93.75, kwh: 0 },
  { display: 87.5, kwh: 1 },
  { display: 81.25, kwh: 2 },
  { display: 75.0, kwh: 5 },
  { display: 68.75, kwh: 7 },
  { display: 62.5, kwh: 8 },
  { display: 56.25, kwh: 10 },
  { display: 50.0, kwh: 12 },
  { display: 43.75, kwh: 13 },
  { display: 37.5, kwh: 16 },
  { display: 31.25, kwh: 17 },
  { display: 25.0, kwh: 18 },
  { display: 18.75, kwh: 20 },
  { display: 12.5, kwh: 22 },
  { display: 6.25, kwh: 24 },
];

const wheel = document.getElementById("wheel");
const kwhValue = document.getElementById("kwhValue");
const selectedDisplay = document.getElementById("selectedDisplay");
const jumpButtons = document.querySelectorAll("[data-jump]");
const rowHeight = 58;

let activeIndex = 0;
let scrollTimeout;

function formatNumber(value) {
  return value.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatWholeNumber(value) {
  return value.toLocaleString("de-DE", {
    maximumFractionDigits: 0,
  });
}

function updateResult(index) {
  activeIndex = index;

  document.querySelectorAll(".wheel-option").forEach((option, optionIndex) => {
    option.classList.toggle("active", optionIndex === index);
    option.setAttribute("aria-selected", optionIndex === index ? "true" : "false");
  });

  const selection = chargeLevels[index];
  kwhValue.textContent = formatWholeNumber(selection.kwh);
  selectedDisplay.textContent = `${formatNumber(selection.display)}%`;
}

function scrollToIndex(index, behavior = "smooth") {
  const target = index * rowHeight;
  wheel.scrollTo({ top: target, behavior });
  updateResult(index);
}

function nearestIndex() {
  return Math.max(
    0,
    Math.min(chargeLevels.length - 1, Math.round(wheel.scrollTop / rowHeight))
  );
}

chargeLevels.forEach((item, index) => {
  const option = document.createElement("button");
  option.type = "button";
  option.className = "wheel-option";
  option.textContent = `${formatNumber(item.display)}%`;
  option.setAttribute("role", "option");
  option.addEventListener("click", () => scrollToIndex(index));
  wheel.appendChild(option);
});

wheel.setAttribute("role", "listbox");
wheel.addEventListener("scroll", () => {
  updateResult(nearestIndex());

  window.clearTimeout(scrollTimeout);
  scrollTimeout = window.setTimeout(() => {
    scrollToIndex(nearestIndex());
  }, 90);
});

jumpButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetValue = Number(button.dataset.jump);
    const index = chargeLevels.findIndex((item) => item.display === targetValue);

    if (index >= 0) {
      scrollToIndex(index);
    }
  });
});

scrollToIndex(0, "auto");
