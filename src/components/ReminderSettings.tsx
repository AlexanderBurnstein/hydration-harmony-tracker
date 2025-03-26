import React, { useState } from 'react';
import { useHydration } from '@/context/HydrationContext';
import { useToast } from '@/components/ui/toast';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Plus, X, Droplet } from 'lucide-react';

interface Reminder {
  id: string;
  time: string;
  repeat: boolean;
}

const ReminderSettings: React.FC = () => {
  const { setNotificationTimes } = useHydration();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', time: '09:00', repeat: true },
    { id: '2', time: '12:00', repeat: true },
    { id: '3', time: '15:00', repeat: true },
  ]);
  const [interval, setIntervalValue] = useState<number>(60);
  const [isAutomatic, setIsAutomatic] = useState<boolean>(false);

  const handleAddReminder = () => {
    const newId = String(Date.now());
    setReminders([...reminders, { id: newId, time: '10:00', repeat: true }]);
  };

  const handleRemoveReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  const handleTimeChange = (id: string, time: string) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, time } : reminder
      )
    );
  };

  const handleRepeatChange = (id: string, repeat: boolean) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, repeat } : reminder
      )
    );
  };

  const handleIntervalChange = (value: number[]) => {
    setIntervalValue(value[0]);
  };

  const handleAutomaticToggle = (checked: boolean) => {
    setIsAutomatic(checked);
  };

  const saveSettings = () => {
    // Convert reminders to notification times
    const notificationTimes = reminders.map((reminder) => reminder.time);
    setNotificationTimes(notificationTimes);

    toast({
      title: 'Settings saved!',
      description: 'Your hydration reminders have been updated.',
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Manual Reminders</h3>
      {reminders.map((reminder) => (
        <div key={reminder.id} className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <Input
              type="time"
              value={reminder.time}
              onChange={(e) => handleTimeChange(reminder.id, e.target.value)}
              className="max-w-[100px]"
            />
            <label htmlFor={`repeat-${reminder.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              Repeat
            </label>
            <Switch
              id={`repeat-${reminder.id}`}
              checked={reminder.repeat}
              onCheckedChange={(checked) => handleRepeatChange(reminder.id, checked)}
            />
          </div>
          <Button variant="ghost" size="sm" onClick={() => handleRemoveReminder(reminder.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="mt-2" onClick={handleAddReminder}>
        <Plus className="h-4 w-4 mr-2" />
        Add Reminder
      </Button>

      <h3 className="text-lg font-semibold mt-6 mb-4">Automatic Reminders</h3>
      <div className="flex items-center justify-between mb-4">
        <label htmlFor="automatic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
          Enable Automatic Reminders
        </label>
        <Switch id="automatic" checked={isAutomatic} onCheckedChange={handleAutomaticToggle} />
      </div>
      {isAutomatic && (
        <>
          <div className="space-y-2">
            <label htmlFor="interval">Interval (minutes)</label>
            <Slider
              id="interval"
              defaultValue={[interval]}
              max={120}
              min={30}
              step={5}
              onValueChange={handleIntervalChange}
            />
            <p className="text-sm text-muted-foreground">
              Remind me every {interval} minutes.
            </p>
          </div>
        </>
      )}

      <Button className="mt-6" onClick={saveSettings}>
        Save Settings
      </Button>
    </div>
  );
};

export default ReminderSettings;
