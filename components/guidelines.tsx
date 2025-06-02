import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Heart, Users, Shield, MessageCircle } from "lucide-react"

const guidelines = [
  {
    category: "Respect & Kindness",
    icon: Heart,
    color: "text-red-500",
    rules: [
      {
        type: "do",
        text: "Treat all community members with respect and kindness",
      },
      {
        type: "do",
        text: "Be patient with learners and beginners",
      },
      {
        type: "dont",
        text: "Use offensive language or discriminatory remarks",
      },
      {
        type: "dont",
        text: "Harass or bully other members",
      },
    ],
  },
  {
    category: "Skill Sharing",
    icon: Users,
    color: "text-blue-500",
    rules: [
      {
        type: "do",
        text: "Be honest about your skill level and experience",
      },
      {
        type: "do",
        text: "Provide constructive feedback and guidance",
      },
      {
        type: "do",
        text: "Follow through on your commitments",
      },
      {
        type: "dont",
        text: "Misrepresent your abilities or qualifications",
      },
      {
        type: "dont",
        text: "Cancel sessions without proper notice",
      },
    ],
  },
  {
    category: "Communication",
    icon: MessageCircle,
    color: "text-green-500",
    rules: [
      {
        type: "do",
        text: "Communicate clearly and professionally",
      },
      {
        type: "do",
        text: "Respond to messages in a timely manner",
      },
      {
        type: "do",
        text: "Use appropriate channels for different types of communication",
      },
      {
        type: "dont",
        text: "Spam or send unsolicited promotional messages",
      },
      {
        type: "dont",
        text: "Share personal contact information publicly",
      },
    ],
  },
  {
    category: "Safety & Security",
    icon: Shield,
    color: "text-purple-500",
    rules: [
      {
        type: "do",
        text: "Meet in public places for in-person sessions",
      },
      {
        type: "do",
        text: "Report suspicious or inappropriate behavior",
      },
      {
        type: "do",
        text: "Protect your personal information",
      },
      {
        type: "dont",
        text: "Share sensitive personal or financial information",
      },
      {
        type: "dont",
        text: "Engage in activities that could be harmful or dangerous",
      },
    ],
  },
]

const consequences = [
  {
    level: "Warning",
    description: "First-time minor violations result in a friendly warning",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    level: "Temporary Suspension",
    description: "Repeated violations or moderate offenses result in temporary account suspension",
    color: "bg-orange-100 text-orange-800",
  },
  {
    level: "Permanent Ban",
    description: "Serious violations or repeated offenses result in permanent account termination",
    color: "bg-red-100 text-red-800",
  },
]

export function Guidelines() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Community Guidelines</h1>
        <p className="text-gray-600">
          Our guidelines help create a safe, respectful, and productive learning environment for everyone.
        </p>
      </div>

      {/* Guidelines by Category */}
      <div className="space-y-6">
        {guidelines.map((category) => {
          const Icon = category.icon
          return (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon className={`h-6 w-6 ${category.color}`} />
                  <span>{category.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Do's */}
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Do's
                    </h4>
                    <ul className="space-y-2">
                      {category.rules
                        .filter((rule) => rule.type === "do")
                        .map((rule, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rule.text}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Don'ts */}
                  <div>
                    <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                      <XCircle className="h-4 w-4 mr-2" />
                      Don'ts
                    </h4>
                    <ul className="space-y-2">
                      {category.rules
                        .filter((rule) => rule.type === "dont")
                        .map((rule, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rule.text}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Reporting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <span>Reporting Violations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            If you encounter behavior that violates our community guidelines, please report it immediately. We take all
            reports seriously and investigate them promptly.
          </p>
          <div className="space-y-2">
            <p className="font-medium">How to report:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Use the report button on posts, messages, or profiles</li>
              <li>Contact our moderation team directly through the help center</li>
              <li>Email us at support@swapandlearn.com for serious violations</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Consequences */}
      <Card>
        <CardHeader>
          <CardTitle>Consequences for Violations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            We believe in fair and proportionate responses to guideline violations. Here's what you can expect:
          </p>
          <div className="space-y-3">
            {consequences.map((consequence, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Badge className={consequence.color}>{consequence.level}</Badge>
                <p className="text-sm text-gray-600">{consequence.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Questions or Concerns?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            If you have questions about our community guidelines or need clarification on any rules, please don't
            hesitate to reach out to our community team. We're here to help create the best possible experience for
            everyone.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
