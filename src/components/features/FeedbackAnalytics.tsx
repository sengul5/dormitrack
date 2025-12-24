import React from 'react'
import { Star, TrendingUp, ThumbsUp, MessageCircle, User, Activity } from 'lucide-react'
import { Card, CardTitle } from '@ui/Card.component'
import Progress from '@ui/Progress.component'
import Avatar from '@ui/Avatar.component'

const FeedbackAnalytics: React.FC = () => {
  const stats = { avgRating: 4.8, totalReviews: 124, helpfulRate: 92 }

  const categories = [
    { name: 'Wifi & Internet', score: 2.4, count: 45, color: 'bg-red-500' },
    { name: 'Cleaning Services', score: 4.9, count: 30, color: 'bg-green-500' },
    { name: 'Technical Repairs', score: 4.2, count: 28, color: 'bg-blue-500' },
    { name: 'Security', score: 4.7, count: 21, color: 'bg-purple-500' },
  ]

  const reviews = [
    {
      id: 1,
      name: 'Alice Wonderland',
      date: '2 hours ago',
      rating: 5,
      comment: 'Technical team was very fast!',
      category: 'Repair',
    },
    {
      id: 2,
      name: 'John Wick',
      date: '5 hours ago',
      rating: 1,
      comment: 'Internet is still very slow.',
      category: 'Wifi',
    },
    {
      id: 3,
      name: 'Bruce Wayne',
      date: '1 day ago',
      rating: 5,
      comment: 'Security staff is very polite.',
      category: 'Security',
    },
  ]

  return (
    <div className="space-y-8">
      {/* 1. TOP STATS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Average Satisfaction"
          value={stats.avgRating}
          icon={Star}
          color="yellow"
          footer={
            <div className="mt-2 flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(stats.avgRating) ? 'currentColor' : 'none'}
                  className={i < Math.floor(stats.avgRating) ? '' : 'text-gray-300'}
                />
              ))}
            </div>
          }
        />
        <StatsCard
          title="Resolution Effectiveness"
          value={`%${stats.helpfulRate}`}
          icon={ThumbsUp}
          color="green"
          footer={
            <p className="mt-2 flex items-center gap-1 text-sm font-bold text-green-600">
              <TrendingUp size={16} /> +4.2% this week
            </p>
          }
        />
        <StatsCard
          title="Total Feedbacks"
          value={stats.totalReviews}
          icon={MessageCircle}
          color="blue"
          footer={<p className="mt-2 text-sm text-gray-400">Last 30 days</p>}
        />
      </div>

      {/* 2. MAIN SECTION */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* CATEGORY PERFORMANCE */}
        <Card className="p-8">
          <CardTitle icon={Activity} className="mb-6">
            Category Performance
          </CardTitle>
          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat.name}>
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-sm font-bold text-gray-700">{cat.name}</span>
                  <div className="text-right">
                    <span
                      className={`text-lg font-bold ${cat.score < 3 ? 'text-red-500' : 'text-gray-800'}`}
                    >
                      {cat.score}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">/ 5.0</span>
                  </div>
                </div>
                <Progress value={(cat.score / 5) * 100} color={cat.color} height="h-3" />
                <p className="mt-1 text-right text-xs text-gray-400">{cat.count} reviews</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="text-sm font-bold text-blue-800">AI Insight</h4>
              <p className="mt-1 text-xs text-blue-700">
                Students are consistently complaining about <strong>Wifi Speed</strong>. Consider
                upgrading the bandwidth in Block A.
              </p>
            </div>
          </div>
        </Card>

        {/* RECENT COMMENTS */}
        <Card className="flex flex-col p-8">
          <div className="mb-6 flex items-center justify-between">
            <CardTitle icon={MessageCircle} className="text-purple-600">
              Recent Comments
            </CardTitle>
            <button className="text-sm font-bold text-purple-600 hover:underline">View All</button>
          </div>

          <div className="custom-scrollbar max-h-[400px] flex-1 space-y-4 overflow-y-auto pr-2">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all hover:bg-white hover:shadow-md"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" src="" alt={review.name} className="bg-gray-200" />
                    <div>
                      <h5 className="text-sm font-bold text-gray-800">{review.name}</h5>
                      <span className="rounded border border-gray-100 bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-gray-400">
                        {review.category}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>

                <p className="mb-3 text-sm leading-relaxed text-gray-600">"{review.comment}"</p>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < review.rating ? '#FBBF24' : 'none'}
                      className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Helper Component for Stats
const StatsCard = ({ title, value, icon: Icon, color, footer }: any) => {
  const colors: Record<string, string> = {
    yellow: 'bg-yellow-50 text-yellow-500',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{title}</p>
        <h3 className="mt-2 text-4xl font-bold text-gray-800">{value}</h3>
        {footer}
      </div>
      <div className={`flex h-16 w-16 items-center justify-center rounded-full ${colors[color]}`}>
        <Icon
          size={32}
          fill="currentColor"
          className={color === 'yellow' ? 'text-yellow-500' : ''}
        />
      </div>
    </div>
  )
}

export default FeedbackAnalytics
