import GroundwaterMap from '../components/GroundwaterMap';

const MapView = () => {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-lg font-semibold">نقشه چاه‌ها و آبخوان</h1>
      </div>

      <div className="flex-1 min-h-[320px]">
        <GroundwaterMap />
      </div>
    </div>
  );
};

export default MapView;
