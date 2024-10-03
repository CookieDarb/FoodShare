// document.getElementById('registerForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const formData = {
//         name: document.getElementById('name').value,
//         email: document.getElementById('email').value,
//         password: document.getElementById('password').value,
//         role: document.getElementById('role').value
//     };

//     fetch('/api/register', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json', // Inform the server that you're sending JSON
//         },
//         body: JSON.stringify(formData)
//     })
//     .then(response => response.json())  // Expecting a JSON response from the server
//     .then(data => {
//         if (data.message === 'Registration successful') {
//             // Redirect based on the user's role
//             if (data.role === 'restaurant') {
//                 window.location.href = '/templates/restaurant_dashboard.html';
//             } else if (data.role === 'ngo') {
//                 window.location.href = '/templates/ngo_dashboard.html';
//             }
//         } else {
//             alert('Registration failed: ' + data.message);
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('An error occurred during registration. Please try again.');
//     });
// });
