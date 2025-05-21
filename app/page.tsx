import Link from "next/link"
import { Button } from "@/components/ui/button"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import HowItWorksSection from "@/components/how-it-works-section"
import AnimatedBackground from "@/components/animated-background"
import FloatingParticles from "@/components/floating-particles"
import GamePreview from "@/components/game-preview"
import AstroGuide from "@/components/astro-guide"
import { Badge } from "@/components/ui/badge"
import AnimatedStars from "@/components/animated-stars"
import { Gamepad2, Trophy, Brain, Sparkles, Rocket } from "lucide-react"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white overflow-hidden">
      <AnimatedBackground />
      <FloatingParticles />
      <AnimatedStars />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="relative">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 flex items-center">
                <Gamepad2 className="mr-2 h-6 w-6 text-blue-400" /> QuizMaster
              </h1>
              <div className="absolute -top-3 -right-12">
                <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold animate-pulse">
                  Novo!
                </Badge>
              </div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/game" className="text-blue-400 hover:text-blue-300 transition-colors">
              Jogar
            </Link>
            <Link href="/categorias" className="text-gray-300 hover:text-white transition-colors">
              Categorias
            </Link>
            <Link href="/conquistas" className="text-gray-300 hover:text-white transition-colors">
              Conquistas
            </Link>
            <Link href="/sobre" className="text-gray-300 hover:text-white transition-colors">
              Sobre
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-950">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">Cadastrar</Button>
            </Link>
          </div>
        </header>

        <main>
          <HeroSection />

          <div className="py-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 rounded-full mb-8">
              <Rocket className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Comece sua jornada de aprendizado agora!</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-blue-900/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Aprenda</h3>
                <p className="text-gray-300 text-center mb-4">Teste seus conhecimentos com quizzes educativos</p>
                <Link href="/game" className="mt-auto">
                  <Button variant="outline" className="border-blue-700 text-blue-400 hover:bg-blue-900/20 w-full">
                    Começar
                  </Button>
                </Link>
              </div>

              <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-purple-900/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 flex flex-col items-center transform md:scale-110 md:-mt-4 md:mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center mb-4">
                  <Gamepad2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Jogue</h3>
                <p className="text-gray-300 text-center mb-4">Divirta-se enquanto se prepara para suas provas</p>
                <Link href="/game" className="mt-auto">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full">
                    Jogar Agora
                  </Button>
                </Link>
              </div>

              <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-blue-900/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-4">
                  <Trophy className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Conquiste</h3>
                <p className="text-gray-300 text-center mb-4">Desbloqueie conquistas e acompanhe seu progresso</p>
                <Link href="/conquistas" className="mt-auto">
                  <Button variant="outline" className="border-blue-700 text-blue-400 hover:bg-blue-900/20 w-full">
                    Ver Conquistas
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <GamePreview />
          <FeaturesSection />
          <HowItWorksSection />

          <section className="py-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-yellow-400 mr-2" />
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Pronto para Mandar Bem nas Provas?
                </h2>
              </div>
              <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                Entre no jogo agora e comece sua jornada de aprendizado. Teste seus conhecimentos, desbloqueie
                conquistas e prepare-se para o sucesso!
              </p>
              <Link href="/game">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 transition-all duration-300 group"
                >
                  <span className="mr-2 transition-transform duration-300 group-hover:translate-x-1">🚀</span>
                  Começar a Jogar Agora
                </Button>
              </Link>
              <div className="mt-4 text-blue-300 text-sm animate-bounce">Clique para iniciar o jogo de quiz!</div>
            </div>
          </section>
        </main>

        <AstroGuide />

        <footer className="mt-12 py-8 border-t border-blue-900/50 text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mr-3">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              QuizMaster
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div>
              <h4 className="font-bold text-blue-400 mb-3">Jogo</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/game" className="text-gray-300 hover:text-white">
                    Jogar Agora
                  </Link>
                </li>
                <li>
                  <Link href="/categorias" className="text-gray-300 hover:text-white">
                    Categorias
                  </Link>
                </li>
                <li>
                  <Link href="/conquistas" className="text-gray-300 hover:text-white">
                    Conquistas
                  </Link>
                </li>
                <li>
                  <Link href="/ranking" className="text-gray-300 hover:text-white">
                    Ranking
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-blue-400 mb-3">Conta</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-white">
                    Entrar
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-300 hover:text-white">
                    Cadastrar
                  </Link>
                </li>
                <li>
                  <Link href="/perfil" className="text-gray-300 hover:text-white">
                    Meu Perfil
                  </Link>
                </li>
                <li>
                  <Link href="/configuracoes" className="text-gray-300 hover:text-white">
                    Configurações
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-blue-400 mb-3">Recursos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/tutorial" className="text-gray-300 hover:text-white">
                    Tutorial
                  </Link>
                </li>
                <li>
                  <Link href="/dicas" className="text-gray-300 hover:text-white">
                    Dicas de Estudo
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/ajuda" className="text-gray-300 hover:text-white">
                    Ajuda
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-blue-400 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/termos" className="text-gray-300 hover:text-white">
                    Termos
                  </Link>
                </li>
                <li>
                  <Link href="/privacidade" className="text-gray-300 hover:text-white">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-gray-300 hover:text-white">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="text-gray-300 hover:text-white">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} QuizMaster. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </div>
  )
}
