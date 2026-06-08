// 1. Updated Data Structure: 'repo' now specifies WHICH exam to replace
const students = [
    {
        id: "S101",
        name: "Alice Smith",
        quizzes: [80, 90, 70, 100, 85],
        exams: [88, 92, 90],
        repo: { examIndex: null, grade: null } // Took no repo
    },
    {
        id: "S102",
        name: "Bob Jones",
        quizzes: [60, 70, 80, 90, 75],
        exams: [78, 85, 90], 
        repo: { examIndex: 2, grade: 50 } // Gambled on Exam 2, got a 50 (lower than 85!)
    },
    {
        id: "S103",
        name: "Charlie Brown",
        quizzes: [100, 90, 95, 100, 100],
        exams: ["NA", 80, 75], 
        repo: { examIndex: 1, grade: 85 } // Replaced missed Exam 1 with an 85
    }
];

// 2. Strict Repo Replacement Logic
function calculateExamAverage(examArray, repoInfo) {
    if (!examArray || examArray.length === 0) return 0;

    // Map exams to numbers, converting "NA" to 0
    let numericExams = examArray.map(score => {
        if (typeof score === 'string' && score.toUpperCase() === 'NA') {
            return 0;
        }
        return Number(score);
    });

    // Check if they strictly designated an exam to replace (1, 2, or 3)
    if (repoInfo && repoInfo.examIndex >= 1 && repoInfo.examIndex <= 3) {
        // Convert Exam 1, 2, 3 to array index 0, 1, 2
        const targetIndex = repoInfo.examIndex - 1; 
        
        // Handle if repo grade itself is "NA" (counts as 0)
        let repoScore = repoInfo.grade;
        if (typeof repoScore === 'string' && repoScore.toUpperCase() === 'NA') {
            repoScore = 0;
        } else {
            repoScore = Number(repoScore);
        }

        // Forced Policy: Completely overwrite the original grade, even if lower!
        numericExams[targetIndex] = repoScore;
    }

    // Calculate the average of the finalized scores
    const total = numericExams.reduce((acc, score) => acc + score, 0);
    return (total / numericExams.length).toFixed(1);
}

// 3. Quiz Average Function (Kept the same)
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

// 4. Function to display the data on the web page
function displayGrades() {
    const tableBody = document.getElementById('student-table-body');
    tableBody.innerHTML = "";

    students.forEach(student => {
        const row = document.createElement('tr');

        const quizAvgString = calculateQuizAverage(student.quizzes);
        // Pass the new repo object into the calculator
        const examAvgString = calculateExamAverage(student.exams, student.repo);

        const quizAvgNum = Number(quizAvgString);
        const examAvgNum = Number(examAvgString);
        const finalGrade = ((examAvgNum * 0.90) + (quizAvgNum * 0.10)).toFixed(1);

        const quizDisplay = student.quizzes.join(', ');
        
        // Format how the repo column looks (e.g., "50 (Exam 2)" or "-")
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
            <td style="color: #2e7d32; font-weight: bold;">${quizAvgString}%</td>
            <td style="color: #1565c0; font-weight: bold;">${examAvgString}%</td>
            <td style="background-color: #fff9c4; color: #d32f2f; font-weight: bold; font-size: 1.1em;">${finalGrade}%</td>
        `;

        tableBody.appendChild(row);
    });
}

window.onload = displayGrades;