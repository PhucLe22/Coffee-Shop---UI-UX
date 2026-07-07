# Map - mapcn

## Map

The simplest way to add an interactive map to your application.

## Basic Usage

The `Map` component handles MapLibre GL setup, theming, and provides context for child components.

```
import { Map } from "@/components/ui/map";

export function BasicMapExample() {
return (
<div className="h-[420px] w-full">
<Map center={[-74.006, 40.7128]} zoom={12} />
</div>
);
}
```

## Controlled Mode

Use the `viewport` and `onViewportChange` props to control the map's viewport externally. This is useful when you need to sync the map state with your application or respond to viewport changes.

```
"use client";

import { useState } from "react";
import { Map, type MapViewport } from "@/components/ui/map";

export function ControlledMapExample() {
  const [viewport, setViewport] = useState<MapViewport>({
    center: [-74.006, 40.7128],
    zoom: 8,
    bearing: 0,
    pitch: 0,
  });

  return (
    <div className="relative h-[420px] w-full">
      <Map viewport={viewport} onViewportChange={setViewport} />
      <div className="bg-background/80 absolute top-2 left-2 z-10 flex flex-wrap gap-x-3 gap-y-1 rounded border px-2 py-1.5 font-mono text-xs backdrop-blur">
        <span>
          <span className="text-muted-foreground">lng:</span>{" "}
          {viewport.center[0].toFixed(3)}
        </span>
        <span>
          <span className="text-muted-foreground">lat:</span>{" "}
          {viewport.center[1].toFixed(3)}
        </span>
        <span>
          <span className="text-muted-foreground">zoom:</span>{" "}
          {viewport.zoom.toFixed(1)}
        </span>
        <span>
          <span className="text-muted-foreground">bearing:</span>{" "}
          {viewport.bearing.toFixed(1)}°
        </span>
        <span>
          <span className="text-muted-foreground">pitch:</span>{" "}
          {viewport.pitch.toFixed(1)}°
        </span>
      </div>
    </div>
  );
}

```

## Custom Styles

Use the `styles` prop to provide custom map styles. This example uses free vector tiles from [OpenFreeMap](https://openfreemap.org/), an open-source project, the data comes from OpenStreetMap.

```
"use client";

import { useState, useEffect, useRef } from "react";
import { Map, type MapRef } from "@/components/ui/map";

const styles = {
  default: undefined,
  openstreetmap: "https://tiles.openfreemap.org/styles/bright",
  openstreetmap3d: "https://tiles.openfreemap.org/styles/liberty",
};

type StyleKey = keyof typeof styles;

export function CustomStyleExample() {
  const mapRef = useRef<MapRef>(null);
  const [style, setStyle] = useState<StyleKey>("default");
  const selectedStyle = styles[style];
  const is3D = style === "openstreetmap3d";

  useEffect(() => {
    mapRef.current?.easeTo({ pitch: is3D ? 60 : 0, duration: 500 });
  }, [is3D]);

  return (
    <div className="relative h-[420px] w-full">
      <Map
        ref={mapRef}
        center={[-0.1276, 51.5074]}
        zoom={15}
        styles={
          selectedStyle
            ? { light: selectedStyle, dark: selectedStyle }
            : undefined
        }
      />
      <div className="absolute top-2 right-2 z-10">
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value as StyleKey)}
          className="bg-background text-foreground rounded-md border px-2 py-1 text-sm shadow"
        >
          <option value="default">Default (Carto)</option>
          <option value="openstreetmap">OpenStreetMap</option>
          <option value="openstreetmap3d">OpenStreetMap 3D</option>
        </select>
      </div>
    </div>
  );
}

```

[API Reference](./api-reference.md)
[Controls](./controls.md)
