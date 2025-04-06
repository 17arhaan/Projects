"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeProvider } from "@/components/theme-provider"
import { GraduationCap, MapPin, Mail, Code, Brain, Briefcase, Github, Linkedin } from "lucide-react"

export default function AboutPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-neutral-900 to-black p-4 sm:p-6 md:p-8 dark">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <Card className="border-neutral-800 bg-neutral-950 text-white overflow-hidden shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col items-center">
                {/* Profile Image */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-32 h-32 rounded-full overflow-hidden border-4 border-neutral-700 mb-6"
                >
                  <img
                    src="/pfp.png?height=128&width=128"
                    alt="Arhaan Girdhar"
                    className="w-full h-full object-cover bg-neutral-800"
                  />
                </motion.div>

                {/* Name and Title */}
                <motion.h1
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-center mb-2"
                >
                  Arhaan Girdhar
                </motion.h1>

                <motion.h2
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-xl text-neutral-400 text-center mb-6"
                >
                  Software Engineer & AI Enthusiast
                </motion.h2>

                {/* Bio */}
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-neutral-300 text-center max-w-xl mb-10"
                >
                  A passionate developer with a strong foundation in software engineering and a keen interest in
                  artificial intelligence.
                </motion.p>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="bg-neutral-900 rounded-xl p-4 border border-neutral-800"
                  >
                    <div className="flex items-center mb-2">
                      <GraduationCap className="w-5 h-5 mr-2 text-purple-400" />
                      <h3 className="font-medium">Education</h3>
                    </div>
                    <p className="text-sm text-neutral-400">B.Tech in Computer Science</p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className="bg-neutral-900 rounded-xl p-4 border border-neutral-800"
                  >
                    <div className="flex items-center mb-2">
                      <MapPin className="w-5 h-5 mr-2 text-purple-400" />
                      <h3 className="font-medium">Location</h3>
                    </div>
                    <p className="text-sm text-neutral-400">Noida, India</p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                    className="bg-neutral-900 rounded-xl p-4 border border-neutral-800"
                  >
                    <div className="flex items-center mb-2">
                      <Mail className="w-5 h-5 mr-2 text-purple-400" />
                      <h3 className="font-medium">Contact</h3>
                    </div>
                    <a href="mailto:17arhaan.connect@gmail.com" className="text-sm text-purple-400 hover:underline">
                      17arhaan.connect@gmail.com
                    </a>
                  </motion.div>
                </div>

                {/* Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="bg-neutral-900 rounded-xl p-5 border border-neutral-800"
                  >
                    <div className="flex items-center mb-3">
                      <Code className="w-6 h-6 mr-2 text-purple-400" />
                      <h3 className="font-medium text-lg">AI & ML</h3>
                    </div>
                    <p className="text-sm text-neutral-400">
                      Deep expertise in machine learning, natural language processing, and artificial intelligence
                      applications.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                    className="bg-neutral-900 rounded-xl p-5 border border-neutral-800"
                  >
                    <div className="flex items-center mb-3">
                      <Brain className="w-6 h-6 mr-2 text-purple-400" />
                      <h3 className="font-medium text-lg">Problem Solving</h3>
                    </div>
                    <p className="text-sm text-neutral-400">
                      Strong analytical and problem-solving skills with a track record of delivering innovative
                      solutions.
                    </p>
                  </motion.div>
                </div>

                {/* Featured Projects */}
                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  className="text-xl font-semibold mb-4 flex items-center"
                >
                  <Briefcase className="w-5 h-5 mr-2 text-purple-400" />
                  Featured Projects
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="bg-neutral-900 rounded-xl p-5 border border-neutral-800"
                  >
                    <h4 className="font-medium text-lg mb-2">Twitter Sentiment Analysis</h4>
                    <p className="text-sm text-neutral-400 mb-3">
                      Real-time sentiment analysis of tweets using NLP and Twitter API.
                    </p>
                    <Link href="https://sentiment-analysis-sepia.vercel.app/" className="text-xs text-purple-400 hover:underline">
                      View Project →
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                    className="bg-neutral-900 rounded-xl p-5 border border-neutral-800"
                  >
                    <h4 className="font-medium text-lg mb-2">Personal Portfolio</h4>
                    <p className="text-sm text-neutral-400 mb-3">Modern portfolio showcasing my projects and skills.</p>
                    <Link href="https://www.arhaanportfolio.in" className="text-xs text-purple-400 hover:underline">
                      View Project →
                    </Link>
                  </motion.div>
                </div>

                {/* Social Links */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                  className="flex justify-center space-x-4 mb-6"
                >
                  <a
                    href="https://github.com/17arhaan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-800 hover:bg-neutral-700 transition-colors p-3 rounded-full"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/arhaan17/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-800 hover:bg-neutral-700 transition-colors p-3 rounded-full"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="mailto:17arhaan.connect@gmail.com"
                    className="bg-neutral-800 hover:bg-neutral-700 transition-colors p-3 rounded-full"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </motion.div>

                {/* Back to Home */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                >
                  <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
                    ← Back to Speedy
                  </Link>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ThemeProvider>
  )
}

