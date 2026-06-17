# MamaCare API Tests

Use Postman, Thunder Client, or REST Client in VS Code.

## Health check

GET http://localhost:5000/api/health

## Register

POST http://localhost:5000/api/auth/register

```json
{
  "name": "Amina",
  "phone": "+256700000000",
  "password": "secret123"
}
```

## Login

POST http://localhost:5000/api/auth/login

```json
{
  "phone": "+256700000000",
  "password": "secret123"
}
```

Use returned token as:

Authorization: Bearer YOUR_TOKEN
