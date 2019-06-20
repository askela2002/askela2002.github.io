"use strict";

let buttonAddTask = document.querySelector('#buttonAddTask');
let taskToAdd = document.querySelector("#taskToAdd");
let orderBy = "priorityAsc";
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

document.getElementById("dateAsc").onclick = function () {
    orderBy = "dateAsc";
    renderTodo();
};
document.getElementById("dateDesc").onclick = function () {
    orderBy = "dateDesc";
    renderTodo();
};

document.getElementById("priorityAsc").onclick = function () {
    orderBy = "priorityAsc";
    renderTodo();
};
document.getElementById("priorityDesc").onclick = function () {
    orderBy = "priorityDesc";
    renderTodo();
};


// Shows head of table
if (localStorage.length > 0) {
    document.getElementById('headOfTable').classList.remove('mainTasksTable__headOfTable');
}

// Adds task
buttonAddTask.onclick = function () {
    // Checks the length of a task
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
        let hour1 = hour;

        if (month < 10) {
            month = '0' + month;
        }

        if (day < 10) {
            day = '0' + day;
        }

        if (hour < 10) {
            hour1 = '0' + hour;
        }

        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        if (milliseconds < 10) {
            milliseconds = '00' + milliseconds;
        } else if (milliseconds < 100) {
            milliseconds = '0' + milliseconds;
        }

        let date = day + '.' + month + '.' + year;
        let time = hour + ':' + minutes;
        let taskKey = year + month + day + hour1 + minutes + seconds + milliseconds;

        let saveDataToStorage = {key: taskKey, date: date, time: time, priority: 1, task: taskToAdd.value, done: 0};

        localStorage.setItem(taskKey, JSON.stringify(saveDataToStorage));

        document.getElementById('headOfTable').classList.remove('mainTasksTable__headOfTable');

        orderBy = "priorityAsc";
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
    for (let i = 0; i < allTasks.length; i++) {
        let deleteTask = document.getElementById('deleteTask' + i);

        deleteTask.onclick = function () {

            document.getElementById('deletionConfirm').classList.add('deletionConfirmShow');
            document.getElementById("main").style.display = "none";
            document.getElementById("body").classList.add('redBackground');


            document.addEventListener("keydown", pressedEscOrEnter);

            function pressedEscOrEnter(event) {
                if (event.code === "Escape") {
                    actionOnNoButton();
                } else if (event.code === "Enter") {
                    actionOnYesButton();
                }
            }

            document.getElementById("buttonYes").onclick = function () {
                actionOnYesButton();
            };
            document.getElementById("buttonNo").onclick = function () {
                actionOnNoButton();
            };

            function actionOnYesButton() {
                document.removeEventListener("keydown", pressedEscOrEnter);
                localStorage.removeItem(allTasks[i].key);

                if (localStorage.length === 0) {
                    document.getElementById('headOfTable').classList.add('mainTasksTable__headOfTable');
                }
                document.getElementById("body").classList.remove('redBackground');
                document.getElementById('deletionConfirm').classList.remove('deletionConfirmShow');
                document.getElementById("main").style.display = "flex";

                renderTodo();
            }

            function actionOnNoButton() {
                document.removeEventListener("keydown", pressedEscOrEnter);
                document.getElementById("main").style.display = "flex";
                document.getElementById("body").classList.remove('redBackground');
                document.getElementById('deletionConfirm').classList.remove('deletionConfirmShow');
            }
        }
    }
}

// Changes the color of icon and task, depending on done undone
function doneTask() {
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
            orderBy = "priorityAsc";
            renderTodo();
        };

        decreasePriority.onclick = function () {
            let keyToChange = allTasks[i].key;
            let oldPriority = JSON.parse(localStorage.getItem(keyToChange));

            oldPriority['priority'] = +oldPriority.priority + 1;

            localStorage.setItem(keyToChange, JSON.stringify(oldPriority));
            orderBy = "priorityAsc";
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

            document.onkeydown = function (event) {
                if (event.code === "Escape") {
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
            return +b.key - +a.key;
        } else {
            return b.priority - a.priority;
        }
    });
}

// Sorts priority desc order
function priorityAscOrder() {
    allTasks.sort(function (a, b) {
        if (a.priority === b.priority) {
            return +b.key - +a.key;
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

    } else if (showFilter === "noFilter") {
        for (let i = 0; i < localStorage.length; i++) {
            allTasks.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
        }
    }

    let allTasksSearch = allTasks;

    if (search && showFilter === "filter") {
        allTasks = [];
        let i = 0;
        while (i < allTasksSearch.length) {
            let taskForSearch = allTasksSearch[i].task;
            let target = document.querySelector("#searchInput").value;
            if (target.length > 0) {
                let foundPos = taskForSearch.indexOf(target);
                if (foundPos !== -1) {
                    allTasks.push(allTasksSearch[i]);
                }
            }
            i++;
        }
    } else if (search) {
        allTasks = [];
        let i = 0;
        while (i < localStorage.length) {
            let taskForSearch = JSON.parse(localStorage.getItem(localStorage.key(i))).task;
            let target = document.querySelector("#searchInput").value;
            if (target.length > 0) {
                let foundPos = taskForSearch.indexOf(target);
                if (foundPos !== -1) {
                    allTasks.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
                }
            }
            i++;
        }
    }



}

// Renders main page
function renderTodo() {
    allTasks = [];

    readDataLocalStorage();


    if (orderBy === "priorityDesc") {
        priorityDescOrder();
    } else if (orderBy === "dateDesc") {
        dateDescOrder();
    } else if (orderBy === "dateAsc") {
        dateAscOrder();
    } else if (orderBy === "priorityAsc") {
        priorityAscOrder();
    }

    // orderDate = "";
    // orderPriority = "";

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