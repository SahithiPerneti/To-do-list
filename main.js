// selet elements in DOM

const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemList = document.querySelector("#itemList");
const messageDiv = document.querySelector("#message");

// create empty item list
let todoItems = [];

const showAlert = function (message, msgClass) {
  messageDiv.innerHTML = message;
  messageDiv.classList.add(msgClass, "show");
  messageDiv.classList.remove("hide");
  setTimeout(() => {
    messageDiv.classList.remove("show",msgClass);
    messageDiv.classList.add("hide");
  }, 3000);
  return;
};
// update item
const updateItem = function (itemIndex, newValue) {
  console.log(itemIndex);
  const newItem = todoItems[itemIndex];
  newItem.name = newValue;
  todoItems.splice(itemIndex, 1, newItem);
  const addBtn = document.getElementById('addBtn');
  const editBtn = document.getElementById('editBtn');
  addBtn.style.display = "block";
  editBtn.style.display = "none";
  setLocalStorage(todoItems);
};

// remove/delete item
const removeItem = function (item) {
  const removeIndex = todoItems.indexOf(item);
  todoItems.splice(removeIndex, 1);
};

//bi-check-circle-fill  // bi-check-circle
// handle item
const handleItem = function (itemData) {
  const items = document.querySelectorAll(".todo-item");
  items.forEach((item) => {
    if (item.querySelector(".title").getAttribute("data-time") == itemData.addedAt) {
      // done
      item.querySelector("[data-done]").addEventListener("click", function (e) {
        e.preventDefault();
        const itemIndex = todoItems.indexOf(itemData);
        const currentItem = todoItems[itemIndex];
        const currentClass = currentItem.isDone ? "bi-check-circle-fill" : "bi-check-circle";
        currentItem.isDone = currentItem.isDone ? false : true;
        if (currentItem.isDone = true) {
          currentItem.status="completed";
          currentItem.completedAt=new Date().toLocaleString();
          showAlert("Item has been completed","alert-success");
        }
        // const Btn = item.querySelector(".green");
        // Btn.style.display = "none";
        // console.log(Btn);
        todoItems.splice(itemIndex, 1, currentItem);
        setLocalStorage(todoItems);
        
        const iconClass = currentItem.isDone ? "bi-check-circle" : "bi-check-circle-fill";
        this.firstElementChild.classList.replace(currentClass, iconClass);
        getLocalStorage();
        
      });
      //start
      item.querySelector("[data-start]").addEventListener("click",function (e) {
        e.preventDefault();
        const itemIndex = todoItems.indexOf(itemData);
        const currentItem = todoItems[itemIndex];
        currentItem.status = "in-progress"
        todoItems.splice(itemIndex, 1, currentItem);
        showAlert('Item is In-Progress');
        setLocalStorage(todoItems);
        getLocalStorage();
      });
      // edit
      item.querySelector("[data-edit]").addEventListener("click", function (e) {
        e.preventDefault();
        itemInput.value = itemData.name;
        document.querySelector("#citem").value = todoItems.indexOf(itemData)
        const addBtn = document.getElementById('addBtn');
        const editBtn = document.getElementById('editBtn');
        addBtn.style.display = "none";
        editBtn.style.display = "block";
        return todoItems;
      });

      //delete
      item.querySelector("[data-delete]").addEventListener("click", function (e) {
          e.preventDefault();
            itemList.removeChild(item);
            removeItem(item);
            setLocalStorage(todoItems);
            showAlert("Item has been deleted.", 'mesaage-wrapper-danger');
        });
    }
  });
};
// Get list items
const getList = function (todoItems) {
  itemList.innerHTML = "";
  if (todoItems.length > 0) {
    todoItems.forEach((item) => {
      const iconClass = item.isDone ? "bi-check-circle-fill" : "bi-check-circle";
      itemList.insertAdjacentHTML(
        "beforeend",
        `<tr class="todo-item item-${item.status}">
          <td><a href="#" data-done><i class="bi ${iconClass} green"></i></a></td>
          <td class="title" data-time="${item.addedAt}">${item.name}</td> 
          <td>${item.addedAt}</td>
          <td><a href="#"  data-start><i class="bi bi-play-circle green id="Button1"></i></a></td>
          <td><a href="#" data-edit><i class="bi bi-pencil-square blue"></i></td>
          <td><a href="#" data-delete><i class="bi bi-x-circle red"></i></a></td>
          <td>${item.completedAt}</td>
          <td>${item.status}</td>
        </tr>`
      );
      handleItem(item);
    });
  } else {
    itemList.insertAdjacentHTML(
      "beforeend",
      `<tr>
        No record found.
      </tr>`
    );
  }
};

// Get localstorage from the page
const getLocalStorage = function () {
  const todoStorage = localStorage.getItem("todoItems");
  if (todoStorage === "undefined" || todoStorage === null) {
    todoItems = [];
  } else {
    todoItems = JSON.parse(todoStorage);
  }
  getList(todoItems);
};
// Set list in local storage
const setLocalStorage = function (todoItems) {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
};
document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const itemName = itemInput.value.trim();
    if (itemName.length === 0) {
      showAlert("Please enter name.");
      return;
    } else {
      // update existing Item
      const currenItemIndex = document.querySelector("#citem").value;
      if (currenItemIndex) {
        updateItem(currenItemIndex, itemName);
        document.querySelector("#citem").value = "";
        showAlert("Item has been updated.");
      } else {
        // Add new Item
        const itemObj = {
          name: itemName,
          isDone: false,
          addedAt: new Date().toLocaleString(),
          completedAt: "",
          status:"open",
        };
        todoItems.push(itemObj);
        // set local storage
        setLocalStorage(todoItems);
        showAlert("New item has been added.");
      }
      getList(todoItems);
      // get list of all items
    }
    console.log(todoItems);
    itemInput.value = "";
  });
  // load items
  getLocalStorage();
});