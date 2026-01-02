"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

import { useEffect, useState } from "react"

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  markers?: Array<{ position: [number, number]; title: string }>
}

export default function MapView({ 
  center = [9.0820, 8.6753], // Nigeria center approx
  zoom = 6,
  markers = [] 
}: MapViewProps) {
  
  // Nigeria center: 9.0820° N, 8.6753° E
  
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
      </MapContainer>
    </div>
  )
}
