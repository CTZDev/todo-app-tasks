import darkTheme from "./modules/dark_theme.js";
import todoTask from "./modules/task.js";

const d = document;
d.addEventListener("DOMContentLoaded", (e) => {
  todoTask();
});

darkTheme();
