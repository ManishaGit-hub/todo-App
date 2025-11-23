const input = document.getElementById("task")
const priorityInput=document.getElementById("priority")
const dueDate=document.getElementById("time")
const addBtn=document.getElementById("addBtn")
const listItems=document.getElementById("taskList")
const darkMode=document.getElementById("darkMode")
const allBtn = document.getElementById("all")
const pendingBtn = document.getElementById("pending")
const completedBtn = document.getElementById("completed")
const taskCount = document.getElementById("taskCount")
const clearAllBtn = document.getElementById("clearAll")
const clearCompleted = document.getElementById("clearCompleted")
let currentFilter = "all"
let tasksArr=[]; //to store in localStorage

addBtn.addEventListener('click',addTask)
clearAllBtn.addEventListener('click',()=>{
    if(confirm("Are you sure you want to clear all tasks ?")){
        clearAll()
    }

})
clearCompleted.addEventListener('click',()=>{
    if(confirm("Are you sure you want to clear all completed tasks?")){
        clearCompletedTasks()
    }
})

//enter key navigation
input.addEventListener('keydown',(e) =>{
    if(e.key === 'Enter'){
        e.preventDefault();
        priorityInput.focus();
    }
})

priorityInput.addEventListener('keydown',(e)=>{
    if(e.key === 'Enter'){
        e.preventDefault();
        dueDate.focus();
        dueDate.showPicker?.();
    }
})

dueDate.addEventListener('change',()=>{
    dueDate.blur();
    addBtn.focus();
})

function renderTask(taskObj){
    const card = document.createElement("div")
    card.className="card my-2";
    if(taskObj.completed)card.classList.add("completedTask")

    const cardBody=document.createElement("div")
    cardBody.className = "card-body"

    const leftDiv = document.createElement("div")
    leftDiv.innerHTML=`<h5 class="card-title mb-1">${taskObj.name}</h5>
    <p class="card-text mb-0"><strong>Priority:</strong>${taskObj.priority}</p>
    <p class="card-text mb-0"><strong>Due:</strong>${taskObj.date}</p>`;

    const rightDiv = document.createElement("div")
    
    const completeBtn = document.createElement("button")
    completeBtn.className = taskObj.completed? "btn btn-secondary btn-sm me-2":"btn btn-success btn-sm me-2"
    completeBtn.innerText = taskObj.completed? "Undo":"Complete"

    const deleteBtn = document.createElement("button")
    deleteBtn.className = "btn btn-danger btn-sm me-2"
    deleteBtn.innerText = "Delete"

    rightDiv.appendChild(completeBtn)
    rightDiv.appendChild(deleteBtn)
    cardBody.appendChild(leftDiv)
    cardBody.appendChild(rightDiv)
    card.appendChild(cardBody)
    listItems.appendChild(card)

    //complete button
    completeBtn.addEventListener("click",()=>{
        card.classList.toggle("completedTask")
        taskObj.completed = card.classList.contains("completedTask")

        completeBtn.innerText = taskObj.completed? "Undo":"Complete";
        completeBtn.classList.toggle("btn-success")
        completeBtn.classList.toggle("btn-secondary")

        localStorage.setItem("tasks",JSON.stringify(tasksArr))
        updateTaskCount();
        filterTask(currentFilter)
    })

    deleteBtn.addEventListener("click",()=>{
        card.remove()
        tasksArr = tasksArr.filter(t => t!==taskObj)
        localStorage.setItem("tasks",JSON.stringify(tasksArr))
        updateTaskCount()
        filterTask(currentFilter);
    })
}

function addTask(){
    const task=input.value.trim();
    const priority = priorityInput.value;
    const date=dueDate.value;

    if(task === '' || date === '' || priority === ''){
        alert("Please enter all the details!")
        input.focus();
        return;
    }

    //show confirm every time before saving
    if(!confirm("Save the task?")){
        input.focus()
        return;
    }

    //to save this created task in localstroage
    const taskObj = {
        name:task,
        priority:priority,
        date:date,
        completed:false
    };
    tasksArr.push(taskObj);
    localStorage.setItem("tasks",JSON.stringify(tasksArr));
    renderTask(taskObj)

    input.value=""
    priorityInput.value="high"
    dueDate.value=""
    input.focus()

    updateTaskCount(); //update count when any task is marked complete

}



function filterTask(type){
    const allTasks = listItems.querySelectorAll(".card")

    allTasks.forEach(card =>{
        const isCompleted = card.classList.contains("completedTask");

        if(type === "all"){
            card.style.display = "block";
        }
        else if(type === "pending"){
            card.style.display = isCompleted ? "none" : "block";
        }
        else if(type === "completed"){
            card.style.display = isCompleted ? "block" : "none"
        }
    })
}

allBtn.addEventListener('click',()=>{
    currentFilter="all"
    sessionStorage.setItem("filter",currentFilter)
    filterTask("all")})
pendingBtn.addEventListener('click',()=>{
    currentFilter="pending"
    sessionStorage.setItem("filter",currentFilter)
    filterTask("pending")
})
completedBtn.addEventListener('click',()=>{
    currentFilter="completed"
    sessionStorage.setItem("filter",currentFilter)
    filterTask("completed")
})

//update task count and completed count
function updateTaskCount(){
    const totalTasks = listItems.querySelectorAll(".card")
    const totalCount = totalTasks.length
    let completedTasks = 0;
        totalTasks.forEach(card => {
            if(card.classList.contains("completedTask")){
                completedTasks++;
            }
        })
    taskCount.innerText = `${totalCount} Tasks, ${completedTasks} Completed`
}

function clearAll(){
    listItems.innerHTML = "";
    tasksArr = [];
    localStorage.removeItem("tasks");
    updateTaskCount();
}

function clearCompletedTasks(){
    tasksArr = tasksArr.filter(task => !task.completed) //removed from memory
    localStorage.setItem("tasks",JSON.stringify(tasksArr)) //removed from localstorage
    document.querySelectorAll(".completedTask").forEach(card => card.remove())
    updateTaskCount()
}

//load tasks on page refresh
window.addEventListener("DOMContentLoaded",()=>{
    const stored=JSON.parse(localStorage.getItem("tasks"))||[]; //if we dont give [] then when there are no tasks it
    //  returns null and if we parse this it returns error and the app crashes coz json.parse expects valid json string
    tasksArr=stored;
    stored.forEach(t=>renderTask(t))
    currentFilter = sessionStorage.getItem("filter")||"all" //here "all" is used as fallback UI because first time 
    // when you open page , no filter is selected in the session so it will be null if we dont give "all"
    filterTask(currentFilter)
    updateTaskCount();
})

//darkMode -> clicking on moon will toggle dark-mode class on body..CSS changes will apply automatically for background,cards,input,text
//and the button icon changes dynamically to indicate current mode
darkMode.addEventListener('click',()=>{
    document.body.classList.toggle('dark-mode')
    darkMode.innerText = document.body.classList.contains('dark-mode')?"☀️":"🌙"
})