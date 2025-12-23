#!/bin/bash

echo "📊 KheirBox Logs"
echo "================"
echo ""
echo "Press Ctrl+C to exit"
echo ""

# Check if a service name was provided
if [ -z "$1" ]; then
    # Show all logs
    docker-compose logs -f
else
    # Show logs for specific service
    docker-compose logs -f "$1"
fi
