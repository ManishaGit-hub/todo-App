const input = document.getElementById("task")
const priorityInput=document.getElementById("priority")
const dueDate=document.getElementById("time")
const addBtn=document.getElementById("addBtn")
const listItems=document.getElementById("taskList")
const darkMode=document.getElementById("darkMode")

addBtn.addEventListener('click',addTask)

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
    })

    deleteBtn.addEventListener('click',()=>{
        card.remove();
    })

}
