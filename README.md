# 📁 File Share App# Welcome to React Router!



A modern, secure file-sharing application built with React, Firebase, and Vite.A modern, production-ready template for building full-stack React applications using React Router.



## 🚀 Features[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)



- **User Authentication**: Secure sign-up and login with Firebase Authentication## Features

- **File Upload**: Upload files up to 50MB to Firebase Storage

- **File Management**: View, download, and delete your uploaded files- 🚀 Server-side rendering

- **Real-time Updates**: See your files update in real-time with Firestore- ⚡️ Hot Module Replacement (HMR)

- **Responsive Design**: Works seamlessly on desktop and mobile devices- 📦 Asset bundling and optimization

- **Secure**: Files are protected with Firebase Security Rules - users can only access their own files- 🔄 Data loading and mutations

- 🔒 TypeScript by default

## 📋 Prerequisites- 🎉 TailwindCSS for styling

- 📖 [React Router docs](https://reactrouter.com/)

Before you begin, ensure you have:

- Node.js (v14 or higher) installed## Getting Started

- A Firebase account (free tier works great!)

- npm or yarn package manager### Installation



## 🔧 Firebase SetupInstall the dependencies:



1. **Create a Firebase Project**```bash

   - Go to [Firebase Console](https://console.firebase.google.com/)npm install

   - Click "Add project" and follow the setup wizard```

   - Once created, click on the web icon (</>) to register your app

### Development

2. **Enable Authentication**

   - In Firebase Console, go to AuthenticationStart the development server with HMR:

   - Click "Get Started"

   - Enable "Email/Password" sign-in method```bash

npm run dev

3. **Create Firestore Database**```

   - Go to Firestore Database

   - Click "Create database"Your application will be available at `http://localhost:5173`.

   - Choose "Start in production mode" (we'll add security rules)

   - Select a location close to your users## Building for Production



4. **Set up Firebase Storage**Create a production build:

   - Go to Storage

   - Click "Get Started"```bash

   - Choose "Start in production mode"npm run build

```

5. **Get Firebase Config**

   - Go to Project Settings (gear icon)## Deployment

   - Scroll down to "Your apps" section

   - Copy the Firebase configuration object### Docker Deployment



6. **Update Firebase Config**To build and run using Docker:

   - Open `src/firebase.js`

   - Replace the placeholder config with your actual Firebase configuration:```bash

   ```javascriptdocker build -t my-app .

   const firebaseConfig = {

     apiKey: "your-api-key",# Run the container

     authDomain: "your-auth-domain",docker run -p 3000:3000 my-app

     projectId: "your-project-id",```

     storageBucket: "your-storage-bucket",

     messagingSenderId: "your-messaging-sender-id",The containerized application can be deployed to any platform that supports Docker, including:

     appId: "your-app-id"

   };- AWS ECS

   ```- Google Cloud Run

- Azure Container Apps

7. **Deploy Security Rules**- Digital Ocean App Platform

   - In Firebase Console, go to Firestore Database > Rules- Fly.io

   - Copy the Firestore rules from `firebase.rules` and paste them- Railway

   - Go to Storage > Rules

   - Copy the Storage rules from `firebase.rules` and paste them### DIY Deployment

   - Publish the rules

If you're familiar with deploying Node applications, the built-in app server is production-ready.

## 💻 Installation & Running

Make sure to deploy the output of `npm run build`

1. **Navigate to project directory**

   ```bash```

   cd file-share-app├── package.json

   ```├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)

├── build/

2. **Install dependencies** (if not already installed)│   ├── client/    # Static assets

   ```bash│   └── server/    # Server-side code

   npm install```

   ```

## Styling

3. **Start the development server**

   ```bashThis template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

   npm run dev

   ```---



4. **Open your browser**Built with ❤️ using React Router.

   - The app should automatically open at `http://localhost:3000`
   - If not, manually navigate to the URL shown in the terminal

## 🏗️ Project Structure

```
file-share-app/
├── package.json              # Project dependencies and scripts
├── vite.config.js           # Vite configuration
├── index.html               # HTML entry point
├── firebase.rules           # Firebase security rules
├── src/
│   ├── main.jsx            # Application entry point
│   ├── firebase.js         # Firebase configuration
│   ├── App.jsx             # Main app component with routing
│   ├── styles.css          # Global styles
│   └── components/
│       ├── Auth.jsx        # Sign-in/Sign-up component
│       ├── Upload.jsx      # File upload component
│       ├── FileList.jsx    # File listing component
│       └── ProtectedRoute.jsx  # Route protection wrapper
└── public/
    └── favicon.ico         # App icon
```

## 🎯 Usage

1. **Sign Up/Sign In**
   - Create a new account with email and password
   - Or sign in if you already have an account

2. **Upload Files**
   - Click "Choose a file" or drag and drop
   - Select a file (max 50MB)
   - Click "Upload File"
   - Watch the progress bar

3. **Manage Files**
   - View all your uploaded files in a grid
   - Click "Download" to save a file
   - Click "Delete" to remove a file

## 🛠️ Built With

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Firebase Authentication** - User authentication
- **Firebase Firestore** - NoSQL database for metadata
- **Firebase Storage** - File storage
- **React Router** - Client-side routing

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🔒 Security

- All files are private by default
- Users can only access their own files
- Firebase Security Rules enforce access control
- Files are stored with user ID in the path
- Authentication required for all operations

## 🚀 Deployment to Firebase Hosting

This project is fully configured for Firebase Hosting. Follow these steps:

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Update Firebase Project ID
Edit `.firebaserc` and replace `"your-project-id"` with your actual Firebase project ID:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### Step 4: Build Your Project
```bash
npm run build
```
This creates an optimized production build in the `dist` folder.

### Step 5: Deploy to Firebase
```bash
firebase deploy
```

This will deploy:
- ✅ **Hosting**: Your React app
- ✅ **Firestore Rules**: Database security rules
- ✅ **Storage Rules**: File storage security rules

### Optional: Deploy Only Specific Services
- Deploy only hosting: `firebase deploy --only hosting`
- Deploy only rules: `firebase deploy --only firestore:rules,storage:rules`

### Alternative Deployment Options
- **Vercel**: Connect your GitHub repo
- **Netlify**: Drag and drop the `dist` folder

## 🐛 Troubleshooting

**Authentication not working?**
- Ensure Email/Password is enabled in Firebase Console
- Check your Firebase configuration in `src/firebase.js`

**Files not uploading?**
- Verify Storage is set up in Firebase Console
- Check if file size is under 50MB
- Ensure security rules are properly deployed

**Files not showing?**
- Check Firestore security rules
- Verify you're signed in with the correct account
- Check browser console for errors

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📧 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ using React and Firebase
