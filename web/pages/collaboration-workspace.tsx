import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

// Real-time Collaboration Interfaces
interface CollaborationRoom {
  id: string;
  name: string;
  type: "meeting" | "workshop" | "brainstorm" | "review" | "training";
  host: Participant;
  participants: Participant[];
  documents: SharedDocument[];
  whiteboard: WhiteboardState;
  recording: RecordingState;
  settings: RoomSettings;
  created_at: string;
  status: "active" | "scheduled" | "ended";
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: "host" | "moderator" | "participant" | "observer";
  status: "online" | "away" | "busy";
  permissions: ParticipantPermissions;
  audio_enabled: boolean;
  video_enabled: boolean;
  screen_sharing: boolean;
  joined_at: string;
  device_info: DeviceInfo;
}

interface ParticipantPermissions {
  can_share_screen: boolean;
  can_edit_documents: boolean;
  can_use_whiteboard: boolean;
  can_record: boolean;
  can_invite_others: boolean;
  can_moderate: boolean;
}

interface SharedDocument {
  id: string;
  name: string;
  type: "text" | "spreadsheet" | "presentation" | "pdf" | "code";
  content: any;
  cursors: CursorPosition[];
  edits: EditHistory[];
  version: number;
  locked_by?: string;
  last_modified: string;
}

interface CursorPosition {
  user_id: string;
  user_name: string;
  position: { line: number; column: number };
  color: string;
  selection?: { start: any; end: any };
}

interface EditHistory {
  id: string;
  user_id: string;
  operation: "insert" | "delete" | "replace";
  position: any;
  content: string;
  timestamp: string;
}

interface WhiteboardState {
  elements: WhiteboardElement[];
  active_tool: "pen" | "eraser" | "text" | "shape" | "selector";
  cursors: WhiteboardCursor[];
  zoom: number;
  pan: { x: number; y: number };
}

interface WhiteboardElement {
  id: string;
  type: "path" | "text" | "rectangle" | "circle" | "arrow" | "image";
  data: any;
  style: any;
  created_by: string;
  timestamp: string;
}

interface WhiteboardCursor {
  user_id: string;
  x: number;
  y: number;
  tool: string;
  color: string;
}

interface RecordingState {
  is_recording: boolean;
  started_at?: string;
  paused: boolean;
  duration: number;
  file_size: number;
  quality: "low" | "medium" | "high" | "4k";
  include_audio: boolean;
  include_video: boolean;
  include_screen: boolean;
}

interface RoomSettings {
  max_participants: number;
  require_approval: boolean;
  enable_chat: boolean;
  enable_reactions: boolean;
  enable_file_sharing: boolean;
  auto_record: boolean;
  ai_insights: boolean;
  background_noise_suppression: boolean;
}

interface DeviceInfo {
  camera: MediaDeviceInfo | null;
  microphone: MediaDeviceInfo | null;
  speaker: MediaDeviceInfo | null;
  bandwidth: number;
  network_quality: "excellent" | "good" | "fair" | "poor";
}

interface AIInsight {
  type: "action_item" | "decision" | "summary" | "sentiment" | "engagement";
  content: string;
  confidence: number;
  timestamp: string;
  participants_mentioned: string[];
}

