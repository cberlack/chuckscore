// Rating categories for different experience types
const categoryRatings = {
    'Hotel': ['Cleanliness', 'Service', 'Location', 'Value', 'Amenities'],
    'Sporting Event': ['Atmosphere', 'Seats', 'Food/Drinks', 'Value', 'Overall Experience'],
    'Airport': ['Cleanliness', 'Food Options', 'Amenities', 'Layout/Navigation', 'Efficiency'],
    'Restaurant': ['Food Quality', 'Service', 'Ambiance', 'Value', 'Presentation'],
    'College': ['Academics', 'Campus', 'Dorms', 'Food', 'Social Life'],
    'Other': ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadScores();
    setDefaultDateTime();
    
    document.getElementById('experienceType').addEventListener('change', updateRatingCategories);
    document.getElementById('scoreForm').addEventListener('submit', handleSubmit);
    document.getElementById('filterCategory').addEventListener('change', filterAndSort);
    document.getElementById('sortBy').addEventListener('change', filterAndSort);
});

function setDefaultDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('customDate').value = now.toISOString().slice(0, 16);
}

function updateRatingCategories() {
    const type = document.getElementById('experienceType').value;
    const container = document.getElementById('ratingCategories');
    
    if (!type) {
        container.innerHTML = '<h3>Select a category to see rating options</h3>';
        return;
    }
    
    const categories = categoryRatings[type];
    let html = '<h3>Rate the Following (1-5 ⭐)</h3>';
    
    categories.forEach((category, index) => {
        html += `
            <div class="rating-item">
                <label>${category}:</label>
                <div class="stars" data-category="${index}">
                    ${[5, 4, 3, 2, 1].map(star => `
                        <input type="radio" name="rating-${index}" value="${star}" class="star-option" id="star-${index}-${star}" required>
                        <label for="star-${index}-${star}" class="star-label">⭐</label>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function handleSubmit(e) {
    e.preventDefault();
    
    const type = document.getElementById('experienceType').value;
    const categories = categoryRatings[type];
    
    const ratings = {};
    categories.forEach((category, index) => {
        const rating = document.querySelector(`input[name="rating-${index}"]:checked`);
        ratings[category] = parseInt(rating.value);
    });
    
    const score = {
        id: Date.now(),
        name: document.getElementById('experienceName').value,
        type: type,
        location: document.getElementById('location').value,
        date: document.getElementById('customDate').value,
        ratings: ratings,
        notes: document.getElementById('notes').value,
        overallScore: Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length
    };
    
    saveScore(score);
    document.getElementById('scoreForm').reset();
    setDefaultDateTime();
    document.getElementById('ratingCategories').innerHTML = '<h3>Select a category to see rating options</h3>';
    loadScores();
}

function saveScore(score) {
    const scores = getScores();
    scores.push(score);
    localStorage.setItem('chuckScores', JSON.stringify(scores));
}

function getScores() {
    const scores = localStorage.getItem('chuckScores');
    return scores ? JSON.parse(scores) : [];
}

function deleteScore(id) {
    if (confirm('Are you sure you want to delete this ChuckScore?')) {
        let scores = getScores();
        scores = scores.filter(score => score.id !== id);
        localStorage.setItem('chuckScores', JSON.stringify(scores));
        loadScores();
    }
}

function filterAndSort() {
    loadScores();
}

function loadScores() {
    let scores = getScores();
    const filterCategory = document.getElementById('filterCategory').value;
    const sortBy = document.getElementById('sortBy').value;
    
    // Filter
    if (filterCategory !== 'all') {
        scores = scores.filter(score => score.type === filterCategory);
    }
    
    // Sort
    scores.sort((a, b) => {
        switch(sortBy) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'score-desc':
                return b.overallScore - a.overallScore;
            case 'score-asc':
                return a.overallScore - b.overallScore;
            default:
                return 0;
        }
    });
    
    displayScores(scores);
}

function displayScores(scores) {
    const container = document.getElementById('scoresList');
    
    if (scores.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏔️</div>
                <h3>No ChuckScores Yet!</h3>
                <p>Start logging your experiences above.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = scores.map(score => {
        const date = new Date(score.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const ratingsHtml = Object.entries(score.ratings).map(([category, rating]) => `
            <div class="rating-breakdown-item">
                <span class="rating-breakdown-label">${category}</span>
                <span class="rating-breakdown-stars">${'⭐'.repeat(rating)}</span>
            </div>
        `).join('');
        
        return `
            <div class="score-card">
                <div class="score-card-header">
                    <div>
                        <div class="score-card-title">${score.name}</div>
                        <span class="category-badge">${score.type}</span>
                        ${score.location ? `<div style="color: #52b788; margin-top: 5px;">📍 ${score.location}</div>` : ''}
                    </div>
                    <div class="score-card-meta">
                        <div class="overall-score">${score.overallScore.toFixed(1)} ⭐</div>
                        <div>${formattedDate}</div>
                    </div>
                </div>
                <div class="ratings-breakdown">
                    ${ratingsHtml}
                </div>
                ${score.notes ? `<div class="notes-section">💭 ${score.notes}</div>` : ''}
                <button class="delete-btn" onclick="deleteScore(${score.id})">🗑️ Delete</button>
            </div>
        `;
    }).join('');
}