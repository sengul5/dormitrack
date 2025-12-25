import React from 'react'
import { Card, CardContent, CardTitle } from '@ui/Card.component'
import Progress from '@ui/Progress.component'

const FeedbackChart: React.FC = () => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <CardTitle className="mb-6">Feedback & Rate</CardTitle>

        <div className="flex items-center gap-6">
          {/* SVG Circular Chart (Custom Component olarak kalabilir) */}
          <div className="relative h-32 w-32 flex-shrink-0">
            <svg className="h-full w-full -rotate-90 transform">
              <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#22c55e"
                strokeWidth="12"
                fill="none"
                strokeDasharray="351"
                strokeDashoffset="105" // 351 * (1 - 0.70)
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">%70</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-500">Positive Feedbacks</span>
                <span className="font-bold text-green-600">70%</span>
              </div>
              <Progress value={70} color="bg-green-500" />
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-500">Negative Feedbacks</span>
                <span className="font-bold text-red-600">20%</span>
              </div>
              <Progress value={20} color="bg-red-500" />
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-500">Neutral Feedbacks</span>
                <span className="font-bold text-gray-400">10%</span>
              </div>
              <Progress value={10} color="bg-gray-300" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FeedbackChart
