import darkTheme from "./modules/dark_theme.js";
import dragAndDrop from "./modules/drag_drop.js";
import todoTask from "./modules/task.js";

document.addEventListener("DOMContentLoaded", (e) => {
  dragAndDrop();
});

darkTheme();
todoTask();
