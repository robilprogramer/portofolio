"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { 
  ArrowRight, Github, Linkedin, Mail, ExternalLink, 
  ChevronDown, Sparkles, Code2, Layers, Zap, 
  Download, MapPin, Calendar, Send, Menu, X,
  Briefcase, GraduationCap, Award, Star
} from "lucide-react"

// ═══════════════════════════════════════════════════════════════════════════
// DEMO DATA - Replace with actual data from database
// ═══════════════════════════════════════════════════════════════════════════

const profile = {
  name: "Robil",
  title: "Full Stack Developer",
  tagline: "Building digital experiences that matter",
  bio: "I craft exceptional digital experiences with modern technologies. Passionate about clean code, beautiful design, and solving complex problems that make a real difference.",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
  email: "robilputra19@gmail.com",
  location: "San Francisco, CA",
  isAvailable: true,
  yearsExperience: 5,
  projectsCompleted: 50,
  happyClients: 30,
}

const featuredProjects = [
  {
    id: "1",
    title: "E-Commerce Platform",
    slug: "e-commerce-platform",
    category: "Web App",
    shortDesc: "A full-featured e-commerce platform with cart, checkout, and admin dashboard. Built for scale.",
    thumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800",
    techStack: ["Next.js", "TypeScript", "Prisma", "Stripe"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "2",
    title: "AI Chat Assistant",
    slug: "ai-chat-assistant",
    category: "AI/ML",
    shortDesc: "Intelligent chatbot powered by GPT with context awareness and multi-language support.",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    techStack: ["Python", "FastAPI", "OpenAI", "Redis"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "3",
    title: "Task Management",
    slug: "task-management-app",
    category: "SaaS",
    shortDesc: "Collaborative task management with real-time updates and powerful team features.",
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800",
    techStack: ["React", "Node.js", "Socket.io", "MongoDB"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    color: "from-emerald-500 to-teal-600",
  },
]

const skills = [
  { name: "React / Next.js", icon: "⚛️", level: 95, category: "Frontend" },
  { name: "TypeScript", icon: "🔷", level: 90, category: "Language" },
  { name: "Node.js", icon: "🟢", level: 88, category: "Backend" },
  { name: "Python", icon: "🐍", level: 85, category: "Backend" },
  { name: "PostgreSQL", icon: "🐘", level: 82, category: "Database" },
  { name: "Docker / K8s", icon: "🐳", level: 78, category: "DevOps" },
]

const experiences = [
  {
    title: "Senior Full Stack Developer",
    company: "TechCorp Inc.",
    period: "2022 - Present",
    description: "Leading development of enterprise applications",
    icon: Briefcase,
  },
  {
    title: "Full Stack Developer",
    company: "StartupXYZ",
    period: "2020 - 2022",
    description: "Built and scaled multiple SaaS products",
    icon: Code2,
  },
  {
    title: "Bachelor of Computer Science",
    company: "University of Technology",
    period: "2016 - 2020",
    description: "Specialized in Software Engineering",
    icon: GraduationCap,
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart",
    content: "John delivered exceptional work that exceeded our expectations. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  },
  {
    name: "Michael Chen",
    role: "CTO, InnovateCo",
    content: "Working with John was a pleasure. His technical skills and communication are top-notch.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  },
]

const socialLinks = [
  { platform: "GitHub", url: "https://github.com", icon: Github },
  { platform: "LinkedIn", url: "https://linkedin.com", icon: Linkedin },
  { platform: "Email", url: "mailto:hello@example.com", icon: Mail },
]

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const duration = 2000
          const steps = 60
          const increment = value / steps
          let current = 0
          
          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
          
          return () => clearInterval(timer)
        }
      },
      { threshold: 0.5 }
    )
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])
  
  return <span ref={ref}>{count}{suffix}</span>
}

