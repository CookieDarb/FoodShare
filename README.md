# FoodShare

FoodShare is a platform that connects **NGOs** with **restaurants** to share surplus food. It enables restaurants to post leftover food, which can be claimed by nearby NGOs for distribution to people in need.

## Features

- **User Registration and Login:**
  - Both **NGOs** and **restaurants** can register and log in to the platform.
  - Restaurants can post surplus food details, including quantity, expiry, and contact information.
  - NGOs can view available food posts from restaurants in their city.
  
- **Food Post Management:**
  - Restaurants can add, update, and delete food posts.
  - NGOs can accept food posts, marking them as accepted on the platform.

- **Dashboard for Restaurants and NGOs:**
  - **Restaurant Dashboard:** View past posts, add new posts, and manage food details.
  - **NGO Dashboard:** View available food posts, claim food items, and manage accepted posts.

- **Automatic Post Expiration:**
  - Food posts are automatically marked as expired after the expiry time.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Security:** bcrypt (for password hashing), express-session (for session management)
- **APIs:** RESTful API for handling food posts, user registration, login, and CRUD operations.

