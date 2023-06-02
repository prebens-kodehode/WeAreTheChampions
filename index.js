import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://wearethechampions-57655-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementFeedInDB = ref(database, "endorsementFeed");

const inputMessageEl = document.getElementById("input-message");
const inputFromEl = document.getElementById("input-from");
const inputToEl = document.getElementById("input-to");
const btnPublish = document.getElementById("btn-publish");
const btnModal = document.getElementById("modal-close-btn");
const modalEl = document.getElementById("modal");
// const endorsementFeedEl = document.getElementById("endorsement-feed")
// const likes = 0

btnPublish.addEventListener("click", function () {
  if (
    inputMessageEl.value === "" ||
    inputFromEl.value === "" ||
    inputToEl.value === ""
  ) {
    modalEl.style.display = "block";
  } else {
    let inputTo = inputToEl.value;
    let inputFrom = inputFromEl.value;
    let inputMessage = inputMessageEl.value;
    let likesValue = 0;
    let endorsementObject = {
      to: inputTo,
      from: inputFrom,
      message: inputMessage,
      likes: likesValue,
    };

    push(endorsementFeedInDB, endorsementObject);
    clearInputFields();
  }
});

btnModal.addEventListener("click", function () {
  modalEl.style.display = "none";
});

onValue(endorsementFeedInDB, function (snapshot) {
  if (snapshot.exists()) {
    let endorsementArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < endorsementArray.length; i++) {
      let currentEndorsement = endorsementArray[i];
      let currentEndorsementID = currentItem[0];
      let currentEndorsementValue = currentItem[1];

      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet";
  }
});

function clearInputFields() {
  inputToEl.value = "";
  inputFromEl.value = "";
  inputMessageEl.value = "";
}
