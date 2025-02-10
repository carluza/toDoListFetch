import React, { useState, useEffect } from "react";

export const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");

  const apiUrl = "https://playground.4geeks.com/todo/users/carlitos";

  //mostrar tareas renderizadas al cargar la web
  useEffect(() => {
    fetch(apiUrl)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.todos) {
          setTasks(data.todos);
        }
      })
      .catch((error) =>
        console.error("Error al extraer las tareas desde la API:", error)
      );
  }, []);

  //añadir una tarea
  const handleAddTask = () => {
    if (newTask.trim() === "") return;

    const newTaskObject = {
      label: newTask,
      is_done: false,
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    };

    const updatedTasks = [...tasks, newTaskObject];

    updateTasksInAPI(updatedTasks);
    setNewTask("");
  };

  //quitar tarea
  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    updateTasksInAPI(updatedTasks);
  };

  //editar tarea
  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setEditText(task.label);
  };

  //guardar
  const handleSaveEdit = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, label: editText } : task
    );

    updateTasksInAPI(updatedTasks);
    setEditingTask(null);
  };

  // actualizar la api con la lista nueva
  const updateTasksInAPI = (updatedTasks) => {
    fetch(apiUrl, {
      method: "PUT",
      body: JSON.stringify({ name: "carlitos", todos: updatedTasks }),
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => resp.json())
      .then(() => setTasks(updatedTasks))
      .catch((error) =>
        console.error("Error al actualizar las tareas:", error)
      );
  };
  //retorno del html
  return (
    <div className="container">
      <h1>My Todos</h1>
      <div>
        <input
          type="text"
          placeholder="What do you need to do?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <ul>
        {/* recorremos los elementos de la api para añadirlos al html */}
        {tasks.map((task) => (
          <li key={task.id}>
            {editingTask === task.id ? (
              <>
                {/* entrada para escribir la task */}
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                {/* boton para guardar tarea */}
                <button onClick={() => handleSaveEdit(task.id)}>Save</button>
              </>
            ) : (
              <>
                {/* label donde está el titulo de la tarea */}
                {task.label}
                {/* boton para editar tarea */}
                <button onClick={() => handleEditTask(task)}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                {/* boton para eliminar tarea */}
                <button onClick={() => handleDeleteTask(task.id)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      {/* contador de tareas */}
      <div className="task-count">{tasks.length} Tasks</div>
    </div>
  );
};
