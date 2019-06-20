"use strict";

let taskToAdd = document.querySelector("#taskToAdd");
let orderBy = "priorityAsc";
let showFilter = "noFilter";
let search;
let allTasks = [];
let path = 'http://localhost:3000/todo/';
let pressedIndex;
let pressedAction;
let amountOfTasks;

renderTodo();


document.querySelector("#searchInput").oninput = function () {
    search = document.querySelector("#searchInput").value;
    renderTodo();
};

document.body.addEventListener('click', function (element) {

    let pressedButton = element.target['id'];

    // console.log(pressedButton);

    pressedIndex = pressedButton.substr(-1);
    pressedAction = pressedButton.substr(0, pressedButton.length - 1);

    switch (pressedAction) {

        case "buttonAddTas":
            addTask();
            break;

        case "deleteTask":
            deleteTask(pressedIndex, element);
            break;

        case "doneTask":
            doneTask(pressedIndex, element);
            break;

        case "editTask":
            editTask(pressedIndex);
            break;

        case "filte":
            changeFilter();
            renderTodo();
            break;

        case "increasePriority":
        case "decreasePriority":
            incAndDecPrior(pressedIndex, pressedAction);
            break;

        case "dateAs":
            orderBy = "dateAsc";
            renderTodo();
            break;

        case "dateDes":
            orderBy = "dateDesc";
            renderTodo();
            break;

        case "priorityAs":
            orderBy = "priorityAsc";
            renderTodo();
            break;

        case "priorityDes":
            orderBy = "priorityDesc";
            renderTodo();
            break;
    }

    element.stopPropagation()
});

// Changes variable showFilter: filter <-> noFilter
function changeFilter() {
    console.log("func filter before: " + showFilter);
    if (showFilter === "filter") {
        showFilter = "noFilter";
    } else {

        showFilter = "filter"
    }
}

// Hides tableHead if there are no tasks
function hideTableHead() {
    if (allTasks.length) {
        document.getElementById('headOfTable').classList.remove('mainTasksTable__headOfTable');
    }
}

