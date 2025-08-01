"use client";

import { SensorCard } from "@/components/SensorCard";
import { useSensorStore } from "@/store/sensorStore";
import { Thermometer, Droplets, Waves, Zap, Bot } from "lucide-react";

export function Dashboard() {
  const dados = useSensorStore((state) => state.latestData);

  const nivelPercent = () => {
    if (dados.distancia_cm === undefined || isNaN(dados.distancia_cm)) return '---';
    const cheio = 30.0;
    const vazio = 35.0;
    let percent = 100.0 * (vazio - dados.distancia_cm) / (vazio - cheio);
    percent = Math.max(0, Math.min(percent, 100));
    return Math.round(percent);
  };
  
  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
        Dashboard
      </h1>
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SensorCard title="Temperatura da Água" value={dados.temp_agua ?? '---'} unit="°C" status="Ideal" icon={<Thermometer className="h-5 w-5 text-blue-500" />} />
        <SensorCard title="pH da Solução" value={dados.ph_value ?? '---'} unit="" status="Ideal" icon={<Bot className="h-5 w-5 text-green-500" />} />
        <SensorCard title="TDS" value={dados.tds_ppm ?? '---'} unit="ppm" status="OK" icon={<Zap className="h-5 w-5 text-yellow-500" />} />
        <SensorCard title="EC" value={dados.tds_ec ?? '---'} unit="µS/cm" status="OK" icon={<Zap className="h-5 w-5 text-yellow-500" />} />
        <SensorCard title="Nível do Reservatório" value={nivelPercent()} unit="%" status="OK" icon={<Waves className="h-5 w-5 text-cyan-500" />} />
        <SensorCard title="Temp. Ambiente" value={dados.temp_amb ?? '---'} unit="°C" status="Ideal" icon={<Thermometer className="h-5 w-5 text-orange-500" />} />
        <SensorCard title="Umidade do Ar" value={dados.umidade ?? '---'} unit="%" status="Ideal" icon={<Droplets className="h-5 w-5 text-indigo-500" />} />
      </div>
    </div>
  );
}