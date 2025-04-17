// Initialize tasks array
let tasks = [];

// Load tasks from local storage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        storedTasks.forEach(task => {
            tasks.push(task);
        });
        updateTasksList();
        updateStats();
    }
});

// Function to add a new task
const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value;
    
    if (text.trim()) {
        tasks.push({
            text: text,
            completed: false
        });
        
        taskInput.value = '';
        updateTasksList();
        updateStats();
        saveTasks();
    }
};

// Function to update the tasks in the UI
const updateTasksList = () => {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'task-item';
        
        listItem.innerHTML = `
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onChange="toggleTaskComplete(${index})">
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" onclick="editTask(${index})">
                <img src="https://cdn-icons-png.flaticon.com/512/3096/3096673.png" onclick="deleteTask(${index})">
            </div>
        `;
        
        taskList.appendChild(listItem);
    });
};

// Function to toggle task completion status
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
    
    // If all tasks are completed, show confetti
    const allCompleted = tasks.every(task => task.completed) && tasks.length > 0;
    if (allCompleted) {
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti();
    }
};

// Function to delete a task
const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

// Function to edit a task
const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = tasks[index].text;
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
};

// Function to update statistics (progress bar and numbers)
const updateStats = () => {
    const completed = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progressPercentage = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;
    
    document.getElementById('progress').style.width = `${progressPercentage}%`;
    document.getElementById('numbers').innerText = `${completed}/${totalTasks}`;
};

// Function to save tasks to local storage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Event listener for the form submission
document.getElementById('newTask').addEventListener('click', (e) => {
    e.preventDefault();
    addTask();
});

// Event listener for pressing Enter in the input field
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
});