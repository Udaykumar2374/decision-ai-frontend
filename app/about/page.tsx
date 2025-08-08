"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Get structured, thoughtful analysis of your decisions using advanced AI.",
    },
    {
      icon: Target,
      title: "Clear Framework",
      description: "Break down complex decisions into manageable, actionable components.",
    },
    {
      icon: Users,
      title: "For Everyone",
      description: "Whether you're a student, professional, or entrepreneur - we've got you covered.",
    },
    {
      icon: Zap,
      title: "Quick & Efficient",
      description: "Get insights in minutes, not hours. Make better decisions faster.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="text-6xl mb-6">🧠</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Decidely</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe that better decisions lead to better outcomes. Decidely helps you think clearly and
            systematically about the choices that matter most.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="h-full shadow-lg border-0">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to make better decisions?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Join thousands of users who are already making smarter choices with Decidely.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/dashboard">Get Started Free</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/faq">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
