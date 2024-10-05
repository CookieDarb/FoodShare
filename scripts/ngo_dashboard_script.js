// Fetch and display available food posts for NGOs
document.addEventListener('DOMContentLoaded', () => {
    const ngoName = 'Example NGO'; // Replace with dynamic user name
    document.getElementById('ngoName').innerText = ngoName;

    // Fetch available food posts and display them
    fetch('/api/food/available')
        .then(response => response.json())
        .then(posts => {
            const foodPostsOverview = document.getElementById('foodPostsOverview');
            
            // Clear previous content if any
            foodPostsOverview.innerHTML = '';

            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post-item'); // Add a class for styling if needed
                
                // Display food title, quantity, restaurant name, and contact details
                postElement.innerHTML = `
                    <h3>${post.food_title}</h3>
                    <p>Quantity: ${post.meal_quantity}</p>
                    <p>Restaurant: ${post.restaurant_name}</p>
                    <p>Contact: ${post.contact_details}</p>
                `;
                foodPostsOverview.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error fetching food posts:', error);
            const foodPostsOverview = document.getElementById('foodPostsOverview');
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

