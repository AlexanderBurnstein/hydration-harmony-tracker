
import React, { useEffect } from 'react';
import { HydrationProvider } from '@/context/HydrationContext';
import Header from '@/components/layout/Header';
import WaterAnimation from '@/components/WaterAnimation';
import TimeFrameSelector from '@/components/ui/TimeFrameSelector';
import ProgressChart from '@/components/ProgressChart';
import HydrationTracker from '@/components/HydrationTracker';
import StatisticsView from '@/components/StatisticsView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplet, BarChart, Settings } from 'lucide-react';

const Index = () => {
  // Set up notification checking on load
  useEffect(() => {
    // Check if user has granted notification permissions
    if ('Notification' in window && Notification.permission === 'granted') {
      console.log('Notification permission granted');
    }
  }, []);

  return (
    <HydrationProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-indigo-950">
        <div className="max-w-2xl mx-auto px-4 pb-20">
          <Header />
          
          <main className="relative z-10 animate-fade-in">
            <div className="mt-4">
              <WaterAnimation />
            </div>
            
            <div className="mt-8">
              <TimeFrameSelector />
            </div>
            
            <div className="mt-6">
              <ProgressChart />
            </div>
            
            <Tabs defaultValue="add" className="mt-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="add" className="gap-2">
                  <Droplet className="h-4 w-4" />
                  Add Water
                </TabsTrigger>
                <TabsTrigger value="stats" className="gap-2">
                  <BarChart className="h-4 w-4" />
                  Statistics
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="add" className="mt-4">
                <HydrationTracker />
              </TabsContent>
              
              <TabsContent value="stats" className="mt-4">
                <StatisticsView />
              </TabsContent>
            </Tabs>
          </main>
        </div>
        
        {/* Background decorative elements */}
        <div className="fixed top-0 right-0 -z-10 w-72 h-72 bg-water/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="fixed bottom-0 left-0 -z-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      </div>
    </HydrationProvider>
  );
};

export default Index;
