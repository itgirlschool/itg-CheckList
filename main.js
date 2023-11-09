import data from "./data.json";
import "./style.scss";

let global_title = "";
let count = 0;
const container = document.querySelector(".container");
console.log(container);
const arrKeyData = Object.keys(data);

function createFirstPage() {
  //Отрисовка первой страницы
  global_title = "first";
  const content = document.getElementById("content");
  content.innerHTML = "";
  const formHTML = `
  <h1 class="title">
  Чек-лист: Готова ли ты стать Junior Frontend-разработчицей?
</h1>
            <div class="indent">Мы подготовили чек-лист, с помощью которого ты сможешь определить свой уровень знаний и готовность стать
                Junior Frontend-разработчицей.</div>
            <div class="pinkText indent">Оцени свои Hard Skills по 5 бальной шкале, где 5 - знаю отлично, а 1 - не знаю ничего</div>

        <div class="form indent">
            <input class="inputField inputName" type="text" placeholder="Твое имя и фамилия" >
            <input class="inputField inputGroup" type="text" placeholder="Твоя группа" >
        </div>
        <div class="btnField indent">
            <button id="firstButton">Начать</button>
        </div>`;
  content.insertAdjacentHTML("beforeend", formHTML);
  const firstButton = document.querySelector("#firstButton");

  // Подслушка на кнопку, вызов второй страницы и сохранение внесенных пользователем данных
  firstButton.addEventListener("click", () => {
    if (checkEmpty()) {
      setDataUser();
      count = 0;
      renderCards();
    }
  });
}

//Проверка заполнения инпутов + Uppercase для первой буквы имени
function checkEmpty() {
  const name = document.querySelector(".inputName");
  const group = document.querySelector(".inputGroup");
  if (name.value === "" || group.value === "") {
    if (!document.querySelector("#alert_div")) {
      const alert = document.createElement("div");
      alert.id = "alert_div";
      const btnField = document.querySelector(".btnField");
      alert.innerHTML =
        '<h3 class="center pinkText">* Необходимо заполнить все поля</h3>';
      btnField.before(alert);
    }
    return false;
  } else {
    //Капиталайз имени
    name.value =
      name.value[0].toUpperCase() + name.value.substring(1).toLowerCase();
  }
  return true;
}

//Отправка данных в локал сторедж введенных пользователем
const glObj = {
  userName: null,
  groupNum: null,
};

function setDataUser() {
  const inpName = document.querySelector(".inputName");
  const inpGroup = document.querySelector(".inputGroup");
  glObj.userName = inpName.value;
  glObj.groupNum = inpGroup.value;
}

function createCards(title, arrQuestion, section_key) {
  global_title = section_key;
  container.innerHTML = "";
  const createDivContainerCard = document.querySelector("div");
  createDivContainerCard.insertAdjacentHTML(
    "beforeend",
    `<h2 class="indent pinkText">${title}</h2>`
  );
  arrQuestion.forEach((item) => {
    const divQuestion = createQuestion(item);
    container.appendChild(divQuestion);
  });

  container.insertAdjacentHTML(
    "beforeend",
    `
        <div class="cardButtons">
            <button class='prevCardsBtn' >Назад</button>
            <button class='nextCardsBtn' >Вперед</button>
        </div>`
  );
}

function range() {
  return (
    '<div class="input indent">' +
    '<input type="range" min="1" max="5" class="slider" value="1">' +
    '<div class="numbers"><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div>' +
    "</div>" +
    "</div>"
  );
}

function createQuestion(question) {
  const div = document.createElement("div");
  div.classList.add("item");
  const template = `
                    <div class="wrapperContent">
                    <div class="question indent">${question}</div>
                    <div class="range indent">${range()}</div>
                    </div>`;
  div.insertAdjacentHTML("beforeend", template);
  return div;
}

//Слайдер из страниц (вопросы + бегунки + кнопки)
function renderCards() {
  const arrKeyData = Object.keys(data);
  createCards(
    data[arrKeyData[count]].title,
    data[arrKeyData[count]].question,
    arrKeyData[count]
  );
}

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("nextCardsBtn")) {
    saveObjectLocalStorage(global_title);
    createNextCard();
  } else if (e.target.classList.contains("prevCardsBtn")) {
    saveObjectLocalStorage(global_title);
    createPrevCard();
  }
});

