# Kiptaaz - Personal Finance Management App

A full-stack web application for personal finance management with user authentication, expense tracking, and multi-language support.

## 📁 Project Structure

```
kiptaaaz/
├── backend/                    # Backend API Server
│   ├── models/                 # Database Models
│   │   ├── User.js            # User authentication model
│   │   └── Task.js            # Task management model
│   ├── routes/                 # API Route Handlers
│   │   ├── auth.js            # Authentication routes
│   │   └── tasks.js           # Task management routes
│   ├── middleware/             # Custom Middleware
│   │   └── auth.js            # JWT authentication middleware
│   ├── Server.js              # Main server file
│   └── package.json           # Backend dependencies
├── frontend/                   # React Frontend Application
│   ├── public/                 # Static assets
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/                    # React source code
│   │   ├── components/         # React components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NavBar.jsx
│   │   │   └── ...
│   │   ├── contexts/           # React contexts
│   │   │   └── TranslationContext.js
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useTheme.js
│   │   │   └── useLanguage.js
│   │   ├── translations.js     # Translation data
│   │   ├── App.jsx             # Main React app
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json            # Frontend dependencies
├── README.md                   # Project documentation
└── .gitignore                  # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kiptaaaz
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with:
   # JWT_SECRET=your-secret-key
   # MONGODB_URI=mongodb://127.0.0.1:27017/kiptaaaz_db
   npm start
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **CSS** - Styling
- **Context API** - State management

## 📋 Features

### Authentication
- User registration with email/password
- Secure login with JWT tokens
- Password reset functionality
- Protected routes

### Finance Management
- Expense tracking
- Income management
- Budget setting
- Financial summaries
- Category-based organization

### User Experience
- Light/Dark theme toggle
- Multi-language support (English/Bangla)
- Responsive design
- Real-time updates

## 🔧 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- `GET /profile` - Get user profile (protected)

### Tasks
- `POST /add-task` - Create new task
- `GET /tasks` - Get all tasks

## 🗂️ File Organization Benefits

### Before (Monolithic)
- All files in root directory
- Frontend and backend code mixed
- Difficult to maintain and scale
- Confusing import paths

### After (Modular)
- **Clear separation** of frontend and backend
- **Logical grouping** of related files
- **Easy maintenance** and scalability
- **Clean import paths** within each module
- **Independent deployment** of frontend/backend

## 🚀 Development Workflow

1. **Backend Development**: Work in `backend/` directory
2. **Frontend Development**: Work in `frontend/` directory
3. **Database**: MongoDB collections are automatically created
4. **API Testing**: Use tools like Postman for backend testing
5. **Frontend Testing**: Use browser dev tools for frontend testing

## 📝 Scripts

### Backend
```bash
npm start      # Start production server
npm run dev    # Start development server (with nodemon)
```

### Frontend
```bash
npm start      # Start development server
npm run build  # Build for production
npm test       # Run tests
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- CORS enabled for cross-origin requests
- Input validation and sanitization
- Protected API routes

## 🌍 Internationalization

- English and Bangla language support
- Context-based translation system
- Easy to add more languages
- Real-time language switching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
