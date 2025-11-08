document.addEventListener('DOMContentLoaded', () => {
    const finalScoreElement = document.getElementById('final-score');
    const totalQuestionsElement = document.getElementById('total-questions');
    const feedbackMessageElement = document.getElementById('feedback-message');
    const resultChartCtx = document.getElementById('result-chart').getContext('2d');

    const finalScore = parseInt(sessionStorage.getItem('finalScore') || '0', 10);
    const totalQuestions = parseInt(sessionStorage.getItem('totalQuestions') || '0', 10);
    const incorrectAnswers = totalQuestions - finalScore;

    finalScoreElement.textContent = finalScore;
    totalQuestionsElement.textContent = totalQuestions;

    // Determine feedback message
    let feedback = '';
    const scorePercentage = (finalScore / totalQuestions) * 100;

    if (finalScore >= 11 && finalScore <= 15) { // Assuming 15 questions total
        feedback = 'مستوى متعمق في القرآن 💫 أنت رائع!';
        feedbackMessageElement.style.color = '#4CAF50';
    } else if (finalScore >= 6 && finalScore <= 10) {
        feedback = 'مستوى ممتاز 👏 واصل التعلم!';
        feedbackMessageElement.style.color = '#FFC107';
    } else {
        feedback = 'تحتاج تركيزًا أكثر 📖 لا تيأس، حاول مرة أخرى!';
        feedbackMessageElement.style.color = '#F44336';
    }
    feedbackMessageElement.textContent = feedback;

    // Create the pie chart
    new Chart(resultChartCtx, {
        type: 'doughnut', // Changed to doughnut for a more modern look
        data: {
            labels: ['إجابات صحيحة', 'إجابات خاطئة'],
            datasets: [{
                data: [finalScore, incorrectAnswers],
                backgroundColor: ['#4CAF50', '#FFCDD2'], // Green for correct, light red for incorrect
                borderColor: ['#4CAF50', '#FFCDD2'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow custom sizing
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: 'Cairo',
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed;
                            }
                            return label;
                        }
                    },
                    bodyFont: {
                        family: 'Cairo',
                        size: 14
                    },
                    titleFont: {
                        family: 'Cairo',
                        size: 16
                    }
                }
            }
        }
    });
});