// Adds task
function addTask() {
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

        if (milliseconds < 10) {
            milliseconds = '00' + milliseconds;
        } else if (milliseconds < 100) {
            milliseconds = '0' + milliseconds;
        }

        let date = day + '.' + month + '.' + year;
        let time = hour + ':' + minutes;
        let taskKey = year + month + day + hour + minutes + seconds + milliseconds;

        document.getElementById('headOfTable').classList.remove('mainTasksTable__headOfTable');

        // Adds to SERVER
        // POST adds a random id to the object sent, add to virtual db
        fetch(path, {
            method: 'POST',
            body: JSON.stringify({
                key: taskKey,
                date: date,
                time: time,
                priority: 1,
                task: taskToAdd.value,
                done: 0
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        orderBy = "priorityAsc";
    }
}

// Deletes a task
function deleteTask(deleteTaskId, elementToDelete) {

    console.log(deleteTaskId);
    console.log(elementToDelete.path[2]);
    console.log(allTasks);

    console.log("amount of tasks: " + amountOfTasks);

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

        // Removes element from LS
        // localStorage.removeItem(allTasks[i].key);

        // Removes element from SERVER
        elementToDelete.path[2].remove();
        amountOfTasks -= 1;
        fetch('http://localhost:3000/todo/' + allTasks[deleteTaskId].id, {
            method: 'DELETE'
        });


        if (amountOfTasks === 0) {
            document.getElementById('headOfTable').classList.add('mainTasksTable__headOfTable');
        }
        document.getElementById("body").classList.remove('redBackground');
        document.getElementById('deletionConfirm').classList.remove('deletionConfirmShow');
        document.getElementById("main").style.display = "flex";
    }

    function actionOnNoButton() {
        document.removeEventListener("keydown", pressedEscOrEnter);
        document.getElementById("main").style.display = "flex";
        document.getElementById("body").classList.remove('redBackground');
        document.getElementById('deletionConfirm').classList.remove('deletionConfirmShow');
    }

}

// Changes the color of icon and task, depending on done undone
function doneTask(doneTaskId, elementChangeColor) {

    let task = document.getElementById('task' + doneTaskId);

    let doneUndoneTask;

    if (task.className === "mainTasksTable__task greyBackground") {

        doneUndoneTask = 1;
        task.classList.remove('greyBackground');
        task.classList.add('lightBlueColorBackground');
        elementChangeColor.path[0].classList.add('lightBlueColor');
    } else {
        doneUndoneTask = 0;
        task.classList.remove('lightBlueColorBackground');
        task.classList.add('greyBackground');
        elementChangeColor.path[0].classList.remove('lightBlueColor');
    }

    fetch('http://localhost:3000/todo/' + allTasks[doneTaskId].id, {
        method: 'PUT',
        body: JSON.stringify({
            done: doneUndoneTask,
            key: allTasks[doneTaskId].key,
            date: allTasks[doneTaskId].date,
            time: allTasks[doneTaskId].time,
            priority: allTasks[doneTaskId].priority,
            task: allTasks[doneTaskId].task
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
}

// Increases and decreases priority
async function incAndDecPrior(priorityChange, decIncPriority) {

    // console.log("priorityChange: " + priorityChange);

    let idToChange = allTasks[priorityChange].id;
    // console.log("action: " + decIncPriority);

    // console.log("idToChange: " + idToChange);

    let oldPriority = document.getElementById("priority" + priorityChange).innerHTML;


    let newPriority;
    if (decIncPriority === "increasePriority") {
        if (+oldPriority > 1) {
            newPriority = +oldPriority - 1;
        } else {
            newPriority = +oldPriority;
        }
    } else if (decIncPriority === "decreasePriority") {
        newPriority = +oldPriority + 1;
    }


    async function savePriorityServer() {
        await fetch(path + idToChange, {
            method: 'PUT',
            body: JSON.stringify({
                done: allTasks[priorityChange].done,
                key: allTasks[priorityChange].key,
                date: allTasks[priorityChange].date,
                time: allTasks[priorityChange].time,
                priority: newPriority,
                task: allTasks[priorityChange].task
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });


    }

    let nextPriority;
    let previousPriority;


    if (allTasks.length > 1) {
        if (priorityChange === "0") {
            nextPriority = document.getElementById("priority" + (+priorityChange + 1)).innerHTML;
        } else if (priorityChange === (allTasks.length - 1).toString()) {
            previousPriority = document.getElementById("priority" + (+priorityChange - 1)).innerHTML;
        } else {
            previousPriority = document.getElementById("priority" + (+priorityChange - 1)).innerHTML;
            nextPriority = document.getElementById("priority" + (+priorityChange + 1)).innerHTML;
        }
    }

    if ((decIncPriority === "decreasePriority" && nextPriority < newPriority) || (decIncPriority === "increasePriority" && previousPriority > newPriority)) {
        await savePriorityServer();
        orderBy = "priorityAsc";
        renderTodo();
    } else {
        savePriorityServer();
        document.getElementById("priority" + priorityChange).innerHTML = newPriority;
    }
}

// Edits a task
function editTask(editTaskId) {

    document.getElementById("editTask").classList.add("editTextShow");

    document.getElementById("text").value = document.getElementById("taskText" + editTaskId).innerHTML;

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
        let newTask = document.getElementById("text").value;

        document.getElementById("taskText" + editTaskId).innerHTML = newTask;

        fetch('http://localhost:3000/todo/' + allTasks[editTaskId].id, {
            method: 'PUT',
            body: JSON.stringify({
                done: allTasks[editTaskId].done,
                key: allTasks[editTaskId].key,
                date: allTasks[editTaskId].date,
                time: allTasks[editTaskId].time,
                priority: allTasks[editTaskId].priority,
                task: newTask
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        document.getElementById("editTask").classList.remove("editTextShow");
    }

}


// The sorting functions
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

// Reads data from server
async function readDataFromServer() {
    let response = await fetch(path);
    let json = await response.json();
    let tasksFilter;

    allTasks = [];
    // console.log(showFilter);
    if (showFilter === "filter") {
        for (let i = 0; i < json.length; i++) {
            if (json[i].done === 1) {
                allTasks.push(json[i]);
                tasksFilter = allTasks;
            }
        }
    } else {
        for (let i = 0; i < json.length; i++) {
            allTasks.push(json[i]);
        }
    }

    if (search && showFilter === "filter") {
        allTasks = [];
        let i = 0;
        while (i < tasksFilter.length) {
            let taskForSearch = tasksFilter[i].task;
            let target = document.querySelector("#searchInput").value;
            if (target.length > 0) {
                let foundPos = taskForSearch.indexOf(target);
                if (foundPos !== -1) {
                    allTasks.push(tasksFilter[i]);
                }
            }
            i++;
        }
    } else if (search) {
        allTasks = [];
        let i = 0;
        while (i < json.length) {
            let taskForSearch = json[i].task;
            let target = document.querySelector("#searchInput").value;
            if (target.length > 0) {
                let foundPos = taskForSearch.indexOf(target);
                if (foundPos !== -1) {
                    allTasks.push(json[i]);
                }
            }
            i++;
        }
    }
}

// Renders main page
async function renderTodo() {
    allTasks = [];

    await readDataFromServer();

    amountOfTasks = allTasks.length;

    if (orderBy === "priorityDesc") {
        priorityDescOrder();
    } else if (orderBy === "dateDesc") {
        dateDescOrder();
    } else if (orderBy === "dateAsc") {
        dateAscOrder();
    } else if (orderBy === "priorityAsc") {
        priorityAscOrder();
    }

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
        rowOfTheTable += '<td><div id="task' + i + '" class="mainTasksTable__task"><p id="taskText' + i + '" class="task" >' + task + '</p></div></td>';

        // The fifth column
        rowOfTheTable += '<td><i id="editTask' + i + '" class="far fa-edit icon-less icon-green"></i><i id="doneTask' + i + '" class="fas fa-check-circle icon-less icon-blue"></i><i id="deleteTask' + i + '" class="fas fa-trash-alt icon-less icon-blue"></i> </td>';

        rowOfTheTable += '</tr>';
    }
    document.getElementById("tasks").innerHTML = rowOfTheTable;


    // Puts the color for done tasks
    for (let i = 0; i < allTasks.length; i++) {
        let done = allTasks[i].done;
        if (done === 1) {
            document.getElementById('doneTask' + i).classList.add('lightBlueColor');
            document.getElementById('task' + i).classList.add('lightBlueColorBackground');
        } else {
            document.getElementById('task' + i).classList.add('greyBackground');
        }
    }
    hideTableHead();
    console.log("rendered");
}