"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Home,
  Menu,
  Award,
  BookOpen,
  Play,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  XCircle,
  Star,
  Tag,
  BarChart,
  Trophy,
  HelpCircle,
  Info,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useMediaQuery } from "@/hooks/use-media-query"
import GameSidebar from "@/components/game-sidebar"
import AnimatedStars from "@/components/animated-stars"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import TutorialDialog from "@/components/tutorial-dialog"

// Import the original game logic
import { initializeGame } from "@/lib/game-engine"

// Add these imports at the top
import LevelProgress from "@/components/level-progress"
import LevelUpNotification from "@/components/level-up-notification"
import { levelSystem, calculateQuizXP } from "@/lib/level-system"
import { Gift, Crown, Medal, Sparkles } from "lucide-react"

export default function GamePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("inicio")
  const [playerName, setPlayerName] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("facil")
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [gameStats, setGameStats] = useState({
    score: 0,
    level: 1,
    correctAnswers: 0,
    wrongAnswers: 0,
    questionsAnswered: 0,
    achievements: [],
    lastErrors: 0,
    answeredCorrectly: [],
    answeredIncorrectly: [],
  })
  const [progress, setProgress] = useState(0)
  const [showTutorial, setShowTutorial] = useState(false)
  const [achievementAnimation, setAchievementAnimation] = useState(false)
  const [latestAchievement, setLatestAchievement] = useState<string | null>(null)
  const gameContainerRef = useRef<HTMLDivElement>(null)

  // Add these state variables inside the component
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpData, setLevelUpData] = useState({
    level: 1,
    rewards: [
      {
        name: "Tema Espacial",
        description: "Transforme a interface do jogo com um tema espacial futurista.",
        icon: <Gift className="h-16 w-16 text-blue-400" />,
      },
    ],
  })

  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const { toast } = useToast()

  // Initialize game engine
  useEffect(() => {
    const gameEngine = initializeGame({
      onQuestionLoad: (question) => {
        setCurrentQuestion(question)
      },
      onAnswerCheck: (isCorrect, explanation) => {
        setShowFeedback(true)

        // Update game stats
        setGameStats((prev) => {
          const pointsPerQuestion = {
            facil: 100,
            medio: 200,
            dificil: 300,
          }[selectedDifficulty]

          const newScore = isCorrect ? prev.score + pointsPerQuestion : prev.score
          const newLevel = Math.floor(newScore / 1000) + 1
          const newLastErrors = isCorrect ? 0 : prev.lastErrors + 1

          const newStats = {
            ...prev,
            score: newScore,
            level: newLevel,
            correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
            wrongAnswers: !isCorrect ? prev.wrongAnswers + 1 : prev.wrongAnswers,
            questionsAnswered: prev.questionsAnswered + 1,
            lastErrors: newLastErrors,
            answeredCorrectly: isCorrect ? [...prev.answeredCorrectly, currentQuestion] : prev.answeredCorrectly,
            answeredIncorrectly: !isCorrect ? [...prev.answeredIncorrectly, currentQuestion] : prev.answeredIncorrectly,
          }

          return newStats
        })
      },
      onAchievementUnlock: (achievement) => {
        setGameStats((prev) => ({
          ...prev,
          achievements: [...prev.achievements, achievement],
        }))

        setLatestAchievement(achievement)
        setAchievementAnimation(true)

        // Show achievement toast
        toast({
          title: "Conquista Desbloqueada!",
          description: achievement,
          variant: "default",
        })
      },
      onGameComplete: () => {
        setActiveTab("resultados")
      },
    })

    // Cleanup function
    return () => {
      // Any cleanup needed for the game engine
    }
  }, [selectedDifficulty, toast])

  useEffect(() => {
    if (isDesktop) {
      setSidebarOpen(true)
    } else {
      setSidebarOpen(false)
    }
  }, [isDesktop])

  // Load questions from JSON
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("/api/questions")
        const data = await response.json()
        if (data && data[selectedDifficulty]) {
          // Shuffle questions and limit to 10
          const shuffled = [...data[selectedDifficulty]].sort(() => Math.random() - 0.5).slice(0, 10)
          setQuestions(shuffled)
        }
      } catch (error) {
        console.error("Error loading questions:", error)
        // Use sample questions as fallback
        setQuestions(getSampleQuestions())
      }
    }

    if (activeTab === "quiz") {
      loadQuestions()
    }
  }, [activeTab, selectedDifficulty])

  // Set current question when questions change
  useEffect(() => {
    if (questions.length > 0 && activeTab === "quiz") {
      setCurrentQuestion(questions[currentQuestionIndex])
    }
  }, [questions, currentQuestionIndex, activeTab])

  // Update progress when question changes
  useEffect(() => {
    if (questions.length > 0) {
      setProgress((gameStats.questionsAnswered / questions.length) * 100)
    }
  }, [gameStats.questionsAnswered, questions.length])

  // Scroll to top when changing questions
  useEffect(() => {
    if (gameContainerRef.current && showFeedback) {
      gameContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }, [currentQuestionIndex, showFeedback])

  const startGame = () => {
    if (!playerName.trim()) {
      toast({
        title: "Nome Obrigatório",
        description: "Por favor, digite seu nome para começar o jogo.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setGameStats({
      score: 0,
      level: 1,
      correctAnswers: 0,
      wrongAnswers: 0,
      questionsAnswered: 0,
      achievements: [],
      lastErrors: 0,
      answeredCorrectly: [],
      answeredIncorrectly: [],
    })
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setProgress(0)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      setActiveTab("quiz")
    }, 1500)
  }

  const handleAnswerSelection = (index: number) => {
    setSelectedAnswer(index)

    const isCorrect = index === currentQuestion.respostaCorreta

    // Update game stats
    setGameStats((prev) => {
      const pointsPerQuestion = {
        facil: 100,
        medio: 200,
        dificil: 300,
      }[selectedDifficulty]

      const newScore = isCorrect ? prev.score + pointsPerQuestion : prev.score
      const newLevel = Math.floor(newScore / 1000) + 1
      const newLastErrors = isCorrect ? 0 : prev.lastErrors + 1

      return {
        ...prev,
        score: newScore,
        level: newLevel,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        wrongAnswers: !isCorrect ? prev.wrongAnswers + 1 : prev.wrongAnswers,
        questionsAnswered: prev.questionsAnswered + 1,
        lastErrors: newLastErrors,
        answeredCorrectly: isCorrect ? [...prev.answeredCorrectly, currentQuestion] : prev.answeredCorrectly,
        answeredIncorrectly: !isCorrect ? [...prev.answeredIncorrectly, currentQuestion] : prev.answeredIncorrectly,
      }
    })

    setShowFeedback(true)

    // Check for achievements
    checkAchievements(isCorrect)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      // End of quiz
      //setActiveTab("resultados")
      handleQuizComplete(gameStats.correctAnswers, questions.length)
    }
  }

  const restartGame = () => {
    setActiveTab("inicio")
  }

  const checkAchievements = (isCorrect: boolean) => {
    // Check for "Iniciante" achievement
    if (isCorrect && gameStats.correctAnswers + 1 === 2 && !gameStats.achievements.includes("Iniciante")) {
      setGameStats((prev) => ({
        ...prev,
        achievements: [...prev.achievements, "Iniciante"],
      }))

      setLatestAchievement("Iniciante: Acertar 2 perguntas")
      setAchievementAnimation(true)

      // Show achievement toast
      toast({
        title: "Conquista Desbloqueada!",
        description: "Iniciante: Acertar 2 perguntas",
        variant: "default",
      })
    }

    // Check for "Sem Erros" achievement
    if (
      gameStats.lastErrors === 0 &&
      gameStats.questionsAnswered + 1 >= 3 &&
      !gameStats.achievements.includes("Sem Erros")
    ) {
      setGameStats((prev) => ({
        ...prev,
        achievements: [...prev.achievements, "Sem Erros"],
      }))

      setLatestAchievement("Sem Erros: Responder 3 perguntas seguidas sem errar")
      setAchievementAnimation(true)

      toast({
        title: "Conquista Desbloqueada!",
        description: "Sem Erros: Responder 3 perguntas seguidas sem errar",
        variant: "default",
      })
    }

    // Check for "Expert em Provas" achievement
    const provasCorrect = gameStats.answeredCorrectly.filter((q) => q.tema === "Provas").length
    if (
      isCorrect &&
      currentQuestion.tema === "Provas" &&
      provasCorrect + 1 >= 3 &&
      !gameStats.achievements.includes("Expert em Provas")
    ) {
      setGameStats((prev) => ({
        ...prev,
        achievements: [...prev.achievements, "Expert em Provas"],
      }))

      setLatestAchievement("Expert em Provas: Acertar 3 perguntas sobre provas")
      setAchievementAnimation(true)

      toast({
        title: "Conquista Desbloqueada!",
        description: "Expert em Provas: Acertar 3 perguntas sobre provas",
        variant: "default",
      })
    }

    // Check for "Mestre do Conhecimento" achievement
    if (
      Math.floor((gameStats.score + (isCorrect ? 100 : 0)) / 1000) + 1 >= 3 &&
      !gameStats.achievements.includes("Mestre do Conhecimento")
    ) {
      setGameStats((prev) => ({
        ...prev,
        achievements: [...prev.achievements, "Mestre do Conhecimento"],
      }))

      setLatestAchievement("Mestre do Conhecimento: Alcançar nível 3")
      setAchievementAnimation(true)

      toast({
        title: "Conquista Desbloqueada!",
        description: "Mestre do Conhecimento: Alcançar nível 3",
        variant: "default",
      })
    }

    // Check for "Pontuação Máxima" achievement
    if (gameStats.score + (isCorrect ? 100 : 0) >= 1000 && !gameStats.achievements.includes("Pontuação Máxima")) {
      setGameStats((prev) => ({
        ...prev,
        achievements: [...prev.achievements, "Pontuação Máxima"],
      }))

      setLatestAchievement("Pontuação Máxima: Alcançar 1000 pontos")
      setAchievementAnimation(true)

      toast({
        title: "Conquista Desbloqueada!",
        description: "Pontuação Máxima: Alcançar 1000 pontos",
        variant: "default",
      })
    }
  }

  const formatDifficulty = (difficulty: string) => {
    const formats: { [key: string]: string } = {
      facil: "Fácil",
      medio: "Médio",
      dificil: "Difícil",
    }
    return formats[difficulty] || difficulty
  }

  // Sample questions for fallback
  const getSampleQuestions = () => {
    return [
      {
        enunciado: "Qual é a prova que dá acesso às universidades brasileiras?",
        alternativas: ["ENEM", "OAB", "ENCCEJA", "Vestibular"],
        respostaCorreta: 0,
        tema: "Provas",
        explicacao:
          "O ENEM (Exame Nacional do Ensino Médio) é a principal porta de entrada para as universidades brasileiras, tanto públicas quanto privadas.",
      },
      {
        enunciado: "O que significa a sigla ENEM?",
        alternativas: [
          "Exame Nacional do Ensino Médio",
          "Exame Nacional de Educação Média",
          "Exame Nacional para Entrada na Universidade",
          "Exame Nacional de Escolas Médias",
        ],
        respostaCorreta: 0,
        tema: "Provas",
        explicacao:
          "ENEM significa Exame Nacional do Ensino Médio, criado em 1998 para avaliar o desempenho escolar ao final da educação básica.",
      },
      {
        enunciado: "Qual é a nota máxima possível na redação do ENEM?",
        alternativas: ["900", "1000", "950", "800"],
        respostaCorreta: 1,
        tema: "Provas",
        explicacao: "A redação do ENEM pode chegar a 1000 pontos, sendo avaliada em cinco competências diferentes.",
      },
    ]
  }

  // Add this function inside the component
  const handleQuizComplete = (correctAnswers: number, totalQuestions: number) => {
    const xpEarned = calculateQuizXP(selectedDifficulty, correctAnswers, totalQuestions)

    // Assuming we store the total XP in the gameStats
    const result = levelSystem.addXP(gameStats.score, xpEarned)

    if (result.leveledUp) {
      // Format rewards for the notification
      const formattedRewards = result.rewards.map((reward) => ({
        name: reward.name,
        description: reward.description,
        icon: getRewardIcon(reward.type),
      }))

      setLevelUpData({
        level: result.newLevel,
        rewards: formattedRewards,
      })

      // Show level up notification
      setShowLevelUp(true)
    }

    // Update game stats with new XP and level
    setGameStats((prev) => ({
      ...prev,
      score: result.newTotalXP,
      level: result.newLevel,
    }))

    // Continue with other quiz completion logic
    setActiveTab("resultados")
  }

  // Add this helper function inside the component
  const getRewardIcon = (type: string) => {
    switch (type) {
      case "tema":
        return <Gift className="h-16 w-16 text-blue-400" />
      case "avatar":
        return <Medal className="h-16 w-16 text-purple-400" />
      case "poder":
        return <Sparkles className="h-16 w-16 text-yellow-400" />
      case "medalha":
        return <Medal className="h-16 w-16 text-yellow-400" />
      case "título":
        return <Crown className="h-16 w-16 text-yellow-400" />
      default:
        return <Star className="h-16 w-16 text-blue-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white overflow-hidden">
      <AnimatedStars />

      {/* Achievement animation */}
      <AnimatePresence>
        {achievementAnimation && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => {
              setTimeout(() => setAchievementAnimation(false), 2000)
            }}
          >
            <motion.div
              className="bg-black/70 backdrop-blur-sm p-8 rounded-xl border-2 border-yellow-500 text-center"
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: -100 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, 15, -15, 15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: 1 }}
              >
                🏆
              </motion.div>
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">Conquista Desbloqueada!</h2>
              <p className="text-white text-lg">{latestAchievement}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <GameSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gameStats={gameStats}
        levelSystem={levelSystem}
      />

      {/* Overlay for mobile sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-sm border-b border-blue-900/50 p-4">
          <div className="flex items-center">
            <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="flex items-center">
              <Home className="h-5 w-5 mr-2 text-blue-400" />
              <span className="font-medium">Início</span>
            </Link>
            <h1 className="text-xl font-bold ml-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              {activeTab === "inicio" && "Jogo de Quiz"}
              {activeTab === "quiz" && "Quiz em Andamento"}
              {activeTab === "resultados" && "Resultados do Quiz"}
              {activeTab === "categorias" && "Categorias"}
              {activeTab === "ranking" && "Ranking"}
            </h1>

            <div className="ml-auto flex items-center gap-3">
              <TutorialDialog />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-blue-500/50 hover:bg-blue-900/20"
                    >
                      <HelpCircle className="h-4 w-4 text-blue-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Precisa de ajuda?</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto" ref={gameContainerRef}>
          <AnimatePresence mode="wait">
            {/* Start Screen */}
            {activeTab === "inicio" && (
              <motion.div
                key="inicio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <div className="bg-gray-900/70 backdrop-blur-lg rounded-xl border border-blue-900/50 p-6 md:p-8 shadow-xl">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                      <Play className="h-8 w-8 ml-1" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                      Jogo de Quiz Educacional
                    </h2>
                    <p className="text-gray-300">
                      Prepare-se para suas provas com nossa plataforma interativa de quiz!
                    </p>
                  </div>

                  <div className="relative w-full aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl overflow-hidden mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 animate-pulse flex items-center justify-center">
                        <Play className="h-12 w-12 text-white ml-2" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-center bg-black/30 backdrop-blur-sm p-3 rounded-lg">
                      <p className="text-white font-medium">Teste seus conhecimentos e melhore suas notas!</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="player-name" className="block text-sm font-medium mb-2 flex items-center">
                        <span>Seu Nome</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-2 text-blue-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Digite seu nome para acompanhar seu progresso</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <Input
                        id="player-name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Digite seu nome"
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center">
                        <span>Dificuldade</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-2 text-blue-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Escolha seu nível de dificuldade</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <Button
                          variant={selectedDifficulty === "facil" ? "default" : "outline"}
                          className={
                            selectedDifficulty === "facil"
                              ? "bg-green-600 hover:bg-green-700"
                              : "border-green-700 text-green-400 hover:bg-green-900/20"
                          }
                          onClick={() => setSelectedDifficulty("facil")}
                        >
                          Fácil
                        </Button>
                        <Button
                          variant={selectedDifficulty === "medio" ? "default" : "outline"}
                          className={
                            selectedDifficulty === "medio"
                              ? "bg-yellow-600 hover:bg-yellow-700"
                              : "border-yellow-700 text-yellow-400 hover:bg-yellow-900/20"
                          }
                          onClick={() => setSelectedDifficulty("medio")}
                        >
                          Médio
                        </Button>
                        <Button
                          variant={selectedDifficulty === "dificil" ? "default" : "outline"}
                          className={
                            selectedDifficulty === "dificil"
                              ? "bg-red-600 hover:bg-red-700"
                              : "border-red-700 text-red-400 hover:bg-red-900/20"
                          }
                          onClick={() => setSelectedDifficulty("dificil")}
                        >
                          Difícil
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={startGame}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-6 text-lg font-medium"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Carregando...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-5 w-5" /> Iniciar Quiz
                        </>
                      )}
                    </Button>

                    <div className="text-center text-sm text-gray-400 mt-4">
                      <p>
                        Não sabe como jogar? Confira nosso{" "}
                        <button onClick={() => setShowTutorial(true)} className="text-blue-400 hover:underline">
                          tutorial
                        </button>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quiz Screen */}
            {activeTab === "quiz" && currentQuestion && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <div className="bg-gray-900/70 backdrop-blur-lg rounded-xl border border-blue-900/50 p-6 md:p-8 shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-10 w-10 rounded-full flex items-center justify-center">
                        <span className="font-bold">{playerName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">
                          Jogador: <span className="text-white">{playerName}</span>
                        </p>
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-gray-300">
                            Nível: <span className="text-blue-400">{gameStats.level}</span>
                          </p>
                          <p className="text-sm text-gray-300">
                            Pontuação: <span className="text-purple-400">{gameStats.score}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-right">
                      <p className="text-gray-300">
                        Questão <span className="text-white">{currentQuestionIndex + 1}</span> de{" "}
                        <span className="text-white">{questions.length}</span>
                      </p>
                      <p className="text-gray-300">
                        Tema: <span className="text-blue-400">{currentQuestion.tema}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <Progress
                      value={progress}
                      className="h-2 bg-gray-800"
                      indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-blue-400" />
                        <span className="text-sm text-gray-300">
                          Tema: <span className="text-blue-400">{currentQuestion.tema}</span>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <BarChart className="h-4 w-4 mr-2 text-purple-400" />
                        <span className="text-sm text-gray-300">
                          Dificuldade: <span className="text-purple-400">{formatDifficulty(selectedDifficulty)}</span>
                        </span>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-medium mb-6 text-center p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-900/50">
                        {currentQuestion.enunciado}
                      </h3>
                    </motion.div>

                    <div className="space-y-3 mt-6">
                      {currentQuestion.alternativas.map((option: string, index: number) => (
                        <motion.button
                          key={index}
                          onClick={() => !showFeedback && handleAnswerSelection(index)}
                          disabled={showFeedback}
                          className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex items-center ${
                            selectedAnswer === index
                              ? index === currentQuestion.respostaCorreta
                                ? "bg-green-900/30 border border-green-500"
                                : "bg-red-900/30 border border-red-500"
                              : "bg-gray-800/50 border border-gray-700 hover:border-blue-500"
                          }`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={!showFeedback ? { scale: 1.02, x: 5 } : {}}
                        >
                          {showFeedback && index === currentQuestion.respostaCorreta && (
                            <CheckCircle className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                          )}
                          {showFeedback && selectedAnswer === index && index !== currentQuestion.respostaCorreta && (
                            <XCircle className="h-5 w-5 mr-3 text-red-500 flex-shrink-0" />
                          )}
                          {(!showFeedback ||
                            (showFeedback &&
                              selectedAnswer !== index &&
                              index !== currentQuestion.respostaCorreta)) && (
                            <div className="h-5 w-5 mr-3 rounded-full border border-gray-600 flex-shrink-0"></div>
                          )}
                          <span>{option}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg mb-6 ${
                        selectedAnswer === currentQuestion.respostaCorreta
                          ? "bg-green-900/20 border-l-4 border-green-500"
                          : "bg-red-900/20 border-l-4 border-red-500"
                      }`}
                    >
                      <div className="flex items-start">
                        {selectedAnswer === currentQuestion.respostaCorreta ? (
                          <CheckCircle className="h-6 w-6 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-6 w-6 mr-3 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium mb-1">
                            {selectedAnswer === currentQuestion.respostaCorreta ? "Correto!" : "Incorreto!"}
                          </p>
                          <p className="text-gray-300">{currentQuestion.explicacao}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-between">
                    <Button
                      disabled={currentQuestionIndex === 0}
                      variant="outline"
                      className="border-gray-700 text-gray-300"
                    >
                      Anterior
                    </Button>
                    <Button
                      onClick={nextQuestion}
                      disabled={!showFeedback}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {currentQuestionIndex < questions.length - 1 ? (
                        <>
                          Próxima <ChevronRight className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        "Finalizar Quiz"
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results Screen */}
            {activeTab === "resultados" && (
              <motion.div
                key="resultados"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-gray-900/70 backdrop-blur-lg rounded-xl border border-blue-900/50 p-6 md:p-8 shadow-xl">
                  <div className="text-center mb-8">
                    <motion.div
                      className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                    >
                      <Trophy className="h-10 w-10" />
                    </motion.div>
                    <motion.h2
                      className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Quiz Concluído!
                    </motion.h2>
                    <motion.p
                      className="text-gray-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Ótimo trabalho, {playerName}! Veja como você se saiu:
                    </motion.p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      {
                        icon: <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />,
                        value: gameStats.score,
                        label: "Pontuação Final",
                        color: "text-yellow-400",
                      },
                      {
                        icon: <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-500" />,
                        value: gameStats.correctAnswers,
                        label: "Respostas Corretas",
                        color: "text-green-400",
                      },
                      {
                        icon: <XCircle className="h-6 w-6 mx-auto mb-2 text-red-500" />,
                        value: gameStats.wrongAnswers,
                        label: "Respostas Erradas",
                        color: "text-red-400",
                      },
                      {
                        icon: <Award className="h-6 w-6 mx-auto mb-2 text-blue-500" />,
                        value: gameStats.level,
                        label: "Nível Alcançado",
                        color: "text-blue-400",
                      },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        className="bg-gray-800/50 p-4 rounded-lg text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {stat.icon}
                        <motion.div
                          className={`text-2xl font-bold ${stat.color} mb-1`}
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.5 + index * 0.1,
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                          }}
                        >
                          {stat.value}
                        </motion.div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {gameStats.achievements.length > 0 && (
                    <motion.div
                      className="mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="text-xl font-medium mb-4 flex items-center">
                        <Trophy className="mr-2 h-5 w-5 text-yellow-500" /> Conquistas Desbloqueadas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gameStats.achievements.map((achievement, index) => (
                          <motion.div
                            key={index}
                            className="bg-gray-800/50 p-4 rounded-lg flex items-center gap-4 border border-yellow-900/50"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                          >
                            <div className="h-12 w-12 rounded-full bg-yellow-900/30 flex items-center justify-center">
                              <Award className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div>
                              <h4 className="font-medium">{achievement}</h4>
                              <p className="text-sm text-gray-400">
                                {achievement === "Iniciante" && "Acertar 2 perguntas"}
                                {achievement === "Expert em Provas" && "Acertar 3 perguntas sobre provas"}
                                {achievement === "Sem Erros" && "Responder 3 perguntas seguidas sem errar"}
                                {achievement === "Mestre do Conhecimento" && "Alcançar nível 3"}
                                {achievement === "Pontuação Máxima" && "Alcançar 1000 pontos"}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {gameStats.wrongAnswers > 0 && (
                    <motion.div
                      className="mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h3 className="text-xl font-medium mb-4 flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-blue-500" /> Oportunidades de Aprendizado
                      </h3>
                      <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-4">
                        <p className="text-gray-300 mb-4">Revise estes tópicos para melhorar seu conhecimento:</p>
                        <ul className="space-y-2">
                          {gameStats.answeredIncorrectly.slice(0, 3).map((q, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="h-6 w-6 rounded-full bg-red-900/30 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                                {idx + 1}
                              </div>
                              <div>
                                <p className="font-medium">{q.enunciado}</p>
                                <p className="text-sm text-gray-400 mt-1">{q.explicacao}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <Button
                      onClick={restartGame}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-6"
                      size="lg"
                    >
                      <RefreshCw className="mr-2 h-5 w-5" /> Jogar Novamente
                    </Button>
                    <Link href="/">
                      <Button variant="outline" className="border-gray-700 py-6" size="lg">
                        <Home className="mr-2 h-5 w-5" /> Voltar para Início
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Categories Screen */}
            {activeTab === "categorias" && (
              <motion.div
                key="categorias"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-gray-900/70 backdrop-blur-lg rounded-xl border border-blue-900/50 p-6 md:p-8 shadow-xl">
                  <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    Categorias de Quiz
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl border border-blue-900/50 p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="h-16 w-16 rounded-full bg-blue-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="h-8 w-8 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">ENEM</h3>
                      <p className="text-gray-300 mb-4">
                        Questões relacionadas ao Exame Nacional do Ensino Médio para admissão universitária.
                      </p>
                      <Button variant="outline" className="w-full border-blue-700 text-blue-400 hover:bg-blue-900/20">
                        Explorar Questões do ENEM
                      </Button>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl border border-purple-900/50 p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="h-16 w-16 rounded-full bg-purple-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="h-8 w-8 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Cursos Universitários</h3>
                      <p className="text-gray-300 mb-4">
                        Aprenda sobre diferentes cursos universitários e suas características.
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-purple-700 text-purple-400 hover:bg-purple-900/20"
                      >
                        Explorar Cursos
                      </Button>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/30 rounded-xl border border-cyan-900/50 p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/20 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="h-16 w-16 rounded-full bg-cyan-900/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="h-8 w-8 text-cyan-400" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Universidades</h3>
                      <p className="text-gray-300 mb-4">
                        Informações sobre universidades e seus processos de admissão.
                      </p>
                      <Button variant="outline" className="w-full border-cyan-700 text-cyan-400 hover:bg-cyan-900/20">
                        Explorar Universidades
                      </Button>
                    </motion.div>
                  </div>

                  <motion.div
                    className="mt-8 bg-blue-900/20 p-6 rounded-lg border border-blue-900/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-xl font-medium mb-4">Tópicos Populares</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button variant="outline" className="border-blue-700 text-blue-400 hover:bg-blue-900/20">
                        Matemática
                      </Button>
                      <Button variant="outline" className="border-purple-700 text-purple-400 hover:bg-purple-900/20">
                        Física
                      </Button>
                      <Button variant="outline" className="border-green-700 text-green-400 hover:bg-green-900/20">
                        Biologia
                      </Button>
                      <Button variant="outline" className="border-yellow-700 text-yellow-400 hover:bg-yellow-900/20">
                        Química
                      </Button>
                      <Button variant="outline" className="border-red-700 text-red-400 hover:bg-red-900/20">
                        História
                      </Button>
                      <Button variant="outline" className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/20">
                        Geografia
                      </Button>
                      <Button variant="outline" className="border-pink-700 text-pink-400 hover:bg-pink-900/20">
                        Literatura
                      </Button>
                      <Button variant="outline" className="border-orange-700 text-orange-400 hover:bg-orange-900/20">
                        Línguas
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <>
        {/* Add the level progress component to the game UI */}
        <div className="mb-6">
          <LevelProgress
            currentLevel={gameStats.level}
            currentXP={gameStats.score % levelSystem.getXPForLevel(gameStats.level)}
            xpForNextLevel={levelSystem.getXPForLevel(gameStats.level)}
          />
        </div>

        {/* Add the level up notification */}
        <LevelUpNotification
          show={showLevelUp}
          onClose={() => setShowLevelUp(false)}
          level={levelUpData.level}
          rewards={levelUpData.rewards}
        />
      </>
    </div>
  )
}
