// document.getElementById('addFoodPostForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent form submission

//     const formData = new FormData(this); // Get form data

//     // Send a POST request to the server
//     fetch('http://127.0.0.1:3000/api/food/add', {
//         method: 'POST',
//         body: formData // Send form data as request body
//     })
//     .then(response => {
//         if (response.ok) {
//             alert('Food post added successfully!');
//             window.location.href = '../templates/restaurant_dashboard.html'; // Redirect to restaurant dashboard
//         } else {
//             alert('Error adding post: ' + response.statusText); // Show error message
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('There was a problem with the fetch operation: ' + error.message);
//     });
// });

// // Cancel button functionality
// document.getElementById('cancelBtn').addEventListener('click', () => {
//     window.location.href = '../templates/restaurant_dashboard.html'; // Redirect to restaurant dashboard
// });
