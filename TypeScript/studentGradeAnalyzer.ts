// Define the StudentInfo interface
interface StudentInfo {
    name: string;
    grades: number[];
}

// Define the GradeAnalysisReport interface
interface GradeAnalysisReport {
    studentName: string;
    averageGrade: number;
    highestGrade: number;
    passed: boolean;
    summary: string;
}

// Function to analyze student grades
function analyzeGrades(student: StudentInfo, minPassingGrade: number): GradeAnalysisReport {
    // Validate that student info is provided
    if (!student) {
        throw new Error("Student info is missing!");
    }
    
    // Validate that student name is provided
    if (!student.name) {
        throw new Error("Student name is missing!");
    }
    
    // Validate that grades array is not empty
    if (!student.grades || student.grades.length === 0) {
        throw new Error("Grades array cannot be empty!");
    }
    
    // Validate that all grades are within the valid range [2...6]
    for (const grade of student.grades) {
        if (grade < 2 || grade > 6) {
            throw new Error(`Invalid grade: ${grade}. Grades must be between 2 and 6.`);
        }
    }
    
    // Calculate the average grade
    const sum = student.grades.reduce((acc, grade) => acc + grade, 0);
    const averageGrade = sum / student.grades.length;
    
    // Find the highest grade
    const highestGrade = Math.max(...student.grades);
    
    // Determine if the student passed
    const passed = averageGrade >= minPassingGrade;
    
    // Generate the summary message
    let summary = `${student.name}'s average grade is ${averageGrade.toFixed(2)}. `;
    if (passed) {
        summary += `Excellent! The student passed with a highest grade of ${highestGrade}.`;
    } else {
        summary += `Unfortunately, the student did not meet the minimum grade of ${minPassingGrade}.`;
    }
    
    // Return the grade analysis report
    return {
        studentName: student.name,
        averageGrade: averageGrade,
        highestGrade: highestGrade,
        passed: passed,
        summary: summary
    };
}

// Test cases
console.log("Test Case 1: Alice");
console.log(analyzeGrades({ name: "Alice", grades: [5, 5, 5, 6] }, 4));
console.log();

console.log("Test Case 2: Eve");
console.log(analyzeGrades({ name: "Eve", grades: [2] }, 3));
console.log();

console.log("Test Case 3: Frank (Invalid grade)");
try {
    console.log(analyzeGrades({ name: "Frank", grades: [5, 1, 5, 4] }, 4));
} catch (error: any) {
    console.log(error.message);
}
console.log();

// Additional test cases
console.log("Test Case 4: Bob (Perfect scores)");
console.log(analyzeGrades({ name: "Bob", grades: [6, 6, 6] }, 5));
console.log();

console.log("Test Case 5: Charlie (Borderline pass)");
console.log(analyzeGrades({ name: "Charlie", grades: [4, 4, 4, 4] }, 4));
console.log();

console.log("Test Case 6: Empty grades array");
try {
    console.log(analyzeGrades({ name: "David", grades: [] }, 4));
} catch (error: any) {
    console.log(error.message);
}
console.log();

console.log("Test Case 7: Invalid grade (too high)");
try {
    console.log(analyzeGrades({ name: "Emily", grades: [5, 7, 4] }, 4));
} catch (error: any) {
    console.log(error.message);
}
console.log();

console.log("Test Case 8: Missing student name");
try {
    console.log(analyzeGrades({ name: "", grades: [5, 5] }, 4));
} catch (error: any) {
    console.log(error.message);
}
