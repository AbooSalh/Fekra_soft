#!/bin/bash

echo "🍱 KheirBox - Food Donation Platform"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

echo ""
echo "🏗️  Building and starting services..."
echo ""

# Build and start all services
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker ps | grep -q kheirbox-backend; then
    echo "✅ Backend is running"
else
    echo "❌ Backend failed to start"
    docker-compose logs backend
    exit 1
fi

if docker ps | grep -q kheirbox-frontend; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend failed to start"
    docker-compose logs frontend
    exit 1
fi

if docker ps | grep -q kheirbox-db; then
    echo "✅ Database is running"
else
    echo "❌ Database failed to start"
    docker-compose logs db
    exit 1
fi

echo ""
echo "🎉 KheirBox is now running!"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080/api"
echo "   Database: localhost:5432"
echo ""
echo "📝 To stop the application, run:"
echo "   docker-compose down"
echo ""
echo "📊 To view logs, run:"
echo "   docker-compose logs -f"
echo ""
