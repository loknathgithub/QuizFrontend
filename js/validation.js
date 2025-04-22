document.getElementById("editButton").onclick = async function() {
    const password = document.getElementById('passwordInput').value;
    let quizName = localStorage.getItem('className');
    const errorMessageDiv = document.getElementById('errorMessage');
    errorMessageDiv.textContent = '';

    console.log(quizName);
    
    // If no class exists, prompt for name
    if (!quizName) {
        quizName = prompt('Enter class name:');
        if (!quizName) {
            errorMessageDiv.textContent = 'Class name required';
            return;
        }
    }

    try {
        const response = await fetch(`http://localhost:8080/class/verify?quizName=${quizName}&password=${password}`, {
            method: 'POST'
        });

        if (response.ok) {
            localStorage.setItem('className', quizName);
            window.location.href = 'preview.html';
        } else if (response.status === 404) {
            // If 404, backend will create the class (if modified as per previous recommendation)
            // For current backend, handle client-side creation separately:
            const createResponse = await fetch('http://localhost:8080/class/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quizsName: quizName, password })
            });

            if (createResponse.ok) {
                localStorage.setItem('className', quizName);
                window.location.href = 'preview.html';
            } else {
                const error = await createResponse.text();
                throw new Error(error);
            }
        } else {
            const error = await response.text();
            throw new Error(error);
        }
    } catch (error) {
        errorMessageDiv.textContent = error.message.includes('Incorrect password') 
            ? 'Invalid password' 
            : error.message;
    }
};