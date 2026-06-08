// 1. Updated Student Data Structure (including "NA")
const students = [
    {
        id: "S101",
        name: "Alice Smith",
        quizzes: [80, 90, 70, 100, 85], // 5 quizzes
        exams: [88, 92, 90]
    },
    {
        id: "S102",
        name: "Bob Jones",
        quizzes: [60, "NA", 80, 90, 75],
        exams: [78, "NA", 85] // Bob missed Exam 2
    },
    {
        id: "S103",
        name: "Charlie Brown",
        quizzes: [100, 90, 95, 100, 100],
        exams: ["NA", "NA", 98] // Charlie missed two exams
    }
];

// 2. Helper function to calculate Exam Average (Treats "NA" as 0)
function calculateExamAverage(examArray) {
    if (!examArray || examArray.length === 0) return 0;

    let total = 0;
    examArray.forEach(score => {
        // If the score is "NA" (case-insensitive), treat it as 0
        if (typeof score === 'string' && score.toUpperCase() === 'NA') {
            total += 0;
        } else {
            total += Number(score); // Ensure it's treated as a number
        }
    });

    return (total / examArray.length).toFixed(1); // Rounds to 1 decimal place
}

// 3. Helper function to calculate Quiz Average (Top 80% only)
function calculateQuizAverage(quizArray) {
    if (!quizArray || quizArray.length === 0) return 0;

    // 1. Convert any "NA" to 0, and ensure other scores are numbers
    const sanitizedQuizzes = quizArray.map(score => {
        if (typeof score === 'string' && score.toUpperCase() === 'NA') {
            return 0; 
        }
        return Number(score);
    });

    // 2. Sort quizzes in descending order (highest to lowest)
    // This naturally pushes the 0s (missed quizzes) to the very end
    const sortedQuizzes = sanitizedQuizzes.sort((a, b) => b - a);

    // 3. Calculate how many quizzes represent 80%
    const itemsToKeep = Math.round(sortedQuizzes.length * 0.8);
    const finalCount = itemsToKeep > 0 ? itemsToKeep : 1;

    // 4. Slice the array to keep only the top scores (dropping the lowest 20%)
    const topQuizzes = sortedQuizzes.slice(0, finalCount);

    // 5. Calculate the average of these top scores
    const sum = topQuizzes.reduce((acc, score) => acc + score, 0);
    return (sum / finalCount).toFixed(1);
}

// 4. Function to display the data on the web page
// 4. Function to display the data on the web page (Updated with Final Grade)
function displayGrades() {
    const tableBody = document.getElementById('student-table-body');
    tableBody.innerHTML = "";

    students.forEach(student => {
        const row = document.createElement('tr');

        // 1. Calculate the individual averages (returns strings, e.g., "85.5")
        const quizAvgString = calculateQuizAverage(student.quizzes);
        const examAvgString = calculateExamAverage(student.exams);

        // 2. Convert averages back to numbers for math operations
        const quizAvgNum = Number(quizAvgString);
        const examAvgNum = Number(examAvgString);

        // 3. Apply the weights: 90% Exams, 10% Quizzes
        const finalGrade = ((examAvgNum * 0.90) + (quizAvgNum * 0.10)).toFixed(1);

        const quizDisplay = student.quizzes.join(', ');

        // 4. Inject the data into the table row
        row.innerHTML = `
            <td>${student.id}</td>
            <td><b>${student.name}</b></td>
            <td>${quizDisplay}</td>
            <td>${student.exams[0] !== undefined ? student.exams[0] : '-'}</td>
            <td>${student.exams[1] !== undefined ? student.exams[1] : '-'}</td>
            <td>${student.exams[2] !== undefined ? student.exams[2] : '-'}</td>
            <td style="color: #2e7d32; font-weight: bold;">${quizAvgString}%</td>
            <td style="color: #1565c0; font-weight: bold;">${examAvgString}%</td>
            <td style="background-color: #fff9c4; color: #d32f2f; font-weight: bold; font-size: 1.1em;">${finalGrade}%</td>
        `;

        tableBody.appendChild(row);
    });
}

window.onload = displayGrades;