# Local MCP-Server-with-HTTPS-and-GitHub-OAuth
This project is a secure local MCP server built with Node.js and Express. It features HTTPS encryption using self-signed certificates, GitHub OAuth authentication, and additional security measures like rate limiting and HTTP header protection.
## Features
- **HTTPS Encryption**: Ensures secure communication between clients and the server.
- **GitHub OAuth Authentication**: Allows users to log in using their GitHub accounts.
- **Rate Limiting**: Protects against abuse and denial-of-service (DoS) attacks.
- **Secure Session Management**: Uses `express-session` with secure cookies.
- **HTTP Header Security**: Implements `helmet` to protect against common vulnerabilities.

## Prerequisites
Before you begin, ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [OpenSSL](https://slproweb.com/products/Win32OpenSSL.html) (for generating SSL certificates)

## Setup Instructions
### Step 1: Clone the Repository
Clone this repository to your local machine:

`` git clone https://github.com/omar-steam/MCP-Server-with-HTTPS-and-GitHub-OAuth.git
cd mcp-server ``


### Step 2: Install Dependencies
Install the required npm packages:

`` npm install ``

### Step 3: Generate SSL Certificates
Generate self-signed SSL certificates using OpenSSL:

``openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem``

This will create the following files in your project directory:
- `key.pem`: Private key
- `cert.pem`: Self-signed certificate

### Step 4: Configure Environment Variables
Create a `.env` file in the root of your project and add the following variables:

``CLIENT_ID=your-github-client-id
CLIENT_SECRET=your-github-client-secret
REDIRECT_URI=https://localhost:3000/auth/callback
SESSION_SECRET=your-session-secret`` 

Replace `your-github-client-id` and `your-github-client-secret` with the credentials from your [GitHub OAuth App](https://github.com/settings/developers).

### Step 5: Start the Server
Run the server:
``node server.js``

You should see:

``Secure server running on https://localhost:3000``

## Usage

### Accessing the Server
Open your browser and navigate to:

``https://localhost:3000``

### Authentication via GitHub
1. Visit `/auth` to start the GitHub authentication process:

``https://localhost:3000/auth``

2. After successful login, you’ll be redirected to `/success`.
3. If authentication fails, you’ll be redirected to `/failure`.

### Protected Routes
Access `/secure-data` to test a route that requires authentication:

``https://localhost:3000/secure-data``

If you’re not authenticated, you’ll see a `401 Unauthorized` error.

## Project Structure
``
mcp-server/
├── key.pem # Private key for HTTPS
├── cert.pem # Self-signed certificate for HTTPS
├── server.js # Main server file
├── package.json # Project metadata and dependencies
├── .env # Environment variables (not included in version control)
└── README.md # Project documentation (this file)
``

## Troubleshooting

### Port Already in Use (`EADDRINUSE`)
If port `3000` is already in use, stop any processes using it or change the port in `server.js`.

To find and kill processes using port `3000`:

``netstat -ano | findstr :3000
taskkill /PID <PID> /F``


### Certificate Warnings in Browser
Self-signed certificates are not trusted by browsers. For production, use a trusted Certificate Authority like [Let’s Encrypt](https://letsencrypt.org/).

## Contributing
Feel free to fork this repository, make improvements, and submit pull requests! Contributions are welcome.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
Special thanks to:
- [Express.js](https://expressjs.com/)
- [Passport.js](http://www.passportjs.org/)
- [Helmet](https://helmetjs.github.io/)
- [OpenSSL](https://www.openssl.org/)

---

### Enjoy building your secure MCP server guys! 🔥🔥🔥

---

### Notes for Customization:
1. Replace placeholders like `your-github-client-id` with your actual credentials.
2. Update the repository URL (`git clone`) with your GitHub repository link if you’re hosting this code.
