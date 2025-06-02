import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface StatusDisplayProps {
  status: 'healthy' | 'degraded' | 'error' | 'unknown';
  title: string;
  message: string;
  latency?: number;
  timestamp: string;
}

export function StatusDisplay({ status, title, message, latency, timestamp }: StatusDisplayProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'degraded':
        return 'bg-amber-50 border-amber-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'healthy':
        return 'Working';
      case 'degraded':
        return 'Degraded';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
      <div className="flex items-center gap-3 mb-2">
        {getStatusIcon()}
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          status === 'healthy' ? 'bg-green-100 text-green-800' :
          status === 'degraded' ? 'bg-amber-100 text-amber-800' :
          status === 'error' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {getStatusText()}
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-2">{message}</p>

      <div className="flex justify-between text-xs text-gray-500">
        <span>Last checked: {new Date(timestamp).toLocaleTimeString()}</span>
        {latency && <span>Response: {latency}ms</span>}
      </div>
    </div>
  );
}