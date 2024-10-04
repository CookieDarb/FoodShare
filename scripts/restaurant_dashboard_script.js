// Fetch and display past food posts for the restaurant
document.addEventListener('DOMContentLoaded', () => {
    // Fetch the restaurant's past food posts from the server
    fetch('/api/restaurant/posts')  // Adjust this endpoint based on your backend logic
        .then(response => response.json())
        .then(pastPosts => {
            const pastPostsOverview = document.getElementById('pastPostsOverview');

            if (pastPosts.length === 0) {
                pastPostsOverview.innerHTML = '<p>No past posts available.</p>';
                return;
            }

            // Loop through the past posts and display them
            pastPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post-item'); // Add a class for styling if needed
                postElement.innerHTML = `
                    <h3>${post.food_title}</h3>
                    <p>Quantity: ${post.meal_quantity}</p>
                    <p>Expiry: ${new Date(post.expiry).toLocaleString()}</p>
                    <p>Contact: ${post.contact_details}</p>
                    <p>Status: ${post.status}</p>
                `;
                pastPostsOverview.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error fetching past posts:', error);
            pastPostsOverview.innerHTML = '<p>Error loading past posts.</p>';
        });
});

