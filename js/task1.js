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

function addTask(){
    const task=input.value.trim();
    const priority = priorityInput.value;
    const date=dueDate.value;

    if(task === '' || date === '' || priority === ''){
        alert("Please enter all the details!")
        input.focus();
        return;
    }

    const card=document.createElement("div");
    card.className="card my-2"

    const cardBody=document.createElement("div")
    cardBody.className="card-body"

    //the card body has 2 parts left section & right section
    const leftDiv = document.createElement("div")
    leftDiv.innerHTML = `<h5 class="card-title mb-1">${task}</h5>
    <p class="card-text mb-0"><strong>Priority:</strong>${priority}</p>
    <p class="card-text mb-0"><strong>Due:</strong>${date}</p>`

    const rightDiv = document.createElement("div")

    const completeBtn = document.createElement("button")
    completeBtn.className = "btn btn-success btn-sm me-2"
    completeBtn.innerText = "Complete"

    const deleteBtn = document.createElement("button")
    deleteBtn.className = "btn btn-danger btn-sm me-2" 
    deleteBtn.innerText = "Delete" 

    rightDiv.appendChild(completeBtn)
    rightDiv.appendChild(deleteBtn)

    cardBody.appendChild(rightDiv)
    cardBody.appendChild(leftDiv)
    card.appendChild(cardBody);
    listItems.appendChild(card);

    input.value=""
    priorityInput.value="high"
    dueDate.value=""
    input.focus()

    updateTaskCount(); //update count when any task is marked complete

    //adding functionality to complete/delete button

    completeBtn.addEventListener('click',()=>{
        

        card.classList.toggle("completedTask")
        if(card.classList.contains("completedTask")){
            completeBtn.innerText = "Undo"
            completeBtn.classList.remove("btn-success")
            completeBtn.classList.add("btn-secondary")
        }else{
            completeBtn.innerText = "Complete"
            completeBtn.classList.remove("btn-secondary")
            completeBtn.classList.add("btn-success")
        }

        //refreshes current filter automatically
        filterTask(currentFilter);
        updateTaskCount();
    })

    deleteBtn.addEventListener('click',()=>{
        card.remove();
        //refreshes current filter automatically
        filterTask(currentFilter);
        updateTaskCount(); //update count after marking delete to any task
    })

    updateTaskCount();
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
    filterTask("all")})
pendingBtn.addEventListener('click',()=>{
    currentFilter="pending"
    filterTask("pending")
})
completedBtn.addEventListener('click',()=>{
    currentFilter="completed"
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
    const cleartasks=listItems.querySelectorAll(".card")
    cleartasks.forEach(card=>{
        card.remove()
    })
    updateTaskCount();
}

function clearCompletedTasks(){
    const doneTask = listItems.querySelectorAll(".completedTask")
    doneTask.forEach(card=>{
        card.remove()
    })
    updateTaskCount()
}

//darkMode -> clicking on moon will toggle dark-mode class on body..CSS changes will apply automatically for background,cards,input,text
//and the button icon changes dynamically to indicate current mode
darkMode.addEventListener('click',()=>{
    document.body.classList.toggle('dark-mode')
    darkMode.innerText = document.body.classList.contains('dark-mode')?"☀️":"🌙"
})