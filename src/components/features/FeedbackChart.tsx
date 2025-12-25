import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardTitle } from '@ui/Card.component'
import Progress from '@ui/Progress.component'

const FeedbackChart: React.FC = () => {
  // Başlangıç değerleri (Backend gelene kadar placeholder)
  const [stats, setStats] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // BURASI İLERİDE SERVİSE BAĞLANACAK
    // Örn: const data = await analyticsService.getFeedbackStats();
    const fetchStats = async () => {
      try {
        // Sahte bir yükleme süresi (Backend varmış gibi)
        await new Promise((resolve) => setTimeout(resolve, 800))

        setStats({
          positive: 75,
          negative: 15,
          neutral: 10,
        })
      } catch (error) {
        console.error('Feedback verisi alınamadı', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // SVG Çember Hesaplaması (r=56 için Çevre ≈ 351)
  const circleCircumference = 351
  const strokeDashoffset = circleCircumference - (circleCircumference * stats.positive) / 100

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center p-6 text-gray-400">
        Loading analytics...
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <CardTitle className="mb-6">Feedback & Rate</CardTitle>

        <div className="flex items-center gap-6">
          {/* SVG Circular Chart (Dinamik) */}
          <div className="relative h-32 w-32 flex-shrink-0">
            <svg className="h-full w-full -rotate-90 transform transition-all duration-1000 ease-out">
              {/* Arka plan gri çember */}
              <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
              {/* Doluluk oranı (Yeşil) */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#22c55e"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">%{stats.positive}</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-500">Positive Feedbacks</span>
                <span className="font-bold text-green-600">{stats.positive}%</span>
              </div>
              <Progress value={stats.positive} color="bg-green-500" />
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-500">Negative Feedbacks</span>
                <span className="font-bold text-red-600">{stats.negative}%</span>
              </div>
              <Progress value={stats.negative} color="bg-red-500" />
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-gray-500">Neutral Feedbacks</span>
                <span className="font-bold text-gray-400">{stats.neutral}%</span>
              </div>
              <Progress value={stats.neutral} color="bg-gray-300" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FeedbackChart