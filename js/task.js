

const taskInput=document.getElementById('taskInput'); //input
const priorityInput=document.getElementById('priorityInput'); //select
const addBtn=document.getElementById('addBtn'); //button
const taskList=document.getElementById('taskList'); //ul
const darkModeBtn=document.getElementById("darkModeBtn");

if(localStorage.getItem("darkMode")==="enabled"){
    document.body.classList.add("dark-mode");
    darkModeBtn.textContent="🌞";
}

darkModeBtn.addEventListener("click",()=>{
    document.body.classList.toggle("dark-mode");


if(document.body.classList.contains("dark-mode")){
    localStorage.setItem("darkMode","enabled");
    darkModeBtn.textContent="🌞";
}else{
    localStorage.setItem("darkMode","disabled");
    darkModeBtn.textContent="🌙";

}
});
//when page opens load the previous tasks
window.onload=()=>{
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.forEach(task => renderTask(task.text,task.completed,task.priority));
    updateTaskCount();
    const savedFilter=localStorage.getItem("currentFilter")||"all";
    applyFilter(savedFilter);
}


function applyFilter(filter){
    const buttons={
        all: document.getElementById('showAll'),
        pending:document.getElementById('showPending'),
        completed:document.getElementById('showCompleted')
    };

    Object.keys(buttons).forEach(key => buttons[key].classList.remove('active-filter'))
    buttons[filter].classList.add('active-filter');
    
    document.querySelectorAll('#taskList li').forEach(li =>{
        if(filter === "all")li.style.display='flex';
        else if(filter === "pending")li.style.display=li.classList.contains('completed')?'none':'flex';
        else if(filter ==="completed")li.style.display=li.classList.contains('completed')?'flex':'none';
    })
}

function addTask(){
    const text=taskInput.value.trim();
    const priority=priorityInput.value;

    if(text===''){
        alert("Please enter a task!")
        taskInput.focus();
        return;
    }


    renderTask(text,false,priority);
    saveTasks();
    updateTaskCount();

    taskInput.value='';
    taskInput.focus();
}

function renderTask(text,completed,priority="low"){
        const li=document.createElement('li');
        if(completed) li.classList.add("completed");
        li.classList.add(priority);

        const span=document.createElement('span');
        span.textContent=text;

        span.onclick=()=>{
            const newText=prompt("Edit task:",span.textContent);
            if(newText!==null && newText.trim()!==""){
                span.textContent=newText.trim();
                saveTasks();
                updateTaskCount();
            }
        }

        const buttons=document.createElement("div");
        buttons.classList.add("task-buttons");

        const completedBtn=document.createElement("i");
        completedBtn.classList.add("fa-solid","fa-check");
        completedBtn.onclick=()=>{
        li.classList.toggle("completed");
        saveTasks();
        updateTaskCount();
        }

        const deleteBtn=document.createElement("i");
        deleteBtn.classList.add("fa-solid","fa-trash");
        deleteBtn.onclick=()=>{
        li.remove();
        saveTasks();
        updateTaskCount();
        }

        buttons.appendChild(completedBtn);
        buttons.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(buttons);
        taskList.appendChild(li);
}
function saveTasks(){
    const tasks=[];
    document.querySelectorAll("#taskList li").forEach(li=>{
        let priority="low";
        if(li.classList.contains("medium"))priority="medium";
        if(li.classList.contains("high"))priority="high";
        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("completed"),
            priority:priority
        });
    });
    localStorage.setItem("tasks",JSON.stringify(tasks));
    updateTaskCount();
}

function updateTaskCount(){
            const total=document.querySelectorAll("#taskList li").length;
            const completed=document.querySelectorAll("#taskList li.completed").length;
            document.getElementById("taskCount").textContent=`${total} tasks,${completed} completed`;
        }

document.getElementById('clearAll').onclick=()=>{
    if(taskList.children.length===0){
        alert("No tasks to clear!");
        return;
        
    }
    const isComfirmed=confirm("All the content will be disappeared, are you sure")
    if(isComfirmed){
    taskList.innerHTML='',
    saveTasks();
    updateTaskCount();}
}

document.getElementById('clearCompleted').onclick=()=>{
    document.querySelectorAll('#taskList li.completed').forEach(li=>li.remove());
    saveTasks();
    updateTaskCount();
}

//filters
document.getElementById('showAll').onclick=()=>{
    localStorage.setItem("currentFilter","all");
    applyFilter("all");
}

document.getElementById('showPending').onclick=()=>{
    localStorage.setItem("currentFilter","pending");
    applyFilter("pending");
}

document.getElementById('showCompleted').onclick=()=>{
    localStorage.setItem("currentFilter","completed");
    applyFilter("completed");
}

addBtn.addEventListener('click',addTask);

taskInput.addEventListener('keydown',(e)=>{
    if(e.key === 'Enter') addTask();
});

