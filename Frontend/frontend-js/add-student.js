const submitBtn = document.querySelector("#sub-btn");
const deleteBtn = document.querySelector('#del-btn');
const rollInput = document.querySelector("#rollno");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const classSelect = document.querySelector('#class-select')

submitBtn.addEventListener('click', async () => {
    const rollNo = rollInput.value;
    const stuName = nameInput.value;
    const emailValue = emailInput.value;
    const classId = classSelect.value;

    if (!classId || !rollNo || !stuName || !emailValue) {
        alert('Please Fill all details ');
        return
    }
    else {
        try {
            const response = await fetch('/add-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ClassId: classId,
                    Email: emailValue,
                    Name: stuName,
                    RollNo: rollNo
                })
            });
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errText}`);
            }
            else {
                alert("student added");
            }
        } catch (e) {
            alert('error!:  ', e.message)
        }
    }
});

deleteBtn.addEventListener('click', async () => {
    const delRoll = document.querySelector('#del-roll').value.trim();
    const confirmRoll = document.querySelector('#confirm-roll').value.trim();
    if (!delRoll || !confirmRoll) {
        alert('please fill all details ');
        return
    }
    else {
        if (delRoll === confirmRoll) {
            try {
                const response = await fetch('/remove-student', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        RollNo: delRoll
                    })
                })
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'Unknown error');
                }
                else {
                    alert("Student deleted");
                }

            }
            catch (e) {
                alert('error! : ' + e.message);
            }
        }
        else {
            alert('Confirming RollNO is diffrent');
            return
        }
    }

})