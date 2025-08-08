"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MessageCircle, Mail, Book, Video, Send } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const helpCategories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of using Decidely",
      articles: [
        "How to create your first decision session",
        "Understanding AI analysis results",
        "Tips for better decision-making",
      ],
    },
    {
      icon: MessageCircle,
      title: "Using the Chat Interface",
      description: "Master the conversation flow",
      articles: ["How to ask better questions", "Providing effective context", "Interpreting structured responses"],
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      articles: ["Decidely Dashboard Overview", "Making Your First Decision", "Advanced Features Walkthrough"],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center mb-8">
            <Button variant="ghost" size="sm" asChild className="mr-4">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Help Categories */}
            <div className="lg:col-span-2 space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-4">How can we help you?</h2>
                <div className="relative max-w-md mx-auto">
                  <Input placeholder="Search help articles..." className="pl-4 pr-10" />
                  <Button size="sm" className="absolute right-1 top-1 h-8 w-8 p-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {helpCategories.map((category, index) => (
                  <motion.div
                    key={category.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <category.icon className="w-6 h-6 mr-3 text-blue-600" />
                          {category.title}
                        </CardTitle>
                        <p className="text-gray-600">{category.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {category.articles.map((article, articleIndex) => (
                            <li key={articleIndex}>
                              <Button variant="ghost" className="w-full justify-start p-2 h-auto text-left">
                                <span className="text-sm text-blue-600 hover:text-blue-800">{article}</span>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h4 className="font-medium mb-2">How does the AI analysis work?</h4>
                      <p className="text-sm text-gray-600">
                        Our AI analyzes your decision question and context to provide structured insights including pros
                        and cons, risk assessment, and actionable recommendations.
                      </p>
                    </div>
                    <div className="border-b pb-4">
                      <h4 className="font-medium mb-2">Can I share my decision sessions?</h4>
                      <p className="text-sm text-gray-600">
                        Yes! You can share any session using the share button in the session menu. This creates a
                        read-only link that others can view.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Is my data secure?</h4>
                      <p className="text-sm text-gray-600">
                        Absolutely. All your decision sessions are encrypted and stored securely. We never share your
                        personal decision data with third parties.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Support */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Describe your issue or question..." rows={4} />
                  </div>
                  <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/about">About Decidely</Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/faq">FAQ</Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Privacy Policy
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    Terms of Service
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2">💡</div>
                    <h3 className="font-semibold mb-2">Need immediate help?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Check out our video tutorials for quick solutions to common questions.
                    </p>
                    <Button size="sm" variant="outline">
                      Watch Tutorials
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
