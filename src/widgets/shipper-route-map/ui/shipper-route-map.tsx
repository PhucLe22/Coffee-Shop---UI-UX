"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ShipperRoute } from "@/entities/delivery";

const popupStyles = `
  .maplibregl-popup-content {
    background: #fff !important;
    border-radius: 12px !important;
    padding: 12px 14px !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
    border: none !important;
  }
  .maplibregl-popup-tip {
    border-top-color: #fff !important;
  }
  .maplibregl-popup {
    z-index: 1000 !important;
  }
`;

interface ShipperRouteMapProps {
  shippers: ShipperRoute[];
}

const SHIPPER_COLORS = ["#F0660A", "#2563EB", "#16A34A", "#9333EA", "#DC2626", "#0891B2", "#CA8A04", "#BE185D"];

export function ShipperRouteMap({ shippers }: ShipperRouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = popupStyles;
    document.head.appendChild(styleEl);
    return () => { styleEl.remove(); };
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [106.0, 14.0],
      zoom: 6,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !shippers.length) return;

    map.on("load", () => drawRoutes(map, shippers));

    if (map.isStyleLoaded()) {
      drawRoutes(map, shippers);
    }

    return () => {
      const layers = map.getStyle()?.layers || [];
      layers.forEach((layer) => {
        if (layer.id?.startsWith("shipper-")) {
          try { map.removeLayer(layer.id); } catch {}
        }
      });
      ["shipper-routes", "shipper-markers", "shipper-numbers"].forEach((s) => {
        try { map.removeSource(s); } catch {}
      });
    };
  }, [shippers]);

  function drawRoutes(map: maplibregl.Map, data: ShipperRoute[]) {
    const lineFeatures: GeoJSON.Feature[] = [];
    const markerFeatures: GeoJSON.Feature[] = [];
    const numberFeatures: GeoJSON.Feature[] = [];
    const bounds = new maplibregl.LngLatBounds();

    data.forEach((shipper, idx) => {
      const coords: [number, number][] = shipper.routes.map((r) => [r.lng, r.lat]);
      coords.forEach((c) => bounds.extend(c));

      lineFeatures.push({
        type: "Feature",
        properties: { color: SHIPPER_COLORS[idx % SHIPPER_COLORS.length] },
        geometry: { type: "LineString", coordinates: coords },
      });

      shipper.routes.forEach((node, nodeIdx) => {
        const nodeColor = node.type === "STORE" ? "#9333EA" : SHIPPER_COLORS[idx % SHIPPER_COLORS.length];

        markerFeatures.push({
          type: "Feature",
          properties: {
            type: node.type,
            shipperId: shipper.shipperId,
            shipperName: shipper.shipperName,
            orderCode: node.orderCode,
            customerName: node.customerName,
            address: node.address,
            storeName: node.storeName,
            storeAddress: node.storeAddress,
            arrival: node.arrival_datetime,
            items: JSON.stringify(node.items),
            total: node.total,
            color: nodeColor,
            index: nodeIdx,
          },
          geometry: { type: "Point", coordinates: [node.lng, node.lat] },
        });

        numberFeatures.push({
          type: "Feature",
          properties: { index: nodeIdx + 1 },
          geometry: { type: "Point", coordinates: [node.lng, node.lat] },
        });
      });
    });

    // Lines source + layer
    if (!map.getSource("shipper-routes")) {
      map.addSource("shipper-routes", {
        type: "geojson",
        data: { type: "FeatureCollection", features: lineFeatures },
      });

      map.addLayer({
        id: "shipper-routes-layer",
        type: "line",
        source: "shipper-routes",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 3,
          "line-opacity": 0.7,
        },
      });
    } else {
      (map.getSource("shipper-routes") as maplibregl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: lineFeatures,
      });
    }

    // Marker circles source + layer
    if (!map.getSource("shipper-markers")) {
      map.addSource("shipper-markers", {
        type: "geojson",
        data: { type: "FeatureCollection", features: markerFeatures },
      });

      map.addLayer({
        id: "shipper-markers-layer",
        type: "circle",
        source: "shipper-markers",
        paint: {
          "circle-radius": 8,
          "circle-color": ["get", "color"],
          "circle-stroke-width": 2.5,
          "circle-stroke-color": "#fff",
        },
      });

      const popup = new maplibregl.Popup({
        closeButton: false,
        offset: 14,
        className: "shipper-popup",
      });

      map.on("mouseenter", "shipper-markers-layer", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const props = e.features?.[0]?.properties;
        if (!props) return;

        const isStore = props.type === "STORE";
        const name = isStore ? props.storeName : props.customerName || "Unknown";
        const address = isStore ? props.storeAddress || props.address : props.address;
        const stopLabel = `Stop #${props.index + 1}`;
        const arrival = props.arrival ? new Date(props.arrival).toLocaleString() : "";

        let itemsHtml = "";
        if (props.items) {
          try {
            const items = JSON.parse(props.items);
            if (items?.length) {
              itemsHtml = items.map((i: any) =>
                `<div style="display:flex;justify-content:space-between;gap:16px;font-size:12px;color:#555">
                  <span>${i.name}</span>
                  <span style="font-weight:600">x${i.quantity}</span>
                </div>`
              ).join("");
            }
          } catch {}
        }

        const totalFormatted = props.total
          ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(props.total)
          : "";

        popup.setLngLat((e.lngLat))
          .setHTML(`
            <div style="font-family:system-ui,sans-serif;min-width:220px;background:#fff;border-radius:12px;padding:4px">
              <div style="font-size:14px;font-weight:700;color:#1a1a1a;margin-bottom:4px">${name}</div>
              <div style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">${stopLabel} · ${props.type}</div>
              <div style="border-top:1px solid #eee;padding-top:8px;font-size:12px;color:#555;line-height:1.6">
                <div>📍 ${address}</div>
                ${arrival ? `<div>🕐 ${arrival}</div>` : ""}
                ${props.orderCode ? `<div>📋 ${props.orderCode}</div>` : ""}
              </div>
              ${itemsHtml ? `<div style="border-top:1px solid #eee;padding-top:8px;margin-top:8px">${itemsHtml}</div>` : ""}
              ${totalFormatted ? `<div style="border-top:1px solid #eee;padding-top:8px;margin-top:8px;font-size:13px;font-weight:700;color:#1a1a1a;text-align:right">${totalFormatted}</div>` : ""}
            </div>
          `)
          .addTo(map);
      });

      map.on("mouseleave", "shipper-markers-layer", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });
    } else {
      (map.getSource("shipper-markers") as maplibregl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: markerFeatures,
      });
    }

    // Number labels source + layer
    if (!map.getSource("shipper-numbers")) {
      map.addSource("shipper-numbers", {
        type: "geojson",
        data: { type: "FeatureCollection", features: numberFeatures },
      });

      map.addLayer({
        id: "shipper-numbers-layer",
        type: "symbol",
        source: "shipper-numbers",
        layout: {
          "text-field": ["get", "index"],
          "text-size": 10,
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-offset": [0, -1.8],
        },
        paint: {
          "text-color": "#fff",
          "text-halo-color": "rgba(0,0,0,0.6)",
          "text-halo-width": 1.5,
        },
      });
    } else {
      (map.getSource("shipper-numbers") as maplibregl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features: numberFeatures,
      });
    }

    if (data.length === 1 && data[0].routes.length > 1) {
      map.fitBounds(bounds, { padding: 60 });
    } else {
      map.fitBounds(bounds, { padding: 40 });
    }
  }

  return <div ref={mapContainer} className="size-full rounded-md" />;
}
