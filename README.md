# Epistula

An AI-powered cover letter and email generator that helps job seekers create compelling, personalized application materials in seconds.

## Overview

Epistula leverages advanced language models through LangChain to analyze your resume against job descriptions and generate tailored cover letters and emails. Simply upload your resume, paste a job description, and let AI handle the rest.

## Features

- **Resume Analysis** - Get detailed insights into your resume's strengths and areas for improvement
- **ATS Compatibility Check** - Ensure your resume passes Applicant Tracking Systems
- **Job Match Scoring** - See how well your resume matches the job requirements
- **AI-Generated Cover Letters** - Create professional, customized cover letters instantly
- **Email Generation** - Generate compelling cover emails for job applications
- **User Profiles** - Save and manage your resume information
- **Application History** - Track all your generated cover letters and emails
- **Search Similar Jobs** _(Coming Soon)_ - Find related job opportunities across the web

## Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **LangChain** - AI/LLM orchestration and prompt management
- **Python 3.11+** - Core backend language

### Frontend
- **Next.js** - React framework with server-side rendering
- **React Query** - Powerful data synchronization and caching
- **Firebase** - Authentication and user management
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components

### Database
- **Supabase** - PostgreSQL database with real-time capabilities

## Getting Started

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp example.env .env
# Edit .env with your API keys and configuration
```

5. Start the development server:
```bash
cd app
uvicorn server:app --reload
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env.local file with your configuration
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Project Structure

```
epistula/
├── backend/
│   ├── app/
│   │   ├── pipelines/        # AI processing pipelines
│   │   ├── routes/            # API endpoints
│   │   ├── config.py          # Configuration management
│   │   ├── schemas.py         # Pydantic models
│   │   └── server.py          # FastAPI application
│   └── example.env            # Environment template
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js pages and layouts
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API and external services
│   │   └── lib/               # Utility functions
│   └── package.json
└── README.md
```

## Usage

1. **Sign Up/Login** - Create an account or sign in to access the dashboard
2. **Upload Resume** - Upload your resume in PDF or DOCX format
3. **Paste Job Description** - Copy and paste the job description you're applying for
4. **Analyze** - Get instant feedback on ATS compatibility and job match percentage
5. **Generate** - Create a professional cover letter or email with one click
6. **Download** - Save your generated content and track it in your history

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with LangChain for powerful AI capabilities
- UI components from shadcn/ui
- Icons and design inspiration from modern web applications

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ for job seekers everywhere
