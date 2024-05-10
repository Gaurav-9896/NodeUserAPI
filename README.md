# Node User API Readme 

This repository contains a Node.js API for user management, including registration, login, and user details retrieval. Below are the API endpoints and corresponding documentation based on the provided Swagger JSON (`swagger.json`).

## API Endpoints

### Register a New User

- **POST /api/register**

  - **Summary**: Register a new user
  - **Description**: Creates a new user account
  - **Request Body**:
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "password": "string",
      "dob": "string (date)"
    }
    ```
  - **Responses**:
    - **200**: User created successfully
    - **400**: Bad request - Invalid input
    - **401**: Email already exists

### User Login

- **POST /api/login**

  - **Summary**: User login
  - **Description**: Authenticate and login user
  - **Request Body**:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - **Responses**:
    - **200**: Login successful
    - **401**: Unauthorized - Invalid credentials

### Get User Details

- **GET /api/login/userdetails**

  - **Summary**: Get user details
  - **Description**: Retrieve details of the logged-in user
  - **Responses**:
    - **200**: OK
    - **401**: Unauthorized

## Components

### Schemas

#### UserRegistration

```json
{
  "type": "object",
  "properties": {
    "firstName": { "type": "string" },
    "lastName": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "password": { "type": "string" },
    "dob": { "type": "string", "format": "date" }
  },
  "required": ["firstName", "lastName", "email", "password", "dob"]
}
```

#### UserLogin

```json
{
  "type": "object",
  "properties": {
    "email": { "type": "string", "format": "email" },
    "password": { "type": "string" }
  },
  "required": ["email", "password"]
}
```

### Security

- **BearerAuth**: JWT token-based authentication

## Usage

1. Clone the repository:

   ```bash
   git clone https://github.com/Gaurav-9896/NodeUserApi.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (e.g., MongoDB URI, JWT secret) in a `.env` file.
 ```bash
  PORT = 3000
  MONGO_CONNECTION_STRING = "Your mongodb connection string"
  JWT_TOKEN = "JWTTOKEN"
  user= "email"
  pass ="password for nodemailer"

   ```
 
4. Start the server:

   ```bash
   npm eun start
   ```

## Testing

Use tools like Postman or cURL to test the API endpoints based on the provided documentation. Ensure to include valid request bodies and handle responses accordingly.

## Contributing

Feel free to contribute to this project by opening issues or pull requests. Contributions are welcome!

## License

This project is licensed under the [MIT License](LICENSE).
