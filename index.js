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
const endorsementForm = document.querySelector("form");
const inputFromEl = document.getElementById("input-from");
const inputToEl = document.getElementById("input-to");
const btnPublish = document.getElementById("btn-publish");
const endorsementFeedEl = document.getElementById("endorsement-feed");

endorsementForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (
    inputMessageEl.value === "" ||
    inputFromEl.value === "" ||
    inputToEl.value === ""
  ) {
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

onValue(endorsementFeedInDB, function (snapshot) {
  if (snapshot.exists()) {
    let endorsementArray = Object.entries(snapshot.val());

    clearEndorsementFeedEl();

    for (let i = 0; i < endorsementArray.length; i++) {
      let currentEndorsement = endorsementArray[i];

      let currentEndorsementID = currentEndorsement[0];
      let currentEndorsementValue = currentEndorsement[1];

      let valuesArray = Object.values(currentEndorsementValue);

      appendMessageToEndorsementFeedEl(
        valuesArray[0],
        valuesArray[1],
        valuesArray[2],
        valuesArray[3],
        currentEndorsementID
      );
    }
  }
});

function clearInputFields() {
  inputToEl.value = "";
  inputFromEl.value = "";
  inputMessageEl.value = "";
}

function clearEndorsementFeedEl() {
  endorsementFeedEl.innerHTML = "";
}

function appendMessageToEndorsementFeedEl(
  from,
  likes,
  message,
  to,
  endorsementID
) {
  let listItem = document.createElement("li");

  let paragraphTo = document.createElement("p");
  paragraphTo.classList.add("paragraph-bold");
  paragraphTo.textContent = `To ${to}`;

  let paragraphMsg = document.createElement("p");
  paragraphMsg.classList.add("paragraph-msg");
  paragraphMsg.textContent = `${message}`;

  let paragraphFromWrapper = document.createElement("div");
  paragraphFromWrapper.classList.add("endorsement-from-wrapper");

  let paragraphFrom = document.createElement("p");
  paragraphFrom.classList.add("paragraph-bold");
  paragraphFrom.textContent = `From ${from}`;

  let likesSection = document.createElement("p");
  likesSection.classList.add("likes-section");

  let heartBtn = document.createElement("button");
  heartBtn.classList.add("heart-icon");
  heartBtn.id = `heart-icon-${endorsementID}`;
  heartBtn.innerHTML = `&#10084;`;
  // let likesBtn = document.getElementById(`heart-icon-${endorsementID}`);

  let likesNumber = document.createElement("p");
  likesNumber.classList.add("likes-number");
  likesNumber.innerHTML = `${likes}`;

  likesSection.append(heartBtn, likesNumber);

  paragraphFromWrapper.append(paragraphFrom, likesSection),
    listItem.append(paragraphTo, paragraphMsg, paragraphFromWrapper);

  heartBtn.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(
      database,
      `endorsementFeed/${endorsementID}`
    );

    remove(exactLocationOfItemInDB);
  });

  endorsementFeedEl.append(listItem);
}
