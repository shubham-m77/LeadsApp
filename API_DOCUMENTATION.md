# API Documentation - Smart Leads Dashboard

This document describes all backend APIs used in the Smart Leads Dashboard project.

## Base URL

```txt
http://localhost:5000/api
```

For deployed backend, replace the base URL with your live backend URL.

---

## Authentication

Authentication is handled using JWT tokens.

For protected routes, pass token in headers:

```txt
Authorization: Bearer <jwt_token>
```

---

# 1. Health Check API

## Check API Health

```http
GET /health
```

### Success Response

```json
{
  "success": true,
  "message": "Smart Leads API is running",
  "environment": "development"
}
```

---

# 2. Auth APIs

## Register User

```http
POST /auth/register
```

### Description

Creates a new user account.

### Request Body

```json
{
  "name": "Shubham Mandal",
  "email": "shubham@example.com",
  "password": "123456",
  "role": "admin"
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| name | string | Yes | User full name |
| email | string | Yes | User email address |
| password | string | Yes | Minimum 6 characters |
| role | string | No | `admin` or `sales`. Default is `sales` |

### Success Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Shubham Mandal",
      "email": "shubham@example.com",
      "role": "admin"
    },
    "token": "jwt_token"
  }
}
```

### Error Responses

#### Email already exists

```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

#### Validation error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

---

## Login User

```http
POST /auth/login
```

### Description

Logs in an existing user and returns a JWT token.

### Request Body

```json
{
  "email": "shubham@example.com",
  "password": "123456"
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| email | string | Yes | Registered email address |
| password | string | Yes | User password |

### Success Response

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Shubham Mandal",
      "email": "shubham@example.com",
      "role": "admin"
    },
    "token": "jwt_token"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Get Authenticated User

```http
GET /auth/me
```

### Description

Returns authenticated user information from the JWT token.

### Headers

```txt
Authorization: Bearer <jwt_token>
```

### Success Response

```json
{
  "success": true,
  "message": "Authenticated user fetched successfully",
  "data": {
    "user": {
      "userId": "user_id",
      "role": "admin"
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Access denied. No token provided"
}
```

---

# 3. Lead APIs

All lead APIs require authentication.

### Required Header

```txt
Authorization: Bearer <jwt_token>
```

---

## Create Lead

```http
POST /leads
```

### Description

Creates a new lead.

### Access

```txt
Admin
Sales User
```

### Request Body

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "Qualified",
  "source": "Instagram"
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| name | string | Yes | Lead name |
| email | string | Yes | Lead email |
| status | string | No | `New`, `Contacted`, `Qualified`, `Lost` |
| source | string | Yes | `Website`, `Instagram`, `Referral` |

### Success Response

```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "lead": {
      "_id": "lead_id",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "createdBy": "user_id",
      "createdAt": "2026-05-18T00:00:00.000Z",
      "updatedAt": "2026-05-18T00:00:00.000Z"
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

---

## Get All Leads

```http
GET /leads
```

### Description

Returns a paginated list of leads with optional search, filters, and sorting.

### Access

```txt
Admin
Sales User
```

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| page | number | No | Page number |
| status | string | No | Filter by `New`, `Contacted`, `Qualified`, `Lost` |
| source | string | No | Filter by `Website`, `Instagram`, `Referral` |
| search | string | No | Search by lead name or email |
| sort | string | No | `latest` or `oldest` |

### Example Requests

#### Get all leads

```http
GET /leads
```

#### Pagination

```http
GET /leads?page=1
```

#### Filter by status

```http
GET /leads?status=Qualified
```

#### Filter by source

```http
GET /leads?source=Instagram
```

#### Search by name or email

```http
GET /leads?search=rahul
```

#### Sort by oldest

```http
GET /leads?sort=oldest
```

#### Multiple filters together

```http
GET /leads?status=Qualified&source=Instagram&search=rahul&sort=latest&page=1
```

### Success Response

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": {
    "leads": [
      {
        "_id": "lead_id",
        "name": "Rahul Sharma",
        "email": "rahul@example.com",
        "status": "Qualified",
        "source": "Instagram",
        "createdBy": {
          "_id": "user_id",
          "name": "Shubham Mandal",
          "email": "shubham@example.com",
          "role": "admin"
        },
        "createdAt": "2026-05-18T00:00:00.000Z",
        "updatedAt": "2026-05-18T00:00:00.000Z"
      }
    ],
    "pagination": {
      "totalRecords": 25,
      "currentPage": 1,
      "totalPages": 3,
      "limit": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "appliedFilters": {
      "status": "Qualified",
      "source": "Instagram",
      "search": "rahul",
      "sort": "latest"
    }
  }
}
```

