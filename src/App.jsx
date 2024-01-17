import { useState, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';

import Form from './components/Form';
import FilterButton from './components/FilterButton';
import Todo from './components/Todo';

import usePrevious from './utils/usePrevious.js';

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App({ data }) {
  const [tasks, setTasks] = useState(data);
  const [filter, setFilter] = useState('All');

  const listHeadingRef = useRef(null);

  function addTask(name) {
    let newTask = { id: `todo-${nanoid()}`, name, completed: false };
    console.log('Task name: ', name);
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    console.log('updatedTasks: ', updatedTasks);
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    console.log('Id: ', id);
    console.log('remainingTasks: ', remainingTasks);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const taskList = tasks
    ?.filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        key={task.id}
        id={task.id}
        name={task.name}
        completed={task.completed}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const updateNoun = taskList.length > 1 ? 'tasks' : 'task';

  function updateFilteredText(text) {
    switch (text) {
      case 'All':
        return `${filter} ${updateNoun}`;
      case 'Active':
        return `${taskList.length} ${updateNoun} remaining`;
      case 'Completed':
        return `${taskList.length} ${updateNoun} completed`;
    }
  }

  const remainingTasksText =
    tasks.length === 0 ? 'Empty - no task' : updateFilteredText(filter);

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length < prevTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {remainingTasksText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
