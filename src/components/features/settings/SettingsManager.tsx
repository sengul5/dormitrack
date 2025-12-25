import React, { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Check, Shield, Globe, Bell, User, Settings as SettingsIcon, LogOut } from 'lucide-react'
import { Card } from '@ui/Card.component'
import Button from '@ui/Button.component'
import { Input } from '@ui/Input.component'
import Switch from '@ui/Switch.component'
import Avatar from '@ui/Avatar.component'
import toast from 'react-hot-toast'

const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile')
  const { data: session } = authClient.useSession()
  const user = session?.user

  // Form States
  const [name, setName] = useState(user?.name || '')
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [loading, setLoading] = useState(false)

  // PROFİL GÜNCELLEME
  const handleUpdateProfile = async () => {
    setLoading(true)
    const toastId = toast.loading('Updating profile...')
    try {
      await authClient.updateUser({ name })
      toast.success('Profile updated!', { id: toastId })
    } catch (e) {
      toast.error('Update failed', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  // ŞİFRE GÜNCELLEME
  const handleChangePassword = async () => {
    setLoading(true)
    const toastId = toast.loading('Changing password...')
    try {
      await authClient.changePassword({
        currentPassword: currentPass,
        newPassword: newPass,
        revokeOtherSessions: true,
      })
      toast.success('Password changed!', { id: toastId })
      setCurrentPass('')
      setNewPass('')
    } catch (e: any) {
      toast.error(e.error?.message || 'Failed', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
  ]

  return (
    <Card className="flex min-h-[600px] flex-col gap-8 p-8">
      <div>
        <h2 className="mb-6 font-serif text-3xl font-bold text-gray-800">Settings</h2>
        <div className="flex items-center gap-2 overflow-x-auto border-b border-gray-100 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-t-xl border-b-2 px-6 py-3 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 bg-blue-50/50 text-blue-600'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl">
        {/* 1. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="mb-8 text-xl font-bold text-gray-800">Personal Information</h3>
            <div className="flex flex-col items-start gap-8 md:flex-row">
              <div className="flex flex-col items-center gap-4">
                <Avatar
                  src={user?.image!}
                  size="lg"
                  className="h-32 w-32 border-4 border-gray-50"
                />
              </div>
              <div className="w-full flex-1 space-y-6">
                <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input
                  label="Email"
                  value={user?.email}
                  disabled
                  className="cursor-not-allowed bg-gray-100"
                />
                <div className="flex justify-end pt-2">
                  <Button size="lg" onClick={handleUpdateProfile} disabled={loading}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-12 duration-300">
            <div>
              <h3 className="mb-6 text-xl font-bold text-gray-800">Login & Security</h3>
              <div className="max-w-xl space-y-4">
                <Input
                  type="password"
                  label="Current Password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                />
                <Input
                  type="password"
                  label="New Password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                <div className="pt-2">
                  <Button
                    onClick={handleChangePassword}
                    disabled={loading}
                    variant="ghost"
                    className="w-full bg-gray-800 px-6 text-white hover:bg-black sm:w-auto"
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PREFERENCES TAB (Sadece UI) */}
        {activeTab === 'preferences' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 duration-300">
            <div>
              <h3 className="mb-4 text-xl font-bold">Notifications</h3>
              <div className="max-w-md space-y-4">
                <Switch label="Email Notifications" defaultChecked />
                <Switch label="Push Notifications" defaultChecked />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default SettingsManager
