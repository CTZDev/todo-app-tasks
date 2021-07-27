const d = document;

export default function darkTheme() {
  let mq = matchMedia("(prefers-color-scheme: dark)");

  function lightTheme() {
    d.body.classList.remove("dark-theme");
    d.body.classList.add("light-theme");
    changeThemeImage("moon", "Icon Dark Mode");
    localStorage.setItem("theme", "light");
  }

  function darkTheme() {
    d.body.classList.add("dark-theme");
    d.body.classList.remove("light-theme");
    changeThemeImage("sun", "Icon Light Mode");
    localStorage.setItem("theme", "dark");
  }

  function changeThemeImage(imgSrc, alt) {
    const $imgDarkTheme = d.querySelector(".dark-theme-img [data-icon-theme]");
    $imgDarkTheme.setAttribute("src", `./images/icon-${imgSrc}.svg`);
    $imgDarkTheme.setAttribute("alt", alt);
  }

  function changeTheme(e) {
    e.matches ? darkTheme() : lightTheme();
  }
  mq.addEventListener("change", changeTheme);

  d.addEventListener("click", (e) => {
    if (e.target.matches(".dark-theme-img")) {
      if (d.body.classList.contains("dark-theme")) {
        lightTheme();
      } else {
        darkTheme();
      }
    }
  });

  d.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === undefined) localStorage.setItem("theme", "light");
    if (localStorage.getItem("theme") === "light") lightTheme();
    if (localStorage.getItem("theme") === "dark") darkTheme();
  });
}
