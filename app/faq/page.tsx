"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Decidely?",
      answer:
        "Decidely is an AI-powered decision-making assistant that helps you think through important choices systematically. It provides structured analysis, considers multiple perspectives, and helps you make more informed decisions.",
    },
    {
      question: "How does the AI analysis work?",
      answer:
        "Our AI analyzes your decision question and context to provide structured insights including pros and cons, risk assessment, timeline considerations, and actionable recommendations. It's designed to complement your thinking, not replace it.",
    },
    {
      question: "Is Decidely free to use?",
      answer:
        "Yes! Decidely is completely free to use. We believe everyone should have access to tools that help them make better decisions.",
    },
    {
      question: "What types of decisions can I get help with?",
      answer:
        "Decidely can help with a wide range of decisions including career choices, investment decisions, relationship matters, business strategies, educational paths, and more. If it's a decision that matters to you, we can help you think through it.",
    },
    {
      question: "How do I get started?",
      answer:
        "Simply sign in with your Google account and start a new decision session. Describe your decision and provide any relevant context, then let our AI help you think through the options.",
    },
    {
      question: "Are my decisions and data private?",
      answer:
        "Absolutely. Your decision sessions are private and secure. We use industry-standard encryption and never share your personal decision data with third parties.",
    },
    {
      question: "Can I save and revisit my decision sessions?",
      answer:
        "Yes! All your decision sessions are automatically saved in your dashboard. You can revisit them anytime to review your analysis or continue the conversation.",
    },
    {
      question: "What makes Decidely different from other decision tools?",
      answer:
        "Decidely combines the conversational ease of chat interfaces with structured decision-making frameworks. It's designed specifically for decision-making, not general AI assistance, making it more focused and effective for this specific use case.",
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Decidely and how it can help you make better decisions.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Collapsible>
                <Card className="shadow-lg border-0">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardTitle className="text-left flex items-center justify-between">
                        {faq.question}
                        <ChevronDown className="w-5 h-5 transition-transform" />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Still have questions?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Can't find what you're looking for? We're here to help you get started.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/dashboard">Try Decidely Now</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
