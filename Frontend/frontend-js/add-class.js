const addSubjectBtn = document.getElementById('add-subject-btn');
const subjectContainer = document.getElementById('subject-container');
const submitBtn = document.getElementById('submit-class-btn');

addSubjectBtn.addEventListener('click', () => {
    if (subjectContainer.style.display != 'flex') {
        
        subjectContainer.style.display = 'flex';
        subjectContainer.style.flexDirection = 'column';
        subjectContainer.innerHTML = '<lable>Subject Name</lable>'
    }

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'subject-box';
    input.name = 'subjects';
    
    input.required = true;
    subjectContainer.appendChild(input);
});


submitBtn.addEventListener('click', async () => {
    const className = document.getElementById('class-name').value.trim();
    const subjectInputs = subjectContainer.querySelectorAll('input[name="subjects"]');

    const subjects = Array.from(subjectInputs)
        .map(input => input.value.trim())
        .filter(value => value.length > 0);

    if (!className || subjects.length === 0) {
        alert('Please enter class name and at least one subject.');
        return;
    }

    const payload = {
        className,
        subjects
    };

    const res = await fetch('/add-class', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const result = await res.json();
    alert(result.message || 'Class added!');
});
const classSelector = document.querySelector('#class-select');
const delBtn= document.querySelector('#del-btn');
classSelector.addEventListener('change',()=>{
    const classID = classSelector.value;
    if(!classID){
        delBtn.disabled=true;
        return;
    }
    delBtn.disabled=false;
});
delBtn.addEventListener('click',async()=>{
    const classID = classSelector.value;
    const response = await fetch('/api/del-class',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            classID
        })
    });
    const result = await response.json();
    alert(result.message || 'Class deleted!');
});