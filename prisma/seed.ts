import { hash } from "bcryptjs"
import "dotenv/config";
import { PrismaClient, SkillCategory, ProjectStatus } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 🔑 PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 🔑 Prisma adapter
const adapter = new PrismaPg(pool);

// ✅ PrismaClient HARUS pakai adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...")

  // Create admin user
  const hashedPassword = await hash("INTdev06123!master$1", 12)
  
  const admin = await prisma.user.upsert({
    where: { email: "robil14022019@gmail.com" },
    update: {},
    create: {
      email: "robil14022019@gmail.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log("✅ Created admin user:", admin.email)

  // Create default profile
  const profile = await prisma.profile.upsert({
    where: { id: "default-profile" },
    update: {},
    create: {
      id: "default-profile",
      name: "John Doe",
      title: "Full Stack Developer",
      bio: "I craft exceptional digital experiences with modern technologies. Passionate about clean code, beautiful design, and solving complex problems.",
      shortBio: "Full Stack Developer specializing in React, Node.js, and cloud technologies.",
      email: "hello@example.com",
      location: "San Francisco, CA",
      isAvailable: true,
    },
  })

  console.log("✅ Created default profile:", profile.name)

  // Create sample skills
  const skills: Array<{
    name: string
    category: SkillCategory
    level: number
    order: number
  }> = [
    { name: "React", category: SkillCategory.FRONTEND, level: 95, order: 1 },
    { name: "Next.js", category: SkillCategory.FRONTEND, level: 90, order: 2 },
    { name: "TypeScript", category: SkillCategory.FRONTEND, level: 88, order: 3 },
    { name: "Node.js", category: SkillCategory.BACKEND, level: 85, order: 4 },
    { name: "Python", category: SkillCategory.BACKEND, level: 82, order: 5 },
    { name: "PostgreSQL", category: SkillCategory.DATABASE, level: 80, order: 6 },
    { name: "Docker", category: SkillCategory.DEVOPS, level: 78, order: 7 },
    { name: "AWS", category: SkillCategory.DEVOPS, level: 75, order: 8 },
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: {
        id: `skill-${skill.name.toLowerCase().replace(/\s+/g, "-")}`,
      },
      update: skill,
      create: {
        id: `skill-${skill.name.toLowerCase().replace(/\s+/g, "-")}`,
        ...skill,
        userId: admin.id,
      },
    })
  }

  console.log("✅ Created", skills.length, "skills")

  // Create sample projects
  const projects = [
    {
      title: "E-Commerce Platform",
      slug: "e-commerce-platform",
      description: "A full-featured e-commerce platform built with Next.js, featuring cart functionality, payment integration with Stripe, and a comprehensive admin dashboard for product and order management.",
      shortDesc: "Full-featured e-commerce with Next.js, Stripe, and admin dashboard.",
      thumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600",
      techStack: ["Next.js", "TypeScript", "Prisma", "Stripe", "Tailwind CSS"],
      category: "Web App",
      featured: true,
      status: ProjectStatus.COMPLETED,
      isPublished: true,
    },
    {
      title: "AI Chat Assistant",
      slug: "ai-chat-assistant",
      description: "An intelligent chatbot powered by GPT with context awareness, multi-language support, and the ability to learn from conversations. Features real-time streaming responses.",
      shortDesc: "Intelligent GPT-powered chatbot with context awareness.",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
      techStack: ["Python", "FastAPI", "OpenAI", "Redis", "React"],
      category: "AI/ML",
      featured: true,
      status: ProjectStatus.COMPLETED,
      isPublished: true,
    },
    {
      title: "Task Management App",
      slug: "task-management-app",
      description: "A collaborative task management application with real-time updates using Socket.io, team collaboration features, progress tracking, and Kanban board functionality.",
      shortDesc: "Collaborative task management with real-time updates.",
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600",
      techStack: ["React", "Node.js", "Socket.io", "MongoDB", "Express"],
      category: "Web App",
      featured: false,
      status: ProjectStatus.IN_PROGRESS,
      isPublished: true,
    },
  ]

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: {
        ...project,
        userId: admin.id,
      },
    })
  }

  console.log("✅ Created", projects.length, "projects")

  // Create sample social links
  const socialLinks = [
    { platform: "GitHub", url: "https://github.com", order: 1 },
    { platform: "LinkedIn", url: "https://linkedin.com", order: 2 },
    { platform: "Twitter", url: "https://twitter.com", order: 3 },
  ]

  for (const link of socialLinks) {
    await prisma.socialLink.upsert({
      where: {
        id: `social-${link.platform.toLowerCase()}`,
      },
      update: link,
      create: {
        id: `social-${link.platform.toLowerCase()}`,
        ...link,
        userId: admin.id,
      },
    })
  }

  console.log("✅ Created", socialLinks.length, "social links")

  // Create default settings
  const settings = [
    { key: "site_title", value: "Portfolio", type: "string" },
    { key: "site_description", value: "Professional portfolio showcasing projects and skills", type: "string" },
    { key: "theme_color", value: "#8b5cf6", type: "string" },
    { key: "enable_blog", value: "true", type: "boolean" },
    { key: "enable_contact_form", value: "true", type: "boolean" },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    })
  }

  console.log("✅ Created", settings.length, "settings")

  console.log("\n🎉 Seed completed successfully!")
  console.log("\n📧 Admin login:")
  console.log("   Email: admin@example.com")
  console.log("   Password: admin123")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })