import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get('https://my-json-server.typicode.com/EnkiGroup/DesafioReactFrontendJunior2024/todos')
      .then(response => {
        setTodos(response.data);
      });
  }, []);

  const handleNewTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleNewTodoSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const todoToAdd = {
      id: todos.length + 1,
      title: newTodo,
      completed: false,
    };
    setTodos([todoToAdd, ...todos]);
    setNewTodo('');
  };

  const handleToggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const handleRemoveTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setEditingText(todo.title);
  };

  const handleEditingTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(event.target.value);
  };

  const handleEditingSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingTodo) {
      setTodos(todos.map(todo => todo.id === editingTodo.id ? { ...todo, title: editingText } : todo));
    }
    setEditingTodo(null);
    setEditingText('');
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    setTodos(todos.map(todo => ({ ...todo, completed: !areAllCompleted })));
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const getVisibleTodos = () => {
    if (filter === 'active') {
      return todos.filter(todo => !todo.completed);
    }
    if (filter === 'completed') {
      return todos.filter(todo => todo.completed);
    }
    return todos;
  };

  return (
    <div className="App">
      <h1>Todos</h1>
      <button className='Toggle' onClick={handleToggleAll}>Toggle All</button>
      <form onSubmit={handleNewTodoSubmit}>
        <input type="text" value={newTodo} onChange={handleNewTodoChange} placeholder='What needs to be done?' />
        <button className='add' type="submit">Add Todo</button>
      </form>
      {getVisibleTodos().map(todo => (
        <div key={todo.id} className="todo-item">
          {editingTodo === todo ? (
            <form onSubmit={handleEditingSubmit}>
              <input type="text" value={editingText} onChange={handleEditingTextChange} />
            </form>
          ) : (
            <>
              <input type="checkbox" checked={todo.completed} onChange={() => handleToggleTodo(todo.id)} />
              <span onDoubleClick={() => handleEditTodo(todo)}>{todo.title}</span>
            </>
          )}
          <button onClick={() => handleRemoveTodo(todo.id)}>X</button>
        </div>
      ))}
      <div>
        <span className='item'>{todos.filter(todo => !todo.completed).length} items left!</span>
        <button className="All" onClick={() => setFilter('all')}>All</button>
        <button className='Active' onClick={() => setFilter('active')}>Active</button>
        <button className='Completed' onClick={() => setFilter('completed')}>Completed</button>
        <button className='Clear' onClick={handleClearCompleted}>Clear Completed</button>
      </div>
    </div>
  );
}

export default App;
