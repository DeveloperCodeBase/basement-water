import { useState } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import OverviewView from './views/OverviewView';
import MapView from './views/MapView';
import TimeSeriesView from './views/TimeSeriesView';
import AiPredictionView from './views/AiPredictionView';
import ScenarioView from './views/ScenarioView';
import WellsTableView from './views/WellsTableView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';

const App = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView />;
      case 'map':
        return <MapView />;
      case 'timeseries':
        return <TimeSeriesView />;
      case 'ai':
        return <AiPredictionView />;
      case 'scenario':
        return <ScenarioView />;
      case 'wells':
        return <WellsTableView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="h-screen bg-slate-50" dir="rtl">
      <div className="flex h-full flex-row-reverse">
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="w-64 xl:w-72 border-l border-slate-100 bg-white">
            <Sidebar
              currentView={currentView}
              onNavigate={(view) => {
                setCurrentView(view);
                setMobileSidebar(false);
              }}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col h-full">
          <TopBar onToggleMenu={() => setMobileSidebar(true)} />
          <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-5 lg:py-6 space-y-6">
            {renderView()}
          </main>
        </div>
      </div>
      {mobileSidebar && (
        <div className="fixed inset-0 z-40 flex justify-end lg:hidden" aria-modal="true" role="dialog">
          <div className="flex-1 bg-slate-900/40" onClick={() => setMobileSidebar(false)}></div>
          <div className="w-64 max-w-[85%] h-full bg-white shadow-2xl border-l border-slate-100 transform transition-transform duration-300 translate-x-0">
            <Sidebar
              currentView={currentView}
              onNavigate={(view) => {
                setCurrentView(view);
                setMobileSidebar(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
