// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const formData = {
//         email: document.getElementById('email').value,
//         password: document.getElementById('password').value
//     };

//     fetch('/api/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json' // Set the content type to JSON
//         },
//         body: JSON.stringify(formData)
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.message) {
//             // Redirect based on user role
//             if (data.user.role === 'restaurant') {
//                 window.location.href = 'restaurant_dashboard.html';
//             } else {
//                 window.location.href = 'ngo_dashboard.html';
//             }
//         } else {
//             alert('Login failed: ' + data);
//         }
//     });
// });
