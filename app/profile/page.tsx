"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  User,
  Trophy,
  BarChart,
  Settings,
  Star,
  Calendar,
  Clock,
  Gamepad2,
  Medal,
  Crown,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import AnimatedBackground from "@/components/animated-background"
import LevelProgress from "@/components/level-progress"
import RewardsShowcase from "@/components/rewards-showcase"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock user data
  const userData = {
    name: "João Silva",
    level: 4,
    xp: 350,
    xpForNextLevel: 500,
    totalQuizzes: 24,
    correctAnswers: 187,
    wrongAnswers: 53,
    accuracy: 78,
    totalPlayTime: "42h",
    joinDate: "15/03/2023",
    achievements: [
      { name: "Iniciante", description: "Complete seu primeiro quiz", date: "16/03/2023" },
      { name: "Em Sequência", description: "Acerte 5 questões seguidas", date: "20/03/2023" },
      { name: "Maratonista", description: "Complete 10 quizzes", date: "05/04/2023" },
    ],
    recentQuizzes: [
      { title: "ENEM Matemática", score: 85, date: "2 dias atrás" },
      { title: "Física Mecânica", score: 73, date: "4 dias atrás" },
      { title: "Química Orgânica", score: 92, date: "1 semana atrás" },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-blue-950 text-white">
      <AnimatedBackground />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center">
            <Home className="h-5 w-5 mr-2 text-blue-400" />
            <span className="font-medium">Voltar para Início</span>
          </Link>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Perfil do Jogador
          </h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-950">
              <Settings className="h-4 w-4 mr-2" /> Configurações
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/70 backdrop-blur-sm border border-blue-900/50 rounded-lg p-6 sticky top-8">
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold">JS</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-1">
                    <Crown className="h-5 w-5 text-yellow-300" />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
                <div className="flex items-center">
                  <Badge className="bg-blue-600 mr-2">Nível {userData.level}</Badge>
                  <Badge className="bg-purple-600">Intermediário</Badge>
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <button
                  className={`flex items-center w-full p-2 rounded-lg ${
                    activeTab === "overview" ? "bg-blue-900/30 text-blue-400" : "hover:bg-gray-800 transition-colors"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  <User className="h-4 w-4 mr-3" />
                  <span>Visão Geral</span>
                </button>
                <button
                  className={`flex items-center w-full p-2 rounded-lg ${
                    activeTab === "stats" ? "bg-blue-900/30 text-blue-400" : "hover:bg-gray-800 transition-colors"
                  }`}
                  onClick={() => setActiveTab("stats")}
                >
                  <BarChart className="h-4 w-4 mr-3" />
                  <span>Estatísticas</span>
                </button>
                <button
                  className={`flex items-center w-full p-2 rounded-lg ${
                    activeTab === "achievements"
                      ? "bg-blue-900/30 text-blue-400"
                      : "hover:bg-gray-800 transition-colors"
                  }`}
                  onClick={() => setActiveTab("achievements")}
                >
                  <Trophy className="h-4 w-4 mr-3" />
                  <span>Conquistas</span>
                </button>
                <button
                  className={`flex items-center w-full p-2 rounded-lg ${
                    activeTab === "rewards" ? "bg-blue-900/30 text-blue-400" : "hover:bg-gray-800 transition-colors"
                  }`}
                  onClick={() => setActiveTab("rewards")}
                >
                  <Star className="h-4 w-4 mr-3" />
                  <span>Recompensas</span>
                </button>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <div className="text-sm text-gray-400 mb-2">Informações da Conta</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Membro desde: {userData.joinDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Tempo de jogo: {userData.totalPlayTime}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/game">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Gamepad2 className="mr-2 h-4 w-4" /> Jogar Agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <LevelProgress
              currentLevel={userData.level}
              currentXP={userData.xp}
              xpForNextLevel={userData.xpForNextLevel}
              showDetails={true}
            />

            <div className="mt-6">
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-gray-900/70 border-blue-900/50">
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="mr-4 rounded-full bg-blue-900/30 p-2">
                            <Gamepad2 className="h-6 w-6 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-3xl font-bold">{userData.totalQuizzes}</div>
                            <div className="text-xs text-gray-400">Quizzes Completados</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/70 border-blue-900/50">
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="mr-4 rounded-full bg-purple-900/30 p-2">
                            <Star className="h-6 w-6 text-purple-400" />
                          </div>
                          <div>
                            <div className="text-3xl font-bold">{userData.accuracy}%</div>
                            <div className="text-xs text-gray-400">Taxa de Acerto</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/70 border-blue-900/50">
                      <CardContent className="p-6">
                        <div className="flex items-center">
                          <div className="mr-4 rounded-full bg-cyan-900/30 p-2">
                            <Trophy className="h-6 w-6 text-cyan-400" />
                          </div>
                          <div>
                            <div className="text-3xl font-bold">{userData.achievements.length}</div>
                            <div className="text-xs text-gray-400">Conquistas</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-900/70 border-blue-900/50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Trophy className="h-5 w-5 mr-2 text-yellow-400" /> Conquistas Recentes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {userData.achievements.slice(0, 3).map((achievement, index) => (
                            <div
                              key={index}
                              className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-lg font-bold mr-3">
                                <Medal className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{achievement.name}</h3>
                                <p className="text-xs text-gray-400">
                                  {achievement.description} • {achievement.date}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full border-blue-700 text-blue-400 hover:bg-blue-900/20"
                          onClick={() => setActiveTab("achievements")}
                        >
                          Ver Todas as Conquistas
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card className="bg-gray-900/70 border-blue-900/50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Gamepad2 className="h-5 w-5 mr-2 text-blue-400" /> Quizzes Recentes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {userData.recentQuizzes.map((quiz, index) => (
                            <div
                              key={index}
                              className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-lg font-bold mr-3">
                                {quiz.score}%
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{quiz.title}</h3>
                                <p className="text-xs text-gray-400">{quiz.date}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                              >
                                Revisar
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href="/game" className="w-full">
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Jogar Novo Quiz
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === "stats" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gray-900/70 border-blue-900/50 mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <BarChart className="h-5 w-5 mr-2 text-blue-400" /> Estatísticas Detalhadas
                      </CardTitle>
                      <CardDescription>Seu desempenho detalhado em números</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-800/70 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-blue-400">{userData.totalQuizzes}</div>
                          <div className="text-xs text-gray-400">Quizzes Completados</div>
                        </div>
                        <div className="bg-gray-800/70 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-green-400">{userData.correctAnswers}</div>
                          <div className="text-xs text-gray-400">Respostas Corretas</div>
                        </div>
                        <div className="bg-gray-800/70 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-red-400">{userData.wrongAnswers}</div>
                          <div className="text-xs text-gray-400">Respostas Incorretas</div>
                        </div>
                        <div className="bg-gray-800/70 p-4 rounded-lg text-center">
                          <div className="text-3xl font-bold text-purple-400">{userData.accuracy}%</div>
                          <div className="text-xs text-gray-400">Taxa de Acerto</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Matemática</span>
                            <span className="text-blue-400">Avançado</span>
                          </div>
                          <Progress value={85} className="h-2 bg-gray-800" indicatorClassName="bg-blue-600" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Física</span>
                            <span className="text-yellow-400">Intermediário</span>
                          </div>
                          <Progress value={60} className="h-2 bg-gray-800" indicatorClassName="bg-yellow-600" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Química</span>
                            <span className="text-green-400">Intermediário</span>
                          </div>
                          <Progress value={65} className="h-2 bg-gray-800" indicatorClassName="bg-green-600" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Biologia</span>
                            <span className="text-red-400">Iniciante</span>
                          </div>
                          <Progress value={30} className="h-2 bg-gray-800" indicatorClassName="bg-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900/70 border-blue-900/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-400" /> Histórico de Atividade
                      </CardTitle>
                      <CardDescription>Seu progresso ao longo do tempo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-gray-800/50 rounded-lg border border-gray-700/50 mb-4">
                        <div className="text-center p-6">
                          <BarChart className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                          <p className="text-gray-400">Gráfico de atividade ao longo do tempo</p>
                          <p className="text-xs text-gray-500">Mostrando dados dos últimos 30 dias</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-800/70 p-4 rounded-lg text-center">
                          <div className="text-xl font-bold text-blue-400">42h</div>
                          <div className="text-xs text-gray-400">Tempo Total de Jogo</div>
                        </div>
                        <div className="bg-gray-800/70 p-4 rounded-lg text-center">
                          <div className="text-xl font-bold text-purple-400">18</div>
                          <div className="text-xs text-gray-400">Dias Consecutivos</div>
                        </div>
                        <div className="bg-gray-800/70 p-4 rounded-lg text-center">
                          <div className="text-xl font-bold text-green-400">+15%</div>
                          <div className="text-xs text-gray-400">Melhoria na Taxa de Acerto</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "achievements" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gray-900/70 border-blue-900/50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-yellow-400" /> Conquistas
                      </CardTitle>
                      <CardDescription>Suas conquistas desbloqueadas e em progresso</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="unlocked">
                        <TabsList className="grid grid-cols-3 mb-4">
                          <TabsTrigger value="unlocked">Desbloqueadas (3)</TabsTrigger>
                          <TabsTrigger value="progress">Em Progresso (5)</TabsTrigger>
                          <TabsTrigger value="all">Todas (20)</TabsTrigger>
                        </TabsList>

                        <TabsContent value="unlocked" className="mt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userData.achievements.map((achievement, index) => (
                              <div
                                key={index}
                                className="bg-gray-800/70 p-4 rounded-lg border border-blue-900/50 flex items-center"
                              >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mr-4">
                                  <Medal className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{achievement.name}</h3>
                                  <p className="text-xs text-gray-400">
                                    {achievement.description} • {achievement.date}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="progress" className="mt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700/50 flex items-center">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mr-4">
                                <Star className="h-6 w-6 text-gray-500" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">Especialista</h3>
                                <p className="text-xs text-gray-400 mb-2">Acerte 50 questões em uma única categoria</p>
                                <Progress value={70} className="h-1.5 bg-gray-700" indicatorClassName="bg-blue-600" />
                                <p className="text-xs text-gray-500 mt-1">35/50 questões</p>
                              </div>
                            </div>

                            <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700/50 flex items-center">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mr-4">
                                <Sparkles className="h-6 w-6 text-gray-500" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">Perfeccionista</h3>
                                <p className="text-xs text-gray-400 mb-2">Complete um quiz com 100% de acerto</p>
                                <Progress value={92} className="h-1.5 bg-gray-700" indicatorClassName="bg-blue-600" />
                                <p className="text-xs text-gray-500 mt-1">Melhor pontuação: 92%</p>
                              </div>
                            </div>

                            <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700/50 flex items-center">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center mr-4">
                                <Clock className="h-6 w-6 text-gray-500" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">Dedicado</h3>
                                <p className="text-xs text-gray-400 mb-2">Jogue por 50 horas no total</p>
                                <Progress value={84} className="h-1.5 bg-gray-700" indicatorClassName="bg-blue-600" />
                                <p className="text-xs text-gray-500 mt-1">42/50 horas</p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="all" className="mt-0">
                          <div className="text-center p-8 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                            <h3 className="text-lg font-medium mb-2">Todas as Conquistas</h3>
                            <p className="text-gray-400 mb-4">
                              Existem 20 conquistas para você desbloquear neste jogo!
                            </p>
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                              Ver Lista Completa
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "rewards" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <RewardsShowcase />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
