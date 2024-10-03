// Fetch and display available food posts for NGOs
document.addEventListener('DOMContentLoaded', () => {
    const ngoName = 'Example NGO'; // Replace with dynamic user name
    document.getElementById('ngoName').innerText = ngoName;

    // Fetch available food posts (mockup)
    fetch('/api/food/available')
        .then(response => response.json())
        .then(posts => {
            const foodPostsOverview = document.getElementById('foodPostsOverview');
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `<h3>${post.food_title}</h3><p>Quantity: ${post.meal_quantity}</p><button onclick="acceptFoodPost(${post.id})">Accept</button>`;
                foodPostsOverview.appendChild(postElement);
            });
        });
});

// Function to accept food post
function acceptFoodPost(postId) {
    fetch(`/api/food/accept/${postId}`, {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) {
            alert('Food post accepted');
            location.reload(); // Refresh the page to update posts
        } else {
            alert('Error accepting post');
        }
    });
}
