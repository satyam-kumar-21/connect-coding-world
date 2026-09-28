'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Globe,
  Radio,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Share2,
  Code,
  Users,
  Compass,
  Sparkles,
  MapPin,
  Send,
  X,
  Maximize2,
  Minimize2,
  Settings2,
  HelpCircle,
  Flame,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Smile,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { mockUsers, currentUser } from '@/lib/mock-data';
import { getInitials } from '@/lib/utils';
import { toast } from 'sonner';

// ============================================================
// WORLD MAP CONSTANTS
// ============================================================
const WORLD_WIDTH = 3200;
const WORLD_HEIGHT = 2400;

interface WorldUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  developerLevel: string;
  company: string;
  skills: string[];
  codingLanguage: string;
  currentActivity: string;
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  color: string;
  direction: 'left' | 'right' | 'up' | 'down';
  isMoving: boolean;
  walkFrame: number;
  speechBubble?: string;
  speechBubbleTimer?: number;
}

interface Landmark {
  id: string;
  name: string;
  category: 'house' | 'mountain' | 'hub' | 'lounge' | 'arena' | 'lake';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  description: string;
  badge: string;
}

const LANDMARKS: Landmark[] = [
  {
    id: 'plaza',
    name: 'Cyber Spawn Plaza',
    category: 'hub',
    x: 1500,
    y: 1150,
    width: 240,
    height: 180,
    color: '#3b82f6',
    description: 'Central town square with holographic fountain and developer boards.',
    badge: 'Spawn Zone',
  },
  {
    id: 'hacker-house',
    name: 'Hacker House Alpha',
    category: 'house',
    x: 750,
    y: 720,
    width: 260,
    height: 200,
    color: '#8b5cf6',
    description: 'High-tech villa with gigabit servers, rooftop solar and pair workstations.',
    badge: 'Tech House',
  },
  {
    id: 'mountain-peak',
    name: 'Algorithm Mountain Peak',
    category: 'mountain',
    x: 950,
    y: 320,
    width: 320,
    height: 220,
    color: '#64748b',
    description: 'Snow-capped peak overlooking the island. Home of systems & Rust engineers.',
    badge: 'Lookout Peak',
  },
  {
    id: 'coffee-lounge',
    name: 'Code & Coffee Lounge',
    category: 'lounge',
    x: 2200,
    y: 1100,
    width: 220,
    height: 160,
    color: '#f59e0b',
    description: 'Cozy cafe with espresso bars, beanbags, and design system discussions.',
    badge: 'Social Cafe',
  },
  {
    id: 'dsa-arena',
    name: 'DSA Speed Arena',
    category: 'arena',
    x: 2350,
    y: 550,
    width: 260,
    height: 200,
    color: '#ef4444',
    description: 'Competitive coliseum for 1v1 algorithmic duels and speed debugging.',
    badge: '1v1 Arena',
  },
  {
    id: 'lake-dock',
    name: 'Lakeside Dock & Marina',
    category: 'lake',
    x: 1750,
    y: 1950,
    width: 280,
    height: 160,
    color: '#06b6d4',
    description: 'Tranquil water boardwalk with boats and mobile dev study circles.',
    badge: 'Lakeside',
  },
];

