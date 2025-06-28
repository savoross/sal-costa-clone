import { Navbar } from "@/components/navigation/navbar"
import { CursorFollower } from "@/components/cursor/cursor-follower"
import { WebGLFallbackBackground } from "@/components/background/webgl-fallback-background"
import { ProjectDetail } from "./project-detail"
import { notFound } from "next/navigation"

// Project data
const projects = {
  arcex: {
    id: "arcex",
    title: "Arcex",
    subtitle: "UX/UI Дизайн и Разработка",
    year: "2024",
    client: "Arcex Technologies",
    duration: "3 месяца",
    role: "Ведущий дизайнер и Frontend разработчик",
    tags: ["UI Дизайн", "Frontend Разработка", "React", "TypeScript"],
    description:
      "Комплексная дизайн-система и веб-приложение для финтех стартапа, специализирующегося на торговле криптовалютами и управлении портфелем.",
    challenge:
      "Создать удобный интерфейс для сложных финансовых данных, сохраняя при этом стандарты безопасности и производительности.",
    solution:
      "Разработали модульную дизайн-систему с визуализацией данных в реальном времени, интуитивной навигацией и адаптивными макетами, оптимизированными как для настольных, так и для мобильных торгов.",
    results: [
      "Увеличение вовлеченности пользователей на 40%",
      "Сокращение обращений в поддержку на 25%",
      "Достигнута доступность 99.9%",
      "Упоминание в TechCrunch",
    ],
    images: [
      {
        url: "https://ext.same-assets.com/4083826418/779204435.png",
        alt: "Обзор панели Arcex",
        caption: "Главная панель с обзором портфеля и рыночными данными в реальном времени",
      },
      {
        url: "/placeholder.svg?height=600&width=800",
        alt: "Мобильное приложение Arcex",
        caption: "Дизайн, ориентированный на мобильные устройства для торговли в движении",
      },
      {
        url: "/placeholder.svg?height=600&width=800",
        alt: "Дизайн-система Arcex",
        caption: "Комплексная дизайн-система и библиотека компонентов",
      },
    ],
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion", "Chart.js"],
    liveUrl: "https://arcex.example.com",
    githubUrl: "https://github.com/salcosta/arcex",
  },
  raindrop: {
    id: "raindrop",
    title: "Raindrop",
    subtitle: "Веб Дизайн и Разработка",
    year: "2023",
    client: "Raindrop Analytics",
    duration: "2 месяца",
    role: "Full Stack дизайнер и разработчик",
    tags: ["Веб Дизайн", "Frontend Разработка", "UX Исследования"],
    description:
      "Красивая и интуитивная платформа аналитики погоды, которая предоставляет подробную метеорологическую информацию для бизнеса и исследователей.",
    challenge:
      "Преобразовать сложные данные о погоде в понятные, практичные инсайты, сохраняя визуальную привлекательность и удобство использования.",
    solution:
      "Создали элегантный интерфейс с интерактивными картами, настраиваемыми панелями и инструментами прогнозной аналитики.",
    results: [
      "Улучшение понимания данных на 60%",
      "Увеличение удержания пользователей на 35%",
      "Награда Design Awards 2023",
      "10k+ активных пользователей в первый месяц",
    ],
    images: [
      {
        url: "https://ext.same-assets.com/4083826418/354791880.png",
        alt: "Панель Raindrop",
        caption: "Интерактивная панель погоды с визуализацией данных в реальном времени",
      },
      {
        url: "/placeholder.svg?height=600&width=800",
        alt: "Мобильный интерфейс Raindrop",
        caption: "Мобильно-оптимизированный интерфейс для полевых исследователей",
      },
    ],
    technologies: ["Vue.js", "D3.js", "Node.js", "PostgreSQL", "Mapbox", "WebGL"],
    liveUrl: "https://raindrop.example.com",
  },
  finterest: {
    id: "finterest",
    title: "Finterest",
    subtitle: "UX/UI Дизайн и Разработка",
    year: "2023",
    client: "Finterest Inc.",
    duration: "4 месяца",
    role: "Старший UX дизайнер и Frontend лид",
    tags: ["UI Дизайн", "Frontend Разработка", "Пользовательские исследования"],
    description:
      "Социальная платформа для финансовой грамотности и инвестиционного образования, сочетающая стиль Pinterest с образовательным контентом.",
    challenge: "Сделать сложные финансовые концепции доступными и увлекательными для миллениалов и поколения Z.",
    solution:
      "Разработали визуально-ориентированную платформу с элементами геймификации, персонализированными путями обучения и функциями социального обмена.",
    results: [
      "Увеличение завершения курсов на 200%",
      "85% оценка удовлетворенности пользователей",
      "50k+ зарегистрированных пользователей",
      "Партнерство с крупными финансовыми учреждениями",
    ],
    images: [
      {
        url: "https://ext.same-assets.com/4083826418/1936394737.png",
        alt: "Лента Finterest",
        caption: "Персонализированная лента финансового образования с визуальными обучающими карточками",
      },
    ],
    technologies: ["React", "Redux", "Node.js", "MongoDB", "AWS", "Stripe"],
    liveUrl: "https://finterest.example.com",
  },
  portfolio: {
    id: "portfolio",
    title: "Portfolio",
    subtitle: "UX/UI Дизайн и Разработка",
    year: "2022",
    client: "Личный проект",
    duration: "1 месяц",
    role: "Дизайнер и разработчик",
    tags: ["UI Дизайн", "Frontend Разработка", "Личный брендинг"],
    description:
      "Мой личный портфолио веб-сайт, демонстрирующий дизайн и разработку с акцентом на чистую эстетику и плавные взаимодействия.",
    challenge:
      "Создать запоминающееся портфолио, которое выделяется, сохраняя профессионализм и демонстрируя технические навыки.",
    solution:
      "Разработали минималистичный дизайн с тонкими анимациями, геометрическими элементами и оптимизированной производительностью.",
    results: [
      "Представлено на Awwwards",
      "95+ баллов производительности Lighthouse",
      "Увеличение запросов клиентов на 150%",
      "Положительные отзывы от дизайнерского сообщества",
    ],
    images: [
      {
        url: "https://ext.same-assets.com/4083826418/3629516342.png",
        alt: "Главная страница портфолио",
        caption: "Чистая, минималистичная главная страница с геометрической анимацией загрузки",
      },
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP"],
    liveUrl: "https://salcosta.dev",
  },
  "venture-out": {
    id: "venture-out",
    title: "Venture Out",
    subtitle: "Веб Дизайн и Разработка",
    year: "2022",
    client: "Venture Out Co.",
    duration: "2 месяца",
    role: "Ведущий дизайнер и разработчик",
    tags: ["Веб Дизайн", "Frontend Разработка", "E-commerce"],
    description:
      "Платформа бронирования приключений на открытом воздухе, соединяющая путешественников с уникальными впечатлениями и местными гидами по всему миру.",
    challenge:
      "Создать надежную платформу, которая демонстрирует приключенческие впечатления, обрабатывая сложные рабочие процессы бронирования.",
    solution:
      "Построили захватывающую платформу с высококачественными изображениями, подробными страницами впечатлений и упрощенным процессом бронирования.",
    results: [
      "Увеличение бронирований на 300%",
      "Средняя оценка пользователей 4.8/5",
      "Расширение на 15 стран",
      "Упоминание в туристических изданиях",
    ],
    images: [
      {
        url: "https://ext.same-assets.com/4083826418/843157461.png",
        alt: "Главная страница Venture Out",
        caption: "Героическая секция, демонстрирующая приключенческие впечатления с захватывающими изображениями",
      },
    ],
    technologies: ["React", "Next.js", "Stripe", "Mapbox", "Cloudinary", "Prisma"],
    liveUrl: "https://ventureout.example.com",
  },
}

interface PageProps {
  params: { slug: string }
}

export default function ProjectPage({ params }: PageProps) {
  const { slug } = params
  const project = projects[slug as keyof typeof projects]

  if (!project) {
    notFound()
  }

  return (
    <div className="page-wrapper">
      <CursorFollower />
      <WebGLFallbackBackground />
      <Navbar />
      <ProjectDetail project={project} />
    </div>
  )
}

export function generateStaticParams() {
  return Object.keys(projects).map((slug) => ({
    slug,
  }))
}

export function generateMetadata({ params }: PageProps) {
  const { slug } = params
  const project = projects[slug as keyof typeof projects]

  if (!project) {
    return {
      title: "Проект не найден",
    }
  }

  return {
    title: `${project.title} - ${project.subtitle} | SALI COST`,
    description: project.description,
  }
}
