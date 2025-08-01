"use client";

import { useSensorStore } from "@/store/sensorStore";
import { shallow } from 'zustand/shallow'; // <-- PASSO 1: Importe
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";

export function ChartsDisplay() {
  // PASSO 2: Use o 'shallow' para otimizar
const dataHistory = useSensorStore((state) => state.dataHistory);
  const { theme } = useTheme();
  
  const reversedHistory = [...dataHistory].reverse();

  const formatXAxis = (tickItem: number) => {
    return new Date(tickItem).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const chartConfig = {
    ph_value: { label: "pH", color: theme === 'dark' ? "hsl(var(--chart-1))" : "#10b981" },
    tds_ppm: { label: "TDS (ppm)", color: theme === 'dark' ? "hsl(var(--chart-2))" : "#f59e0b" },
    temp_agua: { label: "Temp. Água", color: theme === 'dark' ? "hsl(var(--chart-3))" : "#3b82f6" },
  } satisfies ChartConfig;

  return (
    <>
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Gráficos Históricos
        </h1>
      </header>
      <div className="grid gap-6 grid-cols-1">
        <Card>
          <CardHeader><CardTitle>Variação do pH</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reversedHistory} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} /><XAxis dataKey="timestamp" tickFormatter={formatXAxis} /><YAxis domain={[5, 8]} tickCount={4} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Line dataKey="ph_value" type="monotone" stroke="var(--color-ph_value)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Variação de TDS (ppm)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reversedHistory} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} /><XAxis dataKey="timestamp" tickFormatter={formatXAxis} /><YAxis domain={['dataMin - 100', 'dataMax + 100']} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Line dataKey="tds_ppm" type="monotone" stroke="var(--color-tds_ppm)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Variação da Temperatura da Água (°C)</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reversedHistory} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid vertical={false} /><XAxis dataKey="timestamp" tickFormatter={formatXAxis} /><YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Line dataKey="temp_agua" type="monotone" stroke="var(--color-temp_agua)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}