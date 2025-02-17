# DocCdev - Discord Bot Management Platform

DocCdev is a comprehensive web-based Discord bot management platform that combines AI-powered development tools with advanced multi-bot management capabilities.

## Features

- 🤖 Multi-bot Token Management
- 🧠 AI-powered Bot Development
- 📊 Analytics Dashboard
- ⚡ Real-time Command Editor
- 🔐 Secure Authentication System
- 📱 Responsive Design

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js/Express
- **Database**: PostgreSQL
- **Authentication**: Passport.js
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: wouter

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v20.x or later)
- npm (v9.x or later)
- PostgreSQL (v14.x or later)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Session
SESSION_SECRET=your_session_secret

# Discord
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_api_key
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/doccdev.git
cd doccdev
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:push
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── pages/      # Application pages
├── server/              # Backend Express server
│   ├── auth.ts         # Authentication logic
│   ├── routes.ts       # API routes
│   └── storage.ts      # Database interactions
└── shared/             # Shared types and schemas
    └── schema.ts       # Database schema definitions
```

## Development Guidelines

1. Follow the established project structure
2. Use TypeScript for type safety
3. Implement proper error handling
4. Write clean, documented code
5. Follow the existing styling patterns
6. Test thoroughly before submitting PRs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
