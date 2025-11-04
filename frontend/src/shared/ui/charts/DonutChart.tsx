"use client";

import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';
import {useMemo} from "react";

type Props = {
    data: {name: string, value: number, color: string}[];
}

const DonutChart = ({data}: Props) => {
    const total = useMemo(() => {
        return data.reduce((acc, c) => acc + c.value, 0);
    }, [data]);

    return (
        <ResponsiveContainer width="50%" height={140}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                    cornerRadius={6}
                    animationDuration={1000}
                    animationBegin={0}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            {...(index === 0 ? { outerRadius: 110 } : {})}
                        />
                    ))}
                </Pie>
                <Tooltip
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
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

export default DonutChart;
