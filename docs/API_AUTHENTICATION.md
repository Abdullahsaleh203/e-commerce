# API Documentation

## Authentication Controller

The authentication system provides secure user registration, login, logout, and session management using JWT tokens with refresh token mechanism.

### Base URL
```
http://localhost:8000/api/v1/auth
```

## Endpoints

### 1. User Registration

**Endpoint:** `POST /signup`

**Description:** Register a new user account

**Request Body:**
```json
{
  "username": "string (required, min 3 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars, must contain uppercase, lowercase, number)"
}
```

**Example Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "648a5c7d1234567890abcdef",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "cartItems": [],
    "createdAt": "2025-06-19T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400`: User already exists
- `400`: Validation errors (invalid email, weak password, etc.)

---

### 2. User Login

**Endpoint:** `POST /login`

**Description:** Authenticate user and return JWT tokens

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Example Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "648a5c7d1234567890abcdef",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "cartItems": []
    }
  }
}
```

**Cookies Set:**
- `accessToken`: JWT token (expires in 15 minutes)
- `refreshToken`: Refresh token (expires in 7 days)

**Error Responses:**
- `400`: Please provide email and password
- `401`: Incorrect email or password

---

### 3. Logout

**Endpoint:** `POST /logout`

**Description:** Logout user and invalidate tokens

**Authentication:** Optional (if logged in)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

**Side Effects:**
- Clears access and refresh token cookies
- Removes refresh token from Redis cache
- Invalidates current session

---

### 4. Refresh Token

**Endpoint:** `POST /refresh-token`

**Description:** Generate new access token using refresh token

**Authentication:** Requires valid refresh token in cookies

**Success Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookies Updated:**
- `accessToken`: New JWT token (expires in 15 minutes)

**Error Responses:**
- `401`: No refresh token found. Please log in again
- `401`: Invalid refresh token. Please log in again
- `401`: The user belonging to this token no longer exists

---

### 5. Get User Profile

**Endpoint:** `GET /profile`

**Description:** Get current user's profile information

**Authentication:** Required (Bearer token or cookie)

**Success Response (200):**
```json
{
  "_id": "648a5c7d1234567890abcdef",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "user",
  "cartItems": [
    {
      "product": "648a5c7d1234567890abcdef",
      "quantity": 2
    }
  ],
  "createdAt": "2025-06-19T10:30:00.000Z"
}
```

**Error Responses:**
- `401`: Not authenticated
- `404`: User not found

---

## Authentication Flow

### 1. Token Generation
```javascript
const generateTokens = (userId) => {   
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15m'
    });
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d'
    });
    return { accessToken, refreshToken };
};
```

### 2. Token Storage
- **Access Token**: HTTP-only cookie, 15 minutes expiry
- **Refresh Token**: HTTP-only cookie, 7 days expiry
- **Refresh Token**: Also stored in Redis with user ID as key

### 3. Security Features

#### Cookie Configuration
```javascript
const cookieOptions = {
    httpOnly: true,                    // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',               // CSRF protection
    maxAge: 15 * 60 * 1000           // 15 minutes for access token
};
```

#### Redis Storage
```javascript
const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refreshToken:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
}
```

## Usage Examples

### Frontend Implementation (JavaScript)

#### Register User
```javascript
const register = async (userData) => {
    try {
        const response = await fetch('/api/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important for cookies
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        if (response.ok) {
            console.log('User registered:', data.user);
            // Redirect to dashboard or home page
        } else {
            console.error('Registration failed:', data.message);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
};
```

#### Login User
```javascript
const login = async (email, password) => {
    try {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (response.ok) {
            console.log('Login successful:', data.data.user);
            // Redirect or update UI
        } else {
            console.error('Login failed:', data.message);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
};
```

#### Auto-refresh Token
```javascript
const refreshAuthToken = async () => {
    try {
        const response = await fetch('/api/v1/auth/refresh-token', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Token refreshed successfully');
            return true;
        } else {
            // Redirect to login page
            window.location.href = '/login';
            return false;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
    }
};

// Auto-refresh before token expires
setInterval(refreshAuthToken, 14 * 60 * 1000); // Refresh every 14 minutes
```

#### Protected API Calls
```javascript
const makeAuthenticatedRequest = async (url, options = {}) => {
    try {
        let response = await fetch(url, {
            ...options,
            credentials: 'include'
        });
        
        // If token expired, try to refresh
        if (response.status === 401) {
            const refreshed = await refreshAuthToken();
            if (refreshed) {
                // Retry the original request
                response = await fetch(url, {
                    ...options,
                    credentials: 'include'
                });
            }
        }
        
        return response;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};
```

### cURL Examples

#### Register
```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!"
  }' \
  -c cookies.txt
```

#### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }' \
  -c cookies.txt
```

#### Get Profile
```bash
curl -X GET http://localhost:8000/api/v1/auth/profile \
  -b cookies.txt
```

#### Logout
```bash
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

## Error Handling

All authentication endpoints use the centralized error handling middleware. Errors are returned in this format:

```json
{
  "status": "error",
  "message": "Error description",
  "statusCode": 400
}
```

### Common Error Scenarios

1. **Validation Errors**: Missing required fields, invalid email format, weak password
2. **Authentication Errors**: Invalid credentials, expired tokens, missing tokens
3. **Authorization Errors**: Insufficient permissions, invalid user role
4. **Server Errors**: Database connection issues, Redis connection problems

## Security Considerations

### Password Security
- Passwords are hashed using bcrypt with salt rounds
- Minimum 8 characters with complexity requirements
- No password exposed in API responses

### Token Security
- JWT tokens are signed with secret keys
- Refresh tokens are stored securely in Redis
- HTTP-only cookies prevent XSS attacks
- Secure flag ensures HTTPS-only transmission in production

### Rate Limiting
- Implement rate limiting on authentication endpoints
- Prevent brute force attacks on login endpoint
- Monitor failed login attempts

### Best Practices
1. Always use HTTPS in production
2. Implement proper session management
3. Log authentication events for monitoring
4. Use strong, unique secret keys
5. Regularly rotate JWT secrets
6. Implement account lockout after failed attempts
7. Use multi-factor authentication for admin accounts
