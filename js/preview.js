document.addEventListener('DOMContentLoaded', async () => {
    // First load handler - unchanged
    const className = localStorage.getItem('className');
    if (!className) {
        window.location.href = 'edit.html?error=no_class_selected';
        return;
    }

    try {
        const baseurl = window.env.QUESTION_API_URL;
        const response = await fetch(`${baseurl}/question/by-class/${className}`);
        if (!response.ok) throw new Error('Failed to load questions');
        
        const questions = await response.json();
        renderQuestions(questions);
    } catch (error) {
        console.error(error);
        document.getElementById('previewContainer').innerHTML = `
            <p class="text-red-500">Error: ${error.message}</p>
        `;
    }
});

// Keep this for manual reloads (if needed elsewhere)
async function loadQuestions() {
    const quizName = localStorage.getItem('className');
    if (!quizName) {
        window.location.href = 'edit.html?error=no_class_selected';
        return;
    }

    try {
        const baseurl = window.env.QUESTION_API_URL;
        const response = await fetch(`${baseurl}/question/by-class/${quizName}`);
        if (!response.ok) throw new Error('Failed to load questions');

        const questions = await response.json();
        renderQuestions(questions);
    } catch (error) {
        console.error(error);
        document.getElementById('previewContainer').innerHTML = `
            <p class="text-red-500">Error: ${error.message}</p>
        `;
    }
}

// Critical Fix: Add null checks for DOM elements
function renderQuestions(questions) {
    // 1. Verify container exists
    const container = document.getElementById('previewContainer');
    if (!container) {
        console.error('previewContainer element not found!');
        return;
    }

    // 2. Verify title element exists
    const titleElement = document.getElementById('title');
    if (titleElement) {
        const className = localStorage.getItem('className');
        titleElement.textContent = `Ease Quiz Class: ${className}`;
    }

    // 3. Render only if questions exist
    if (!questions || !Array.isArray(questions)) {
        container.innerHTML = '<p class="text-red-500">No questions found</p>';
        return;
    }

    container.innerHTML = questions.map((q, index) => `
        <div class="mb-6 border-b pb-4">
            <div class="flex justify-between items-center mb-2">
                <div>
                    <div class="text-m text-gray-500">
                        <span><strong>ID:</strong> ${q.id}</span>
                    </div>    
                    <h3 class="text-lg font-semibold">
                        Question ${index + 1}: ${q.questionTitle}
                    </h3>
                </div>
                <div>
                    <button class="mx-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
                            onclick="goToEditPage(${q.id})">
                        Edit
                    </button>
                    <button class="mx-2 p-2 bg-red-500 text-white rounded hover:bg-red-600" 
                            onclick="deleteQuestion(${q.id})">
                        Delete
                    </button>
                </div>
            </div>
            <div class="space-y-2 ml-4">
                <p>${q.option1}</p>
                <p>${q.option2}</p>
                <p>${q.option3}</p>
                <p>${q.option4}</p>
            </div>
            <div class="mt-2 text-sm text-green-600">
                <strong>Answer:</strong> ${q.rightAnswer}
            </div>
            <div class="mt-1 text-xs text-gray-500">
                <span>Difficulty: ${q.difficulty}</span> | 
                <span>Category: ${q.category}</span>
            </div>
        </div>
    `).join('');
}

// Rest of your functions remain unchanged
function goToAddQuestion() {
    const className = localStorage.getItem('className');
    if (!className) {
        alert('No quiz/class selected!');
        return;
    }
    window.location.href = `question.html?class=${className}`;
}

function goToEditPage(id) {
    localStorage.setItem('editQuestionId', id);
    window.location.href = `question.html?id=${id}`;
}

async function deleteQuestion(id) {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
        const baseurl = window.env.QUESTION_API_URL;
        const response = await fetch(`${baseurl}/question/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Failed to delete question: ${errorData.message || response.statusText}`);
            return;
        }

        alert('Question deleted successfully!');
        location.reload();
    } catch (error) {
        console.error('Error deleting question:', error);
        alert('An error occurred while deleting the question.');
    }
}

async function deleteQuiz() {
    const quizName = localStorage.getItem('className');
    if (!quizName) {
        alert('Quiz name not found in local storage.');
        return;
    }

    if (!confirm(`Are you sure you want to delete the quiz "${quizName}"?`)) return;

    try {
        const baseurl = window.env.QUESTION_API_URL;
        const response = await fetch(`${baseurl}/question/delete/by-class/${quizName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (response.ok && result.status === 'success') {
            alert('Quiz deleted successfully!');
            window.location.href = '/html/index.html';
        } else {
            alert(`Failed to delete quiz: ${result.message || response.statusText}`);
        }
    } catch (error) {
        alert('An error occurred while deleting the quiz.');
        console.error(error);
    }
}

function redirectToScoreboard() {
    const className = localStorage.getItem('className');
    if (!className) {
        alert('No quiz/class selected!');
        return;
    }
    window.location.href = `scoreboard.html?class=${className}`;
}
