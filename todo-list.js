const toDoForm = document.querySelector("#todo-form");
const toDoInput = document.querySelector("#todo-form input");
const toDoList = document.querySelector("#todo-list");

const TODOS_KEY = "todos";
let toDos = []; // 할 일들을 담을 배열

// 1. 저장하기 (LocalStorage는 문자열만 저장 가능해서 JSON.stringify 사용)
function saveToDos() {
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

// 2. 삭제하기
function deleteToDo(event) {
    const li = event.target.parentElement;
    li.remove();
    // 클릭한 li의 id와 다른 것들만 남겨서 배열 업데이트
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
    saveToDos();
}

// 3. 화면에 그리기
function paintToDo(newTodo) {
    const li = document.createElement("li");
    li.id = newTodo.id;
    const span = document.createElement("span");
    span.innerText = newTodo.text;
    
    const button = document.createElement("button");
    button.innerText = "제거";
    button.style.border = "none"; // 버튼 스타일 살짝 수정
    button.style.background = "none";
    button.addEventListener("click", deleteToDo);

    li.appendChild(span);
    li.appendChild(button);
    toDoList.appendChild(li);
}

// 4. 제출 이벤트 핸들러
function handleToDoSubmit(event) {
    event.preventDefault();
    const newTodo = toDoInput.value;
    toDoInput.value = "";
    
    const newTodoObj = {
        text: newTodo,
        id: Date.now(), // 각각의 리스트를 구분하기 위한 랜덤 ID
    };
    toDos.push(newTodoObj);
    paintToDo(newTodoObj);
    saveToDos();
}

toDoForm.addEventListener("submit", handleToDoSubmit);

// --- 새로고침 시 불러오기 로직 ---
const savedToDos = localStorage.getItem(TODOS_KEY);

if (savedToDos !== null) {
    const parsedToDos = JSON.parse(savedToDos); // 문자열을 다시 배열로!
    toDos = parsedToDos; // 기존 데이터를 배열에 복구
    parsedToDos.forEach(paintToDo); // 저장된 것들 하나씩 화면에 그리기
}