"use client";

import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, PieLabelRenderProps, PieLabel} from 'recharts';
import {useMemo} from "react";

type Props = {
    data: { value: number, color: string, label?: boolean }[];
    height?: number;
    size?: number;
    children?: any;
    clickable?: boolean;
}

const DonutChart = ({data, height = 140, size = 70, clickable = true, children}: Props) => {
    const total = useMemo(() => {
        return data.reduce((acc, c) => acc + c.value, 0);
    }, [data]);

    return <>
        <ResponsiveContainer className="relative" width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={size - 40}
                    outerRadius={size}
                    paddingAngle={4}
                    dataKey="value"
                    cornerRadius={6}
                    animationDuration={1000}
                    animationBegin={0}
                    labelLine={false}
                    label={({cx, cy, midAngle, innerRadius, outerRadius, fill}: any) => {
                        const elem = data.find(d => d.color === fill);
                        if (!elem?.label) return null;

                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                            <foreignObject
                                x={x - 30}
                                y={y - 12}
                                width={60}
                                height={24}
                                style={{overflow: "visible"}}
                            >
                                <div
                                    className="flex flex-col bg-tertiary text-primary text-xs px-2 py-0.5 rounded-md text-center select-none">
                                    <span
                                        className="text-sm font-semibold">{Math.round(elem.value / total * 100)}%</span>
                                    {elem.value.toLocaleString("ru-RU")}₽
                                </div>
                            </foreignObject>
                        );
                    }}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            {...(index === 0 ? {outerRadius: 110} : {})}
                        />
                    ))}
                </Pie>
                {clickable && <Tooltip
                    cursor={false}
                    formatter={(value: number) => {
                        const percent = ((value / total) * 100).toFixed(1);
                        return [`${percent}%`];
                    }}
                    contentStyle={{
                        background: "white",
                        borderRadius: "0.75rem",
                        border: "none",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.875rem",
                    }}
                />}
            </PieChart>
            {children ?
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{children}</div> : ""}
        </ResponsiveContainer>
    </>
}

export default DonutChart;
