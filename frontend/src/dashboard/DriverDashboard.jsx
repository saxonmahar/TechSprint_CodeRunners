import React, { useState, useEffect } from "react";
import {
  Ambulance,
  MapPin,
  Phone,
  Bell,
  CheckCircle,
  XCircle,
  Share2,
  Radio,
  Power,
  Navigation,
  Clock,
  Building2,
} from "lucide-react";

// Mock ambulance data
const MOCK_AMBULANCE = {
  _id: "507f1f77bcf86cd799439011",
  name: "Nepal Ambulance Service",
  phone: "+977-9841234567",
  address: "Thamel, Kathmandu, Nepal",
  location: { latitude: 27.7172, longitude: 85.324 },
  website: "https://nepalambulance.com",
  category: "Ambulance Service",
  status: "OFFLINE",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2026-01-17T08:45:00Z",
};

// Header Component
const Header = ({ ambulance, onStatusToggle, notifications }) => {
  const isOnline = ambulance.status === "ONLINE";

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-red-500 p-3 rounded-lg">
            <Ambulance className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {ambulance.name}
            </h1>
            <p className="text-sm text-gray-500">Driver Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <button
              onClick={onStatusToggle}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                isOnline ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isOnline ? "translate-x-9" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-semibold ${
                isOnline ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          <div className="relative">
            <Bell
              className={`w-6 h-6 ${isOnline ? "text-gray-700" : "text-gray-400"}`}
            />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Ambulance Profile Card
const AmbulanceProfileCard = ({ ambulance }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-red-100 p-2 rounded-lg">
          <Ambulance className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Ambulance Details</h3>
          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mt-1">
            {ambulance.category}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-gray-600">{ambulance.address}</p>
            <p className="text-xs text-gray-400 mt-1">
              {ambulance.location.latitude.toFixed(4)}, {ambulance.location.longitude.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <a href={`tel:${ambulance.phone}`} className="text-sm text-blue-600 hover:underline">
            {ambulance.phone}
          </a>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last updated:{" "}
            {new Date(ambulance.updatedAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ isOnline }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <div className={`inline-flex p-4 rounded-full mb-4 ${isOnline ? "bg-blue-100" : "bg-gray-100"}`}>
        {isOnline ? <Radio className="w-12 h-12 text-blue-600" /> : <Power className="w-12 h-12 text-gray-400" />}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {isOnline ? "Waiting for Requests..." : "You are Offline"}
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {isOnline
          ? "Your ambulance is online and ready. New accident requests will appear here."
          : "Set your status to ONLINE to start receiving accident requests."}
      </p>
    </div>
  );
};

// Main Dashboard Component
export default function AmbulanceDashboard() {
  const [ambulance, setAmbulance] = useState(MOCK_AMBULANCE);
  const [notifications, setNotifications] = useState(0);

  // Toggle status
  const handleStatusToggle = () => {
    setAmbulance((prev) => ({
      ...prev,
      status: prev.status === "ONLINE" ? "OFFLINE" : "ONLINE",
      updatedAt: new Date().toISOString(),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header ambulance={ambulance} onStatusToggle={handleStatusToggle} notifications={notifications} />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <AmbulanceProfileCard ambulance={ambulance} />
          </div>

          {/* Main Area */}
          <div className="lg:col-span-3">
            <EmptyState isOnline={ambulance.status === "ONLINE"} />
          </div>
        </div>
      </div>
    </div>
  );
}
