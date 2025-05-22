const { exec } = require('child_process');

console.log('Testing Firebase Firestore configuration...');

exec('firebase --version', (error, stdout, stderr) => {
  if (error) {
    console.error('Firebase CLI not found. Please install it using:');
    console.error('npm install -g firebase-tools');
    process.exit(1);
  }

  console.log(`Firebase CLI version: ${stdout.trim()}`);
  
  exec('firebase projects:list', (error, stdout, stderr) => {
    if (error) {
      console.error('Error listing Firebase projects. Make sure you are logged in:');
      console.error('firebase login');
      process.exit(1);
    }

    console.log('Firebase projects:');
    console.log(stdout);
    
    console.log('Checking Firestore configuration...');
    
    exec('firebase firestore:indexes', (error, stdout, stderr) => {
      if (error) {
        console.error('Error checking Firestore indexes. Make sure Firestore is enabled for your project:');
        console.error('firebase firestore:indexes');
        process.exit(1);
      }
      
      console.log('Firestore is properly configured!');
      console.log('You can now run the application with:');
      console.log('npm run dev');
      console.log('');
      console.log('To initialize Firestore with sample data, run:');
      console.log('npm run test:firestore');
    });
  });
});
