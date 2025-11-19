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
      <TopBar onToggleMenu={() => setMobileSidebar(true)} />
      <div className="flex flex-row-reverse max-w-7xl mx-auto w-full">
        <div className="hidden lg:flex lg:w-72 xl:w-80 border-s border-slate-100">{sidebarElement}</div>
        <main className="flex-1 px-3 sm:px-6 py-4 lg:py-6 space-y-6">
          {renderView()}
        </main>
      </div>
      {mobileSidebar && (
        <div className="fixed inset-0 z-40 lg:hidden flex" aria-modal="true" role="dialog">
          <div className="flex-1 bg-black/40" onClick={() => setMobileSidebar(false)}></div>
          <div className="w-72 max-w-full bg-white shadow-xl">
            {sidebarElement}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
