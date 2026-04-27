const chargeLevels = [
  { display: 100.0, kwh: 0.0 },
  { display: 93.75, kwh: 0.0 },
  { display: 87.5, kwh: 1.12 },
  { display: 81.25, kwh: 2.25 },
  { display: 75.0, kwh: 4.5 },
  { display: 68.75, kwh: 6.74 },
  { display: 62.5, kwh: 7.87 },
  { display: 56.25, kwh: 10.12 },
  { display: 50.0, kwh: 12.36 },
  { display: 43.75, kwh: 13.49 },
  { display: 37.5, kwh: 15.74 },
  { display: 31.25, kwh: 16.86 },
  { display: 25.0, kwh: 17.98 },
  { display: 18.75, kwh: 20.23 },
  { display: 12.5, kwh: 22.48 },
  { display: 6.25, kwh: 23.6 },
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

function updateResult(index) {
  activeIndex = index;

  document.querySelectorAll(".wheel-option").forEach((option, optionIndex) => {
    option.classList.toggle("active", optionIndex === index);
    option.setAttribute("aria-selected", optionIndex === index ? "true" : "false");
  });

  const selection = chargeLevels[index];
  kwhValue.textContent = formatNumber(selection.kwh);
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
