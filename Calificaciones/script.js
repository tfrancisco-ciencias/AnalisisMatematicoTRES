// Secret phrase to view all students (Change this to whatever you want)
const TEACHER_PASSWORD = "admin_grades_2026";

const students = [
    {
        id: "S101",
        name: "Alice Smith",
        quizzes: [80, 90, 70, 100, 85],
        exams: [88, 92, 90],
        repo: { examIndex: null, grade: null },
        finalTest: null
    },
    {
        id: "S102",
        name: "Bob Jones",
        quizzes: [60, 70, 80, 90, 75],
        exams: [78, 85, 90], 
        repo: { examIndex: 2, grade: 50 },
        finalTest: null
    },
    {
        id: "S103",
        name: "Charlie Brown",
        quizzes: [100, 90, 95, 100, 100],
        exams: ["NA", 80, 75], 
        repo: { examIndex: 1, grade: 85 },
        finalTest: null
    },
    {
        id: "S104",
        name: "David Miller",
        quizzes: [40, "NA", 30, 50, 20],
        exams: [50, "NA", 45],
        repo: { examIndex: null, grade: null },
        finalTest: 95
    }
];

function calculateExamAverage(examArray, repoInfo) {
    if (!examArray || examArray.length === 0) return 0;
    let numericExams = examArray.map(score => {
        if (typeof score === 'string' && score.toUpperCase() === 'NA') return 0;
        return Number(score);
    });
    if (repoInfo && repoInfo.examIndex >= 1 && repoInfo.examIndex <= 3) {
        const targetIndex = repoInfo.examIndex - 1; 
        let repoScore = repoInfo.grade;
        if (typeof repoScore === 'string' && repoScore.toUpperCase() === 'NA') {
            repoScore = 0;
        } else {
            repoScore = Number(repoScore);
        }
        numericExams[targetIndex] = repoScore;
    }
    const total = numericExams.reduce((acc, score) => acc + score, 0);
    return (total / numericExams.length).toFixed(1);
}

function calculateQuizAverage(quizArray) {
    if (!quizArray || quizArray.length === 0) return 0;
    const sanitizedQuizzes = quizArray.map(score => {
        if (typeof score === 'string' && score.toUpperCase() === 'NA') return 0; 
        return Number(score);
    });
    const sortedQuizzes = sanitizedQuizzes.sort((a, b) => b - a);
    const itemsToKeep = Math.round(sortedQuizzes.length * 0.8);
    const finalCount = itemsToKeep > 0 ? itemsToKeep : 1;
    const topQuizzes = sortedQuizzes.slice(0, finalCount);
    const sum = topQuizzes.reduce((acc, score) => acc + score, 0);
    return (sum / finalCount).toFixed(1);
}

// Main login handler triggered by the HTML button click
function handleLogin() {
    const inputVal = document.getElementById('student-id-input').value.trim();
    const errorMsg = document.getElementById('error-msg');
    const tableContainer = document.getElementById('table-container');

    // Reset view states
    errorMsg.style.display = 'none';
    tableContainer.style.display = 'none';

    if (inputVal === "") return;

    // Check if the teacher is logging in to see everything
    if (inputVal === TEACHER_PASSWORD) {
        displayGrades(students); // Pass the entire array
        tableContainer.style.display = 'block';
        return;
    }

    // Otherwise, check if it matches a single student ID
    const foundStudent = students.find(s => s.id.toUpperCase() === inputVal.toUpperCase());

    if (foundStudent) {
        displayGrades([foundStudent]); // Pass an array containing just that one student
        tableContainer.style.display = 'block';
    } else {
        errorMsg.style.display = 'block'; // Show error if no match
    }
}

// Function modified to accept an array of students to render
function displayGrades(studentsToRender) {
    const tableBody = document.getElementById('student-table-body');
    tableBody.innerHTML = "";

    studentsToRender.forEach(student => {
        const row = document.createElement('tr');

        const quizAvgString = calculateQuizAverage(student.quizzes);
        const examAvgString = calculateExamAverage(student.exams, student.repo);

        let finalGrade;
        let quizAvgDisplay = `${quizAvgString}%`;
        let examAvgDisplay = `${examAvgString}%`;
        let finalTestDisplay = student.finalTest !== null ? `${student.finalTest}%` : '-';

        if (student.finalTest !== null && student.finalTest !== undefined) {
            finalGrade = Number(student.finalTest).toFixed(1);
            quizAvgDisplay = `<span style="color: #bbb; text-decoration: line-through;">${quizAvgString}%</span>`;
            examAvgDisplay = `<span style="color: #bbb; text-decoration: line-through;">${examAvgString}%</span>`;
        } else {
            const quizAvgNum = Number(quizAvgString);
            const examAvgNum = Number(examAvgString);
            finalGrade = ((examAvgNum * 0.90) + (quizAvgNum * 0.10)).toFixed(1);
        }

        const quizDisplay = student.quizzes.join(', ');
        const repoDisplay = student.repo.examIndex 
            ? `${student.repo.grade} (Exam ${student.repo.examIndex})` 
            : '-';

        row.innerHTML = `
            <td>${student.id}</td>
            <td><b>${student.name}</b></td>
            <td>${quizDisplay}</td>
            <td>${student.exams[0] !== undefined ? student.exams[0] : '-'}</td>
            <td>${student.exams[1] !== undefined ? student.exams[1] : '-'}</td>
            <td>${student.exams[2] !== undefined ? student.exams[2] : '-'}</td>
            <td style="font-style: italic; color: #757575;">${repoDisplay}</td>
            <td style="font-weight: bold; color: #673ab7;">${finalTestDisplay}</td>
            <td style="font-weight: bold; color: #2e7d32;">${quizAvgDisplay}</td>
            <td style="font-weight: bold; color: #1565c0;">${examAvgDisplay}</td>
            <td style="background-color: #fff9c4; color: #d32f2f; font-weight: bold; font-size: 1.1em;">${finalGrade}%</td>
        `;

        tableBody.appendChild(row);
    });
}