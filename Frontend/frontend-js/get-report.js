const selectBtn = document.querySelector('#btn1')
const selectBtn2 = document.querySelector('#btn2')
const classSelect = document.getElementById('class-select');
const classSelect2 = document.getElementById('class-select2');
const subjectOptions = document.getElementById('subject-options');
const subjectOptions2 = document.getElementById('subject-options2');
const subjectSection = document.getElementById('subject-section');
const subjectSection2 = document.getElementById('subject-section2');
const studentSection = document.getElementById('student-section');
const studentList = document.getElementById('student-list');
const studentSection2 = document.getElementById('student-section2');
const studentList2 = document.getElementById('student-list2');
classSelect.addEventListener('change', async () => {
    const classId = classSelect.value;
    if (!classId) return;

    //  Load subjects
    const subjectRes = await fetch(`/api/subjects?classId=${classId}`);
    const subjects = await subjectRes.json();

    subjectOptions.innerHTML = ''; // Clear old subjects
    subjects.forEach(subject => {

        subjectOptions.innerHTML += `
      <label>
        <input type="radio" name="SubjectId" value="${subject._id}" required>
        ${subject.SubjectName}
      </label><br/>
    `;
    });

    subjectSection.style.display = 'block';
    selectBtn.disabled = false
});
classSelect2.addEventListener('change', async () => {
    const classId = classSelect2.value;
    if (!classId) return;

    //  Load subjects
    const subjectRes = await fetch(`/api/subjects?classId=${classId}`);
    const subjects = await subjectRes.json();

    subjectOptions2.innerHTML = ''; // Clear old subjects
    subjects.forEach(subject => {

        subjectOptions2.innerHTML += `
      <label>
        <input type="radio" name="SubjectId" value="${subject._id}" required>
        ${subject.SubjectName}
      </label><br/>
    `;
    });

    subjectSection2.style.display = 'block';
    selectBtn2.disabled = false
});
selectBtn.addEventListener('click', async () => {
    const dateValue = document.querySelector('#set-date').value;
    const selectedSubject = document.querySelector('[name="SubjectId"]:checked');

    if (dateValue !== '' && selectedSubject) {
        const SubjectId = selectedSubject.value;

        try {
            const response = await fetch('/api/get-st-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Date: dateValue,
                    SubjectId: SubjectId
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errText}`);
            }

            const data = await response.json();
            studentSection.style.display = "block"
            studentSection.innerHTML = `
                        <div class="student-card flex" style="background-color:transparent; color:white;">
                        <span class="roll">RollNo</span>
                        <span class="name">Name</span>
                        <span>Attendance_Status</span>
                        </div>
                    `;

            data.forEach(stu => {
                studentSection.innerHTML += `
                            <div class="student-card flex">
                            <span class="roll">${stu.student.RollNo}</span>
                            <span class="name">${stu.student.Name}</span>
                            <span>${stu.AttendanceStatus}</span
                            </div>
                        `;
            });


        } catch (error) {
            console.error('Fetch error:', error.message, error);

        }
    } else {
        alert('Please fill all details');
    }
});

selectBtn2.addEventListener('click', async () => {
    // const dateValue = document.querySelector('#set-date').value;
    const selectedSubject2 = document.querySelector('[name="SubjectId"]:checked');

    if (selectedSubject2) {
        const SubjectId = selectedSubject2.value;

        try {
            const response = await fetch('/api/get-semester-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({

                    SubjectId: SubjectId
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errText}`);
            }

            const data = await response.json();
            console.log(data);
            studentSection2.style.display = "block"
            studentSection2.innerHTML = `
                        <div class="student-card flex" style="background-color:transparent; color:white;">
                        <span class="roll">RollNo</span>
                        <span class="name">Name</span>
                        <span class="total-cls">Total Classes</span>
                        <span class="attended">Attended</span>
                        <span class="attendance-rate">Attendance Rate</span>
                        </div>
                    `;
            data.forEach(stu => {
                studentSection2.innerHTML += `
                            <div class="student-card flex">
                            <span class="roll">${stu.RollNo}</span>
                            <span class="name">${stu.Name}</span>
                            <span class="total-cls">${stu.TotalClasses}</span>
                            <span class="attended">${stu.PresentCount}</span>
                            <span class="attendance-rate">${stu.Percentage} %</span>
                            </div>
                        `;
            });


        } catch (error) {
            console.error('Fetch error:', error.message, error);

        }
    } else {
        alert('fill all details first');
    }
});