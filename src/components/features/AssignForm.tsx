import React from 'react'
import { UserCheck } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@ui/Card.component'
import { Select } from '@ui/Input.component'
import Button from '@ui/Button.component'

const AssignForm: React.FC = () => {
  return (
    <Card>
      <CardHeader variant="blue">
        <CardTitle icon={UserCheck}>Assign Task</CardTitle>
        <span className="text-xs text-blue-200">New Assignment</span>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select
            label="Request Issue"
            placeholder="Select Request..."
            options={['Wifi Issue (Room 101)', 'Plumbing (Room 204)']}
          />
          <Select
            label="Staff Member"
            placeholder="Choose Staff..."
            options={['Beyza Beyaz (IT)', 'Carl Max (Cleaner)']}
          />
        </div>

        <Button size="lg" className="mt-2">
          Confirm Assignment
        </Button>
      </CardContent>
    </Card>
  )
}

export default AssignForm
