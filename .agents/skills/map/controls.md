# Controls - mapcn

## Controls

Add interactive controls to your map for zoom, compass, location, and fullscreen.

The `MapControls` component provides a set of interactive controls that can be positioned on any corner of the map.

```
import { Map, MapControls } from "@/components/ui/map";

export function MapControlsExample() {
  return (
    <div className="h-[420px] w-full">
      <Map center={[2.3522, 48.8566]} zoom={10}>
        <MapControls
          position="top-right"
          showZoom
          showCompass
          showLocate
          showFullscreen
        />
      </Map>
    </div>
  );
}

```

[Map](./basic-map.md)
[Markers](./markers.md)
