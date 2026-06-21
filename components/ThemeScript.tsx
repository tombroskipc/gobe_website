const themeScript = `
(function () {
  try {
    var key = "gobe:theme";
    var storedTheme = window.localStorage.getItem(key);
    var theme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    root.style.colorScheme = theme;
  } catch (error) {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