### Empty Response Example

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": {
    "leads": [],
    "pagination": {
      "totalRecords": 0,
      "currentPage": 1,
      "totalPages": 1,
      "limit": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "appliedFilters": {
      "status": null,
      "source": null,
      "search": null,
      "sort": "latest"
    }
  }
}
```

---

## Get Single Lead

```http
GET /leads/:id
```

### Description

Returns details of a single lead by ID.

### Access

```txt
Admin
Sales User
```

### Path Parameter

| Parameter | Type | Required | Description |
|---|---|---|---|
| id | string | Yes | MongoDB lead ID |

### Success Response

```json
{
  "success": true,
  "message": "Lead fetched successfully",
  "data": {
    "lead": {
      "_id": "lead_id",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "Qualified",
      "source": "Instagram",
      "createdBy": {
        "_id": "user_id",
        "name": "Shubham Mandal",
        "email": "shubham@example.com",
        "role": "admin"
      },
      "createdAt": "2026-05-18T00:00:00.000Z",
      "updatedAt": "2026-05-18T00:00:00.000Z"
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Lead not found"
}
```

---

## Update Lead

```http
PATCH /leads/:id
```

### Description

Updates an existing lead.

### Access

```txt
Admin
Sales User
```

### Path Parameter

| Parameter | Type | Required | Description |
|---|---|---|---|
| id | string | Yes | MongoDB lead ID |

### Request Body

All fields are optional.

```json
{
  "name": "Rahul Sharma",
  "email": "rahul.updated@example.com",
  "status": "Contacted",
  "source": "Referral"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": {
    "lead": {
      "_id": "lead_id",
      "name": "Rahul Sharma",
      "email": "rahul.updated@example.com",
      "status": "Contacted",
      "source": "Referral",
      "createdBy": "user_id",
      "createdAt": "2026-05-18T00:00:00.000Z",
      "updatedAt": "2026-05-18T00:00:00.000Z"
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Lead not found"
}
```

---

## Delete Lead

```http
DELETE /leads/:id
```

### Description

Deletes a lead by ID.

### Access

```txt
Admin only
```

### Path Parameter

| Parameter | Type | Required | Description |
|---|---|---|---|
| id | string | Yes | MongoDB lead ID |

### Success Response

```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

### Error Responses

#### Lead not found

```json
{
  "success": false,
  "message": "Lead not found"
}
```

#### Unauthorized role

```json
{
  "success": false,
  "message": "You are not allowed to perform this action"
}
```

---

# 4. CSV Export API

## Export Leads as CSV

```http
GET /leads/export/csv
```

### Description

Exports leads as a CSV file. It supports the same filters as the leads list API.

### Access

```txt
Admin
Sales User
```

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| status | string | No | Filter by `New`, `Contacted`, `Qualified`, `Lost` |
| source | string | No | Filter by `Website`, `Instagram`, `Referral` |
| search | string | No | Search by lead name or email |
| sort | string | No | `latest` or `oldest` |

### Example Requests

#### Export all leads

```http
GET /leads/export/csv
```

#### Export filtered leads

```http
GET /leads/export/csv?status=Qualified
```

```http
GET /leads/export/csv?source=Instagram
```

```http
GET /leads/export/csv?search=rahul
```

```http
GET /leads/export/csv?status=Qualified&source=Instagram&search=rahul&sort=latest
```

### Success Response

Response will be a downloadable CSV file.

### CSV Columns

```txt
Name
Email
Status
Source
Created By
Created By Email
Created By Role
Created At
```

### Error Response

If no leads are available for export:

```json
{
  "success": false,
  "message": "No leads found to export"
}
```

---

# 5. Role-Based Access Control

## Roles

```txt
admin
sales
```

## Permissions

| Feature | Admin | Sales User |
|---|---|---|
| Register | Yes | Yes |
| Login | Yes | Yes |
| View Leads | Yes | Yes |
| View Single Lead | Yes | Yes |
| Create Lead | Yes | Yes |
| Update Lead | Yes | Yes |
| Delete Lead | Yes | No |
| Export CSV | Yes | Yes |

---

# 6. Standard Response Format

## Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

## Validation Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

---

# 7. Common Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Validation error or bad request |
| 401 | Unauthorized or invalid token |
| 403 | Forbidden role access |
| 404 | Resource not found |
| 409 | Duplicate resource |
| 500 | Internal server error |

---

# 8. Postman Testing Flow

Use this order while testing APIs:

```txt
1. POST /auth/register
2. Copy JWT token from response
3. Add Authorization header: Bearer <token>
4. POST /leads
5. GET /leads
6. GET /leads/:id
7. PATCH /leads/:id
8. GET /leads?status=Qualified&source=Instagram&search=rahul&page=1
9. GET /leads/export/csv
10. DELETE /leads/:id as admin
```

---

# 9. Environment Variables Required

## Backend

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

## Frontend

```env
VITE_API_BASE_URL=http://localhost:5000/api
```
