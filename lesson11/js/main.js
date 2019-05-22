"use strict";

let buttonAddTask = document.querySelector('#buttonAddTask');
let taskToAdd = document.querySelector("#taskToAdd");


// To render todolist
renderTodo();

// To add a task
buttonAddTask.onclick = function () {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let hour = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    let milliseconds = today.getMilliseconds();

    if (month < 10) {
        month = '0' + month;
    }

    if (day < 10) {
        day = '0' + day;
    }

    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    let date = day + '.' + month + '.' + year;
    let time = hour + ':' + minutes;
    let taskKey = year + month + day + '.' + hour + minutes + seconds + '.' + milliseconds;

    let saveDataToStorage = {date: date, time: time, priority: 1, task: taskToAdd.value};

    localStorage.setItem(taskKey, JSON.stringify(saveDataToStorage));

    renderTodo();
};

function renderTodo() {
    let rowOfTheTable = '';
    for (let i = localStorage.length - 1; i > -1; --i) {
        let date = JSON.parse(localStorage.getItem(localStorage.key(i))).date;
        let time = JSON.parse(localStorage.getItem(localStorage.key(i))).time;
        let task = JSON.parse(localStorage.getItem(localStorage.key(i))).task;
        let priority = JSON.parse(localStorage.getItem(localStorage.key(i))).priority;

        rowOfTheTable += '<tr>';

        // The first column
        rowOfTheTable += '<td>' + date + '<br>' + time + '</td>';

        // The second column
        rowOfTheTable += '<td><div class="greyRectangle"><p id="priority" class="greyRectangle__notation">' + priority + '</p></div></td>';

        // The third column
        rowOfTheTable += '<td><div class="combinedArrows"> <i id="increasePriority' + i +'" class="fas fa-chevron-up icon-blue"></i> <i id="decreasePriority' + i +'" class="fas fa-chevron-down icon-blue"></i></div></td>';

        // The fourth column
        rowOfTheTable += '<td><div class="mainTasksTable__task"><p class="task" id="task">' + task + '</p></div></td>';

        // The fifth column
        rowOfTheTable += '<td><i class="far fa-edit icon-less icon-green"></i><i class="fas fa-check-circle icon-less icon-blue"></i><i id="deleteTask' + i + '" class="fas fa-trash-alt icon-less icon-blue"></i> </td>';

        rowOfTheTable += '</tr>';
    }
    document.getElementById("tasks").innerHTML = rowOfTheTable;
    incAndDecPrior();
    deletesTask();
}

// Increases and decreases priority
function incAndDecPrior() {
    for (let i = 0; i < localStorage.length; i++) {
        let increasePriority = document.getElementById('increasePriority' + i);
        let decreasePriority = document.getElementById('decreasePriority' + i);

        increasePriority.onclick = function () {
            let oldPriority = JSON.parse(localStorage.getItem(localStorage.key(i)));

            if (+oldPriority.priority  > 1) {
                oldPriority['priority'] = +oldPriority.priority - 1;
            }

            localStorage.setItem(localStorage.key(i), JSON.stringify(oldPriority));
            renderTodo();
        };

        decreasePriority.onclick = function () {
            let oldPriority = JSON.parse(localStorage.getItem(localStorage.key(i)));

            oldPriority['priority'] = +oldPriority.priority + 1;

            localStorage.setItem(localStorage.key(i), JSON.stringify(oldPriority));
            renderTodo();
        }
    }
}

// Deletes a task
function deletesTask() {
    for (let i = 0; i < localStorage.length; i++) {
        let deleteTask = document.getElementById('deleteTask' + i);

        deleteTask.onclick = function () {

            localStorage.removeItem(localStorage.key(i));
            renderTodo();
        };
    }
}

