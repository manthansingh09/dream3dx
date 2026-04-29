# Dream3DX

Dream3DX is a web application for viewing, quoting, and ordering 3D printing models. Built with Next.js, React Three Fiber, MongoDB, Supabase, and Razorpay.

## Features
- **3D Model Viewer**: Upload and interact with `.stl` files in the browser using React Three Fiber.
- **Instant Quoting**: Parses STL files and generates real-time price quotes based on volume/dimensions.
- **Authentication**: Custom JWT authentication and Google OAuth.
- **Payments**: Integrated with Razorpay for secure checkout.
- **File Storage**: Uses Supabase Storage for storing uploaded `.stl` models securely.
- **Admin Dashboard**: Manage orders, track status, and view application data.

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

You will also need accounts and API keys for the following services:
- **MongoDB**: For database storage (Users, Orders, Contact Ideas).
- **Supabase**: For object storage (uploading STL files).
- **Razorpay**: For processing payments.
- **Google Cloud Console**: For Google OAuth login.

## Getting Started

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/manthansingh09/dream3dx.git
cd dream3dx
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Set up environment variables
Create a \`.env.local\` file in the root of your project. Use \`.env.example\` as a reference.

\`\`\`env
# MongoDB Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>"

# Secret for JWT encoding
JWT_SECRET="YOUR_SUPER_SECRET"

# Admin Credentials
ADMIN_EMAIL="contact@dream3dx.com"
ADMIN_PASSWORD="Sales-O@2025"

# Razorpay Keys
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_secret"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
\`\`\`

### 4. Run the development server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure
- \`src/app/\`: Next.js App Router pages and API routes.
- \`src/components/\`: Reusable React components (like the ThreeModelViewer).
- \`src/models/\`: Mongoose schemas (User, Order, ContactIdea).
- \`src/lib/\`: Utility functions (DB connection, auth, STL parser, Supabase client).

## Deployment
This project is optimized for deployment on [Vercel](https://vercel.com).
Simply import your GitHub repository into Vercel, configure the Environment Variables in the Vercel dashboard, and deploy.
