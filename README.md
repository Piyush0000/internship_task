# TodoFlow - Full Stack Todo Application

A modern, full-stack todo application with a beautiful React Native mobile frontend and Express TypeScript backend.

## 🚀 Features

### Mobile App (Expo/React Native)
- **User Authentication**: Secure login and registration with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Priority Levels**: Color-coded priority badges (High/Medium/Low)
- **Task Filtering**: Filter tasks by status (All/Pending/Completed)
- **Due Dates**: Set and track task deadlines
- **Modern UI**: Beautiful, card-based interface with smooth animations
- **Offline Support**: Token-based authentication with secure storage
- **State Management**: Efficient state management with Zustand

### Backend API (Express/TypeScript)
- **RESTful API**: Clean and well-structured API endpoints
- **JWT Authentication**: Secure access and refresh token system
- **MongoDB Database**: Scalable NoSQL database with Mongoose
- **Type Safety**: Full TypeScript implementation
- **Security**: Helmet, CORS, bcrypt password hashing
- **File Upload**: Multer support for file uploads

## 📱 Screenshots

### Mobile App
- Login screen with modern design
- Task list with priority badges and filters
- Add/edit task modal with priority selection
- User profile with avatar display

## 🛠 Tech Stack

### Mobile App
- **Framework**: Expo SDK 50
- **Language**: TypeScript
- **UI**: React Native
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Storage**: Expo SecureStore
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: MongoDB
- **ORM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, bcryptjs

## 📦 Project Structure

```
todo/
├── mobile/                 # React Native mobile app
│   ├── app/               # Expo Router screens
│   │   ├── (auth)/       # Authentication screens
│   │   ├── (tabs)/       # Main app screens
│   │   └── _layout.tsx   # Root layout
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── constants/    # Theme and constants
│   │   ├── stores/      # Zustand stores
│   │   └── types/       # TypeScript definitions
│   ├── android/         # Android native code
│   └── package.json
├── backend/              # Express TypeScript API
│   ├── src/
│   │   ├── config/      # Database and environment config
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Auth and error handling
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API routes
│   │   ├── utils/       # Helper functions
│   │   └── server.ts    # App entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Android Studio (for local Android builds)
- Expo CLI

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
PORT=5000
```

4. **Start the development server**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Mobile App Setup

1. **Navigate to mobile directory**
```bash
cd mobile
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Configure API endpoint**
Update the API base URL in your store files to point to your backend:
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

4. **Start the development server**
```bash
npx expo start
```

5. **Run on device/emulator**
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app for physical device

## 🏗 Building the APK

### Method 1: Local Gradle Build (Recommended)

1. **Install Android SDK**
   - Install Android Studio
   - Install Android SDK Build-Tools and Platform-Tools
   - Set ANDROID_HOME environment variable

2. **Configure local.properties**
```bash
cd android
echo "sdk.dir=C\:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk" > local.properties
```

3. **Accept licenses**
```bash
mkdir -p $ANDROID_HOME/licenses
echo "24333f8a63b6825ea9c5514f83c2829b004d1fee" > $ANDROID_HOME/licenses/android-sdk-license
```

4. **Build release APK**
```bash
cd android
./gradlew.bat assembleRelease
```

The APK will be generated at: `android/app/build/outputs/apk/release/app-release.apk`

### Method 2: EAS Build (Cloud Build)

1. **Install EAS CLI**
```bash
npm install -g eas-cli
```

2. **Configure EAS**
```bash
eas build:configure
```

3. **Build APK**
```bash
eas build --platform android --profile preview
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🎨 Features in Detail

### Task Properties
- **Title**: Task name (required)
- **Description**: Detailed task information
- **Priority**: High, Medium, or Low
- **Status**: Pending or Completed
- **Due Date**: Task deadline
- **Tags**: Custom task labels

### User Interface
- **Color-coded Priorities**: 
  - High: Red/Coral
  - Medium: Amber/Yellow
  - Low: Green/Teal
- **Filter Chips**: Quick task filtering
- **Pull-to-refresh**: Update task list
- **Empty States**: Helpful messages when no tasks exist
- **Floating Action Button**: Quick task creation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **Secure Storage**: Expo SecureStore for token storage
- **CORS Protection**: Configured CORS policy
- **Helmet**: Security headers for Express
- **Input Validation**: Request validation on all endpoints

## 📱 Download APK

The latest release APK can be downloaded from the [Releases section](../../releases).

### Current Version
- **v1.0.0** - TodoFlow-v1.0.0.apk
- **Backend**: https://internship-task-7bqo.onrender.com
- **Status**: ✅ Live and operational

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- Material Design guidelines

---

**Note**: This project was built as an internship assignment demonstrating full-stack development skills with React Native and Node.js/Express.
