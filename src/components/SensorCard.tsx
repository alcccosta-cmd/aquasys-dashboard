import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface SensorCardProps {
  title: string;
  value: number | string;
  unit: string;
  status: "Ideal" | "Atenção" | "Crítico" | "OK";
  icon: React.ReactNode;
}

export function SensorCard({ title, value, unit, status, icon }: SensorCardProps) {
  const statusColors: { [key: string]: string } = {
    Ideal: "text-green-500",
    OK: "text-green-500",
    Atenção: "text-yellow-500",
    Crítico: "text-red-500",
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          {value} <span className="text-xl font-normal text-gray-500 dark:text-gray-400">{unit}</span>
        </div>
        <p className={`text-xs mt-1 font-semibold ${statusColors[status] || 'text-gray-500'}`}>
          {status}
        </p>
      </CardContent>
    </Card>
  );
}