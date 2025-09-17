# RAG Chatbot Frontend

A modern React-based frontend for the RAG-powered news chatbot with an intuitive chat interface and real-time article browsing.

## 🚀 Features

- **Interactive Chat Interface**: Modern messaging UI with typing indicators
- **Real-time Communication**: Live chat with AI-powered responses
- **Article Grid**: Browse and explore news articles with filtering
- **Responsive Design**: Mobile-first SCSS styling with modern aesthetics
- **Session Management**: Persistent chat sessions with history
- **Markdown Support**: Rich text rendering for AI responses
- **Code Highlighting**: Syntax highlighting for code snippets
- **Article Selection**: Click-to-chat functionality from article grid

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 with functional components
- **Styling**: SCSS for modern, responsive design
- **HTTP Client**: Axios for API communication
- **Markdown**: React-markdown with syntax highlighting
- **Build Tool**: Create React App with ES modules
- **State Management**: React hooks (useState, useEffect)
- **Testing**: React Testing Library and Jest

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager
- Running backend service (port 3001)

## 🔧 Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Open browser**:
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Chat Interface
1. Type your question in the message input
2. Press Enter or click Send button
3. View AI responses with contextual news information
4. Access previous conversations through session history

### Article Browsing
1. Browse articles in the grid layout
2. Click on any article to start a conversation about it
3. Filter articles by date, source, or category
4. View article metadata and snippets

### Features Overview
- **Welcome Message**: Guided onboarding for new users
- **Typing Indicators**: Visual feedback during AI processing
- **Message Bubbles**: Distinct styling for user and AI messages
- **Article Grid**: Interactive news article browsing
- **Responsive Header**: Navigation and branding

## 🏗️ Project Structure

```
frontend/
├── public/
│   ├── index.html           # HTML template
│   └── favicon.ico          # App icon
├── src/
│   ├── components/          # React components
│   │   ├── ChatInterface.js     # Main chat container
│   │   ├── MessageList.js       # Message history
│   │   ├── MessageBubble.js     # Individual messages
│   │   ├── MessageInput.js      # Input form
│   │   ├── TypingIndicator.js   # Loading animation
│   │   ├── WelcomeMessage.js    # Onboarding
│   │   ├── ArticleGrid.js       # News article display
│   │   └── Header.js            # Navigation header
│   ├── styles/             # SCSS stylesheets
│   │   ├── main.scss           # Main styles
│   │   ├── components/         # Component-specific styles
│   │   └── variables.scss      # SCSS variables
│   ├── services/           # API services
│   │   └── api.js             # Backend communication
│   ├── utils/              # Utility functions
│   ├── App.js              # Root component
│   └── index.js            # Entry point
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🎨 Styling

### SCSS Architecture
- **Variables**: Colors, fonts, breakpoints in `variables.scss`
- **Components**: Modular component styles
- **Responsive**: Mobile-first design with breakpoints
- **Modern UI**: Clean, minimalist design with smooth animations

### Key Design Elements
- **Color Scheme**: Professional blue and gray palette
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent padding and margins using CSS Grid/Flexbox
- **Animations**: Subtle hover effects and transitions
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 📡 API Integration

### Backend Communication
```javascript
// Chat API
POST /api/chat
{
  "message": "Your question here",
  "sessionId": "unique-session-id"
}

// Search API
POST /api/search
{
  "query": "search terms",
  "topK": 5
}
```

### Proxy Configuration
Development proxy configured in `package.json`:
```json
"proxy": "http://localhost:3001"
```

## 🔧 Development

### Available Scripts

- `npm start` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run lint` - ESLint code checking

### Development Flow
1. Start backend service on port 3001
2. Start frontend development server
3. Make changes and see live updates
4. Write tests for new components
5. Build for production deployment

