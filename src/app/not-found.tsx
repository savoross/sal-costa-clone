import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { CursorFollower } from "@/components/cursor/cursor-follower";
import { WebGLFallbackBackground } from "@/components/background/webgl-fallback-background";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-wrapper">
      <CursorFollower />
      <WebGLFallbackBackground />
      <Navbar />
      <main className="w-full max-w-screen-xl mx-auto py-24 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Страница не найдена
        </h1>
        <p className="text-lg mb-8">
          К сожалению, запрашиваемая страница не существует.
        </p>
        <Button asChild variant="secondary">
          <Link href="/" data-cursor-hover>
            Вернуться на главную
          </Link>
        </Button>
      </main>
    </div>
  );
}
