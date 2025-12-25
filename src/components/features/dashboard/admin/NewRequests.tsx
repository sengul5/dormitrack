import React from 'react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Avatar from '@ui/Avatar.component'

// Types
interface Request {
  id: number
  name: string
  studentId: string
  priority: 'High' | 'Medium' | 'Low'
  date: string
  desc: string
  avatar: string
}

const NewRequests: React.FC = () => {
  const requests: Request[] = [
    {
      id: 1,
      name: 'Ömer Faruk Sağdıç',
      studentId: '22000304',
      priority: 'High',
      date: '01.11.2025',
      desc: 'Klima su akıtıyor...',
      avatar: 'https://i.pravatar.cc/150?u=1',
    },
    {
      id: 2,
      name: 'Abiju Ouwealla',
      studentId: '238172912',
      priority: 'Medium',
      date: '01.11.2025',
      desc: 'İnternet çok yavaş...',
      avatar: 'https://i.pravatar.cc/150?u=2',
    },
    {
      id: 3,
      name: 'Donald Trump',
      studentId: '22000304',
      priority: 'Low',
      date: '01.11.2025',
      desc: 'Lamba yanmıyor...',
      avatar: 'https://i.pravatar.cc/150?u=3',
    },
  ]

  const getPriorityVariant = (p: string) => {
    switch (p) {
      case 'High':
        return 'dangerSoft'
      case 'Medium':
        return 'warning'
      default:
        return 'success'
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          New Requests <span className="ml-1 text-sm font-normal text-gray-400">(16)</span>
        </CardTitle>
      </CardHeader>

      <div className="p-2">
        <Table>
          <TableHeader>
            <TableHead className="pl-2">Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>ID Number</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="pl-2">
                  <Avatar src={req.avatar} alt={req.name} />
                </TableCell>
                <TableCell className="font-medium text-gray-700">{req.name}</TableCell>
                <TableCell className="font-mono text-xs text-gray-500">{req.studentId}</TableCell>
                <TableCell>
                  <Badge variant={getPriorityVariant(req.priority) as any}>{req.priority}</Badge>
                </TableCell>
                <TableCell className="text-xs text-gray-500">{req.date}</TableCell>
                <TableCell className="max-w-[150px] truncate text-xs text-gray-400">
                  {req.desc}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-gray-50 p-4 text-right">
        <a href="/requests">
          <Button size="sm">See All</Button>
        </a>
      </div>
    </Card>
  )
}

export default NewRequests
