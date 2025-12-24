import React from 'react'
import { Phone, MessageSquare } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import Avatar from '@ui/Avatar.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'

interface StaffMember {
  id: number
  name: string
  role: string
  status: 'active' | 'busy' | 'offline'
  img: string
}

const AvailableStaff: React.FC = () => {
  const staff: StaffMember[] = [
    {
      id: 1,
      name: 'Carl Max',
      role: 'Cleaner',
      status: 'active',
      img: 'https://i.pravatar.cc/150?u=60',
    },
    {
      id: 2,
      name: 'Necder Zorluer',
      role: 'Cleaner',
      status: 'busy',
      img: 'https://i.pravatar.cc/150?u=61',
    },
    {
      id: 3,
      name: 'Beyza Beyaz',
      role: 'IT&Network',
      status: 'active',
      img: 'https://i.pravatar.cc/150?u=62',
    },
    {
      id: 4,
      name: 'Mustafa Dönmez',
      role: 'Security',
      status: 'offline',
      img: 'https://i.pravatar.cc/150?u=63',
    },
    {
      id: 5,
      name: 'George Stalge',
      role: 'Maintenance',
      status: 'active',
      img: 'https://i.pravatar.cc/150?u=64',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 border-green-200'
      case 'busy':
        return 'bg-red-500 border-red-200'
      default:
        return 'bg-gray-400 border-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Personals</CardTitle>
        <Badge variant="info">{staff.filter((s) => s.status === 'active').length} Active</Badge>
      </CardHeader>

      <div className="space-y-4 p-6">
        {staff.map((person) => (
          <div key={person.id} className="group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar src={person.img} alt={person.name} />
                <span
                  className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${getStatusColor(person.status)}`}
                ></span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">{person.name}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  {person.role}
                </p>
              </div>
            </div>

            <div className="flex gap-2 opacity-60 transition-opacity group-hover:opacity-100">
              <Button variant="icon" size="icon" onClick={() => alert(`Msg: ${person.name}`)}>
                <MessageSquare size={16} />
              </Button>
              <Button
                variant="icon"
                size="icon"
                className="hover:bg-green-50 hover:text-green-600"
                onClick={() => alert(`Call: ${person.name}`)}
              >
                <Phone size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 pt-0">
        <a href="/assign" className="block w-full">
          <Button variant="ghost" className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100">
            View All Staff
          </Button>
        </a>
      </div>
    </Card>
  )
}

export default AvailableStaff
