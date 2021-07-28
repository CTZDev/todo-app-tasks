const d = document;

//List Of Tasks (Global)
const listTasks = {};

export default function todoTask() {
  const $form = d.getElementById("formTodo");
  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    const $txtnewTask = $form.txtnewTask.value;
    setTask(e.target, $txtnewTask);
  });

  d.addEventListener("DOMContentLoaded", (e) => {
    drawTask();
  });
}

//Dibujar mis tareas
const drawTask = () => {
  const $tasksContainer = d.querySelector(".todo-tasks-container");
  const $dataTaskActions = d.querySelectorAll("[data-tasks-actions]");
  const $templateTask = d.getElementById("template-task").content;
  const $fragment = d.createDocumentFragment();

  //Without Task
  if (Object.entries(listTasks).length === 0) {
    $dataTaskActions.forEach((task) => task.classList.add("is-active"));
    $tasksContainer.innerHTML = `<div class="todo-tasks-empty">No hay tareas pendientes 😊😎</div>`;
    return;
  }

  //With Task
  $tasksContainer.innerHTML = "";
  $dataTaskActions.forEach((task) => task.classList.remove("is-active"));
  Object.values(listTasks).forEach(({ task, id }) => {
    const $clone = $templateTask.cloneNode(true);
    $clone.querySelector(".todo-task-description > p").textContent = task;
    $clone.querySelector(".todo-task-description > p").dataset.id = id;
    $fragment.appendChild($clone);
  });

  $tasksContainer.appendChild($fragment);
};

//Asignar mis tareas al bojeto
const setTask = (form, txtnewTask) => {
  //Validity whitespace in the input new Task
  if (txtnewTask === "") {
    console.log("Campo vacio");
    return;
  }
  //Create Task
  const task = {
    id: Date.now(),
    task: txtnewTask,
    state: false,
  };

  //Object of the Task (Global)
  listTasks[task.id] = { ...task };

  //Draw task
  drawTask();

  //Reset form
  form.reset();
};