export default function VirtualWorldPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player state
  const [playerX, setPlayerX] = useState(1500);
  const [playerY, setPlayerY] = useState(1250);
  const [playerDirection, setPlayerDirection] = useState<'left' | 'right' | 'up' | 'down'>('down');
  const [isPlayerMoving, setIsPlayerMoving] = useState(false);
  const [playerWalkFrame, setPlayerWalkFrame] = useState(0);
  const [playerColor, setPlayerColor] = useState('#8b5cf6'); // Cyber Purple
  const [playerSpeech, setPlayerSpeech] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');

  // Other online developers in the world
  const [worldDevs, setWorldDevs] = useState<WorldUser[]>([
    {
      id: '2',
      name: 'Alex Kumar',
      username: 'alexkumar',
      avatar: mockUsers[1].avatar || '',
      developerLevel: 'Lead',
      company: 'Stripe Partner',
      skills: ['Go', 'Redis', 'Kafka'],
      codingLanguage: 'Go',
      currentActivity: 'Benchmarking Redis clustering',
      x: 820,
      y: 780,
      color: '#3b82f6',
      direction: 'right',
      isMoving: false,
      walkFrame: 0,
      speechBubble: 'Testing Redis atomic locks ⚡',
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      username: 'emmarodriguez',
      avatar: mockUsers[2].avatar || '',
      developerLevel: 'Senior',
      company: 'Figma Community',
      skills: ['React', 'Three.js', 'CSS'],
      codingLanguage: 'JavaScript',
      currentActivity: 'Polishing 3D glass canvas',
      x: 2260,
      y: 1140,
      color: '#ec4899',
      direction: 'left',
      isMoving: false,
      walkFrame: 0,
      speechBubble: 'Grab an espresso & chat UI ✨',
    },
    {
      id: '6',
      name: 'David Lindqvist',
      username: 'dlindqvist',
      avatar: mockUsers[5].avatar || '',
      developerLevel: 'Principal',
      company: 'EdgeCloud',
      skills: ['Rust', 'Linux', 'eBPF'],
      codingLanguage: 'Rust',
      currentActivity: 'Async TCP proxy with Tokio',
      x: 1020,
      y: 380,
      color: '#f97316',
      direction: 'down',
      isMoving: false,
      walkFrame: 0,
      speechBubble: 'Pure zero-cost abstractions up here!',
    },
    {
      id: '4',
      name: 'Michael Zhang',
      username: 'michaelzhang',
      avatar: mockUsers[3].avatar || '',
      developerLevel: 'Senior',
      company: 'AI Labs',
      skills: ['Python', 'PyTorch', 'RAG'],
      codingLanguage: 'Python',
      currentActivity: 'Local quantized LLM fine-tunes',
      x: 1620,
      y: 1220,
      color: '#10b981',
      direction: 'up',
      isMoving: false,
      walkFrame: 0,
    },
    {
      id: '5',
      name: 'Priya Sharma',
      username: 'priyasharma',
      avatar: mockUsers[4].avatar || '',
      developerLevel: 'Mid',
      company: 'Fintech Hub',
      skills: ['Flutter', 'React Native'],
      codingLanguage: 'Dart',
      currentActivity: '120Hz gesture physics engine',
      x: 1820,
      y: 1980,
      color: '#06b6d4',
      direction: 'left',
      isMoving: false,
      walkFrame: 0,
      speechBubble: 'Testing smooth mobile gestures 📱',
    },
  ]);

  // Proximity & Interaction states
  const [nearbyDev, setNearbyDev] = useState<WorldUser | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectDev, setConnectDev] = useState<WorldUser | null>(null);
  const [activeCallSession, setActiveCallSession] = useState<{
    dev: WorldUser;
    isMicOn: boolean;
    isVideoOn: boolean;
    isDeafened: boolean;
    isScreenSharing: boolean;
    duration: number;
  } | null>(null);

  // HUD & UI States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showControlsGuide, setShowControlsGuide] = useState(true);
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Keystroke tracker
  const keysPressed = useRef<Record<string, boolean>>({});

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keys if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      keysPressed.current[e.key.toLowerCase()] = true;
      keysPressed.current[e.code] = true;

      // Interaction shortcut: E
      if (e.key.toLowerCase() === 'e' && nearbyDev) {
        setConnectDev(nearbyDev);
        setIsConnectModalOpen(true);
      }

      // Jump / Emote: Space
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setPlayerSpeech('👋 Hey developers!');
        setTimeout(() => setPlayerSpeech(null), 3000);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyDev]);

  // Game Loop: Movement & Animation
  useEffect(() => {
    let animationId: number;
    let frameCount = 0;

    const gameLoop = () => {
      frameCount++;
      const keys = keysPressed.current;
      const isSprinting = keys['shift'] || keys['shiftleft'] || keys['shiftright'];
      const speed = isSprinting ? 6 : 3.5;

      let dx = 0;
      let dy = 0;

      if (keys['arrowup'] || keys['w'] || keys['keyw']) {
        dy -= speed;
        setPlayerDirection('up');
      }
      if (keys['arrowdown'] || keys['s'] || keys['keys']) {
        dy += speed;
        setPlayerDirection('down');
      }
      if (keys['arrowleft'] || keys['a'] || keys['keya']) {
        dx -= speed;
        setPlayerDirection('left');
      }
      if (keys['arrowright'] || keys['d'] || keys['keyd']) {
        dx += speed;
        setPlayerDirection('right');
      }

      const isMovingNow = dx !== 0 || dy !== 0;
      setIsPlayerMoving(isMovingNow);

      if (isMovingNow) {
        if (frameCount % 6 === 0) {
          setPlayerWalkFrame((prev) => (prev + 1) % 4);
        }

        setPlayerX((prevX) => Math.max(60, Math.min(WORLD_WIDTH - 60, prevX + dx)));
        setPlayerY((prevY) => Math.max(60, Math.min(WORLD_HEIGHT - 60, prevY + dy)));
      }

      // Slightly wander world developers
      if (frameCount % 120 === 0) {
        setWorldDevs((prevDevs) =>
          prevDevs.map((d) => {
            const wanderDist = (Math.random() - 0.5) * 40;
            return {
              ...d,
              x: Math.max(100, Math.min(WORLD_WIDTH - 100, d.x + wanderDist)),
              direction: wanderDist > 0 ? 'right' : 'left',
            };
          })
        );
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Proximity Detection calculation
  useEffect(() => {
    let closest: WorldUser | null = null;
    let minDistance = 140; // Proximity interaction radius (pixels)

    worldDevs.forEach((dev) => {
      const dist = Math.hypot(playerX - dev.x, playerY - dev.y);
      if (dist < minDistance) {
        minDistance = dist;
        closest = dev;
      }
    });

    setNearbyDev(closest);
  }, [playerX, playerY, worldDevs]);

  // Call timer interval
  useEffect(() => {
    if (!activeCallSession) return;
    const interval = setInterval(() => {
      setActiveCallSession((prev) =>
        prev ? { ...prev, duration: prev.duration + 1 } : null
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCallSession]);

  // Render Canvas World
  const renderWorld = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Camera offset to center on player
    const cameraX = playerX - width / 2;
    const cameraY = playerY - height / 2;

    ctx.save();
    // Clear canvas
    ctx.fillStyle = '#090d16'; // Deep space night background
    ctx.fillRect(0, 0, width, height);

    ctx.translate(-cameraX, -cameraY);

    // 1. Draw World Terrain (Grass, Plains & Biomes)
    // Base grass
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < WORLD_WIDTH; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, WORLD_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < WORLD_HEIGHT; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(WORLD_WIDTH, y);
      ctx.stroke();
    }

    // 2. Mountains (North Biome: x: 400-1400, y: 0-600)
    const mountainGrad = ctx.createLinearGradient(0, 0, 0, 700);
    mountainGrad.addColorStop(0, '#334155');
    mountainGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = mountainGrad;
    ctx.beginPath();
    ctx.moveTo(300, 700);
    ctx.lineTo(550, 200);
    ctx.lineTo(750, 400);
    ctx.lineTo(1000, 150);
    ctx.lineTo(1250, 450);
    ctx.lineTo(1450, 250);
    ctx.lineTo(1700, 700);
    ctx.closePath();
    ctx.fill();

    // Mountain snowy peaks
    ctx.fillStyle = 'rgba(241, 245, 249, 0.85)';
    ctx.beginPath();
    ctx.moveTo(550, 200);
    ctx.lineTo(500, 270);
    ctx.lineTo(600, 270);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(1000, 150);
    ctx.lineTo(940, 230);
    ctx.lineTo(1060, 230);
    ctx.closePath();
    ctx.fill();

    // 3. River & Southern Lake (x: 1200-2400, y: 1800-2400)
    const riverGrad = ctx.createLinearGradient(1200, 1800, 2400, 2400);
    riverGrad.addColorStop(0, '#0284c7');
    riverGrad.addColorStop(1, '#0369a1');
    ctx.fillStyle = riverGrad;
    ctx.beginPath();
    ctx.ellipse(1900, 2100, 480, 220, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // Water ripple rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(1900, 2100, 450, 200, -0.15, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Paved Roads & Highways
    ctx.fillStyle = '#1e293b';
    // Main horizontal highway (y: 1100 to 1240)
    ctx.fillRect(200, 1150, WORLD_WIDTH - 400, 90);
    // Vertical avenue (x: 1450 to 1550)
    ctx.fillRect(1455, 300, 90, 1750);
    // North access road to mountains
    ctx.fillRect(750, 600, 80, 600);

    // Road dashed yellow lane markings
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(200, 1195);
    ctx.lineTo(WORLD_WIDTH - 200, 1195);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1500, 300);
    ctx.lineTo(1500, 2050);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // 5. Landmarks & Buildings
    LANDMARKS.forEach((lm) => {
      // Glow under building
      ctx.fillStyle = `${lm.color}15`;
      ctx.fillRect(lm.x - lm.width / 2 - 10, lm.y - lm.height / 2 - 10, lm.width + 20, lm.height + 20);

      // Main structure
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = `${lm.color}90`;
      ctx.lineWidth = 2.5;
      ctx.fillRect(lm.x - lm.width / 2, lm.y - lm.height / 2, lm.width, lm.height);
      ctx.strokeRect(lm.x - lm.width / 2, lm.y - lm.height / 2, lm.width, lm.height);

      // Roof / Glass accent
      ctx.fillStyle = `${lm.color}35`;
      ctx.fillRect(lm.x - lm.width / 2 + 10, lm.y - lm.height / 2 + 10, lm.width - 20, 30);

      // Building Door / Entrance
      ctx.fillStyle = `${lm.color}`;
      ctx.fillRect(lm.x - 18, lm.y + lm.height / 2 - 20, 36, 20);

      // Building Name Tag
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lm.name, lm.x, lm.y - lm.height / 2 - 12);

      // Zone category badge
      ctx.fillStyle = lm.color;
      ctx.font = '10px monospace';
      ctx.fillText(`[ ${lm.badge} ]`, lm.x, lm.y - lm.height / 2 - 28);
    });

    // 6. Proximity Wave Rings between player and nearby dev
    if (nearbyDev) {
      const dist = Math.hypot(playerX - nearbyDev.x, playerY - nearbyDev.y);
      const pulseRadius = 35 + (Date.now() % 1000) / 25;

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);

      // Connect line
      ctx.beginPath();
      ctx.moveTo(playerX, playerY);
      ctx.lineTo(nearbyDev.x, nearbyDev.y);
      ctx.stroke();

      // Pulse rings
      ctx.beginPath();
      ctx.arc(playerX, playerY, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(nearbyDev.x, nearbyDev.y, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([]);
    }

    // 7. Render Cartoon Avatars for Other Developers
    worldDevs.forEach((dev) => {
      drawCartoonAvatar(
        ctx,
        dev.x,
        dev.y,
        dev.color,
        dev.direction,
        dev.walkFrame,
        false,
        dev.name,
        dev.developerLevel,
        dev.speechBubble
      );
    });

    // 8. Render Player Cartoon Avatar
    drawCartoonAvatar(
      ctx,
      playerX,
      playerY,
      playerColor,
      playerDirection,
      playerWalkFrame,
      true,
      `${currentUser.name} (You)`,
      '#1 Architect',
      playerSpeech
    );

    ctx.restore();
  }, [
    playerX,
    playerY,
    playerDirection,
    playerWalkFrame,
    playerColor,
    playerSpeech,
    worldDevs,
    nearbyDev,
  ]);

  // Helper: Draw animated cartoon developer
  const drawCartoonAvatar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    direction: 'left' | 'right' | 'up' | 'down',
    frame: number,
    isSelf: boolean,
    name: string,
    badgeText?: string,
    speech?: string | null
  ) => {
    ctx.save();
    ctx.translate(x, y);

    // Shadow under character
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 16, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Walking leg bobbing
    const legOffset = frame % 2 === 0 ? 3 : -3;

    // Legs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-8, 8 + legOffset, 5, 8);
    ctx.fillRect(3, 8 - legOffset, 5, 8);

    // Torso / Hoodie
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-12, -8, 24, 18, 6);
    ctx.fill();

    // Hoodie pocket / accent
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(-6, -1, 12, 6);

    // Head / Face
    ctx.fillStyle = '#fde047'; // Cartoon cute face
    ctx.beginPath();
    ctx.arc(0, -16, 12, 0, Math.PI * 2);
    ctx.fill();

    // Hair / Cap
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, -20, 12, Math.PI, Math.PI * 2);
    ctx.fill();

    // Eyes based on direction
    ctx.fillStyle = '#0f172a';
    if (direction === 'left') {
      ctx.fillRect(-8, -17, 3, 4);
      ctx.fillRect(-2, -17, 3, 4);
    } else if (direction === 'right') {
      ctx.fillRect(0, -17, 3, 4);
      ctx.fillRect(6, -17, 3, 4);
    } else if (direction === 'up') {
      // Facing back, no eyes
    } else {
      // Down
      ctx.fillRect(-5, -17, 3, 4);
      ctx.fillRect(2, -17, 3, 4);
      // Smile
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -13, 3, 0, Math.PI);
      ctx.stroke();
    }

    // Floating Name Tag & Crown
    ctx.fillStyle = isSelf ? '#8b5cf6' : '#0f172a';
    ctx.strokeStyle = isSelf ? '#a855f7' : '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-45, -44, 90, 16, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name.slice(0, 14), 0, -32);

    if (badgeText) {
      ctx.fillStyle = isSelf ? '#facc15' : '#38bdf8';
      ctx.font = '8px monospace';
      ctx.fillText(badgeText, 0, -48);
    }

    // Speech bubble if speaking
    if (speech) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      const textWidth = Math.max(80, speech.length * 7 + 16);
      ctx.beginPath();
      ctx.roundRect(-textWidth / 2, -80, textWidth, 24, 8);
      ctx.fill();
      ctx.stroke();

      // Bubble pointer triangle
      ctx.beginPath();
      ctx.moveTo(-4, -56);
      ctx.lineTo(4, -56);
      ctx.lineTo(0, -50);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillText(speech, 0, -64);
    }

    ctx.restore();
  };

  // Canvas resize listener
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || 1200;
      canvas.height = canvas.parentElement?.clientHeight || 750;
      renderWorld();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderWorld]);

  // Keep rendering loop active
  useEffect(() => {
    let animId: number;
    const loop = () => {
      renderWorld();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderWorld]);

  // Connect request trigger
  const handleInitiateConnect = (type: 'VOICE' | 'VIDEO' | 'PAIR') => {
    if (!connectDev) return;
    setIsConnectModalOpen(false);

    toast.success(`Request accepted by ${connectDev.name}!`, {
      description: `Starting real-time ${type.toLowerCase()} stream session...`,
    });

    setActiveCallSession({
      dev: connectDev,
      isMicOn: true,
      isVideoOn: type === 'VIDEO',
      isDeafened: false,
      isScreenSharing: type === 'PAIR',
      duration: 0,
    });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setPlayerSpeech(chatInput.trim());
    setChatInput('');
    setTimeout(() => setPlayerSpeech(null), 5000);
  };

  // Teleport helper
  const handleTeleport = (x: number, y: number, name: string) => {
    setPlayerX(x);
    setPlayerY(y + 60);
    toast.info(`Teleported to ${name}!`);
  };

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <MainLayout>
      <div className="w-full py-4">
        <div className="max-w-[1850px] mx-auto px-2 sm:px-4 lg:px-6 space-y-4">
          {/* Top Bar with Online Count & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-primary to-purple-600 text-white shadow-lg shadow-primary/20">
                <Globe className="h-5 w-5 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight">Developer Virtual World</h1>
                  <Badge variant="success" className="text-[10px] h-4 px-1.5 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    Live 60 FPS
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Explore mountains, plains, roads, and hacker cabins. Walk up to fellow engineers to connect via voice, video, or pair coding.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setShowCustomizer(!showCustomizer)}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
                Customize Avatar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setShowControlsGuide(!showControlsGuide)}
              >
                <HelpCircle className="h-3.5 w-3.5 mr-1" />
                Controls
              </Button>
            </div>
          </div>

          {/* MAIN VIRTUAL WORLD VIEWPORT */}
          <div className="relative w-full h-[76vh] min-h-[580px] rounded-2xl overflow-hidden border border-border/70 shadow-2xl bg-slate-950">
            {/* The HTML5 Canvas */}
            <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

            {/* NEARBY PROXIMITY ALERT BANNER */}
            {nearbyDev && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-top-4 duration-200">
                <div className="flex items-center gap-3 p-3 px-5 rounded-2xl bg-card/95 border-2 border-emerald-500/80 backdrop-blur-xl shadow-2xl shadow-emerald-500/20">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-emerald-400">
                      <AvatarImage src={nearbyDev.avatar} />
                      <AvatarFallback>{getInitials(nearbyDev.name)}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-card" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{nearbyDev.name}</span>
                      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] h-4">
                        {nearbyDev.codingLanguage}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{nearbyDev.currentActivity}</p>
                  </div>

                  <Button
                    size="sm"
                    className="ml-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 px-3 shadow"
                    onClick={() => {
                      setConnectDev(nearbyDev);
                      setIsConnectModalOpen(true);
                    }}
                  >
                    <Radio className="h-3.5 w-3.5 mr-1.5 animate-pulse" />
                    Connect [E]
                  </Button>
                </div>
              </div>
            )}

            {/* ACTIVE LIVE CALL HUD (Floating Dock) */}
            {activeCallSession && (
              <div className="absolute top-4 right-4 z-40 w-80 rounded-2xl bg-card/95 border border-primary/50 backdrop-blur-2xl shadow-2xl overflow-hidden p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                      Live Peer Connected
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-foreground">
                    {formatCallTime(activeCallSession.duration)}
                  </span>
                </div>

                {/* Video / Avatar Feed Window */}
                <div className="relative h-32 rounded-xl bg-slate-900 border border-border/60 overflow-hidden flex items-center justify-center">
                  {activeCallSession.isVideoOn ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-950 to-slate-900">
                      <Avatar className="h-16 w-16 border-2 border-emerald-400 shadow-xl animate-pulse">
                        <AvatarImage src={activeCallSession.dev.avatar} />
                        <AvatarFallback>{getInitials(activeCallSession.dev.name)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white font-mono">
                        {activeCallSession.dev.name} (Camera Active)
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      <Avatar className="h-12 w-12 border border-border">
                        <AvatarImage src={activeCallSession.dev.avatar} />
                        <AvatarFallback>{getInitials(activeCallSession.dev.name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold">{activeCallSession.dev.name}</span>
                      <span className="text-[10px] text-muted-foreground">Voice Only Session</span>
                    </div>
                  )}
                </div>

                {/* Voice & Video Controls */}
                <div className="flex items-center justify-between pt-1">
                  <Button
                    variant={activeCallSession.isMicOn ? 'outline' : 'destructive'}
                    size="icon"
                    className="h-9 w-9 rounded-xl"
                    onClick={() =>
                      setActiveCallSession({
                        ...activeCallSession,
                        isMicOn: !activeCallSession.isMicOn,
                      })
                    }
                    title={activeCallSession.isMicOn ? 'Mute Mic' : 'Unmute Mic'}
                  >
                    {activeCallSession.isMicOn ? (
                      <Mic className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <MicOff className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant={activeCallSession.isVideoOn ? 'outline' : 'secondary'}
                    size="icon"
                    className="h-9 w-9 rounded-xl"
                    onClick={() =>
                      setActiveCallSession({
                        ...activeCallSession,
                        isVideoOn: !activeCallSession.isVideoOn,
                      })
                    }
                    title="Toggle Video Stream"
                  >
                    {activeCallSession.isVideoOn ? (
                      <Video className="h-4 w-4 text-primary" />
                    ) : (
                      <VideoOff className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant={activeCallSession.isDeafened ? 'destructive' : 'outline'}
                    size="icon"
                    className="h-9 w-9 rounded-xl"
                    onClick={() =>
                      setActiveCallSession({
                        ...activeCallSession,
                        isDeafened: !activeCallSession.isDeafened,
                      })
                    }
                    title="Mute Audio/Speaker"
                  >
                    {activeCallSession.isDeafened ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-9 w-9 rounded-xl bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30"
                    onClick={() => {
                      setActiveCallSession(null);
                      toast.info('Disconnected from live peer session.');
                    }}
                    title="End Call / Leave Session"
                  >
                    <PhoneOff className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            )}

            {/* MINI-MAP RADAR (Bottom-Right) */}
            {showMiniMap && (
              <div className="absolute bottom-4 right-4 z-20 w-52 h-44 rounded-2xl bg-card/90 border border-border/80 backdrop-blur-md shadow-2xl p-2.5 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/40">
                  <span className="flex items-center gap-1">
                    <Compass className="h-3 w-3 text-primary" /> Dev Island Radar
                  </span>
                  <span className="text-[10px] text-primary">{Math.round(playerX)}, {Math.round(playerY)}</span>
                </div>

                {/* Radar Grid Graphic */}
                <div className="relative flex-1 my-1 rounded-lg bg-slate-900/90 border border-border/50 overflow-hidden">
                  {/* Landmark markers on mini-map */}
                  {LANDMARKS.map((lm) => (
                    <div
                      key={lm.id}
                      className="absolute rounded-sm opacity-60"
                      style={{
                        left: `${(lm.x / WORLD_WIDTH) * 100}%`,
                        top: `${(lm.y / WORLD_HEIGHT) * 100}%`,
                        width: '8px',
                        height: '6px',
                        backgroundColor: lm.color,
                        transform: 'translate(-50%, -50%)',
                      }}
                      title={lm.name}
                    />
                  ))}

                  {/* Other online developers dots */}
                  {worldDevs.map((d) => (
                    <div
                      key={d.id}
                      className="absolute h-2 w-2 rounded-full bg-emerald-400 border border-black animate-pulse"
                      style={{
                        left: `${(d.x / WORLD_WIDTH) * 100}%`,
                        top: `${(d.y / WORLD_HEIGHT) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      title={`${d.name} (${d.codingLanguage})`}
                    />
                  ))}

                  {/* Player Beacon */}
                  <div
                    className="absolute h-2.5 w-2.5 rounded-full bg-purple-400 border-2 border-white shadow-lg shadow-purple-400"
                    style={{
                      left: `${(playerX / WORLD_WIDTH) * 100}%`,
                      top: `${(playerY / WORLD_HEIGHT) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </div>

                <div className="text-[10px] text-muted-foreground flex justify-between">
                  <span>• Blue: Landmarks</span>
                  <span className="text-emerald-400">• Green: Online</span>
                </div>
              </div>
            )}

            {/* FAST TRAVEL TELEPORT BAR (Top-Left) */}
            <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-1.5 p-1.5 rounded-xl bg-card/85 border border-border/70 backdrop-blur-md shadow-lg text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                Fast Travel:
              </span>
              {LANDMARKS.slice(0, 4).map((lm) => (
                <button
                  key={lm.id}
                  onClick={() => handleTeleport(lm.x, lm.y, lm.name)}
                  className="px-2.5 py-1 rounded-lg bg-background/60 hover:bg-accent border border-border/50 text-[11px] font-medium transition-colors"
                >
                  {lm.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* CHAT INPUT BAR (Bottom-Left) */}
            <div className="absolute bottom-4 left-4 z-20 w-80 sm:w-96">
              <form onSubmit={handleSendChat} className="flex gap-2">
                <Input
                  placeholder="Say something to nearby developers..."
                  className="h-10 text-xs bg-card/90 border-border/80 rounded-xl backdrop-blur-md focus:bg-background"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <Button size="icon" className="h-10 w-10 shrink-0 bg-primary hover:bg-primary/90 rounded-xl shadow">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* ON-SCREEN VIRTUAL ARROWS / CONTROLS (for mobile or mouse) */}
            <div className="absolute bottom-16 right-4 z-20 sm:hidden flex flex-col items-center gap-1 p-2 bg-card/80 rounded-2xl backdrop-blur border border-border/60">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPlayerY((y) => Math.max(60, y - 40))}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPlayerX((x) => Math.max(60, x - 40))}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPlayerY((y) => Math.min(WORLD_HEIGHT - 60, y + 40))}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPlayerX((x) => Math.min(WORLD_WIDTH - 60, x + 40))}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* CONTROLS GUIDE & AVATAR CUSTOMIZER DRAWER */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Controls Card */}
            <Card className="p-4 bg-card/60 border-border/70 backdrop-blur">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Compass className="h-4 w-4 text-primary" /> Navigation &amp; Controls
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="p-2 rounded bg-background/50 flex justify-between">
                  <span>Move:</span>
                  <span className="font-mono font-bold text-foreground">WASD / Arrow Keys</span>
                </div>
                <div className="p-2 rounded bg-background/50 flex justify-between">
                  <span>Sprint:</span>
                  <span className="font-mono font-bold text-foreground">Hold Shift</span>
                </div>
                <div className="p-2 rounded bg-background/50 flex justify-between">
                  <span>Interact:</span>
                  <span className="font-mono font-bold text-emerald-400">E Key</span>
                </div>
                <div className="p-2 rounded bg-background/50 flex justify-between">
                  <span>Wave / Emote:</span>
                  <span className="font-mono font-bold text-amber-400">Spacebar</span>
                </div>
              </div>
            </Card>

            {/* Avatar Outfit Selector */}
            <Card className="p-4 bg-card/60 border-border/70 backdrop-blur">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" /> Character Outfit Theme
              </h3>
              <div className="flex gap-2">
                {[
                  { name: 'Cyber Purple', color: '#8b5cf6' },
                  { name: 'Emerald Neon', color: '#10b981' },
                  { name: 'Solar Amber', color: '#f59e0b' },
                  { name: 'Sky Cyan', color: '#06b6d4' },
                  { name: 'Rose Red', color: '#f43f5e' },
                ].map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => {
                      setPlayerColor(theme.color);
                      toast.success(`Outfit changed to ${theme.name}!`);
                    }}
                    className={`h-8 flex-1 rounded-lg border-2 transition-all flex items-center justify-center ${
                      playerColor === theme.color
                        ? 'border-white scale-105 shadow'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: theme.color }}
                    title={theme.name}
                  />
                ))}
              </div>
            </Card>

            {/* Online Peers in World */}
            <Card className="p-4 bg-card/60 border-border/70 backdrop-blur">
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" /> Active in Dev World ({worldDevs.length})
              </h3>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {worldDevs.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleTeleport(d.x, d.y, d.name)}
                    className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-lg bg-background/50 hover:bg-accent border border-border/50 cursor-pointer shrink-0 transition-colors"
                    title="Click to teleport nearby"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={d.avatar} />
                      <AvatarFallback>{getInitials(d.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold">{d.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* SEND LIVE REQUEST INTERACTION MODAL */}
          <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
            <DialogContent className="sm:max-w-md bg-card border-border/80">
              <DialogHeader>
                <DialogTitle className="text-lg">Connect with {connectDev?.name}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  You are within proximity range. Choose how you want to collaborate in the virtual world.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-background/60 border border-border/50">
                  <Avatar className="h-12 w-12 border-2 border-emerald-400">
                    <AvatarImage src={connectDev?.avatar} />
                    <AvatarFallback>{getInitials(connectDev?.name || '')}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm">{connectDev?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {connectDev?.developerLevel} • {connectDev?.codingLanguage}
                    </p>
                    <p className="text-[11px] text-emerald-400 font-medium mt-0.5">
                      &quot;{connectDev?.currentActivity}&quot;
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-1.5 h-20 p-2 text-xs hover:border-emerald-500/60"
                    onClick={() => handleInitiateConnect('VOICE')}
                  >
                    <Mic className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold">Voice Chat</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-1.5 h-20 p-2 text-xs hover:border-primary/60"
                    onClick={() => handleInitiateConnect('VIDEO')}
                  >
                    <Video className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Video Call</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex flex-col items-center gap-1.5 h-20 p-2 text-xs hover:border-amber-500/60"
                    onClick={() => handleInitiateConnect('PAIR')}
                  >
                    <Code className="h-5 w-5 text-amber-400" />
                    <span className="font-semibold">Pair Code</span>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </MainLayout>
  );
}
