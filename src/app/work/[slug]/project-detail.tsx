"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, Calendar, User, Clock } from "lucide-react"

interface ProjectImage {
  url: string
  alt: string
  caption: string
}

interface Project {
  id: string
  title: string
  subtitle: string
  year: string
  client: string
  duration: string
  role: string
  tags: string[]
  description: string
  challenge: string
  solution: string
  results: string[]
  images: ProjectImage[]
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
}

interface ProjectDetailProps {
  project: Project
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <main className="w-full max-w-screen-xl mx-auto py-24 px-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          data-cursor-hover
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к работам
        </Link>
      </motion.div>

      {/* Project Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{project.title}</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-6">{project.subtitle}</p>
        <p className="text-lg leading-relaxed max-w-3xl">{project.description}</p>
      </motion.div>

      {/* Project Meta */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 p-6 bg-background/50 rounded-lg border border-border"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-secondary" />
          <div>
            <p className="text-sm text-muted-foreground">Год</p>
            <p className="font-medium">{project.year}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-secondary" />
          <div>
            <p className="text-sm text-muted-foreground">Клиент</p>
            <p className="font-medium">{project.client}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-secondary" />
          <div>
            <p className="text-sm text-muted-foreground">Длительность</p>
            <p className="font-medium">{project.duration}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Роль</p>
          <p className="font-medium">{project.role}</p>
        </div>
      </motion.div>

      {/* Hero Image */}
      {project.images[0] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="rounded-lg overflow-hidden">
            <Image
              src={project.images[0].url || "/placeholder.svg"}
              alt={project.images[0].alt}
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">{project.images[0].caption}</p>
        </motion.div>
      )}

      {/* Project Links */}
      {(project.liveUrl || project.githubUrl) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex gap-4 mb-16"
        >
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              data-cursor-hover
            >
              <ExternalLink className="w-4 h-4" />
              Посмотреть сайт
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
              data-cursor-hover
            >
              <Github className="w-4 h-4" />
              Посмотреть код
            </a>
          )}
        </motion.div>
      )}

      {/* Project Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        {/* Challenge & Solution */}
        <div className="lg:col-span-2 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Задача</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">{project.challenge}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4">Решение</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">{project.solution}</p>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h3 className="text-xl font-bold mb-4">Технологии</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-xl font-bold mb-4">Категории</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-6">Результаты и влияние</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.results.map((result, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-border">
              <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0" />
              <p className="font-medium">{result}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Additional Images */}
      {project.images.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="space-y-12"
        >
          <h2 className="text-2xl font-bold">Галерея проекта</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.images.slice(1).map((image, index) => (
              <div key={index} className="space-y-4">
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt}
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{image.caption}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Navigation to other projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="mt-24 pt-12 border-t border-border"
      >
        <div className="flex justify-between items-center">
          <Link href="/work" className="text-lg font-medium hover:text-secondary transition-colors" data-cursor-hover>
            ← Все проекты
          </Link>
          <Link
            href="/contact"
            className="text-lg font-medium hover:text-secondary transition-colors"
            data-cursor-hover
          >
            Давайте работать вместе →
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