function GlowingOrb({ className }: { className?: string }) {
  return (
    <div className={`absolute rounded-full blur-3xl opacity-30 animate-pulse ${className}`} />
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      // Update active section
      const sections = ["hero", "about", "projects", "skills", "experience", "contact"]
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* NAVIGATION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50" 
          : "bg-transparent"
      }`}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="relative group">
            <span className="text-2xl font-black tracking-tighter">
              <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                JD
              </span>
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-violet-400 to-cyan-400 group-hover:w-full transition-all duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  activeSection === link.href.slice(1)
                    ? "text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-linear-to-r from-violet-400 to-cyan-400" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Admin
            </Link>
            <button className="group relative overflow-hidden rounded-full bg-linear-to-r from-violet-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 hover:scale-105">
              <span className="relative z-10 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Resume
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-cyan-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/50 transition-all duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}>
          <div className="p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-medium text-zinc-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" className="block text-lg font-medium text-zinc-500 hover:text-white transition-colors">
              Admin Panel
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <GlowingOrb className="top-1/4 -left-32 w-96 h-96 bg-violet-600" />
          <GlowingOrb className="bottom-1/4 -right-32 w-96 h-96 bg-cyan-600" />
          <GlowingOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-fuchsia-600 opacity-10" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Status Badge */}
          {profile.isAvailable && (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 mb-8 animate-fade-in">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-emerald-400">
                Open to new opportunities
              </span>
            </div>
          )}

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[0.9] tracking-tight">
            <span className="block text-zinc-100">Hi, I&apos;m</span>
            <span className="block mt-2 bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent pb-2">
              {profile.name}
            </span>
          </h1>

          {/* Subtitle with animated typing effect look */}
          <div className="mt-6 flex items-center justify-center gap-3 text-xl sm:text-2xl text-zinc-400">
            <Code2 className="h-6 w-6 text-violet-400" />
            <span className="font-light">{profile.title}</span>
          </div>

          {/* Tagline */}
          <p className="mt-8 text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            {profile.bio}
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#projects"
              className="group relative overflow-hidden rounded-full bg-linear-to-r from-violet-600 to-cyan-600 px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-violet-500/30 transition-all duration-300 hover:shadow-violet-500/50 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                View My Work
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-cyan-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <Link
              href="#contact"
              className="group flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-8 py-4 text-base font-semibold text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-800/50"
            >
              <Mail className="h-5 w-5" />
              Get in Touch
            </Link>
          </div>

          {/* Social Links */}
          <div className="mt-16 flex items-center justify-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 text-zinc-500 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/50 hover:text-violet-400 hover:scale-110 hover:shadow-lg hover:shadow-violet-500/20"
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto">
            {[
              { value: profile.yearsExperience, label: "Years Experience", suffix: "+" },
              { value: profile.projectsCompleted, label: "Projects Completed", suffix: "+" },
              { value: profile.happyClients, label: "Happy Clients", suffix: "+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-black bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-zinc-500">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ABOUT SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="about" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-full h-full border border-violet-500/30 rounded-3xl" />
                <div className="absolute -bottom-4 -right-4 w-full h-full bg-linear-to-br from-violet-600/20 to-cyan-600/20 rounded-3xl" />
                
                {/* Main image container */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden bg-linear-to-br from-violet-600 to-cyan-600 p-1">
                  <div className="w-full h-full rounded-[22px] overflow-hidden bg-zinc-900">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-6 -right-6 flex items-center gap-2 rounded-2xl bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 px-4 py-3 shadow-xl">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm font-semibold">Creative Developer</span>
                </div>
                <div className="absolute -bottom-6 -left-6 flex items-center gap-2 rounded-2xl bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 px-4 py-3 shadow-xl">
                  <MapPin className="h-5 w-5 text-violet-400" />
                  <span className="text-sm font-semibold">{profile.location}</span>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-semibold uppercase tracking-widest">
                  <Sparkles className="h-4 w-4" />
                  About Me
                </span>
                <h2 className="mt-4 text-4xl sm:text-5xl font-black leading-tight">
                  Crafting Digital
                  <span className="block text-zinc-500">Experiences</span>
                </h2>
              </div>

              <div className="space-y-4 text-lg text-zinc-400 leading-relaxed">
                <p>
                  I&apos;m a passionate full-stack developer with a love for creating beautiful, 
                  functional, and user-centered digital experiences. With {profile.yearsExperience}+ years 
                  of experience, I bring ideas to life through clean code and thoughtful design.
                </p>
                <p>
                  When I&apos;m not coding, you&apos;ll find me exploring new technologies, 
                  contributing to open-source projects, or sharing knowledge with the developer community.
                </p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Zap, label: "Fast Delivery" },
                  { icon: Layers, label: "Clean Code" },
                  { icon: Code2, label: "Modern Stack" },
                  { icon: Star, label: "Best Practices" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-zinc-300">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              <Link
                href="#contact"
                className="inline-flex items-center gap-2 text-violet-400 font-semibold hover:text-violet-300 transition-colors group"
              >
                Let&apos;s work together
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PROJECTS SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="projects" className="relative py-32 px-6 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-semibold uppercase tracking-widest">
              <Layers className="h-4 w-4" />
              Portfolio
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black">
              Featured <span className="text-zinc-500">Projects</span>
            </h2>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
              A selection of projects that showcase my skills and passion for building great products.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group relative rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden transition-all duration-500 hover:border-zinc-700 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center rounded-full bg-linear-to-r ${project.color} px-3 py-1 text-xs font-semibold text-white`}>
                      {project.category}
                    </span>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-900 hover:bg-violet-500 hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-900 hover:bg-violet-500 hover:text-white transition-colors"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {project.shortDesc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-lg bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-16 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-8 py-4 text-base font-semibold text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/50 hover:text-white hover:shadow-lg hover:shadow-violet-500/20"
            >
              View All Projects
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SKILLS SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="skills" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-semibold uppercase tracking-widest">
              <Zap className="h-4 w-4" />
              Expertise
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black">
              Skills & <span className="text-zinc-500">Technologies</span>
            </h2>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">
              My toolkit for building modern, scalable, and performant applications.
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-violet-500/50 hover:bg-zinc-900"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{skill.icon}</span>
                    <div>
                      <h3 className="font-semibold text-white">{skill.name}</h3>
                      <p className="text-xs text-zinc-500">{skill.category}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-violet-400">{skill.level}%</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-violet-500 to-cyan-500 transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* EXPERIENCE SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="experience" className="relative py-32 px-6 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-semibold uppercase tracking-widest">
              <Award className="h-4 w-4" />
              Journey
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black">
              Experience & <span className="text-zinc-500">Education</span>
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-linear-to-b from-violet-500 via-violet-500/50 to-transparent" />

            {/* Items */}
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div key={index} className="relative flex gap-8">
                  {/* Icon */}
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800">
                    <exp.icon className="h-6 w-6 text-violet-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-violet-500/30 hover:bg-zinc-900">
                    <div className="flex flex-wrap items-center gap-4 justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                      <span className="inline-flex items-center gap-1 text-sm text-zinc-500">
                        <Calendar className="h-4 w-4" />
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-violet-400 font-medium mb-2">{exp.company}</p>
                    <p className="text-zinc-400">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-semibold uppercase tracking-widest">
              <Star className="h-4 w-4" />
              Testimonials
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-black">
              What People <span className="text-zinc-500">Say</span>
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 transition-all duration-300 hover:border-violet-500/30"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-2 text-6xl text-violet-500/20 font-serif">
                  &ldquo;
                </div>

                <p className="text-lg text-zinc-300 leading-relaxed mb-6">
                  {testimonial.content}
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-violet-500/30"
                  />
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-zinc-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTACT SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="relative py-32 px-6 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-semibold uppercase tracking-widest">
            <Send className="h-4 w-4" />
            Contact
          </span>
          <h2 className="mt-4 text-4xl sm:text-6xl font-black leading-tight">
            Let&apos;s Create
            <span className="block bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Something Amazing
            </span>
          </h2>
          <p className="mt-6 text-lg text-zinc-400 max-w-xl mx-auto">
            Have a project in mind? I&apos;d love to hear about it. Let&apos;s discuss how we can work together.
          </p>

          <div className="mt-12">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-3 rounded-full bg-linear-to-r from-violet-600 to-cyan-600 px-10 py-5 text-lg font-semibold text-white shadow-2xl shadow-violet-500/30 transition-all duration-300 hover:shadow-violet-500/50 hover:scale-105"
            >
              <Mail className="h-6 w-6" />
              {profile.email}
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 text-zinc-500 transition-all duration-300 hover:border-violet-500/50 hover:text-violet-400 hover:scale-110"
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-zinc-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="text-sm text-zinc-600">
            Built with <span className="text-violet-400">♥</span> using Next.js & Tailwind CSS
          </p>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
