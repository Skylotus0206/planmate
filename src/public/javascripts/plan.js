document.addEventListener("DOMContentLoaded", () => {
  const plan = document.getElementById(".plan");
  const input = document.querySelector("#planText");
  const addButton = document.querySelector("#addButton");
  const todoList = document.querySelector("#planList");
  const alert = document.querySelector("span");

  // '추가' 버튼 화살표 함수
  const addTodo = () => {
    if (input.value !== "") {
      const item = document.createElement("div");
      // 체크박스
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "checkbox";
      // text
      const text = document.createElement("span");
      text.id = "text";
      // 제거하기 버튼
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "삭제";
      deleteButton.id = "deleteButton";
      // 수정하기 버튼
      const editButton = document.createElement("button");
      editButton.textContent = "수정";
      editButton.id = "editButton";

      text.textContent = input.value;
      input.value = "";

      item.appendChild(checkbox);
      item.appendChild(text);
      item.appendChild(deleteButton);
      item.appendChild(editButton);
      todoList.appendChild(item);

      // 체크박스 이벤트 리스너
      checkbox.addEventListener("change", (event) => {
        if (event.currentTarget.checked) {
          // text.style.textDecoration = "line-through";
        } else {
          text.style.textDecoration = "none";
          sort(); // 목록을 가장 밑으로 이동
        }
      });

      //수정하기
      editButton.addEventListener("click", (event) => {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = text.textContent;
        item.replaceChild(editInput, text);
        editInput.focus();
        editInput.addEventListener("keypress", (event) => {
          if (event.keyCode === 13) {
            text.textContent = editInput.value;
            item.replaceChild(text, editInput);
          }
        });
      });

      // 제거하기 버튼 클릭 이벤트 리스너
      deleteButton.addEventListener("click", (event) => {
        todoList.removeChild(event.currentTarget.parentNode);
      });
      input.value = "";
      alert.textContent = "";
    } else alert.textContent = "플랜이 입력되지 않았어요!";
  };

  addButton.addEventListener("click", addTodo);

  // 할 일 입력창에서 enter key가 눌렸을 때
  input.addEventListener("keypress", (event) => {
    const ENTER = 13; //enter의 keycode가 13
    if (event.keyCode === ENTER) addTodo();
  });
});
