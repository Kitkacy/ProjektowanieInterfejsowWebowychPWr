#!/bin/bash

echo "Starting Books4Cash application..."

npm run dev &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 5

echo "Opening the main application..."
xdg-open http://localhost:5173

echo "Opening the Firestore test page..."
xdg-open http://localhost:5173/firestore-test.html

echo ""
echo "Books4Cash is now running!"
echo ""
echo "Main application: http://localhost:5173"
echo "Firestore test page: http://localhost:5173/firestore-test.html"
echo ""
echo "Press Ctrl+C to stop the server when you're done."

wait $SERVER_PID
