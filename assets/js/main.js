// Import db from firebase-config.js
import { db } from './firebase-config.js';
// Import Firestore functions for v9 SDK
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const usernameInput = document.getElementById('username');
    const startBtn = document.getElementById('start-btn');
    const questionElement = document.getElementById('question');
    const answersContainer = document.getElementById('answers-container');
    const progressBar = document.getElementById('progress-bar');
    const questionCounter = document.getElementById('question-counter');

    let currentQuestionIndex = 0;
    let score = 0;
    let userName = '';
    let quizStartTime;

    const questions = [
        {
            question: "في أي سورة وردت أطول آية في القرآن الكريم؟",
            answers: ["آل عمران", "النساء", "البقرة", "المائدة"],
            correctAnswer: "البقرة"
        },
        {
            question: "كم سجدة تلاوة في القرآن الكريم؟",
            answers: ["12", "14", "15", "17"],
            correctAnswer: "14"
        },
        {
            question: "ما السورة التي تُفتتح بثلاثة أحرف فقط (من الحروف المقطعة)؟",
            answers: ["ص", "البقرة", "مريم", "الشورى"],
            correctAnswer: "ص"
        },
        {
            question: "ما السورة التي تُسمى “سورة القتال”؟",
            answers: ["الأنفال", "محمد", "التوبة", "الأحزاب"],
            correctAnswer: "محمد"
        },
        {
            question: "في أي سورة ورد ذكر 'العسل'؟",
            answers: ["النحل", "الرحمن", "يوسف", "البقرة"],
            correctAnswer: "النحل"
        },
        {
            question: "ما السورة التي تكرّر فيها قوله تعالى: 'فبأي آلاء ربكما تكذبان'؟",
            answers: ["المرسلات", "الرحمن", "الواقعة", "الحاقة"],
            correctAnswer: "الرحمن"
        },
        {
            question: "ما السورة التي تبدأ بآية تتحدث عن الهجرة في سبيل الله؟",
            answers: ["النساء", "التوبة", "الأنفال", "النور"],
            correctAnswer: "النساء"
        },
        {
            question: "كم مرة وردت كلمة “الدنيا” في القرآن؟",
            answers: ["100", "115", "123", "99"],
            correctAnswer: "115"
        },
        {
            question: "ما السورة التي ذُكر فيها اسم فرعون أكثر من غيرها؟",
            answers: ["القصص", "طه", "الأعراف", "الشعراء"],
            correctAnswer: "القصص"
        },
        {
            question: "ما السورة التي ورد فيها ذكر “غار ثور”؟",
            answers: ["التوبة", "النور", "الأنفال", "آل عمران"],
            correctAnswer: "التوبة"
        },
        {
            question: "ما السورة التي ذُكر فيها اسم إبليس صراحة لأول مرة؟",
            answers: ["البقرة", "الأعراف", "الحجر", "الكهف"],
            correctAnswer: "البقرة"
        },
        {
            question: "ما السورة التي تضمّنت أوصاف المنافقين بالتفصيل؟",
            answers: ["المنافقون", "التوبة", "النساء", "الحديد"],
            correctAnswer: "المنافقون"
        },
        {
            question: "في أي سورة ورد قوله تعالى: 'قل هل يستوي الذين يعلمون والذين لا يعلمون'؟",
            answers: ["المجادلة", "الزمر", "الرعد", "طه"],
            correctAnswer: "الزمر"
        },
        {
            question: "ما السورة التي تحتوي على آيتين تختتمان بنفس الجملة: 'وكان الله غفورًا رحيمًا'؟",
            answers: ["النساء", "المائدة", "التوبة", "النور"],
            correctAnswer: "النساء"
        },
        {
            question: "كم عدد الأحزاب في القرآن الكريم؟",
            answers: ["30", "40", "60", "120"],
            correctAnswer: "60"
        }
    ];

    startBtn.addEventListener('click', () => {
        userName = usernameInput.value.trim();
        if (userName) {
            startScreen.classList.add('hidden');
            quizScreen.classList.remove('hidden');
            quizStartTime = new Date();
            loadQuestion();
        } else {
            alert('الرجاء إدخال اسمك للمتابعة.');
        }
    });

    function loadQuestion() {
        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            questionElement.textContent = currentQuestion.question;
            answersContainer.innerHTML = ''; // Clear previous answers

            // Shuffle answers to make the quiz more dynamic
            const shuffledAnswers = shuffleArray([...currentQuestion.answers]);

            shuffledAnswers.forEach(answer => {
                const button = document.createElement('button');
                button.textContent = answer;
                button.classList.add('answer-btn');
                button.addEventListener('click', () => selectAnswer(button, answer, currentQuestion.correctAnswer));
                answersContainer.appendChild(button);
            });

            updateProgressBar();
            updateQuestionCounter();
        } else {
            endQuiz();
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function selectAnswer(selectedButton, userAnswer, correctAnswer) {
        // Disable all buttons after an answer is selected
        Array.from(answersContainer.children).forEach(button => {
            button.disabled = true;
            button.classList.remove('selected'); // Remove any prior selected class
        });

        selectedButton.classList.add('selected'); // Highlight the selected answer

        if (userAnswer === correctAnswer) {
            score++;
            selectedButton.classList.add('correct');
        } else {
            selectedButton.classList.add('incorrect');
            // Optionally, show the correct answer
            Array.from(answersContainer.children).forEach(button => {
                if (button.textContent === correctAnswer) {
                    button.classList.add('correct');
                }
            });
        }

        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 1500); // Wait 1.5 seconds before loading the next question
    }

    function updateProgressBar() {
        const progress = (currentQuestionIndex / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function updateQuestionCounter() {
        questionCounter.textContent = `السؤال ${currentQuestionIndex + 1} من ${questions.length}`;
    }

    async function endQuiz() {
        const quizEndTime = new Date();
        const duration = Math.round((quizEndTime - quizStartTime) / 1000); // Duration in seconds

        try {
            // Use addDoc and collection for v9
            await addDoc(collection(db, 'quizResults'), {
                username: userName,
                score: score,
                totalQuestions: questions.length,
                timestamp: serverTimestamp(), // Use serverTimestamp for v9
                duration: duration
            });
            console.log("Quiz result saved to Firestore!");
        } catch (error) {
            console.error("Error writing document: ", error);
        }

        // Store result in sessionStorage to pass to result.html
        sessionStorage.setItem('finalScore', score);
        sessionStorage.setItem('totalQuestions', questions.length);

        window.location.href = 'result.html';
    }
});