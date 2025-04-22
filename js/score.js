document.addEventListener('DOMContentLoaded', () => {
    const resultData = localStorage.getItem('quizResult');
    const quizDetailsData = localStorage.getItem('quizDetails');

    if (!resultData || !quizDetailsData) {
        document.getElementById('scoreDisplay').textContent = 'No score data found.';
        document.getElementById('usernameDisplay').textContent = '';
        document.getElementById('classNameDisplay').textContent = '';
        return;
    }

    const result = JSON.parse(resultData);
    const quizDetails = JSON.parse(quizDetailsData);

    const username = quizDetails.username;
    const className = quizDetails.className;

    // Adjust this if your backend nests the score differently
    const score = result.score ?? (result.data && result.data.score) ?? 'N/A';

    renderScore(username, className, score);
});

function renderScore(username, className, score) {
    document.getElementById('usernameDisplay').textContent = `Username: ${username}`;
    document.getElementById('classNameDisplay').textContent = `Class Name: ${className}`;
    document.getElementById('scoreDisplay').textContent = score;
}