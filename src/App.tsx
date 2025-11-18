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
  const [collapsed, setCollapsed] = useState(false);
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

  const sidebarElement = (
    <Sidebar
      currentView={currentView}
      onNavigate={(view) => {
        setCurrentView(view);
        setMobileSidebar(false);
      }}
      collapsed={collapsed}
      onToggle={() => setCollapsed((prev) => !prev)}
    />
  );

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <TopBar />
      <div className="flex flex-row-reverse">
        <div className="hidden lg:flex">{sidebarElement}</div>
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <div className="lg:hidden">
            <button
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-sm"
              onClick={() => setMobileSidebar(true)}
            >
              منو
            </button>
          </div>
          {renderView()}
        </main>
      </div>
      {mobileSidebar && (
        <div className="fixed inset-0 bg-black/40 z-40 flex justify-end" onClick={() => setMobileSidebar(false)}>
          <div className="w-72 max-w-full" onClick={(e) => e.stopPropagation()}>
            {sidebarElement}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
