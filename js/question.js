document.addEventListener('DOMContentLoaded', async () => {
    const className = localStorage.getItem('className');
    const changeToQuizName = document.getElementById('title');
    changeToQuizName.textContent = `Ease Quiz Class: ${className}`;

    // Function to extract question ID from URL
    function getQuestionIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Get question ID from URL
    const questionId = getQuestionIdFromUrl();

    // Updated: Fetch question using /getquestions API if editing
    if (questionId) {
        try {
            const baseurl = window.env.QUESTION_API_URL;
            const response = await fetch(`${baseurl}/question/getquestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([parseInt(questionId)])
            });
            if (response.ok) {
                const questions = await response.json();
                const question = questions[0]; // Since we sent one ID
                if (question) {
                    document.getElementById('titleInput').value = question.questionTitle;
                    document.getElementById('option1Input').value = question.option1;
                    document.getElementById('option2Input').value = question.option2;
                    document.getElementById('option3Input').value = question.option3;
                    document.getElementById('option4Input').value = question.option4;
                    document.getElementById('rightAnswerInput').value = question.rightAnswer;
                    document.getElementById('difficultySelect').value = question.difficulty;
                    document.getElementById('categoryInput').value = question.category;
                } else {
                    alert('Question not found.');
                }
            } else {
                alert('Failed to load question data.');
            }
        } catch (error) {
            console.error('Error loading question:', error);
            alert('Error loading question data.');
        }
    } else {
        document.getElementById('editQ').disabled = true;
        // or document.getElementById('editQ').style.display = 'none';
    }

    // Function to handle form submission (add or update)
    async function handleFormSubmit(action) {
        const title = document.getElementById('titleInput').value.trim();
        const option1 = document.getElementById('option1Input').value.trim();
        const option2 = document.getElementById('option2Input').value.trim();
        const option3 = document.getElementById('option3Input').value.trim();
        const option4 = document.getElementById('option4Input').value.trim();
        const rightAnswer = document.getElementById('rightAnswerInput').value.trim();
        const difficulty = document.getElementById('difficultySelect').value;
        const category = document.getElementById('categoryInput').value.trim();

        if (!title || !option1 || !option2 || !option3 || !option4 || !rightAnswer || !difficulty || !category) {
            alert('Please fill in all fields.');
            return;
        }

        const questionData = {
            questionTitle: title,
            option1: option1,
            option2: option2,
            option3: option3,
            option4: option4,
            rightAnswer: rightAnswer,
            difficulty: difficulty,
            category: category
        };

        // let url = 'http://localhost:8080/question/add';  // Default URL for adding
        // let method = 'POST';

        // if (action === 'update' && questionId) {
        //     url = `http://localhost:8080/question/update/${questionId}`;
        //     method = 'PATCH';
        // }

        // try {
        //     const response = await fetch(url, {
        //         method: method,
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(questionData)
        //     });

        // Get quiz name from localStorage
        try{
            const quizName = localStorage.getItem('className');
            if (!quizName) {
                alert('No quiz selected!');
                return;
            }

            // Configure request based on action
            let url, method;
            if (action === 'update' && questionId) {
                // For updates - quiz association remains unchanged
                url = `http://localhost:8080/question/update/${questionId}`;
                method = 'PATCH';
            } else {
                // For new questions - include quiz name in URL
                url = `http://localhost:8080/question/add?quizsName=${quizName}`;
                method = 'POST';
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(questionData)
                });

                // Handle response
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Request failed');
                }
                if (response.ok) {
                    alert(`Question ${action === 'update' ? 'updated' : 'added'} successfully!`);
                    // Reset form fields
                    document.getElementById('titleInput').value = '';
                    document.getElementById('option1Input').value = '';
                    document.getElementById('option2Input').value = '';
                    document.getElementById('option3Input').value = '';
                    document.getElementById('option4Input').value = '';
                    document.getElementById('rightAnswerInput').value = '';
                    document.getElementById('difficultySelect').value = '';
                    document.getElementById('categoryInput').value = '';
                } else {
                    alert('Failed to process question. Please check the input values.');
                }
                // Success handling
                const result = await response.json();
                console.log('Success:', result);
                // Redirect or update UI as needed
                
            } catch (error) {
                console.error('Error:', error);
                alert(`Operation failed: ${error.message}`);
            }

        
        } catch (error) {
            console.error('There was an error:', error);
            alert('There was an error processing the question.');
        }
    }

    // Add event listeners to buttons
    document.getElementById('submitQ').addEventListener('click', function() {
        handleFormSubmit('add');
    });

    document.getElementById('editQ').addEventListener('click', function() {
        handleFormSubmit('update');
    });
});