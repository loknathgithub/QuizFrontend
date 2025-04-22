document.getElementById('startButton').onclick = async function() {
    const quizName = document.getElementById('className').value;
    if (quizName) {
        try {
            alert(`Starting quiz for class: ${quizName}`);
            const response = await fetch(`http://localhost:8090/quiz/by-class/${quizName}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            // Store class name and quiz data in local storage
            localStorage.setItem('className', quizName);
            localStorage.setItem('quizData', JSON.stringify(data));
            window.location.href = 'quiz.html';
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            alert('Failed to fetch questions. Please try again.');
        }
    } else {
        alert('Please enter a class name.');
    }
};

// Edit Button
document.getElementById('editButton').onclick = async function() {
    const quizName = document.getElementById('className').value; // Get the value from the input box
    if (quizName) {
        try {
            // alert(`Editing quiz for class: ${quizName}`);
            // Store class name in local storage
            localStorage.setItem('className', quizName);
            // Redirect to validation.html
            window.location.href = 'validation.html';
        } catch (error) {
            console.error('Error occurred:', error);
        }
    } else {
        alert('Please enter a class name.');
    }
};

// Function to handle the Edit button click
// document.getElementById('editButton').onclick = function() {
//     const className = document.getElementById('className').value; // Get the value from the input box
//     if (className) {
//         // Redirect to edit page or call an API
//         alert(`Editing quiz for class: ${className}`);
//         // Example API call (you can replace this with your actual API)
//         fetch(`http://localhost:8080/question/edit?className=${encodeURIComponent(className)}`)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log(data); // Handle the data returned from the API
//                 // You can redirect to another page or update the UI based on the response
//             })
//             .catch(error => {
//                 console.error('There was a problem with the fetch operation:', error);
//             });
//     } else {
//         alert('Please enter a class name.');
//     }
// };
