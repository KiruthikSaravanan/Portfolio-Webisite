const themeStorageKey = "kiruthik-theme";
const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let savedTheme = null;

try {
  savedTheme = localStorage.getItem(themeStorageKey);
} catch (error) {
  console.warn("Theme preference could not be read from local storage.", error);
}

const initialTheme = savedTheme === "light" || savedTheme === "dark"
  ? savedTheme
  : systemPrefersDark ? "dark" : "light";

function setTheme(theme, savePreference = false) {
  root.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  document.querySelector('meta[name="theme-color"]').setAttribute(
    "content",
    theme === "dark" ? "#211f1d" : "#eeeae0"
  );

  if (savePreference) {
    try {
      localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
      console.warn("Theme preference could not be saved to local storage.", error);
    }
  }
}

setTheme(initialTheme);

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
});
