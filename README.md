# FixItNow Frontend

React frontend application for the FixItNow Smart Home Service Platform.

## 🚀 Quick Start

### Prerequisites
- Node.js v14 or higher
- Backend server running on http://localhost:5000

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs the app in development mode at `http://localhost:5173`

### Build

```bash
npm run build
```

Builds the app for production to the `dist` folder.

### Preview

```bash
npm run preview
```

Preview the production build locally.

## 📁 Project Structure

```
src/
├── api/
│   └── axios.jsx           # Axios configuration with interceptors
├── components/
│   ├── Header.jsx          # Navigation with notification badge
│   ├── RequestCard.jsx     # Service request card component
│   └── WorkerCard.jsx      # Worker profile card component
├── context/
│   └── AuthContext.jsx     # Authentication state management
├── pages/
│   ├── Home.jsx            # Landing page
│   ├── Login.jsx           # User login
│   ├── Register.jsx        # User registration
│   ├── Workers.jsx         # Browse workers with filters
│   ├── WorkerProfile.jsx   # Worker details and reviews
│   ├── WorkerDashboard.jsx # Worker statistics dashboard
│   ├── CreateRequest.jsx   # Create service request
│   ├── MyRequests.jsx      # View user's requests
│   ├── RequestDetails.jsx  # Detailed request view
│   └── Notifications.jsx   # Notification center
├── App.jsx                 # Main app with routing
├── main.jsx               # Entry point
└── styles.css             # Global styles
```

## 🎯 Features

### User Features
- ✅ Browse and filter workers by skills, location, rating
- ✅ View detailed worker profiles with reviews
- ✅ Create service requests with image uploads
- ✅ Track request status in real-time
- ✅ Receive notifications for updates
- ✅ Leave reviews for completed jobs

### Worker Features
- ✅ View and accept available requests
- ✅ Dashboard with earnings and statistics
- ✅ Update job status
- ✅ Track ratings and reviews
- ✅ Manage assigned jobs

### Common Features
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Real-time notification polling
- ✅ Responsive design
- ✅ Image preview and upload

## 🔗 API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`

Key endpoints used:
- `/auth/*` - Authentication
- `/workers/*` - Worker operations
- `/requests/*` - Service requests
- `/reviews/*` - Review system
- `/notifications/*` - Notifications

## 🎨 Styling

The app uses custom CSS with a modern, clean design:
- Responsive grid layouts
- Card-based UI
- Status badges with color coding
- Smooth transitions
- Empty states with helpful messages

## 🔐 Authentication Flow

1. User registers or logs in
2. JWT token stored in localStorage
3. Token automatically attached to API requests
4. Protected routes redirect to login if not authenticated
5. Token refreshed on page reload

## 📱 Pages

### Public Pages
- **Home** - Landing page with feature overview
- **Workers** - Browse workers with advanced filters
- **Login/Register** - Authentication pages

### Protected Pages
- **My Requests** - View and manage service requests
- **Request Details** - Detailed view with actions
- **Notifications** - Notification center
- **Create Request** - New service request form

### Worker-Only Pages
- **Worker Dashboard** - Statistics and recent jobs

## 🛠️ Tech Stack

- **React 19** - UI library
- **React Router DOM 7** - Routing
- **Axios** - HTTP client
- **Context API** - State management
- **Vite** - Build tool
- **CSS3** - Styling

## 🔧 Configuration

### Environment Variables

Create a `.env` file (optional, defaults to localhost:5000):

```env
VITE_API_URL=http://localhost:5000/api
```

### API Base URL

Configured in `src/api/axios.jsx`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## 📦 Dependencies

- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `axios` - HTTP client

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API_URL in axios config

### Authentication Issues
- Clear localStorage and re-login
- Check JWT token expiration
- Verify backend authentication endpoints

### Image Upload Issues
- Check file size limits (5MB max)
- Ensure proper MIME types
- Verify backend upload endpoint

## 📝 Development Notes

- Hot Module Replacement (HMR) enabled
- ESLint configured for code quality
- React strict mode enabled
- Automatic token attachment to requests

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify/Vercel

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL`

## 📄 License

MIT License

---

**Built with React + Vite** ⚡
