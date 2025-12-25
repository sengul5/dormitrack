import React from 'react'
import { Card, CardHeader, CardTitle } from '@ui/Card.component'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/Table.component'
import Badge from '@ui/Badge.component'
import Button from '@ui/Button.component'
import Avatar from '@ui/Avatar.component'

interface Complaint {
  id: number
  photo: string
  name: string
  room: string
  severity: 'Critical' | 'High' | 'Medium'
  date: string
  desc: string
}

const NewComplaints: React.FC = () => {
  const complaints: Complaint[] = [
    {
      id: 1,
      photo: 'https://i.pravatar.cc/150?u=30',
      name: 'Alice Wonderland',
      room: '404',
      severity: 'High',
      date: '01.11.2025',
      desc: 'Yan odadan çok ses geliyor...',
    },
    {
      id: 2,
      photo: 'https://i.pravatar.cc/150?u=31',
      name: 'Bob Marley',
      room: '101',
      severity: 'Critical',
      date: '02.11.2025',
      desc: 'Kulaklığım çalındı, kamera...',
    },
    {
      id: 3,
      photo: 'https://i.pravatar.cc/150?u=32',
      name: 'Charlie Chaplin',
      room: '202',
      severity: 'Medium',
      date: '03.11.2025',
      desc: 'Mutfak tezgahı çok kirli...',
    },
  ]

  const getSeverityVariant = (s: string) => {
    switch (s) {
      case 'Critical':
        return 'danger'
      case 'High':
        return 'warning'
      default:
        return 'info'
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>
          Recent Complaints{' '}
          <span className="ml-1 text-sm font-medium text-gray-400">({complaints.length})</span>
        </CardTitle>
      </CardHeader>

      <div className="p-2">
        <Table>
          <TableHeader>
            <TableHead className="pl-2">Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
          </TableHeader>
          <TableBody>
            {complaints.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="pl-2">
                  <Avatar src={item.photo} alt={item.name} />
                </TableCell>
                <TableCell className="font-bold text-gray-800">{item.name}</TableCell>
                <TableCell className="font-medium text-gray-500">{item.room}</TableCell>
                <TableCell>
                  <Badge variant={getSeverityVariant(item.severity) as any}>{item.severity}</Badge>
                </TableCell>
                <TableCell className="text-xs text-gray-500">{item.date}</TableCell>
                <TableCell className="max-w-[150px] truncate text-xs text-gray-400">
                  {item.desc}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-gray-50 p-4 text-right">
        <a href="/complaints">
          <Button size="sm">See All</Button>
        </a>
      </div>
    </Card>
  )
}

export default NewComplaints
