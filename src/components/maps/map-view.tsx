"use client"

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

import { useEffect, useState } from "react"

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  markers?: Array<{ position: [number, number]; title: string }>
  onMapClick?: (lat: number, lng: number) => void
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function MapView({ 
  center = [9.0820, 8.6753], // Nigeria center approx
  zoom = 6,
  markers = [],
  onMapClick
}: MapViewProps) {
  
  return (
    <div className="h-full w-full min-h-[400px] rounded-lg overflow-hidden border">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={m.position}>
            <Popup>{m.title}</Popup>
          </Marker>
        ))}
        {onMapClick && <MapClickHandler onClick={onMapClick} />}
      </MapContainer>
    </div>
  )
}
