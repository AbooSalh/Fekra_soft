#!/bin/bash

echo "🛑 Stopping KheirBox..."
echo ""

docker-compose down

echo ""
echo "✅ KheirBox has been stopped"
echo ""
echo "📝 To remove all data (including database), run:"
echo "   docker-compose down -v"
echo ""
