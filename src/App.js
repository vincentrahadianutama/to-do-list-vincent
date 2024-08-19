import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      const date = new Date().toLocaleString();
      const newTask = { text: task, date, image };
      if (isEditing) {
        const updatedTasks = tasks.map((t, index) =>
          index === currentTaskIndex ? newTask : t
        );
        setTasks(updatedTasks);
        setIsEditing(false);
        setCurrentTaskIndex(null);
      } else {
        setTasks([...tasks, newTask]);
      }
      setTask("");
      setImage(null);
    }
  };

  const handleEdit = (index) => {
    setTask(tasks[index].text);
    setImage(tasks[index].image);
    setIsEditing(true);
    setCurrentTaskIndex(index);
  };

  const handleDelete = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    if (isEditing && index === currentTaskIndex) {
      setIsEditing(false);
      setTask("");
      setImage(null);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>To-Do List</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={task} 
            onChange={handleChange} 
            placeholder="Tambah atau edit tugas..." 
          />
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
          />
          <button type="submit">{isEditing ? "Update" : "Tambah"}</button>
        </form>
        {image && (
          <div className="image-preview">
            <img src={image} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
            <button onClick={handleDeleteImage}>Hapus Gambar</button>
          </div>
        )}
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <div>
                <span>{task.text}</span>
                <small>{task.date}</small>
                {task.image && <img src={task.image} alt="Task" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
              </div>
              <div>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Hapus</button>
              </div>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
