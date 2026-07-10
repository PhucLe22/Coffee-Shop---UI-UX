'use client';

import { Map, MapMarker, MarkerContent, MapRoute, MapControls } from '@/components/ui/map';
import { Coffee, Home, Truck } from 'lucide-react';
import { Order } from '@/entities/order';

interface LiveTrackingMapProps {
  order: Order;
  className?: string;
}

// Mock coordinates for demonstration
const STORE_COORDS: [number, number] = [106.660172, 10.762622]; // Sample HCMC coords
const USER_COORDS: [number, number] = [106.682124, 10.776466];
const DRIVER_COORDS: [number, number] = [106.671148, 10.769544];

const ROUTE_COORDS: [number, number][] = [
  STORE_COORDS,
  [106.665, 10.765],
  [106.670, 10.768],
  DRIVER_COORDS,
  [106.675, 10.772],
  USER_COORDS,
];

export function LiveTrackingMap({ order, className }: LiveTrackingMapProps) {
  const isOnTheWay = order.status === 'on_the_way';

  return (
    <div className={className}>
      <Map
        center={isOnTheWay ? DRIVER_COORDS : USER_COORDS}
        zoom={14}
        className="w-full h-full"
      >
        <MapControls showZoom showLocate position="top-right" />
        
        {/* Store Marker */}
        <MapMarker longitude={STORE_COORDS[0]} latitude={STORE_COORDS[1]}>
          <MarkerContent>
            <div className="bg-surface-inverse p-xs rounded-full border-2 border-white shadow-lg">
              <Coffee className="size-4 text-inverse-text" />
            </div>
          </MarkerContent>
        </MapMarker>

        {/* User Destination Marker */}
        <MapMarker longitude={USER_COORDS[0]} latitude={USER_COORDS[1]}>
          <MarkerContent>
            <div className="bg-brand-primary p-xs rounded-full border-2 border-white shadow-lg">
              <Home className="size-4 text-inverse-text" />
            </div>
          </MarkerContent>
        </MapMarker>

        {/* Driver Marker (only if on the way) */}
        {isOnTheWay && (
          <MapMarker longitude={DRIVER_COORDS[0]} latitude={DRIVER_COORDS[1]}>
            <MarkerContent>
              <div className="bg-info p-xs rounded-full border-2 border-white shadow-lg">
                <Truck className="size-4 text-white" />
              </div>
            </MarkerContent>
          </MapMarker>
        )}

        {/* Route Line */}
        <MapRoute 
          coordinates={ROUTE_COORDS} 
          color="#F0660A" 
          width={4} 
          opacity={0.6} 
        />
      </Map>
    </div>
  );
}
