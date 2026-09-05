'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { MatchResult, Scheme, UserProfile } from '@/types';

interface SchemeNodeGraphProps {
  userProfile: UserProfile;
  matchResults: MatchResult[];
  schemes: Record<string, Scheme>;
  onSelectScheme?: (schemeId: string) => void;
}

export default function SchemeNodeGraph({
  userProfile,
  matchResults,
  schemes,
  onSelectScheme,
}: SchemeNodeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);

  // Top user criteria nodes
  const userNodes = [
    { id: 'cat', label: `Category: ${userProfile.category || 'General'}`, color: '#06b6d4' },
    { id: 'state', label: `State: ${userProfile.state || 'India'}`, color: '#10b981' },
    { id: 'sector', label: `Sector: ${userProfile.businessType || 'General'}`, color: '#8b5cf6' },
    { id: 'finance', label: `Fund: ₹${Number(userProfile.projectCost || 0).toLocaleString()}`, color: '#f59e0b' },
  ];

  // Eligible / Top match scheme nodes
  const topMatches = matchResults.slice(0, 6);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    const height = (canvas.height = 420);

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Left column: User profile parameter nodes
      const leftX = width * 0.18;
      const userNodePositions: { id: string; x: number; y: number; label: string; color: string }[] = [];

      userNodes.forEach((node, idx) => {
        const y = 70 + idx * ((height - 140) / Math.max(userNodes.length - 1, 1));
        userNodePositions.push({ ...node, x: leftX, y });
      });

      // Right column: Scheme nodes
      const rightX = width * 0.82;
      const schemeNodePositions: { id: string; x: number; y: number; scheme: Scheme; match: MatchResult }[] = [];

      topMatches.forEach((match, idx) => {
        const scheme = schemes[match.schemeId];
        if (!scheme) return;
        const y = 50 + idx * ((height - 100) / Math.max(topMatches.length - 1, 1));
        schemeNodePositions.push({ id: scheme.id, x: rightX, y, scheme, match });
      });

      // Draw bezier connecting energy lines
      step += 0.02;
      userNodePositions.forEach((uNode) => {
        schemeNodePositions.forEach((sNode) => {
          const isEligible = sNode.match.status === 'Eligible';
          const isSelected = selectedSchemeId === sNode.id;

          ctx.beginPath();
          ctx.moveTo(uNode.x, uNode.y);

          const cp1x = uNode.x + (sNode.x - uNode.x) * 0.5;
          const cp1y = uNode.y;
          const cp2x = uNode.x + (sNode.x - uNode.x) * 0.5;
          const cp2y = sNode.y;

          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, sNode.x, sNode.y);

          if (isSelected) {
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#06b6d4';
            ctx.shadowBlur = 12;
          } else if (isEligible) {
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 0;
          } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
            ctx.lineWidth = 1;
            ctx.shadowBlur = 0;
          }
          ctx.stroke();

          // Animated traveling pulse packet along curve
          if (isEligible || isSelected) {
            const t = (Math.sin(step + (uNode.y + sNode.y) * 0.01) + 1) / 2;
            const px = (1 - t) * (1 - t) * (1 - t) * uNode.x + 3 * (1 - t) * (1 - t) * t * cp1x + 3 * (1 - t) * t * t * cp2x + t * t * t * sNode.x;
            const py = (1 - t) * (1 - t) * (1 - t) * uNode.y + 3 * (1 - t) * (1 - t) * t * cp1y + 3 * (1 - t) * t * t * cp2y + t * t * t * sNode.y;

            ctx.beginPath();
            ctx.arc(px, py, isSelected ? 3.5 : 2, 0, Math.PI * 2);
            ctx.fillStyle = isSelected ? '#ffffff' : '#34d399';
            ctx.shadowColor = isSelected ? '#22d3ee' : '#10b981';
            ctx.shadowBlur = 8;
            ctx.fill();
          }
        });
      });

      // Draw User Nodes
      userNodePositions.forEach((uNode) => {
        ctx.shadowBlur = 12;
        ctx.shadowColor = uNode.color;
        ctx.fillStyle = uNode.color;
        ctx.beginPath();
        ctx.arc(uNode.x, uNode.y, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.font = '11px Inter, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'right';
        ctx.fillText(uNode.label, uNode.x - 14, uNode.y + 4);
      });

      // Draw Scheme Nodes
      schemeNodePositions.forEach((sNode) => {
        const isEligible = sNode.match.status === 'Eligible';
        const isSelected = selectedSchemeId === sNode.id;
        const color = isSelected ? '#06b6d4' : isEligible ? '#10b981' : '#f59e0b';

        ctx.shadowBlur = isSelected ? 18 : 10;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(sNode.x, sNode.y, isSelected ? 9 : 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.font = `${isSelected ? 'bold 12px' : '11px'} Inter, sans-serif`;
        ctx.fillStyle = isSelected ? '#ffffff' : '#e2e8f0';
        ctx.textAlign = 'left';
        ctx.fillText(`${sNode.scheme.name} (${sNode.match.score}%)`, sNode.x + 14, sNode.y + 4);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Click handler on canvas to select scheme
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const rightX = width * 0.82;
      topMatches.forEach((match, idx) => {
        const scheme = schemes[match.schemeId];
        if (!scheme) return;
        const y = 50 + idx * ((height - 100) / Math.max(topMatches.length - 1, 1));
        const dist = Math.hypot(clickX - rightX, clickY - y);
        if (dist < 25) {
          setSelectedSchemeId(scheme.id);
          if (onSelectScheme) onSelectScheme(scheme.id);
        }
      });
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [userProfile, matchResults, schemes, selectedSchemeId, onSelectScheme]);

  return (
    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden border border-white/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Interactive Scheme Opportunity Graph</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Visualizing multi-constraint neural paths connecting your profile to live matching schemes.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> 100% Eligible</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Potential</span>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <canvas ref={canvasRef} className="cursor-pointer max-w-full" />
      </div>
    </div>
  );
}
