const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("../models/Question");

MONGO_URI = "mongodb+srv://jkarthikeya2004:karthikeya@cluster0.slrlm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

dotenv.config();
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedQuestions = async () => {
  try {
    await Question.deleteMany();
    await Question.insertMany([
      { id: 1, question: "What is React?", options: ["Library", "Framework", "Language"], correctAnswer: "Library" },
      { id: 2, question: "What does JSX stand for?", options: ["JavaScript XML", "Java Syntax Extension", "Java XML"], correctAnswer: "JavaScript XML" },
      { id: 3, question: "Which hook is used to manage state in a functional component?", options: ["useState", "useEffect", "useContext"], correctAnswer: "useState" },
      { id: 4, question: "Which lifecycle method is called after the component is first rendered?", options: ["componentDidMount", "componentDidUpdate", "componentWillUnmount"], correctAnswer: "componentDidMount" },
      { id: 5, question: "Which company maintains React?", options: ["Google", "Facebook (Meta)", "Microsoft"], correctAnswer: "Facebook (Meta)" },
      { id: 6, question: "What is the correct way to pass props in React?", options: ["this.props", "props", "component.props"], correctAnswer: "props" },
      { id: 7, question: "Which React feature allows components to manage side effects?", options: ["useEffect", "useState", "useReducer"], correctAnswer: "useEffect" },
      { id: 8, question: "What is Redux used for?", options: ["Managing UI state", "Managing application state", "Styling components"], correctAnswer: "Managing application state" },
      { id: 9, question: "Which hook is used for context API?", options: ["useContext", "useReducer", "useEffect"], correctAnswer: "useContext" },
      { id: 10, question: "What does useRef do in React?", options: ["Stores values across renders", "Handles API requests", "Updates state"], correctAnswer: "Stores values across renders" },
    ]);
    console.log("Questions added successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedQuestions();