function createNextCard() {
  if (count + 1 === arrKeyData.length) {
    createLastPage();
  } else {
    count += 1;
    createCards(
      data[arrKeyData[count]].title,
      data[arrKeyData[count]].question,
      arrKeyData[count]
    );
  }
}

function createPrevCard() {
  if (count === 0) {
    createFirstPage();
  } else {
    count -= 1;
    createCards(
      data[arrKeyData[count]].title,
      data[arrKeyData[count]].question,
      arrKeyData[count]
    );
  }
}

// Сохранение в локал сторедж
function saveObjectLocalStorage(title) {
  const setOfQuestions = data[arrKeyData[count]].question;
  const currentRangeValues = Array.from(
    container.querySelectorAll(".slider")
  ).map((input) => input.value);
  const userData = {
    setOfQuestions,
    currentRangeValues,
  };
  glObj[title] = userData;

  localStorage.setItem("userData", JSON.stringify(glObj));
}

//создание последней страницы
function createLastPage() {
  //получение всех ключей объекта
  const arrKeyData = Object.keys(JSON.parse(localStorage.getItem("userData")));
  //удаление ключей, которые не нужны для расчета
  const newArrKeyData = arrKeyData.filter(
    (e) => e !== "userName" && e !== "groupNum"
  );
  //подсчет суммы результатов
  let result = 0;
  const answer = JSON.parse(localStorage.getItem("userData"));

  newArrKeyData.forEach((item) => {
    let resultAnswer = answer[item].currentRangeValues;
    let res = resultAnswer.reduce((a, b) => Number(a) + Number(b));
    result += res;
  });

  //перевод результата в проценты
  const percentResult = (result * 100) / 100;
  //определение уровня
  function level() {
    if (percentResult <= 59) {
      return '"Новичок"';
    } else if (percentResult >= 60 && percentResult < 80) {
      return '"Стажёр"';
    } else {
      return '"Младший разработчик"';
    }
  }
  // рекомендации по результату
  function conclusion() {
    if (percentResult <= 59) {
      return `<h2>Ты можешь смело искать предложения по стажировке, но повтори перед этим следующие темы:</h2>`;
    } else if (percentResult >= 60 && percentResult < 80) {
      return `<h2>Перед составлением резюме рекомендую сходить по нижеприведенным ссылкам и повторить темы:</h2>`;
    } else {
      return (
        `<h2 class="pinkText">Можешь приступать к подготовке к собеседованию!</h2>` +
        `<iframe src="https://www.youtube.com/embed/cyfaOAH-CF0"></iframe>`
      );
    }
  }
  //отрисовка последней страницы
  const content = document.getElementById("content");
  content.innerHTML =
    `<h2 class="pinkText">Отличная работа, поздравляю!</h2>` +
    `<div class="grid"><h3 class="result-title" >Твой результат:</h3><h3 class='result-content' class="pinkText">${percentResult}%</h3></div>` +
    `<div class="grid"><h3 class='result-title' >что соответсвтвует уровню:</h3><h3 class="pinkText result-content">` +
    level() +
    `</h3></div>` +
    `<div>` +
    conclusion() +
    `</div>`;

  //создание кнопки для перехода в начало
  const wrBtn = document.createElement("div");
  const btnStart = document.createElement("button");

  btnStart.textContent = "В начало";
  wrBtn.append(btnStart);
  content.append(wrBtn);

  //переход на первую страницу
  btnStart.addEventListener("click", (e) => {
    content.innerHTML = "";
    createFirstPage();
    btnStart.style.display = "none";
  });

  if (percentResult >= 80) return "";
  newArrKeyData.forEach((key, index) => {
    let resultAnswers = answer[key].currentRangeValues;
    resultAnswers.forEach((score, i) => {
      if (score <= 3) {
        console.log(data[key]["suggestion"][i]);
        btnStart.insertAdjacentHTML(
          "beforebegin",
          `<h3 class="pinkTekst">${data[key]["suggestion"][i]}</h3>`
        );
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  //Вызов функции первой страницы
  createFirstPage();
});
