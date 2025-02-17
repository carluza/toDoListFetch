import React, { useState, useEffect } from "react";

export const App = () => {
  const [task, setTask] = useState([]);
  const [input, setInput] = useState("");

  const urlBase = "https://playground.4geeks.com/todo/users/carlitos";
  const urlDelete = "https://playground.4geeks.com/todo/todos/";
  const urlBasePost = "https://playground.4geeks.com/todo/todos/carlitos";
  const urlBaseUpdate = "https://playground.4geeks.com/todo/todos/";
  const urlBaseUpdateDone = "https://playground.4geeks.com/todo/todos/";

  const getTasks = async () => {
    try {
      const response = await fetch(urlBase, {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
      setTask(data.todos);
    } catch (error) {
      console.log("error obteniendo las tareas:", error);
    }
  };

  const createTask = async () => {
    try {
      const nuevaTarea = {
        label: input,
        is_done: false,
      };

      const response = await fetch(urlBasePost, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaTarea),
      });

      const newData = await response.json();
      console.log("Tarea creada:", newData);
      getTasks();
      setInput("");
    } catch (error) {
      console.log("Error al crear tarea:", error);
    }
  };

  const updateTask = async (id, currentLabel) => {
    try {
      const newLabel = prompt(
        "Escribe el nuevo nombre de la tarea:",
        currentLabel
      );
      if (!newLabel) return;

      const tareaActualizada = {
        label: newLabel,
        is_done: false,
      };

      const response = await fetch(`${urlBaseUpdate}${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tareaActualizada),
      });

      if (response.ok) {
        console.log("Tarea actualizada correctamente");
        getTasks();
      }
    } catch (error) {
      console.log("Error al actualizar la tarea", error);
    }
  };

  const updateIsDone = async (id, currentState) => {
    try {
      const tareaActualizada = {
        is_done: !currentState,
      };

      const response = await fetch(`${urlBaseUpdateDone}${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tareaActualizada),
      });
      if (response.ok) {
        getTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${urlDelete}${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log(`Tarea con id ${id} eliminada correctamente`);
        setTask(task.filter((t) => t.id !== id));
        getTasks();
      } else {
        console.log("error al eliminar tarea");
      }
    } catch (error) {
      console.log("no se pudo eliminar la task", error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="text-center">
              <h1>ToDoList React.JS</h1>
            </div>
            <div className="justify-content-center text-center d-flex ">
              <input
                placeholder="Write your Task"
                className="text-center form-control"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
              <button className="btn btn-enter" onClick={createTask}>
                Enter
              </button>
            </div>
            <div>
              <ul className="">
                {task.map((task) => (
                  <li key={task.id}>
                    {task.label}{" "}
                    <button onClick={() => updateIsDone(task.id, task.is_done)}>
                      {task.is_done ? "Mark as Not Ready" : "Mark as Ready"}
                    </button>
                    <button onClick={() => deleteTask(task.id)}>X</button>
                    <button onClick={() => updateTask(task.id)}>Update</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
