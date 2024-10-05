// Fetch and display available food posts for NGOs
// Fetch and display available food posts for NGOs
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/food/available')
    .then(response => response.json())
    .then(posts => {
        const foodPostsOverview = document.getElementById('foodPostsOverview');
        
        // Clear previous content if any
        foodPostsOverview.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post-item'); // Add a class for styling if needed

            // Display food title, quantity, and restaurant contact details
            postElement.innerHTML = `
                <h3>${post.food_title}</h3>
                <p>Quantity: ${post.meal_quantity}</p>
                <p>Expiry: ${new Date(post.expiry).toLocaleString()}</p>
                <h4>Posted By:</h4>
                <p>Restaurant: ${post.restaurant_name}</p>
                <p>Mobile: ${post.restaurant_mobile}</p>
                <p>City: ${post.restaurant_city}</p>
                <p>Address: ${post.restaurant_address}</p>
            `;
            foodPostsOverview.appendChild(postElement);
        });
    })
    .catch(error => {
        console.error('Error fetching food posts:', error);
        foodPostsOverview.innerHTML = '<p>Error loading food posts.</p>';
    });
});

document.getElementById('logoutButton').addEventListener('click', () => {
    fetch('/api/logout')
        .then(() => {
            window.location.href = '/'; // Redirect to home page after logout
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
});

