const d = document;
import { listTasks, setListTasks } from "./task";

export default function dragAndDrop() {
  const $containerTasks = d.getElementById("todoContainer");
  let indexDragTask, indexDropTask;

  $containerTasks.addEventListener("dragstart", (e) => {
    drag(e);
    indexDragTask = assignIdDragAndDrop(e);
    e.target.style.transform = "scale(1.03)";
  });

  $containerTasks.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  $containerTasks.addEventListener("dragend", (e) => {
    e.target.style.transform = "scale(1)";
  });

  $containerTasks.addEventListener("drop", (e) => {
    indexDropTask = assignIdDragAndDrop(e);
    const $target = drop(e);

    //SELECTED FROM UP TO DOWN - ALSO APPLIED REVERSE
    if (indexDragTask <= indexDropTask) {
      $containerTasks.children[indexDragTask].insertAdjacentElement("afterend", e.target);
      $containerTasks.children[indexDropTask].insertAdjacentElement("afterend", $target);
    } else {
      $containerTasks.children[indexDragTask].insertAdjacentElement("beforebegin", e.target);
      $containerTasks.children[indexDropTask].insertAdjacentElement("beforebegin", $target);
    }

    //e.target = donde termina el arrastre , $target = de donde inicio
    let idDrag = $target.dataset.id;
    let idDrop = e.target.dataset.id;
    let indexDrag, indexDrop;

    //Convert Object to Array , used for orders Elements Of the DOM
    let listTasksCopy = Object.entries(listTasks);
    //Obtain index of the element DRAG and return the object element
    //Filter and capture results and compress array bidim.
    let taskDrag = Object.entries(listTasks)
      .filter((taskId, i) => {
        if (taskId[0] == idDrag) {
          indexDrag = i;
          return taskId[0];
        }
      })
      .flat(1);

    let taskDrop = Object.entries(listTasks)
      .filter((taskId, i) => {
        if (taskId[0] == idDrop) {
          indexDrop = i;
          return taskId[0];
        }
      })
      .flat(1);

    //Delete element of the indexDrop and IndexDrag
    listTasksCopy.splice(indexDrop, 1, taskDrag);
    listTasksCopy.splice(indexDrag, 1, taskDrop);

    //Function where captured first Property and used key
    function arrTwoDimensionsToObject(arr) {
      let obj = {};
      arr.forEach((v) => {
        let key = v[0];
        let value = v[1];
        obj[key] = value;
      });
      return obj;
    }

    //Assign Object preformatted (This function come module Task)
    setListTasks(arrTwoDimensionsToObject(listTasksCopy));
  });
}

//Assign Id , drag and drop , used for the insertElement
const assignIdDragAndDrop = (e) => {
  let index = null;
  d.querySelectorAll(".todo-task").forEach((task, i) => {
    if (e.target.dataset.id === task.dataset.id) {
      index = i;
      return;
    }
  });
  return index;
};

//Drag and Drop
const drag = (e) => {
  e.dataTransfer.setData("text/plain", e.target.dataset.id);
  //Disbaled task-descricption
  d.querySelectorAll(".todo-task-description").forEach((desc) => {
    desc.style.pointerEvents = "none";
  });
  // e.dataTransfer.effectAllowed = "none";
};

const drop = (e) => {
  e.preventDefault();
  const data = e.dataTransfer.getData("text");
  const $target = d.querySelector(`.todo-task[data-id="${data}"]`);

  //Enabled task-descricption
  d.querySelectorAll(".todo-task-description").forEach((desc) => {
    desc.style.pointerEvents = "auto";
  });

  return $target;
};
