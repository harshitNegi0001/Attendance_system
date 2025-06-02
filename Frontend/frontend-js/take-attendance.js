const classSelect = document.getElementById('class-select');
const subjectSection = document.getElementById('subject-section');
const subjectOptions = document.getElementById('subject-options');
const studentSection = document.getElementById('student-section');
const studentList = document.getElementById('student-list');
const sub_button = document.getElementById("button");


let students = [];

classSelect.addEventListener('change', async () => {
    const classId = classSelect.value;
    if (!classId) return;

    try {
        
        const subjectRes = await fetch(`/api/subjects?classId=${classId}`);
        const subjects = await subjectRes.json();

        subjectOptions.innerHTML = ''; 
        subjects.forEach(subject => {
            subjectOptions.innerHTML += `
                <label>
                    <input type="radio" name="SubjectId" value="${subject._id}" required>
                    ${subject.SubjectName}
                </label><br/>
            `;
        });

        subjectSection.style.display = 'block';
        const studentRes = await fetch(`/api/students?classId=${classId}`);
        students = await studentRes.json(); 

        if (students.length === 0) {
            studentList.innerHTML = `<p style="color:red;">Student Data not Found</p>`;
        } else {
            studentList.innerHTML = `
                <div class="student-card flex" style="background-color:transparent; color:white;">
                    <span class="roll">RollNo</span>
                    <span class="name">Name</span>
                    <span>Attendance_Status</span>
                </div>
            `;

            students.forEach(stu => {
                studentList.innerHTML += `
                    <div class="student-card flex">
                        <span class="roll">${stu.RollNo}</span>
                        <span class="name">${stu.Name}</span>
                        <input type="hidden" name="students[]" value="${stu._id}">
                        <label><input type="radio" name="status-${stu._id}" value="present" checked> Present</label>
                        <label><input type="radio" name="status-${stu._id}" value="absent"> Absent</label>
                    </div>
                `;
            });
        }

        studentSection.style.display = 'flex';

    } catch (err) {
        console.error("Error loading data:", err);
        alert("Error loading subjects or students.");
    }
});

sub_button.addEventListener('click', async () => {
    const dateValue = document.querySelector('#date').value;
    const selectedSubject = document.querySelector('[name="SubjectId"]:checked');

    if (dateValue !== '' && selectedSubject) {
        const SubjectId = selectedSubject.value;

        
        const attendanceData = students.map(stu => {
            const status = document.querySelector(`[name="status-${stu._id}"]:checked`)?.value;
            return {
                StudentId: stu._id,
                AttendanceStatus: status
            };
        });

        try {
            const response = await fetch('/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Date: dateValue,
                    SubjectId: SubjectId,
                    students: attendanceData
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errText}`);
            }

            alert('Attendance Submitted');

        } catch (error) {
            console.error('Fetch error:', error.message, error);
            alert("Failed to submit attendance. Check console for details.");
        }
    } else {
        alert("Please fill all details");
    }
});

