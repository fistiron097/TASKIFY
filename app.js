const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value === '') {
    alert("You must write something!");
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    li.setAttribute("draggable", "true"); // Enable dragging
    listContainer.appendChild(li);

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
  }
  inputBox.value = "";
  saveData();
}

listContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveData();
  } else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
  }
}, false);

// Save task list to localStorage
function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

// Load tasks from localStorage
function showTask() {
  listContainer.innerHTML = localStorage.getItem("data");
  // Restore draggable attribute to existing li elements
  // for every li item we set draggable attribute whose property is true
  let listItems = listContainer.querySelectorAll("li");
  listItems.forEach(item => item.setAttribute("draggable", "true"));
}
showTask();


// Drag and Drop functionality
let draggedItem = null;

listContainer.addEventListener("dragstart", function (e) {
  if (e.target.tagName === "LI") {
    draggedItem = e.target;
    e.target.style.opacity = "0.5";
  }
});

listContainer.addEventListener("dragend", function (e) {
  if (e.target.tagName === "LI") {
    draggedItem = null;
    e.target.style.opacity = "1";
    saveData();
  }
});

listContainer.addEventListener("dragover", function (e) {
  e.preventDefault(); // Allow drop
  const afterElement = getDragAfterElement(listContainer, e.clientY);
  if (afterElement == null) {
    listContainer.appendChild(draggedItem);
  } else {
    listContainer.insertBefore(draggedItem, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}
