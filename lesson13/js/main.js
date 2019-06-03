"use strict";

let buttonAddTask = document.querySelector('#buttonAddTask');
let taskToAdd = document.querySelector("#taskToAdd");
let orderPriority;
let orderDate;
let showFilter = "noFilter";
let search;
let allTasks = [];

renderTodo();

document.querySelector("#searchInput").oninput = function () {
    search = document.querySelector("#searchInput").value;
    renderTodo();
};

document.querySelector("#filter").onclick = function () {
    if (showFilter === "noFilter") {
        showFilter = "filter";
    } else {
        showFilter = "noFilter";
    }
    renderTodo();
};

document.getElementById("dateDesc").onclick = function () {
    orderDate = "desc";
    renderTodo();
};
document.getElementById("dateAsc").onclick = function () {
    orderDate = "asc";
    renderTodo();
};

document.getElementById("priorityDesc").onclick = function () {
    orderPriority = "desc";
    renderTodo();
};
document.getElementById("priorityAsc").onclick = function () {
    orderPriority = "asc";
    renderTodo();
};

// Shows head of table
if (localStorage.length > 0) {
    document.getElementById('headOfTable').classList.remove('mainTasksTable__headOfTable');
}

// Adds task
buttonAddTask.onclick = function () {

    if (taskToAdd.value.length < 3) {
        alert("Task is very short! Consider to add some characters!");
    } else if (taskToAdd.value.length > 100) {
        alert("Task is very long! Consider to shorten your task!");
    } else {
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
        let taskKey = year + month + day + hour + minutes + seconds + milliseconds;

        let saveDataToStorage = {key: taskKey, date: date, time: time, priority: 1, task: taskToAdd.value, done: 0};

        localStorage.setItem(taskKey, JSON.stringify(saveDataToStorage));

        document.getElementById('headOfTable').classList.remove('mainTasksTable__headOfTable');

        renderTodo();
    }
};

// Sorts by date desc order
function dateDescOrder() {
    allTasks.sort(function (a, b) {
        return b.key - a.key;
    });
}

// Sorts by date asc order
function dateAscOrder() {
    allTasks.sort(function (a, b) {
        return a.key - b.key;
    });
}

// Deletes a task
function deletesTask() {
    // console.log("delete-fn");
    for (let i = 0; i < allTasks.length; i++) {
        let deleteTask = document.getElementById('deleteTask' + i);

        deleteTask.onclick = function () {
            document.onkeydown = function(event) {
                if (event.code==="Escape"){
                    document.getElementById("main").style.display = "flex";
                    document.getElementById("body").classList.remove('redBackground');
                    document.getElementById('deletionConfirm').classList.remove('deletionConfirmShow');
                }
            };

            document.getElementById('deletionConfirm').classList.add('deletionConfirmShow');
            document.getElementById("main").style.display = "none";
            document.getElementById("body").classList.add('redBackground');

            document.getElementById("buttonYes").onclick = function () {

                localStorage.removeItem(allTasks[i].key);

                if (localStorage.length === 0) {
                    document.getElementById('headOfTable').classList.add('mainTasksTable__headOfTable');
                }
                document.getElementById("body").classList.remove('redBackground');
                document.getElementById('deletionConfirm').classList.remove('deletionConfirmShow');
                document.getElementById("main").style.display = "flex";
                renderTodo();
            };

            document.getElementById("buttonNo").onclick = function () {
                document.getElementById("main").style.display = "flex";
                document.getElementById("body").classList.remove('redBackground');
                document.getElementById('deletionConfirm').classList.remove('deletionConfirmShow');
            }
        }
    }
}

// Changes the color of icon and task, depending on done undone
function doneTask() {
    // console.log("done-fn");
    for (let i = 0; i < allTasks.length; i++) {
        let doneTask = document.getElementById('doneTask' + i);
        let task = document.getElementById('task' + i);

        doneTask.onclick = function () {
            let doneUndoneTask = JSON.parse(localStorage.getItem(allTasks[i].key));

            if (doneUndoneTask.done === 0) {
                doneUndoneTask.done = 1;
                task.classList.remove('greyBackground');
                task.classList.add('lightBlueColorBackground');
                doneTask.classList.add('lightBlueColor');
            } else {
                doneUndoneTask.done = 0;
                task.classList.remove('lightBlueColorBackground');
                task.classList.add('greyBackground');
                doneTask.classList.remove('lightBlueColor');
            }

            localStorage.setItem(allTasks[i].key, JSON.stringify(doneUndoneTask));
            renderTodo();
        };

    }
}

// Increases and decreases priority
function incAndDecPrior() {
    for (let i = 0; i < allTasks.length; i++) {
        let increasePriority = document.getElementById('increasePriority' + i);
        let decreasePriority = document.getElementById('decreasePriority' + i);

        increasePriority.onclick = function () {
            let keyToChange = allTasks[i].key;
            let oldPriority = JSON.parse(localStorage.getItem(keyToChange));

            if (+oldPriority.priority > 1) {
                oldPriority['priority'] = +oldPriority.priority - 1;
            }

            localStorage.setItem(keyToChange, JSON.stringify(oldPriority));
            renderTodo();
        };

        decreasePriority.onclick = function () {
            let keyToChange = allTasks[i].key;

            let oldPriority = JSON.parse(localStorage.getItem(keyToChange));

            oldPriority['priority'] = +oldPriority.priority + 1;

            localStorage.setItem(keyToChange, JSON.stringify(oldPriority));
            renderTodo();
        }
    }
}

