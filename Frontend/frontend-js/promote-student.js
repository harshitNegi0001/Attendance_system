const classSelect = document.getElementById('class-select');
const studentSection = document.getElementById('student-section');
const studentList = document.getElementById('student-list');
const shiftButton = document.getElementById('shift-button');
const newClassSelect = document.getElementById('new-class-select');

let students = [];

classSelect.addEventListener('change', async () => {
    const classId = classSelect.value;
    if (!classId) return;

    try {
        const studentRes = await fetch(`/api/students?classId=${classId}`);
        students = await studentRes.json();

        if (students.length === 0) {
            studentList.innerHTML = `<p style="color:red;">No students found in this class.</p>`;
            shiftButton.style.display = 'none';
        } else {
            studentList.innerHTML = `
                <div class="student-card flex" style="background-color:transparent; color:white;">
                    <span class="roll">Roll No</span>
                    <span class="name">Name</span>
                    <span>Select</span>
                </div>
            `;

            students.forEach(stu => {
                studentList.innerHTML += `
                    <div class="student-card flex">
                        <span class="roll">${stu.RollNo}</span>
                        <span class="name">${stu.Name}</span>
                        <input type="checkbox" name="selectedStudents" value="${stu._id}">
                    </div>
                `;
            });

            shiftButton.style.display = 'inline-block';
            document.querySelector('#class-select2').style.display='block'
        }
        
        studentSection.style.display = 'flex';

    } catch (err) {
        console.error("Error loading students:", err);
        alert("Failed to load students.");
    }
});

shiftButton.addEventListener('click', async () => {
    const selectedStudentIds = Array.from(document.querySelectorAll('input[name="selectedStudents"]:checked'))
        .map(checkbox => checkbox.value);

    const newClassId = newClassSelect.value;

    if (selectedStudentIds.length === 0 || !newClassId) {
        alert("Please select students and a target class.");
        return;
    }

    try {
        const response = await fetch('/api/shift-students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentIds: selectedStudentIds,
                newClassId: newClassId
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        else {
            alert("Students shifted successfully.");
        }

    } catch (error) {
        console.error("Error shifting students:", error.message);
        alert("Failed to shift students.");
    }
});