const CollaborationWorkspacePage: React.FC = () => {
  const router = useRouter();
  const [currentRoom, setCurrentRoom] = useState<CollaborationRoom | null>(
    null,
  );
  const [activeDocument, setActiveDocument] = useState<SharedDocument | null>(
    null,
  );
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [connectionQuality, setConnectionQuality] = useState<
    "excellent" | "good" | "fair" | "poor"
  >("excellent");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    initializeRoom();
    setupWebRTC();
    connectWebSocket();

    return () => {
      cleanupConnections();
    };
  }, []);

  const initializeRoom = () => {
    // Mock room initialization
    const mockRoom: CollaborationRoom = {
      id: "room_001",
      name: "Q1 Strategy Planning Session",
      type: "workshop",
      host: {
        id: "user_001",
        name: "Alice Johnson",
        avatar: "/avatars/alice.jpg",
        role: "host",
        status: "online",
        permissions: {
          can_share_screen: true,
          can_edit_documents: true,
          can_use_whiteboard: true,
          can_record: true,
          can_invite_others: true,
          can_moderate: true,
        },
        audio_enabled: true,
        video_enabled: true,
        screen_sharing: false,
        joined_at: new Date().toISOString(),
        device_info: {
          camera: null,
          microphone: null,
          speaker: null,
          bandwidth: 1000,
          network_quality: "excellent",
        },
      },
      participants: generateMockParticipants(),
      documents: generateMockDocuments(),
      whiteboard: {
        elements: [],
        active_tool: "pen",
        cursors: [],
        zoom: 1,
        pan: { x: 0, y: 0 },
      },
      recording: {
        is_recording: false,
        paused: false,
        duration: 0,
        file_size: 0,
        quality: "high",
        include_audio: true,
        include_video: true,
        include_screen: false,
      },
      settings: {
        max_participants: 50,
        require_approval: false,
        enable_chat: true,
        enable_reactions: true,
        enable_file_sharing: true,
        auto_record: false,
        ai_insights: true,
        background_noise_suppression: true,
      },
      created_at: new Date().toISOString(),
      status: "active",
    };

    setCurrentRoom(mockRoom);
    setActiveDocument(mockRoom.documents[0]);
    setAiInsights(generateMockAIInsights());
  };

  const generateMockParticipants = (): Participant[] => [
    {
      id: "user_002",
      name: "Bob Smith",
      avatar: "/avatars/bob.jpg",
      role: "moderator",
      status: "online",
      permissions: {
        can_share_screen: true,
        can_edit_documents: true,
        can_use_whiteboard: true,
        can_record: false,
        can_invite_others: false,
        can_moderate: true,
      },
      audio_enabled: true,
      video_enabled: false,
      screen_sharing: false,
      joined_at: new Date(Date.now() - 300000).toISOString(),
      device_info: {
        camera: null,
        microphone: null,
        speaker: null,
        bandwidth: 800,
        network_quality: "good",
      },
    },
    {
      id: "user_003",
      name: "Carol Davis",
      avatar: "/avatars/carol.jpg",
      role: "participant",
      status: "online",
      permissions: {
        can_share_screen: false,
        can_edit_documents: true,
        can_use_whiteboard: true,
        can_record: false,
        can_invite_others: false,
        can_moderate: false,
      },
      audio_enabled: true,
      video_enabled: true,
      screen_sharing: false,
      joined_at: new Date(Date.now() - 600000).toISOString(),
      device_info: {
        camera: null,
        microphone: null,
        speaker: null,
        bandwidth: 600,
        network_quality: "fair",
      },
    },
  ];

  const generateMockDocuments = (): SharedDocument[] => [
    {
      id: "doc_001",
      name: "Q1 Strategy Document",
      type: "text",
      content: `# Q1 Strategy Planning

## Objectives
1. Increase revenue by 25%
2. Expand team by 10 members
3. Launch 3 new product features

## Key Initiatives
- Market research and analysis
- Product development roadmap
- Team hiring plan`,
      cursors: [
        {
          user_id: "user_002",
          user_name: "Bob Smith",
          position: { line: 8, column: 15 },
          color: "#3b82f6",
        },
      ],
      edits: [],
      version: 1,
      last_modified: new Date().toISOString(),
    },
    {
      id: "doc_002",
      name: "Budget Spreadsheet",
      type: "spreadsheet",
      content: {
        sheets: [
          {
            name: "Q1 Budget",
            rows: 25,
            columns: 10,
            data: {},
          },
        ],
      },
      cursors: [],
      edits: [],
      version: 1,
      last_modified: new Date().toISOString(),
    },
  ];

  const generateMockAIInsights = (): AIInsight[] => [
    {
      type: "action_item",
      content: "Alice committed to completing market research by Friday",
      confidence: 95,
      timestamp: new Date(Date.now() - 120000).toISOString(),
      participants_mentioned: ["Alice Johnson"],
    },
    {
      type: "decision",
      content: "Team agreed to prioritize mobile app development for Q1",
      confidence: 88,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      participants_mentioned: ["Alice Johnson", "Bob Smith", "Carol Davis"],
    },
    {
      type: "sentiment",
      content:
        "Overall meeting sentiment is positive with high engagement levels",
      confidence: 92,
      timestamp: new Date(Date.now() - 60000).toISOString(),
      participants_mentioned: [],
    },
  ];

  const setupWebRTC = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Get available devices
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      setDevices(deviceList);
    } catch (error) {
      console.error("Failed to setup WebRTC:", error);
    }
  };

  const connectWebSocket = () => {
    // Mock WebSocket connection
    console.log("Connecting to collaboration server...");

    // Simulate real-time updates
    setInterval(() => {
      if (Math.random() > 0.7) {
        const newInsight: AIInsight = {
          type: Math.random() > 0.5 ? "action_item" : "summary",
          content: `AI detected: ${Math.random() > 0.5 ? "New action item identified" : "Key discussion point summarized"}`,
          confidence: Math.floor(Math.random() * 20) + 80,
          timestamp: new Date().toISOString(),
          participants_mentioned: ["Alice Johnson"],
        };
        setAiInsights((prev) => [newInsight, ...prev.slice(0, 9)]);
      }
    }, 30000);
  };

  const cleanupConnections = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // In production, would control actual video stream
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    // In production, would control actual audio stream
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setIsScreenSharing(true);
      // Handle screen share stream
    } catch (error) {
      console.error("Screen share failed:", error);
    }
  };

  const stopScreenShare = () => {
    setIsScreenSharing(false);
    // Stop screen share stream
  };

  const sendChatMessage = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      user: "You",
      content: message,
      timestamp: new Date().toISOString(),
      type: "text",
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  const getConnectionQualityColor = (quality: string) => {
    const colors = {
      excellent: "text-green-600",
      good: "text-blue-600",
      fair: "text-yellow-600",
      poor: "text-red-600",
    };
    return colors[quality as keyof typeof colors];
  };

  const getInsightIcon = (type: string) => {
    const icons = {
      action_item: "✅",
      decision: "🎯",
      summary: "📝",
      sentiment: "😊",
      engagement: "📊",
    };
    return icons[type as keyof typeof icons] || "💡";
  };

  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {currentRoom.name}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Connection Quality */}
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-medium ${getConnectionQualityColor(connectionQuality)}`}
                >
                  {connectionQuality}
                </span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className={`w-1 h-3 rounded-full ${
                        bar <=
                        ["poor", "fair", "good", "excellent"].indexOf(
                          connectionQuality,
                        ) +
                          1
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Participants Count */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {currentRoom.participants.length + 1} participants
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleAudio}
                  className={`p-2 rounded-lg ${
                    isAudioEnabled
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isAudioEnabled ? "🎤" : "🔇"}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded-lg ${
                    isVideoEnabled
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isVideoEnabled ? "📹" : "📷"}
                </button>

                <button
                  onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                  className={`p-2 rounded-lg ${
                    isScreenSharing
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  🖥️
                </button>

                <button
                  onClick={() => currentRoom.recording.is_recording}
                  className={`p-2 rounded-lg ${
                    currentRoom.recording.is_recording
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  ⏺️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Video Grid */}
        <div className="w-1/3 bg-black p-4 space-y-4">
          {/* Main Video */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              You
            </div>
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">👤</span>
                </div>
              </div>
            )}
          </div>

          {/* Participant Videos */}
          <div className="grid grid-cols-2 gap-2">
            {currentRoom.participants.map((participant) => (
              <div
                key={participant.id}
                className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video"
              >
                {participant.video_enabled ? (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-white text-sm">📹</span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">👤</span>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {participant.name}
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  {!participant.audio_enabled && (
                    <span className="text-red-500 text-xs">🔇</span>
                  )}
                  {participant.screen_sharing && (
                    <span className="text-blue-500 text-xs">🖥️</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - Document/Whiteboard */}
        <div className="flex-1 bg-white">
          {activeDocument && (
            <div className="h-full flex flex-col">
              {/* Document Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {activeDocument.name}
                    </h2>
                    <div className="flex items-center space-x-2">
                      {activeDocument.cursors.map((cursor) => (
                        <div
                          key={cursor.user_id}
                          className="flex items-center space-x-1"
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: cursor.color }}
                          ></div>
                          <span className="text-xs text-gray-600">
                            {cursor.user_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      v{activeDocument.version}
                    </span>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Document Content */}
              <div className="flex-1 p-6">
                {activeDocument.type === "text" ? (
                  <div className="h-full">
                    <textarea
                      className="w-full h-full resize-none border-none outline-none text-gray-900 leading-relaxed"
                      value={activeDocument.content}
                      onChange={(e) => {
                        // Handle real-time text editing
                        setActiveDocument({
                          ...activeDocument,
                          content: e.target.value,
                        });
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl mb-4">📊</div>
                      <p className="text-gray-600">
                        {activeDocument.type} editor would be here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Chat & AI Insights */}
        <div className="w-1/3 bg-white border-l border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button className="px-4 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                💬 Chat
              </button>
              <button className="px-4 py-3 text-sm font-medium text-gray-500">
                🤖 AI Insights
              </button>
              <button className="px-4 py-3 text-sm font-medium text-gray-500">
                👥 People
              </button>
            </nav>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {message.user}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{message.content}</p>
                  </div>
                </div>
              ))}

              {/* AI Insights in Chat */}
              {aiInsights.slice(0, 3).map((insight) => (
                <div
                  key={insight.timestamp}
                  className="bg-blue-50 rounded-lg p-3 border border-blue-200"
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">
                      {getInsightIcon(insight.type)}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-blue-900">
                          AI Assistant
                        </span>
                        <span className="text-xs text-blue-600">
                          {insight.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-blue-800">{insight.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      sendChatMessage(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationWorkspacePage;
