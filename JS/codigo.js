const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const addBtn = document.getElementById("addBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// 💾 Salva no navegador
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 📊 Atualiza contador de forma mais natural
function updateCounter() {
  if (tasks.length === 0) {
    counter.textContent = "Nenhuma tarefa ainda 😴";
  } else if (tasks.length === 1) {
    counter.textContent = "Você tem 1 tarefa pendente 👀";
  } else {
    counter.textContent = `Você tem ${tasks.length} tarefas 📋`;
  }
}

// 🧠 Cria data bonitinha
function formatDate(date) {

  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}


//  Renderiza tudo
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.innerHTML = `
      <strong>${task.text}</strong><br>
      <small>Criada em: ${formatDate(task.createdAt)}</small>
    `;
    span.className = "task-text";
    if (task.completed) span.classList.add("completed");

    //  Marcar como feita
    span.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    };

    const actions = document.createElement("div");
    actions.className = "actions";

    //  Editar
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.title = "Editar tarefa";
    editBtn.onclick = () => {
      const newText = prompt("O que você quer mudar nessa tarefa?", task.text);
      if (newText && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
      }
    };

    //  Deletar com confirmação
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "delete";
    deleteBtn.title = "Apagar tarefa";
    deleteBtn.onclick = () => {
      const confirmDelete = confirm("Tem certeza que quer apagar essa tarefa?");
      if (confirmDelete) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      }
    };

    actions.append(editBtn, deleteBtn);
    li.append(span, actions);
    taskList.appendChild(li);
  });

  updateCounter();
}

//  Adicionar tarefa
function addTask() {
  const text = taskInput.value.trim();

  if (!text) {
    alert("escreve alguma coisa primeiro");
    return;
  }

  tasks.push({
    text,
    completed: false,
    createdAt: new Date()
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
}

// Clique no botão
addBtn.onclick = addTask;

// Enter no teclado
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

//  Inicializa
renderTasks();
