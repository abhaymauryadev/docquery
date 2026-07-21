"use client";

import { useState } from "react";
import { CONFIDENCE_CONFIG } from "@/components/ui/confidence-badge";
import type { Confidence } from "@/types";

export interface AnalyticsData {
  docsIndexed: number;
  queriesThisWeek: number;
  avgResponseTimeMs: number;
  avgConfidence: number;
  queriesByDay: { date: string; count: number }[];
  confidenceDistribution: { confidence: Confidence; count: number }[];
}

const WEEKDAY = new Intl.DateTimeFormat(undefined, { weekday: "short" });

export function AnalyticsView({ analytics }: { analytics: AnalyticsData }) {
  const stats = [
    { label: "Docs indexed", value: String(analytics.docsIndexed) },
    { label: "Queries this week", value: String(analytics.queriesThisWeek) },
    { label: "Avg response time", value: `${analytics.avgResponseTimeMs}ms` },
    { label: "Avg confidence", value: String(analytics.avgConfidence) },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h2 className="text-lg font-semibold text-ink">Analytics</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[var(--radius-card)] border border-graphite/10 p-4"
          >
            <p className="text-xs text-graphite">{stat.label}</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-ink">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[var(--radius-card)] border border-graphite/10 p-4">
          <p className="text-sm font-medium text-ink">Queries per day</p>
          <QueriesLineChart data={analytics.queriesByDay} />
        </div>
        <div className="rounded-[var(--radius-card)] border border-graphite/10 p-4">
          <p className="text-sm font-medium text-ink">Confidence distribution</p>
          <ConfidenceBarChart data={analytics.confidenceDistribution} />
        </div>
      </div>
    </div>
  );
}

function niceMax(max: number): number {
  if (max <= 0) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / pow;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return step * pow;
}

function QueriesLineChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 480;
  const height = 160;
  const padL = 28;
  const padR = 12;
  const padT = 16;
  const padB = 24;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const max = niceMax(Math.max(...data.map((d) => d.count), 0));
  const stepX = data.length > 1 ? plotW / (data.length - 1) : 0;
  const points = data.map((d, i) => ({
    x: padL + i * stepX,
    y: padT + plotH - (max === 0 ? 0 : (d.count / max) * plotH),
    ...d,
  }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const last = points[points.length - 1];

  return (
    <div className="mt-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label="Queries per day, line chart"
        onMouseLeave={() => setHover(null)}
      >
        {[0, 0.5, 1].map((t) => {
          const y = padT + plotH - t * plotH;
          return (
            <g key={t}>
              <line
                x1={padL}
                x2={width - padR}
                y1={y}
                y2={y}
                stroke="var(--color-border)"
                strokeWidth={1}
              />
              <text
                x={padL - 6}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-graphite"
                fontSize={9}
                fontFamily="var(--font-mono)"
              >
                {Math.round(t * max)}
              </text>
            </g>
          );
        })}

        <path d={path} fill="none" stroke="var(--color-signal)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => (
          <g key={p.date}>
            <rect
              x={p.x - stepX / 2}
              y={padT}
              width={stepX || plotW}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              tabIndex={0}
              role="button"
              aria-label={`${p.date}: ${p.count} queries`}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill="var(--color-signal)"
              stroke="var(--color-card)"
              strokeWidth={2}
            />
            {i === points.length - 1 && (
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="end"
                className="fill-ink"
                fontSize={11}
                fontWeight={600}
              >
                {p.count}
              </text>
            )}
            <text
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className="fill-graphite"
              fontSize={9}
            >
              {WEEKDAY.format(new Date(p.date))}
            </text>
          </g>
        ))}

        {hover !== null && (
          <line
            x1={points[hover].x}
            x2={points[hover].x}
            y1={padT}
            y2={padT + plotH}
            stroke="var(--color-graphite)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
        )}
      </svg>
      {hover !== null && (
        <p className="mt-1 text-center font-mono text-xs text-graphite">
          {points[hover].date} · <span className="text-ink font-semibold">{points[hover].count}</span> queries
        </p>
      )}
      <table className="sr-only">
        <caption>Queries per day</caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Queries</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}>
              <td>{d.date}</td>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConfidenceBarChart({
  data,
}: {
  data: { confidence: Confidence; count: number }[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 480;
  const height = 160;
  const padT = 20;
  const padB = 28;
  const plotH = height - padT - padB;
  const max = niceMax(Math.max(...data.map((d) => d.count), 0));
  const slot = width / data.length;
  const barW = Math.min(40, slot * 0.5);

  return (
    <div className="mt-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label="Confidence distribution, bar chart"
        onMouseLeave={() => setHover(null)}
      >
        {data.map((d, i) => {
          const cx = slot * i + slot / 2;
          const barH = max === 0 ? 0 : (d.count / max) * plotH;
          const y = padT + plotH - barH;
          const cfg = CONFIDENCE_CONFIG[d.confidence];
          return (
            <g key={d.confidence}>
              <rect
                x={cx - slot / 2}
                y={padT}
                width={slot}
                height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                tabIndex={0}
                role="button"
                aria-label={`${cfg.label}: ${d.count}`}
              />
              <rect
                x={cx - barW / 2}
                y={y}
                width={barW}
                height={Math.max(barH, 1)}
                rx={4}
                fill={cfg.hex}
                opacity={hover === null || hover === i ? 1 : 0.55}
              />
              <text
                x={cx}
                y={y - 6}
                textAnchor="middle"
                className="fill-ink"
                fontSize={11}
                fontWeight={600}
              >
                {d.count}
              </text>
              <g transform={`translate(${cx - 20}, ${height - 14})`}>
                <circle cx={4} cy={0} r={3} fill={cfg.hex} />
                <text x={10} y={3} fontSize={9} className="fill-graphite">
                  {cfg.label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      <table className="sr-only">
        <caption>Confidence distribution</caption>
        <thead>
          <tr>
            <th>Confidence</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.confidence}>
              <td>{CONFIDENCE_CONFIG[d.confidence].label}</td>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
