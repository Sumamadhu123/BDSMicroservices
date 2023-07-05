
const http = require('http');
const url = require('url');
//const querystring = require('querystring');
const crypto = require('crypto');

const users = {};

// Function to generate a random salt
function generateSalt() {
    return crypto.randomBytes(16).toString('hex');
}
  
// Function to hash the password using sha256 with salt
function hashPassword(password, salt) {
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
}

const server = http.createServer (
    (req, res) => {
        const { pathname, query } = url.parse(req.url);
    
        if (pathname === '/signup') {
        if (req.method === 'POST') {
            let body = '';
    
            req.on('data', (chunk) => {
            body += chunk;
            });
    
            req.on('end', () => {
            const formData = JSON.parse(body);//querystring.parse(body);
            const {username,password} = formData || {};

            // Check if user already exists
            if (users[username]) {
                res.statusCode = 409; // Conflict
                res.end('User already exists');
            } else {
                // Create new user
                const salt = generateSalt();
                const hashedPassword = hashPassword(password, salt); 
                users[username] = { username: username, hashedPassword: hashedPassword, salt: salt };
                console.log(users);
                res.statusCode = 201; // Created
                res.end('User created successfully');
            }
            });
        } else {
            res.statusCode = 405; // Method Not Allowed
            res.end('Method not allowed');
        }
        } else if (pathname === '/signin') {
        if (req.method === 'POST') {
            let body = '';
    
            req.on('data', (chunk) => {
            body += chunk;
            });
    
            req.on('end', () => {
                const formData = JSON.parse(body);  
                const {username,password} = formData || {};
            
                const { hashedPassword, salt } = users[username] || {};
                const hashedInputPassword = hashPassword(password, salt);

                if (users[username] && hashedPassword === hashedInputPassword) {
                    console.error(`${username} Sign-in successful`);
                    res.statusCode = 200; // OK
                    res.end('Sign-in successful');
                } else {
                    console.error(`Invalid username or password`);
                    res.statusCode = 401; // Unauthorized
                    res.end('Invalid username or password');
                }
            
            });
        } else {
            res.statusCode = 405; // Method Not Allowed
            res.end('Method not allowed\n');
        }
        } else {
        res.statusCode = 200; 
        res.end('Usage: http://localhost:3000/signin OR http://localhost:3000/signup\n'); // usage
        }
    }
);
  


const port = 3000;
server.listen(port, () => {
  console.log(`BDS Auth service running on port ${port}`);
});
