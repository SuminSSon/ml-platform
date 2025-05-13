// src/components/ResourceMonitoring.jsx

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BarChart2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "./ui/Card";

/* ─────────── 환경 설정 ─────────── */
const PROM_URL = process.env.REACT_APP_PROM_URL
const NAMESPACE = "sumin";
const POLL_SEC = 2;          // 폴링 간격 (초)
const WINDOW_SEC = 600;      // 유지할 윈도우 (초) → 10분
const POINT_LIMIT = WINDOW_SEC / POLL_SEC; // 저장할 데이터 포인트 수

/* 집계 PromQL (2분 윈도우, 밀리코어 · MiB) */
const CPU_Q_ALL = `sum by (pod) (rate(container_cpu_usage_seconds_total{namespace="${NAMESPACE}",image!~"pause"}[3m])) * 1000`;
const MEM_Q_ALL = `sum by (pod) (container_memory_usage_bytes{namespace="${NAMESPACE}"}) / 1024 / 1024`;

export default function ResourceMonitoring() {
  // { podName: [ { time, cpu, mem }, ... ] }
  const [series, setSeries] = useState({});
  const timerRef = useRef(null);

  /* ── 주기적 폴링 ───────────────── */
  useEffect(() => {
    const poll = async () => {
      try {
        const [cpuRes, memRes] = await Promise.all([
          axios.get(PROM_URL, { params: { query: CPU_Q_ALL } }),
          axios.get(PROM_URL, { params: { query: MEM_Q_ALL } }),
        ]);

        // pod → CPU 값, pod → Mem 값 맵 생성
        const cpuMap = {};
        cpuRes.data.data.result.forEach((r) => {
          cpuMap[r.metric.pod] = parseFloat(r.value[1]);
        });
        const memMap = {};
        memRes.data.data.result.forEach((r) => {
          memMap[r.metric.pod] = parseFloat(r.value[1]);
        });

        // 현재 시각 라벨, 살아있는(present) Pod 리스트
        const now = new Date().toLocaleTimeString();
        const alive = new Set([
          ...Object.keys(cpuMap),
          ...Object.keys(memMap),
        ]);

        // series 상태 갱신: 살아있는 Pod만, 삭제된 Pod 자동 제거
        setSeries((prev) => {
          const next = {};
          alive.forEach((pod) => {
            const cpu = cpuMap[pod] ?? 0;
            const mem = memMap[pod] ?? 0;
            const entry = { time: now, cpu, mem };
            // 기존 시계열(prev[pod]) 보존, 새 엔트리 추가, 제한 포인트만 유지
            next[pod] = [...(prev[pod] || []), entry].slice(-POINT_LIMIT);
          });
          return next;
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Prometheus fetch error:", err);
      }
    };

    poll();
    timerRef.current = setInterval(poll, POLL_SEC * 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const podNames = Object.keys(series).sort();

  /* ── 렌더링 ───────────────────── */
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <BarChart2 className="mr-2 text-indigo-600" />
        리소스 모니터링
      </h2>

      <div className="space-y-6">
        {podNames.map((pod) => (
          <div
            key={pod}
            className="flex items-center justify-between border-b pb-6"
          >
            {/* Pod 이름 */}
            <span className="font-mono text-sm mr-4 w-72 truncate">{pod}</span>

            {/* 실시간 그래프 */}
            <div className="flex-1 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series[pod]} margin={{ top: 5, right: 20 }}>
                  {/* X축: 약 5개 라벨 */}
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 14 }}
                    interval={Math.ceil(POINT_LIMIT / 5)}
                  />
                  {/* Y축 좌: CPU (mCPU) */}
                  <YAxis
                    yAxisId="left"
                    domain={[0, (dataMax) => dataMax * 1.2]}
                    label={{
                      value: "mCPU",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 14,
                    }}
                    tick={{ fontSize: 14 }}
                    tickFormatter={(value) => value.toFixed(1)}
                  />
                  {/* Y축 우: 메모리 (MiB) */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, (dataMax) => dataMax * 1.2]}
                    label={{
                      value: "MiB",
                      angle: -90,
                      position: "insideRight",
                      fontSize: 14,
                    }}
                    tick={{ fontSize: 14 }}
                    tickFormatter={(value) => value.toFixed(1)}
                  />

                  <Tooltip
                    contentStyle={{ fontSize: 14 }}
                    formatter={(value, name) =>
                      name === "cpu"
                        ? `${value.toFixed(1)} mCPU`
                        : `${value.toFixed(1)} MiB`
                    }
                  />

                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="cpu"
                    name="cpu"
                    stroke="#6366f1"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="mem"
                    name="mem"
                    stroke="#10b981"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
        {podNames.length === 0 && (
          <p className="text-center text-sm text-gray-500">데이터 없음</p>
        )}
      </div>
    </Card>
  );
}
