// Render questions dynamically into the HTML
function renderQuestions(questions) {
    const quizContainer = document.getElementById('quizContainer');

    // Helper function to get color class based on difficulty
    function getDifficultyColor(difficulty) {
        switch ((difficulty || '').toLowerCase()) {
            case 'easy':
                return 'text-green-600';
            case 'medium':
                return 'text-yellow-600';
            case 'hard':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    }

    quizContainer.innerHTML = questions.map((q, index) => `
        <div class="mb-6 border-b pb-4">
            <h3 class="text-lg font-semibold mb-1">Question ${index + 1}: ${q.question_title}</h3>
         
            <div class="space-y-2">
                ${['option1', 'option2', 'option3', 'option4'].map(opt => `
                    <label class="block">
                        <input type="radio" 
                               name="question${q.id}" 
                               value="${q[opt]}" 
                               data-questionid="${q.id}" 
                               class="mr-2">
                        ${q[opt]}
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Collect responses and submit them to the backend
async function submitQuiz() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    const className = localStorage.getItem('className');

    // Validate inputs
    if (!username) {
        alert('Please enter your username');
        return;
    }
    if (!className) {
        alert('Class name is missing');
        return;
    }

    // Collect selected answers
    const responses = [];
    document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        responses.push({
            id: parseInt(input.dataset.questionid),
            response: input.value
        });
    });

    if (responses.length === 0) {
        alert('Please answer at least one question.');
        return;
    }

    // Only send responses in the body; username/className as query params
    const payload = responses;
    const baseurl = window.env.QUIZ_API_URL;
    // Build the URL with query parameters
    const url = new URL(`${baseurl}/quiz/submit`);
    url.searchParams.append('username', username);
    url.searchParams.append('classname', className);

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Submission failed');
        }
        
        const result = await response.json();
        
        // Store quiz details, responses, and full result in localStorage
        localStorage.setItem('quizDetails', JSON.stringify({
            username,
            className
        }));
        localStorage.setItem('quizResponses', JSON.stringify(responses));
        localStorage.setItem('quizResult', JSON.stringify(result));  // Store full result including score
        
        // Redirect to score.html
        window.location.href = 'score.html';
        
    } catch (error) {
        console.error('Error submitting quiz:', error);
        alert(`Error submitting quiz: ${error.message}`);
    }
}

async function fetchQuestions(){
    console.log("fetching")
    const className=localStorage.getItem('className')
    
    const baseurl = window.env.QUIZ_API_URL;
    const res=await fetch(`${baseurl}/quiz/by-class/${className}`) 
    if(res.ok){
        const data=await res.json();
        console.log(data)
        return data;
    }
    else{
        console.log("failed to fetch")
        return []
    }
}
// Fetch questions when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const data=await fetchQuestions();
    renderQuestions(data)
    // if (localStorage.getItem('quizData')) {
    //     questions = JSON.parse(localStorage.getItem('quizData'));
    //     renderQuestions(questions);  // Pass questions explicitly
    // } else {
    // }
});
