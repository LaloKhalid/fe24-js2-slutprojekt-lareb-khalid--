interface TeamMember {
    name: string;
    roles: string[]; // Each member can have up to three roles
}

interface Task {
    title: string;
    description: string;
    category: string;
    timestamp: string;
    assignedMember: TeamMember | null;
    status: string;
}

let tasks: Task[] = [];
let teamMembers: TeamMember[] = [];
let selectedCategory: string = "";

// Function to add a new team member
function addTeamMember(name: string, roles: string[]) {
    if (roles.length < 1 || roles.length > 3) {
        console.error("A team member must have at least one and at most three roles.");
        return;
    }
    teamMembers.push({ name, roles });
}

// Function to render tasks with filtering and sorting
function renderTasks() {
    const newTasksContainer = document.getElementById("new-tasks");
    const inProgressContainer = document.getElementById("in-progress");
    const completedContainer = document.getElementById("completed");

    if (!newTasksContainer || !inProgressContainer || !completedContainer) {
        console.error("❌ ERROR: One or more containers are missing in HTML!");
        return;
    }

    newTasksContainer.innerHTML = "<h2>New Tasks</h2>";
    inProgressContainer.innerHTML = "<h2>In Progress</h2>";
    completedContainer.innerHTML = "<h2>Completed</h2>";

    let filteredTasks = tasks;
    if (selectedCategory) {
        filteredTasks = tasks.filter(task => task.category === selectedCategory);
    }

    filteredTasks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    filteredTasks.forEach((task, index) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");
        taskElement.innerHTML = `
            <p><strong>Title:</strong> ${task.title}</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Category:</strong> ${task.category}</p>
            <p><strong>Timestamp:</strong> ${task.timestamp}</p>
        `;

        if (task.status === "new") {
            const assignDropdown = document.createElement("select");
            assignDropdown.innerHTML = `<option value="">Assign Member</option>`;
            teamMembers.forEach(member => {
                if (member.roles.includes(task.category)) {
                    assignDropdown.innerHTML += `<option value="${member.name}">${member.name}</option>`;
                }
            });
            taskElement.appendChild(assignDropdown);
            newTasksContainer.appendChild(taskElement);

            assignDropdown.addEventListener("change", () => {
                const selectedMember = teamMembers.find(m => m.name === assignDropdown.value);
                if (selectedMember) {
                    assignTask(index, selectedMember);
                }
            });
        } else if (task.status === "in-progress") {
            taskElement.innerHTML += `<p><strong>Assigned Member:</strong> ${task.assignedMember?.name}</p>`;
            const markCompletedButton = document.createElement("button");
            markCompletedButton.textContent = "Mark as Completed";
            taskElement.appendChild(markCompletedButton);
            markCompletedButton.addEventListener("click", () => {
                completeTask(index);
            });
            inProgressContainer.appendChild(taskElement);
        } else if (task.status === "completed") {
            taskElement.innerHTML += `<p><strong>Assigned Member:</strong> ${task.assignedMember?.name}</p>`;
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            taskElement.appendChild(deleteButton);
            deleteButton.addEventListener("click", () => {
                deleteTask(index);
            });
            completedContainer.appendChild(taskElement);
        }
    });
}

function assignTask(index: number, member: TeamMember) {
    tasks[index].assignedMember = member;
    tasks[index].status = "in-progress";
    renderTasks();
}

function completeTask(index: number) {
    if (!tasks[index].assignedMember) {
        console.error("Task must be assigned before marking as completed.");
        return;
    }
    tasks[index].status = "completed";
    renderTasks();
}

function deleteTask(index: number) {
    tasks.splice(index, 1);
    renderTasks();
}

function addTask(title: string, description: string, category: string) {
    const timestamp = new Date().toISOString();
    const newTask: Task = { title, description, category, timestamp, assignedMember: null, status: "new" };
    tasks.push(newTask);
    renderTasks();
}

document.addEventListener("DOMContentLoaded", () => {
    const filterDropdown = document.createElement("select");
    filterDropdown.innerHTML = `
        <option value="">All Categories</option>
        <option value="UX">UX</option>
        <option value="Backend">Backend</option>
    `;
    filterDropdown.addEventListener("change", () => {
        selectedCategory = filterDropdown.value;
        renderTasks();
    });
    document.body.insertBefore(filterDropdown, document.body.firstChild);
});

addTeamMember("Alice", ["UX", "Frontend"]);
addTeamMember("Bob", ["Backend"]);
addTask("Design UI", "Create the UI for the homepage", "UX");
addTask("Build API", "Develop the backend API for user management", "Backend");

import './firebase';  // Import the Firebase logic from firebase.ts (which will be compiled to firebase.js)
