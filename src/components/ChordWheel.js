
import React from "react";
import { WHEEL_KEYS } from "../cores"; // 

function segmentPath(cx, cy, r1, r2, startAngle, endAngle) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const x1 = cx + r2 * Math.cos(toRad(startAngle));
  const y1 = cy + r2 * Math.sin(toRad(startAngle));
  const x2 = cx + r2 * Math.cos(toRad(endAngle));
  const y2 = cy + r2 * Math.sin(toRad(endAngle));
  const x3 = cx + r1 * Math.cos(toRad(endAngle));
  const y3 = cy + r1 * Math.sin(toRad(endAngle));
  const x4 = cx + r1 * Math.cos(toRad(startAngle));
  const y4 = cy + r1 * Math.sin(toRad(startAngle));
  return `M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`;
}

function segmentCenter(cx, cy, r, angle) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  };
}

export default function ChordWheel({ selectedKey, onSelectKey }) {
  const cx = 145, cy = 145;
  const outerR = 130, midR = 88, innerR = 52;
  const startOffset = -90; 

  return (
    <svg width="115%" height="auto" viewBox="0 0 290 290" style={{ display: "block", margin: "0 auto" }}>
      {WHEEL_KEYS.map((item, i) => {
        const startAngle = startOffset + i * 30;
        const endAngle   = startOffset + (i + 1) * 30;
        const midAngle   = startOffset + i * 30 + 15;
        const isSelected = selectedKey === item.key;

        const outerCenter = segmentCenter(cx, cy, (outerR + midR) / 2, midAngle);
        const innerCenter = segmentCenter(cx, cy, (midR + innerR) / 2, midAngle);

        return (
          <g key={item.key} onClick={() => onSelectKey(item.key)} style={{ cursor: "pointer" }}>
            <path d={segmentPath(cx, cy, midR, outerR, startAngle, endAngle)} fill={item.color} opacity={isSelected ? 1 : 0.72} stroke="#3a4d2a" strokeWidth="1.5" />
            <text x={outerCenter.x} y={outerCenter.y} textAnchor="middle" dominantBaseline="middle" fontSize="20" fontWeight="bold" fill="#fff" style={{ pointerEvents: "none" }}>{item.key}</text>
            <path d={segmentPath(cx, cy, innerR, midR, startAngle, endAngle)} fill={item.color} opacity={isSelected ? 0.6 : 0.35} stroke="#3a4d2a" strokeWidth="1" />
            <text x={innerCenter.x} y={innerCenter.y} textAnchor="middle" dominantBaseline="middle" fontSize="15" fill="#fff" style={{ pointerEvents: "none" }}>{item.minor}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={innerR} fill="#3a4d2a" stroke="#5a7040" strokeWidth="1.5" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="bold" fill="#c8d8b0">{selectedKey || "?"}</text>
    </svg>
  );
}