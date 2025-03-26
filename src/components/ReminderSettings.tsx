
import React, { useState, useEffect } from 'react';
import { useHydration } from '@/context/HydrationContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Bell, Clock } from 'lucide-react';
import { toast } from 'sonner';

const ReminderSettings: React.FC = () => {
  const { 
    reminderInterval, 
    setReminderInterval, 
    remindersEnabled, 
    toggleReminders 
  } = useHydration();
  
  const [interval, setInterval] = useState(reminderInterval);
  const [enabled, setEnabled] = useState(remindersEnabled);
  const [notificationsSupported, setNotificationsSupported] = useState(false);
  const [notificationsPermission, setNotificationsPermission] = useState<NotificationPermission | null>(null);
  
  // Check if notifications are supported
  useEffect(() => {
    setNotificationsSupported('Notification' in window);
    if ('Notification' in window) {
      setNotificationsPermission(Notification.permission);
    }
  }, []);
  
  // Request notification permission
  const requestPermission = async () => {
    if (!notificationsSupported) return;
    
    try {
      const permission = await Notification.requestPermission();
      setNotificationsPermission(permission);
      
      if (permission === 'granted') {
        setEnabled(true);
        toast.success("Notifications enabled", {
          description: "You'll receive hydration reminders.",
        });
      } else {
        toast.error("Permission denied", {
          description: "Please enable notifications in your browser settings.",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error("Couldn't request permission", {
        description: "There was an error requesting notification permission.",
      });
    }
  };
  
  // Save settings
  const saveSettings = () => {
    setReminderInterval(interval);
    toggleReminders(enabled && notificationsPermission === 'granted');
    
    toast.success("Reminder settings saved", {
      description: enabled 
        ? `You'll be reminded to drink water every ${interval} minutes.` 
        : "Reminders have been disabled.",
    });
  };
  
  // Show permission explanation if needed
  const showPermissionExplanation = notificationsSupported && notificationsPermission !== 'granted';

  return (
    <div className="glass p-6 rounded-3xl max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-1">Hydration Reminders</h2>
        <p className="text-sm text-gray-500">Set up reminders to stay hydrated</p>
      </div>
      
      {/* Permission explanation if needed */}
      {showPermissionExplanation && (
        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6">
          <p className="text-sm">
            We need permission to send you notifications. 
            {notificationsPermission === 'denied' 
              ? " Please enable notifications in your browser settings."
              : ""}
          </p>
          {notificationsPermission !== 'denied' && (
            <Button
              onClick={requestPermission}
              variant="secondary"
              size="sm"
              className="mt-2 w-full"
            >
              Allow Notifications
            </Button>
          )}
        </div>
      )}
      
      {/* Enable toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium">Enable Reminders</h3>
          <p className="text-xs text-gray-500">Receive reminders to drink water</p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={(checked) => {
            if (checked && notificationsPermission !== 'granted') {
              requestPermission();
            } else {
              setEnabled(checked);
            }
          }}
          disabled={enabled && notificationsPermission !== 'granted'}
        />
      </div>
      
      {/* Reminder interval */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium">Reminder Interval</h3>
          <span className="text-sm font-medium">{interval} minutes</span>
        </div>
        
        <Slider
          value={[interval]}
          min={15}
          max={120}
          step={15}
          onValueChange={(values) => setInterval(values[0])}
          disabled={!enabled || notificationsPermission !== 'granted'}
          className="py-4"
        />
        
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setInterval(30)}
            disabled={!enabled || notificationsPermission !== 'granted'}
            className="text-xs"
          >
            30 min
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setInterval(60)}
            disabled={!enabled || notificationsPermission !== 'granted'}
            className="text-xs"
          >
            1 hour
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setInterval(90)}
            disabled={!enabled || notificationsPermission !== 'granted'}
            className="text-xs"
          >
            1.5 hours
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={saveSettings}
          className="flex-1 bg-water hover:bg-water-dark text-white gap-2"
          disabled={notificationsPermission !== 'granted' && enabled}
        >
          <Bell className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
      
      {/* Notification preview */}
      {enabled && notificationsPermission === 'granted' && (
        <div className="mt-6 border border-white/20 rounded-lg p-4 bg-white/10">
          <div className="flex items-start gap-3">
            <div className="bg-water rounded-full p-2">
              <Droplet className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Hydration Reminder</h4>
              <p className="text-xs text-gray-600 mt-1">Time to drink some water! Stay hydrated.</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Just now</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderSettings;
