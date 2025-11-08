// Import db from firebase-config.js
import { db } from './firebase-config.js';
// Import Firestore functions for v9 SDK
import { collection, getDocs, orderBy, query } from "firebase/firestore";

document.addEventListener('DOMContentLoaded', async () => {
    const totalParticipantsElement = document.getElementById('total-participants');
    const averageScoreElement = document.getElementById('average-score');
    const successRateElement = document.getElementById('success-rate');
    const resultsTableDiv = document.getElementById('results-table');
    const successPieChartCtx = document.getElementById('success-pie-chart').getContext('2d');

    async function loadQuizResults() {
        resultsTableDiv.innerHTML = '<p>يتم الآن تحميل البيانات...</p>';
        let totalScores = 0;
        let participantCount = 0;
        let successfulParticipants = 0; // Score >= 50%

        try {
            // Use query and getDocs for v9
            const q = query(collection(db, 'quizResults'), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            const results = [];

            querySnapshot.forEach(doc => {
                const data = doc.data();
                results.push(data);

                participantCount++;
                totalScores += data.score;
                const scorePercentage = (data.score / data.totalQuestions) * 100;
                if (scorePercentage >= 50) {
                    successfulParticipants++;
                }
            });

            // Update overview stats
            totalParticipantsElement.textContent = participantCount;
            if (participantCount > 0) {
                averageScoreElement.textContent = (totalScores / participantCount).toFixed(2);
                const successRate = (successfulParticipants / participantCount) * 100;
                successRateElement.textContent = `${successRate.toFixed(1)}%`;
            } else {
                averageScoreElement.textContent = '0';
                successRateElement.textContent = '0%';
            }

            // Populate results table
            if (results.length > 0) {
                let tableHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>الاسم</th>
                                <th>الدرجة</th>
                                <th>عدد الأسئلة</th>
                                <th>النسبة المئوية</th>
                                <th>المدة (ثانية)</th>
                                <th>التاريخ</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                results.forEach(result => {
                    const scorePercentage = ((result.score / result.totalQuestions) * 100).toFixed(1);
                    const date = result.timestamp ? new Date(result.timestamp.seconds * 1000).toLocaleString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : 'غير متاح';

                    tableHTML += `
                        <tr>
                            <td>${result.username}</td>
                            <td>${result.score}</td>
                            <td>${result.totalQuestions}</td>
                            <td>${scorePercentage}%</td>
                            <td>${result.duration || 'N/A'}</td>
                            <td>${date}</td>
                        </tr>
                    `;
                });
                tableHTML += `
                        </tbody>
                    </table>
                `;
                resultsTableDiv.innerHTML = tableHTML;
            } else {
                resultsTableDiv.innerHTML = '<p>لا توجد نتائج حتى الآن.</p>';
            }

            // Create success rate pie chart
            if (participantCount > 0) {
                const failedParticipants = participantCount - successfulParticipants;
                new Chart(successPieChartCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['ناجحون (أكثر من 50%)', 'راسبون (أقل من 50%)'],
                        datasets: [{
                            data: [successfulParticipants, failedParticipants],
                            backgroundColor: ['#4CAF50', '#FFEB3B'], // Green for success, yellow for failure
                            borderColor: ['#4CAF50', '#FFEB3B'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
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
                                            label += context.parsed + ' مشارك';
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
            } else {
                successPieChartCtx.clearRect(0, 0, successPieChartCtx.canvas.width, successPieChartCtx.canvas.height); // Clear if no data
                successPieChartCtx.font = "20px Cairo";
                successPieChartCtx.textAlign = "center";
                successPieChartCtx.fillText("لا توجد بيانات للرسم البياني", successPieChartCtx.canvas.width / 2, successPieChartCtx.canvas.height / 2);
            }

        } catch (error) {
            console.error("Error loading quiz results: ", error);
            resultsTableDiv.innerHTML = '<p>حدث خطأ أثناء تحميل البيانات.</p>';
        }
    }

    loadQuizResults();
});