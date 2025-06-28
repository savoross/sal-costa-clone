"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"

export function AboutClient() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="w-full max-w-screen-xl mx-auto py-24 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8">О нас</h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-4">
              Мы SALI COST — команда Frontend разработчиков и дизайнеров с более чем 5-летним опытом создания цифровых
              интерфейсов, которые сочетают креативность с технической точностью.
            </p>
            <p className="mb-4">
              Наш подход объединяет интуитивные пользовательские интерфейсы с чистым, эффективным кодом для создания
              веб-сайтов и приложений, которые не только красиво выглядят, но и безупречно работают.
            </p>
            <p className="mb-4">
              Мы специализируемся на экосистемах React, UI/UX дизайне и анимации, воплощая бренды и идеи в жизнь через
              продуманный цифровой дизайн и разработку.
            </p>
            <p className="mb-4">
              Когда мы не кодим и не проектируем, вы найдете нас изучающими новые дизайнерские тренды,
              экспериментирующими с анимациями или вносящими вклад в проекты с открытым исходным кодом.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Основные навыки</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Разработка</h3>
                <ul className="space-y-1">
                  <li>React & Next.js</li>
                  <li>TypeScript</li>
                  <li>GSAP & Framer Motion</li>
                  <li>Tailwind CSS</li>
                  <li>Адаптивный дизайн</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Дизайн</h3>
                <ul className="space-y-1">
                  <li>UI/UX дизайн</li>
                  <li>Figma & Adobe Suite</li>
                  <li>Motion дизайн</li>
                  <li>Дизайн системы</li>
                  <li>Интерактивный дизайн</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <div className="relative w-full max-w-md mx-auto">
            <div className="rounded-lg overflow-hidden">
              <Image
                src="https://ext.same-assets.com/4083826418/1092142111.jpeg"
                alt="SALI COST команда"
                width={500}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-secondary text-secondary-foreground p-4 rounded-lg">
              <p className="font-medium">Доступны для фриланс проектов</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
