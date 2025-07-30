"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, Droplet, Wind, Fan, TestTube, TestTube2, Droplets as NutriIcon } from "lucide-react";
import useMqtt from "@/hooks/useMqtt";
import { useSensorStore } from "@/store/sensorStore";
import { shallow } from 'zustand/shallow'; // <-- Importamos o 'shallow'

export function ControlPanel() {
  const { publishCommand } = useMqtt();

  // --- MUDANÇA PRINCIPAL AQUI ---
  // Usamos 'shallow' para otimizar a subscrição e evitar o ciclo infinito.
  const actuatorStates = useSensorStore((state) => state.actuatorStates, shallow);

  const handleSwitchChange = (atuador: string, estado: boolean) => {
    const topic = 'aquasys/commands/control';
    const message = JSON.stringify({ atuador: atuador, acao: estado ? 'ON' : 'OFF' });
    publishCommand(topic, message);
  };

  return (
    <>
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Controle Manual
        </h1>
      </header>
      <Card className="shadow-sm">
        <CardHeader><CardTitle>Controles Gerais</CardTitle></CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
            <Label htmlFor="luzes-switch" className="flex items-center gap-2 text-lg"><Lightbulb className="h-6 w-6 text-yellow-400" />Iluminação Principal</Label>
            <Switch id="luzes-switch" checked={actuatorStates['luzes'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('luzes', c)} />
          </div>
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
            <Label htmlFor="bomba-agua-switch" className="flex items-center gap-2 text-lg"><Droplet className="h-6 w-6 text-blue-500" />Bomba de Água (Circulação)</Label>
            <Switch id="bomba-agua-switch" checked={actuatorStates['bombaAgua'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('bombaAgua', c)} />
          </div>
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
            <Label htmlFor="bomba-ar-switch" className="flex items-center gap-2 text-lg"><Wind className="h-6 w-6 text-cyan-400" />Bomba de Ar (Oxigenação)</Label>
            <Switch id="bomba-ar-switch" checked={actuatorStates['bombaAr'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('bombaAr', c)} />
          </div>
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
            <Label htmlFor="ventilador-switch" className="flex items-center gap-2 text-lg"><Fan className="h-6 w-6 text-gray-400" />Ventilador / Exaustor</Label>
            <Switch id="ventilador-switch" checked={actuatorStates['ventilador'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('ventilador', c)} />
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm mt-6">
        <CardHeader><CardTitle>Bombas Dosadoras</CardTitle></CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg"><Label htmlFor="ph-up-switch" className="flex items-center gap-2 text-lg"><TestTube className="h-6 w-6 text-purple-500" />Bomba pH Up</Label><Switch id="ph-up-switch" checked={actuatorStates['PUMP_PH_UP'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('PUMP_PH_UP', c)} /></div>
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg"><Label htmlFor="ph-down-switch" className="flex items-center gap-2 text-lg"><TestTube2 className="h-6 w-6 text-purple-500" />Bomba pH Down</Label><Switch id="ph-down-switch" checked={actuatorStates['PUMP_PH_DOWN'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('PUMP_PH_DOWN', c)} /></div>
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg"><Label htmlFor="nutri-a-switch" className="flex items-center gap-2 text-lg"><NutriIcon className="h-6 w-6 text-orange-500" />Bomba Nutriente A</Label><Switch id="nutri-a-switch" checked={actuatorStates['PUMP_NUTRI_A'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('PUMP_NUTRI_A', c)} /></div>
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg"><Label htmlFor="nutri-b-switch" className="flex items-center gap-2 text-lg"><NutriIcon className="h-6 w-6 text-green-500" />Bomba Nutriente B</Label><Switch id="nutri-b-switch" checked={actuatorStates['PUMP_NUTRI_B'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('PUMP_NUTRI_B', c)} /></div>
        </CardContent>
      </Card>
    </>
  );
}