// Edits a task
function editTask() {
    for (let i = 0; i < allTasks.length; i++) {
        let editTask = document.getElementById('editTask' + i);

        editTask.onclick = function () {
            document.getElementById("editTask").classList.add("editTextShow");
            let oldTask = JSON.parse(localStorage.getItem(allTasks[i].key));
            document.getElementById("text").value = oldTask.task;

            let cancelButton = document.getElementById("buttonCancel");
            cancelButton.onclick = function () {
                document.getElementById("editTask").classList.remove("editTextShow");
            };

            document.onkeydown = function(event) {
                if (event.code==="Escape"){
                    document.getElementById("editTask").classList.remove("editTextShow");
                }
            };


            let saveButton = document.getElementById("buttonSave");
            saveButton.onclick = function () {
                oldTask.task = document.getElementById("text").value;
                localStorage.setItem(allTasks[i].key, JSON.stringify(oldTask));
                document.getElementById("editTask").classList.remove("editTextShow");
                renderTodo();
            }

        };
    }
}

// Sorts priority desc order
function priorityDescOrder() {
    allTasks.sort(function (a, b) {
        if (a.priority === b.priority) {
            return +a.key - +b.key;
        } else {
            return b.priority - a.priority;
        }
    });
}

// Sorts priority desc order
function priorityAscOrder() {
    allTasks.sort(function (a, b) {
        if (a.priority === b.priority) {
            return +a.key - +b.key;
        } else {
            return a.priority - b.priority;
        }
    });
}

// Reads data from LS and sorts with respect to priority
function readDataLocalStorage() {

    if (showFilter === "filter") {
        for (let i = 0; i < localStorage.length; i++) {
            if (JSON.parse(localStorage.getItem(localStorage.key(i))).done === 1) {
                allTasks.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
            }
        }
    } else {
        for (let i = 0; i < localStorage.length; i++) {
            allTasks.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
        }
    }

    if (search) {
        allTasks = [];
        let i = 0;
        while (i < localStorage.length) {
            let taskForSearch = JSON.parse(localStorage.getItem(localStorage.key(i))).task;
            let target = document.querySelector("#searchInput").value;
            if (target.length > 0) {
                let foundPos = taskForSearch.indexOf(target);
                if (foundPos === -1) {
                } else {
                    allTasks.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
                }
            }
            i++;
        }
    }


    allTasks.sort(function (a, b) {
        if (a.priority === b.priority) {
            return b.key - a.key;
        } else {
            return a.priority - b.priority;
        }
    })
}

// Renders main page
function renderTodo() {
    allTasks = [];

    readDataLocalStorage();

    if (orderPriority === "desc") {
        priorityDescOrder();
    } else if (orderDate === "desc") {
        dateDescOrder();
    } else if (orderDate === "asc") {
        dateAscOrder();
    } else if (orderPriority === "asc") {
        priorityAscOrder();
    }

    orderDate = "";
    orderPriority = "";

    let rowOfTheTable = '';

    for (let i = 0; i < allTasks.length; i++) {
        let date = allTasks[i].date;
        let time = allTasks[i].time;
        let task = allTasks[i].task;
        let priority = allTasks[i].priority;

        rowOfTheTable += '<tr>';

        // The first column
        rowOfTheTable += '<td>' + date + '<br>' + time + '</td>';

        // The second column
        rowOfTheTable += '<td><div class="greyRectangle"><p id="priority' + i + '" class="greyRectangle__notation">' + priority + '</p></div></td>';

        // The third column
        rowOfTheTable += '<td><div class="combinedArrows"> <i id="increasePriority' + i + '" class="fas fa-chevron-up icon-blue"></i> <i id="decreasePriority' + i + '" class="fas fa-chevron-down icon-blue"></i></div></td>';

        // The fourth column
        rowOfTheTable += '<td><div id="task' + i + '" class="mainTasksTable__task"><p class="task" >' + task + '</p></div></td>';

        // The fifth column
        rowOfTheTable += '<td><i id="editTask' + i + '" class="far fa-edit icon-less icon-green"></i><i id="doneTask' + i + '" class="fas fa-check-circle icon-less icon-blue"></i><i id="deleteTask' + i + '" class="fas fa-trash-alt icon-less icon-blue"></i> </td>';

        rowOfTheTable += '</tr>';
    }
    document.getElementById("tasks").innerHTML = rowOfTheTable;

    // Puts the color for done tasks
    for (let i = 0; i < allTasks.length; i++) {
        let done = JSON.parse(localStorage.getItem(allTasks[i].key)).done;
        if (done === 1) {
            document.getElementById('doneTask' + i).classList.add('lightBlueColor');
            document.getElementById('task' + i).classList.add('lightBlueColorBackground');
        } else {
            document.getElementById('task' + i).classList.add('greyBackground');
        }
    }
    deletesTask();
    doneTask();
    editTask();
    incAndDecPrior();
}




