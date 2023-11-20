let questions = [
    {
        question: "What does 'var' stand for in JavaScript?",
        answers: ["Variable", "Variant", "Variety", "Variance"],
        correct: 0
    },
    {
        question: "What does HTML stand for?",
        answers: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Tool Markup Language"],
        correct: 0
    },
    {
        question: "What property is used to change the text color of an element?",
        answers: ["font-color", "text-color", "color", "background-color"],
        correct: 2
    },
    {
        question: "Which command will show you the history of your commits in Git?",
        answers: ["git commit", "git status", "git log", "git history"],
        correct: 2
    },
    {
        question: "Which object in JavaScript can be used to ensure code runs after a delay?",
        answers: ["setTimeout", "delay", "wait", "pause"],
        correct: 0
    },
    {
        question: "How do you select an element with id 'demo' using jQuery?",
        answers: ["$('#demo')", "$('.demo')", "jQuery('#demo')", "jQuery('.demo')"],
        correct: 0
    },
    {
        question: "Which Bootstrap class provides a responsive fixed-width container?",
        answers: [".container-fixed", ".container-fluid", ".container", ".fixed-container"],
        correct: 2
    },
    {
        question: "In Flexbox, what property aligns items horizontally in the container?",
        answers: ["align-items", "justify-content", "flex-align", "align-content"],
        correct: 1
    },
    {
        question: "Which is a popular CSS preprocessor?",
        answers: ["CSSSharp", "Stylish", "Sass", "Less"],
        correct: 2
    },
    {
        question: "Which is a tool used to minimize the size of JavaScript files?",
        answers: ["JavaScript Compressor", "MinifyJS", "UglifyJS", "CondenseJS"],
        correct: 2
    }
];


let currentQuestionIndex = 0; // Track the current question
let timer; // Reference for the quiz countdown timer
let score = 0; // Player's current score

$(document).ready(function() {
    // Event handler for the 'Start Quiz' button
    $('#start-btn').click(function() {
        $(this).hide();
        $('#quiz-container').fadeIn();
        startQuiz();
    });

    // Event handler for the 'High Scores' button
    $('#high-scores-btn').click(function() {
        displayHighScores();
    });

    // Event handler for the 'Go Home' button
    $('#go-home-btn').click(function() {
        $('#high-scores-container').hide();
        $('#home-container').fadeIn();
    });

    // Event handler for the 'Restart Quiz' button
    $('#restart-btn').click(function() {
        resetQuiz();
    });

    // Event handler for the 'Submit Score' button
    $('#submit-score').click(function() {
        let initials = $('#initials').val();
        if (initials !== "") {
            saveScore(initials, score);
            $('#initials').val('');
            resetQuiz(); // Call reset function after saving the score
        } else {
            alert('Please enter your initials.');
        }
    });
});

// Function to start the quiz
function startQuiz() {
    resetQuizState();
    $('#timer').show();
    timer = setInterval(function() {
        let timeLeft = parseInt($('#time').text());
        timeLeft--;
        $('#time').text(timeLeft);
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    showNextQuestion();
}

// Function to show the next question
function showNextQuestion() {
    let question = questions[currentQuestionIndex];
    let questionContainer = $('#question-container');
    questionContainer.html(`<h3>${question.question}</h3>`);
    question.answers.forEach(function(answer, index) {
        let button = $(`<button class="btn btn-info m-1">${answer}</button>`);
        button.click(function() {
            if (index === question.correct) {
                score++;
            } else {
                let currentTime = parseInt($('#time').text());
                let newTime = Math.max(0, currentTime - 10);
                $('#time').text(newTime);
                if(newTime <= 0) {
                    endGame();
                }
            }
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                showNextQuestion();
            } else {
                endGame();
            }
        });
        questionContainer.append(button);
    });
}

// Function to end the quiz
function endGame() {
    clearInterval(timer);
    $('#timer').hide();
    $('#quiz-container').hide();
    $('#final-score').text(score);
    $('#score-container').fadeIn();
}

// Function to save the player's score
function saveScore(initials, score) {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const newScore = { initials, score };
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
}

// Function to display high scores
function displayHighScores() {
    $('#home-container').hide();
    $('#score-container').hide();
    $('#quiz-container').hide();
    $('#high-scores-container').fadeIn();

    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const highScoresList = $('#high-scores-list');
    highScoresList.empty();

    highScores.forEach(function(score) {
        highScoresList.append(`<li class="list-group-item">${score.initials} - ${score.score}</li>`);
    });
}

// Function to reset the quiz to the beginning
function resetQuiz() {
    resetQuizState();

    // Reset DOM elements to their initial state
    $('#final-score').text('');
    $('#time').text('60');
    $('#question-container').empty();

    // Hide all containers except for the home container
    $('#score-container').hide();
    $('#quiz-container').hide();
    $('#high-scores-container').hide();
    $('#home-container').show();

    // Show the 'Start Quiz' and 'High Scores' buttons again
    $('#start-btn').show();
    $('#high-scores-btn').show();
}

// Function to reset internal quiz state
function resetQuizState() {
    // Reset game state variables
    score = 0;
    currentQuestionIndex = 0;
    clearInterval(timer); // Clear any existing timers
}
