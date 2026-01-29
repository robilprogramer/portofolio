# 🚀 Next.js Portfolio

A modern, dynamic portfolio website built with Next.js 15, featuring an elegant admin dashboard for content management.

## ✨ Features

### Public Portfolio
- 🎨 Beautiful, responsive design with smooth animations
- 📱 Mobile-first approach
- 🌓 Dark/Light mode support
- ⚡ Optimized performance with Next.js
- 🔍 SEO optimized

### Admin Dashboard
- 🔐 Secure authentication with NextAuth.js
- 📊 Dashboard with analytics overview
- 📁 Project management (CRUD)
- 📝 Blog post management
- 💼 Experience & Education management
- 🛠️ Skills management
- 📜 Certificates management
- 💬 Testimonials management
- 📧 Contact messages inbox
- 🔗 Social links management
- ⚙️ Site settings

### Database
- 🗄️ Prisma ORM with PostgreSQL/MySQL/SQLite support
- 🔄 Easy migrations
- 🌱 Seed data for quick start

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (or MySQL/SQLite)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## 📁 Project Structure

```
portfolio-nextjs/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── app/
│   │   ├── (public)/      # Public portfolio pages
│   │   ├── admin/         # Admin dashboard
│   │   │   ├── (dashboard)/ # Protected admin routes
│   │   │   └── login/     # Login page
│   │   └── api/           # API routes
│   ├── components/
│   │   ├── admin/         # Admin components
│   │   └── ui/            # Reusable UI components
│   └── lib/
│       ├── auth.ts        # NextAuth configuration
│       ├── prisma.ts      # Prisma client
│       └── utils.ts       # Utility functions
├── .env.example           # Environment variables example
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL (or MySQL/SQLite)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio-nextjs.git
   cd portfolio-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev --name init
   
   # Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Portfolio: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

### Default Admin Credentials

```
Email: admin@example.com
Password: admin123
```

⚠️ **Change these credentials in production!**

## 📊 Database Schema

The database includes the following models:

| Model | Description |
|-------|-------------|
| User | Admin users for authentication |
| Profile | Portfolio profile information |
| Project | Portfolio projects |
| Post | Blog posts |
| Experience | Work experience entries |
| Education | Education history |
| Skill | Technical skills |
| Certificate | Professional certificates |
| Testimonial | Client testimonials |
| SocialLink | Social media links |
| Message | Contact form messages |
| Setting | Site configuration |
| PageView | Analytics data |

## 🔧 Configuration

### Database Providers

The project supports multiple database providers:

**PostgreSQL (Recommended for production)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
```

**MySQL**
```env
DATABASE_URL="mysql://user:password@localhost:3306/portfolio"
```
Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

**SQLite (For development)**
```env
DATABASE_URL="file:./dev.db"
```
Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 API Routes

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session

### Admin API
- `GET/POST /api/admin/projects` - List/Create projects
- `GET/PUT/DELETE /api/admin/projects/[id]` - Single project operations
- Similar routes for posts, experience, education, etc.

## 🎨 Customization

### Colors

Edit the color scheme in your components using Tailwind classes:
- Primary: `violet-500`, `violet-600`
- Secondary: `indigo-500`, `indigo-600`

### Fonts

Update `src/app/layout.tsx` to change fonts:

```tsx
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and Tailwind CSS
