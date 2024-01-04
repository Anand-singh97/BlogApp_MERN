# BlogApp_MERN

## MERN Stack Blog Application

This project is a full-stack Blog Application developed using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It includes user authentication functionalities with Passport.js for Google sign-in and secure JWT token storage in cookies. Middleware has been implemented for user verification, checking token expiry, and encryption.

### Features

- User authentication with Google sign-in
- Secure storage of JWT tokens in cookies
- Middleware for token verification
- User registration and login
- Blog creation with image upload, title, summary, and content
- Edit blog functionality limited to user's own blogs

### Security Measures

Self-signed HTTPS certificate implemented for secure communication between client and server.

### Database

This application uses MongoDB Atlas, a cloud-based MongoDB service, as its database solution.

### Login Credentials

Use the following credentials for logging into the application:
- Username: test, Password: test
- Username: test1, Password: test1

### Validation

Validation is applied for login credentials:
- Both username and password are required fields.
- Username and password must be a minimum of 4 characters long.

### Prerequisites

Node.js installed

### Installation

1. Clone the repository. - (git clone https://github.com/yourusername/BlogApp_MERN.git)
2. Install npm modules by navigating to the project directory. - (cd BlogApp_MERN npm install)
3. Start the backend server with HTTPS by navigating to the API folder. - (nodemon server.js)
4. Start the React app by navigating back to the main directory. - (npm start)
5. Access the application securely in your browser at `https://localhost:3000`.

### Usage

- Login/Register to access the blog functionalities.
- Use Google sign-in for authentication.
- Create a blog by uploading images, providing a title, summary, and content.
- Editing a blog is only accessible for your own blogs.

### Important

The `.env` file is included in this repository and stores API keys and secrets.
