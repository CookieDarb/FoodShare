// Fetch and display past food posts for the restaurant
document.addEventListener('DOMContentLoaded', () => {
    const restaurantName = 'Example Restaurant'; // Replace with dynamic user name
    document.getElementById('restaurantName').innerText = restaurantName;

    // Fetch past posts (mockup)
    const pastPosts = []; // Replace with actual data fetching from the server
    const pastPostsOverview = document.getElementById('pastPostsOverview');
    
    pastPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `<h3>${post.food_title}</h3><p>Quantity: ${post.meal_quantity}</p><p>Contact: ${post.contact_details}</p>`;
        pastPostsOverview.appendChild(postElement);
    });
});
