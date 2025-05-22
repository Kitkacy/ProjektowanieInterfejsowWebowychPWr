echo "Starting deployment process..."

echo "Building the application..."
npm run build

if [ $? -ne 0 ]; then
  echo "Build failed. Aborting deployment."
  exit 1
fi

echo "Build successful!"

echo "Do you want to import sample books to Firestore? (y/n)"
read IMPORT_BOOKS

if [ "$IMPORT_BOOKS" == "y" ]; then
  echo "Importing books to Firestore..."
  npm run import:books
  
  if [ $? -ne 0 ]; then
    echo "Books import failed, but continuing with deployment."
  else
    echo "Books import successful!"
  fi
fi

echo "Deploying to Firebase Hosting..."
firebase deploy --only hosting

if [ $? -ne 0 ]; then
  echo "Hosting deployment failed."
  exit 1
fi

echo "Deploying Firestore security rules..."
firebase deploy --only firestore:rules

if [ $? -ne 0 ]; then
  echo "Firestore rules deployment failed."
  exit 1
fi

echo "Deployment completed successfully!"
echo "Your application is now live with the latest Firestore security rules."
