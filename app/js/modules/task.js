const d = document;

//List Of Tasks (Global) - Applied let for used localStorage
export let listTasks = {};

//Assign list an export , for capture object ListTasks (Used in module (drag_drop))
export function setListTasks(copyListTasks) {
  listTasks = copyListTasks;
  localStorage.setItem("todo-list", JSON.stringify(listTasks));
}

export default function todoTask() {
  const $form = d.getElementById("formTodo");

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    const $txtnewTask = $form.txtnewTask.value;
    setTask(e.target, $txtnewTask);
  });

  d.addEventListener("DOMContentLoaded", (e) => {
    if (localStorage.getItem("todo-list")) {
      listTasks = JSON.parse(localStorage.getItem("todo-list"));
    }
    drawTask();
  });

  d.addEventListener("click", (e) => {
    taskActions(e);
    todoTaskOperations(e);
  });
}

//Assign task to object listTasks
const setTask = (form, txtnewTask) => {
  //Validity whitespace in the input new Task
  const $btnAllTasks = d.getElementById("btnAllTasks");
  const $detailsTasks = d.querySelectorAll(".todo-details-btn");

  if (txtnewTask === "") {
    alert("Campo vacio , Favor Ingresa una tarea 😉😉");
    return;
  }
  //Create Task
  const task = {
    id: Date.now(),
    task: txtnewTask,
    state: false,
    classActive: "_",
  };

  //Object of the Task (Global)
  listTasks[task.id] = { ...task };

  if (!$btnAllTasks.classList.contains("active")) {
    alert("Tareas activas y completadas!! 😎😎😎");
    detailsTasksActions($detailsTasks, $btnAllTasks);
  }

  //Draw task
  drawTask();

  //Reset form
  form.reset();
};

//Draw mi tasks
export const drawTask = () => {
  const $tasksContainer = d.querySelector(".todo-tasks-container");
  const $dataTaskActions = d.querySelectorAll("[data-tasks-actions]");
  const $countTasks = d.querySelector(".todo-tasks-tags > p > span");
  const $templateTask = d.getElementById("template-task").content;
  const $fragment = d.createDocumentFragment();
  const $btnAllTasks = d.getElementById("btnAllTasks");

  localStorage.setItem("todo-list", JSON.stringify(listTasks));

  //Without Task
  if (Object.entries(listTasks).length === 0) {
    $dataTaskActions.forEach((task) => task.classList.add("is-active"));
    $tasksContainer.innerHTML = `<div class="todo-tasks-empty">No hay tareas pendientes 😊😎</div>`;
    return;
  }

  //With Task
  $tasksContainer.innerHTML = "";
  $dataTaskActions.forEach((task) => task.classList.remove("is-active"));
  Object.values(listTasks).forEach(({ id, task, state, classActive }) => {
    const $clone = $templateTask.cloneNode(true);
    $clone.querySelector(".todo-task-description > p").textContent = task;
    $clone.querySelector(".todo-task").dataset.state = state;
    $clone.querySelector(".todo-task").classList.add(`${classActive}`);
    $clone.querySelector(`.todo-task`).dataset.id = id;
    $clone.querySelector(`.todo-task`).setAttribute("draggable", true);
    $fragment.appendChild($clone);
  });

  if ($btnAllTasks.classList.contains("active")) {
    $countTasks.textContent = Object.values(listTasks).length;
  }

  $tasksContainer.appendChild($fragment);
};

//Tasks
const taskActions = (e) => {
  const $countTasks = d.querySelector(".todo-tasks-tags > p > span");
  const $btnActiveTasks = d.getElementById("btnActiveTasks");
  const $btnCompletedTasks = d.getElementById("btnCompletedTasks");

  //Task selected , completed and incompleted
  if (e.target.matches(".todo-task-description") || e.target.matches(".todo-task-description > *")) {
    const $taskDescription = e.target.matches(".todo-task-description");
    const $todoTask = $taskDescription ? e.target.parentElement : e.target.parentElement.parentElement;
    let activeTask = "is-active";

    if ($todoTask.dataset.state == "false") {
      $todoTask.classList.replace("_", `${activeTask}`);
      $todoTask.dataset.state = "true";
      listTasks[$todoTask.dataset.id].classActive = `${activeTask}`;
      listTasks[$todoTask.dataset.id].state = true;
    } else {
      $todoTask.classList.replace(`${activeTask}`, "_");
      $todoTask.dataset.state = "false";
      listTasks[$todoTask.dataset.id].classActive = "_";
      listTasks[$todoTask.dataset.id].state = false;
    }

    if ($btnActiveTasks.classList.contains("active")) {
      tasksLength(false, $countTasks);
      showAndHiddenTasks(true);
    }

    if ($btnCompletedTasks.classList.contains("active")) {
      tasksLength(true, $countTasks);
      showAndHiddenTasks(false);
    }
  }

  //Delete Task
  if (e.target.matches(".todo-task-delete")) {
    const $task = e.target.parentElement;
    delete listTasks[$task.dataset.id];
    drawTask();
  }
};

//Operations Tasks
const todoTaskOperations = (e) => {
  const $btnAllTasks = d.getElementById("btnAllTasks");
  const $btnActiveTasks = d.getElementById("btnActiveTasks");
  const $btnCompletedTasks = d.getElementById("btnCompletedTasks");
  const $detailsTasks = d.querySelectorAll(".todo-details-btn");
  const $countTasks = d.querySelector(".todo-tasks-tags > p > span");
  const $btnClearCompleted = d.getElementById("btnClearCompleted");

  if (e.target.matches(".todo-details-btn")) {
    detailsTasksActions($detailsTasks, e.target);
  }

  if (e.target === $btnAllTasks) {
    todoAllTasks($detailsTasks);
  }

  if (e.target === $btnActiveTasks) {
    drawTask();
    tasksLength(false, $countTasks);
    showAndHiddenTasks(true);
  }

  if (e.target === $btnCompletedTasks) {
    drawTask();
    tasksLength(true, $countTasks);
    showAndHiddenTasks(false);
  }

  if (e.target === $btnClearCompleted) {
    const lengthTaskActive = Object.values(listTasks).filter(({ state }) => state).length;
    if (lengthTaskActive > 0) {
      alert("Se limpio correctamente las tareas completadas 😎😎");
    } else {
      alert("No hay tareas cumplidas 😒😒");
    }
    showAndHiddenTasks(true, false);
    drawTask();
    detailsTasksActions($detailsTasks, $btnAllTasks);
  }
};

const detailsTasksActions = (details, target) => {
  details.forEach((detail) => {
    detail.classList.remove("active");
  });
  target.classList.add("active");
};

const todoAllTasks = () => {
  drawTask();
};

//Active and Completed Tasks (length)
const tasksLength = (active = true, countTask) => {
  const completedTask = Object.values(listTasks).filter(({ state }) => state === active).length;
  countTask.textContent = completedTask;
};

//Show and Hidden Task (Active - Complete) , active = state of the taks
// optionTask = true default , false = deleteTasks Completed
const showAndHiddenTasks = (active = true, optionTask = true) => {
  Object.values(listTasks).filter(({ id, state }) => {
    if (state === active) {
      d.querySelectorAll(".todo-task").forEach((task) => {
        const $idTask = task.dataset.id;
        if (id == $idTask) {
          optionTask ? (task.style.display = "none") : delete listTasks[$idTask];
        }
      });
    }
  });
};
