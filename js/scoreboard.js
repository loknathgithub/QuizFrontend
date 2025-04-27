document.addEventListener('DOMContentLoaded', async () => {
    // Get classname from URL parameters (match the parameter name from your button)
    const urlParams = new URLSearchParams(window.location.search);
    const className = urlParams.get('class');  // Changed from 'classname' to 'class'
    
    if (!className) {
        window.location.href = 'edit.html?error=no_class_selected';
        return;
    }

    // Update page title with decoded class name
    document.getElementById('scoreboard-title').textContent = 
        `Scoreboard for ${className}`;

    try {
        const baseurl = window.env.QUIZ_API_URL;
        // Fetch scores from your API with URL encoding
        const response = await fetch(
            `${baseurl}/quiz/getScores/${className}`
        );
        
        if (!response.ok) throw new Error('Failed to load scores');
        
        const scores = await response.json();
        renderScores(scores);
    } catch (error) {
        console.error(error);
        document.getElementById('scoreboard-body').innerHTML = `
            <tr><td colspan="3" class="px-6 py-4 text-center text-red-500">Error: ${error.message}</td></tr>
        `;
    }
});

function renderScores(scores) {
    const tbody = document.getElementById('scoreboard-body');
    
    if (!Array.isArray(scores) || scores.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No scores found for this class.</td></tr>
        `;
        return;
    }

    tbody.innerHTML = scores.map(score => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">${score.id}</td>
            <td class="px-6 py-4 whitespace-nowrap">${score.username}</td>
            <td class="px-6 py-4 whitespace-nowrap">${score.score}</td>
        </tr>
    `).join('');
}