### Component Development
```javascript
// Example component structure
import React, { useState, useEffect } from 'react';
import './ComponentName.scss';

const ComponentName = ({ props }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return (
    <div className="component-name">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

## 🧪 Testing

### Test Structure
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  test('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('handles user interaction', () => {
    render(<ComponentName />);
    fireEvent.click(screen.getByRole('button'));
    expect(/* assertion */).toBeTruthy();
  });
});
```

### Testing Best Practices
- Test user interactions, not implementation details
- Use semantic queries (getByRole, getByLabelText)
- Mock external dependencies and API calls
- Test accessibility features

## 📱 Responsive Design

### Breakpoints
```scss
$mobile: 768px;
$tablet: 1024px;
$desktop: 1200px;

@media (max-width: $mobile) {
  // Mobile styles
}

@media (min-width: $tablet) {
  // Tablet and desktop styles
}
```

### Mobile Features
- Touch-friendly button sizes
- Optimized chat interface for small screens
- Responsive article grid layout
- Swipe gestures for navigation

## 🚀 Production Build

### Build Process
```bash
npm run build
```

Generates optimized production build in `build/` directory:
- Minified and bundled JavaScript
- Optimized CSS
- Compressed assets
- Service worker for caching

### Deployment Options

1. **Static Hosting** (Netlify, Vercel):
   ```bash
   npm run build
   # Upload build/ directory
   ```

2. **Docker Deployment**:
   ```dockerfile
   FROM nginx:alpine
   COPY build/ /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Node.js Server**:
   ```bash
   npm install -g serve
   serve -s build -l 3000
   ```

## 🔧 Configuration

### Environment Variables
Create `.env` file for environment-specific settings:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
```

### Backend Integration
Ensure backend is running on port 3001 or update proxy configuration in `package.json`.

## 🚨 Troubleshooting

### Common Issues

1. **Backend Connection Error**:
   ```
   Error: Network Error - Backend not reachable
   ```
   **Solution**: Ensure backend is running on port 3001

2. **Build Failures**:
   ```
   npm run build fails with memory error
   ```
   **Solution**: Increase Node.js memory limit:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

3. **SCSS Compilation Error**:
   ```
   Error: Sass compilation failed
   ```
   **Solution**: Check SCSS syntax and import paths

4. **Proxy Issues**:
   ```
   404 errors for API calls
   ```
   **Solution**: Verify proxy configuration in package.json

### Debug Mode
```bash
REACT_APP_DEBUG=true npm start
```

## 📊 Performance

### Optimization Techniques
- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Bundle Analysis**: webpack-bundle-analyzer
- **Image Optimization**: WebP format with fallbacks
- **CSS Optimization**: Purged unused styles

### Performance Metrics
- **First Contentful Paint**: < 2s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB gzipped
- **Lighthouse Score**: 90+ across all categories

## 🔒 Security

### Best Practices
- Input sanitization for user messages
- XSS protection through React's built-in escaping
- Secure API communication over HTTPS
- Content Security Policy headers
- No sensitive data in client-side code

## 📈 Analytics

### Tracking Events
```javascript
// Example analytics integration
const trackEvent = (eventName, properties) => {
  // Analytics service integration
  analytics.track(eventName, properties);
};

// Usage
trackEvent('message_sent', {
  messageLength: message.length,
  sessionId: sessionId
});
```

## 🔄 Updates & Maintenance

### Regular Tasks
- Weekly dependency updates: `npm audit fix`
- Monthly bundle size analysis
- Quarterly accessibility audits
- Performance monitoring and optimization

### Version Management
- Semantic versioning (semver)
- Changelog maintenance
- Feature flag management for gradual rollouts

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For frontend-specific issues:
1. Check browser developer tools for errors
2. Verify backend connectivity
3. Review component props and state
4. Test with different browsers and devices

## 🤝 Contributing

1. Follow React best practices
2. Write tests for new components
3. Use proper SCSS organization
4. Ensure mobile responsiveness
5. Test accessibility features