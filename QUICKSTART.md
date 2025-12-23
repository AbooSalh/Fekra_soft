# 🚀 KheirBox Quick Start Guide

This guide will help you get KheirBox up and running in 5 minutes!

## Prerequisites

Make sure you have these installed:
- Docker (v20.10+)
- Docker Compose (v2.0+)

To verify, run:
```bash
docker --version
docker-compose --version
```

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Fekra_soft
```

## Step 2: Start the Application

Simply run the start script:

```bash
./start.sh
```

Or manually with Docker Compose:

```bash
docker-compose up -d
```

## Step 3: Wait for Services to Start

The services will take about 1-2 minutes to fully start. You can monitor progress:

```bash
docker-compose logs -f
```

Press `Ctrl+C` to exit the logs.

## Step 4: Access the Application

Open your browser and go to:

**Frontend**: http://localhost:3000

## Step 5: Create Your First Account

1. Click "Register" on the login page
2. Fill in your details
3. Select your role:
   - **Donor**: To donate food
   - **Receiver**: To receive donations
   - **Volunteer**: To deliver donations
   - **NGO**: Organization account
   - **Admin**: For platform administration

### Note on Account Approval

- **Donors** (individuals) and **Receivers** are auto-approved
- **Volunteers**, **NGOs**, and organization donors need admin approval
- To approve accounts, you'll need an admin user (see below)

## Creating the First Admin User

### Option 1: Register as Admin (Recommended for Testing)

1. Register with role "DONOR" first
2. Access the database:
   ```bash
   docker exec -it kheirbox-db psql -U kheirbox -d kheirbox
   ```
3. Update your user to admin:
   ```sql
   UPDATE users SET role = 'ADMIN', status = 'ACTIVE' WHERE email = 'your-email@example.com';
   \q
   ```

### Option 2: Create Admin Directly in Database

```bash
docker exec -it kheirbox-db psql -U kheirbox -d kheirbox
```

Then run:
```sql
INSERT INTO users (email, password, full_name, role, status, points, preferred_language, created_at, updated_at)
VALUES (
  'admin@kheirbox.com',
  '$2a$10$xK4yq3Z6F9LGZfFGKxJRnOKYYfh3aK.YYqHfMQ0QH0oH9nHZ8Fz3m',
  'Admin User',
  'ADMIN',
  'ACTIVE',
  0,
  'en',
  NOW(),
  NOW()
);
\q
```

**Default admin credentials:**
- Email: admin@kheirbox.com
- Password: admin123

⚠️ **Important**: Change this password after first login!

## Step 6: Start Using KheirBox

### As a Donor:
1. Go to "Create Donation"
2. Fill in food details
3. Submit and wait for volunteers

### As a Volunteer:
1. Go to "Browse Available"
2. Accept a delivery
3. Update status as you progress

### As an Admin:
1. Go to "Admin Panel"
2. Approve pending users
3. Monitor platform activity

## Stopping the Application

```bash
docker-compose down
```

To stop and remove all data:
```bash
docker-compose down -v
```

## Troubleshooting

### Backend won't start
```bash
docker-compose logs backend
```
Check if database is ready. Sometimes the backend starts before the database is fully initialized.

### Frontend won't start
```bash
docker-compose logs frontend
```
Check if Node modules are properly installed.

### Can't connect to database
Make sure port 5432 isn't already in use:
```bash
lsof -i :5432
```

### Reset Everything
```bash
docker-compose down -v
docker-compose up -d --build
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check the [KheirBox .md](KheirBox%20.md) file for use cases
- Review the architecture diagrams

## API Testing

You can test the API directly:

### Health Check
```bash
curl http://localhost:8080/api/donations/available
```

### Register a User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "role": "DONOR"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Support

If you encounter any issues, please:
1. Check the logs: `docker-compose logs`
2. Verify all containers are running: `docker-compose ps`
3. Check the GitHub issues
4. Contact the development team

---

**Happy food sharing! 🍱**
