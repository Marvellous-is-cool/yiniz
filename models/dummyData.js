// Dummy data for fallback when DB is not connected

const students = [
  {
    matric_number: "A123",
    full_name: "John Doe",
    scores: 85,
  },
  {
    matric_number: "B456",
    full_name: "Jane Smith",
    scores: 90,
  },
];

const questions = [
  { id: 1, question: "What is 2+2?", answer: "4" },
  { id: 2, question: "What is the capital of France?", answer: "Paris" },
  // ...add more dummy questions as needed
];

const testSessions = [
  { id: 1, starthour: 8, endhour: 17 },
  { id: 2, starthour: 18, endhour: 20 },
];

module.exports = {
  getStudentByUsernameAndPassword: async (username, password) => {
    return students.find(
      (s) =>
        s.matric_number === username && s.full_name.split(" ")[0] === password
    );
  },
  getRandomQuestions: async () => {
    // Return up to 20 random questions
    return questions.sort(() => 0.5 - Math.random()).slice(0, 20);
  },
  updateUserScores: async (username, score) => {
    const student = students.find((s) => s.matric_number === username);
    if (student) student.scores = score;
  },
  getUserData: async (username) => {
    const student = students.find((s) => s.matric_number === username);
    if (!student) return null;
    return {
      username: student.matric_number,
      full_name: student.full_name,
      scores: student.scores,
    };
  },
  getStudentsWithScoresGreaterThanZero: async () => {
    return students.filter((s) => s.scores > 0);
  },
  getTestSessions: async () => {
    return testSessions;
  },
  getUserScores: async (username) => {
    const student = students.find((s) => s.matric_number === username);
    if (!student) return null;
    return { scores: student.scores };
  },
};
