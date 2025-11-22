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
    <div className="h-screen w-screen bg-slate-50" dir="rtl">
      <div className="relative flex h-full flex-row-reverse overflow-hidden">
        <aside className="hidden h-full w-64 shrink-0 border-l border-slate-100 bg-white xl:w-72 lg:block z-20">
          <Sidebar
            currentView={currentView}
            onNavigate={(view) => {
              setCurrentView(view);
              setMobileSidebar(false);
            }}
          />
        </aside>
        {mobileSidebar && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
              onClick={() => setMobileSidebar(false)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  setMobileSidebar(false);
                }
              }}
              aria-label="بستن منوی اصلی"
              role="button"
              tabIndex={0}
            ></div>
            <aside className="fixed inset-y-0 right-0 z-50 w-64 max-w-[85%] border-l border-slate-100 bg-white shadow-2xl transition-transform duration-300 lg:hidden">
              <Sidebar
                currentView={currentView}
                onNavigate={(view) => {
                  setCurrentView(view);
                  setMobileSidebar(false);
                }}
              />
            </aside>
          </>
        )}
        <div className="z-0 flex min-h-0 flex-1 flex-col">
          <TopBar onToggleMenu={() => setMobileSidebar(true)} />
          <main className="flex-1 space-y-6 overflow-y-auto px-3 py-5 sm:px-6 lg:py-6">{renderView()}</main>
        </div>
      </div>
    </div>
  );
};

export default App;
