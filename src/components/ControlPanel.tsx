"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, Droplet, Wind, Fan, TestTube, TestTube2, Droplets as NutriIcon } from "lucide-react";
import useMqtt from "@/hooks/useMqtt";
import { useSensorStore } from "@/store/sensorStore";
import { shallow } from 'zustand/shallow';

export function ControlPanel() {
  const { publishCommand } = useMqtt();
const actuatorStates = useSensorStore((state) => state.actuatorStates);
  const handleSwitchChange = (atuador: string, estado: boolean) => {
    const topic = 'aquasys/commands/control';
    const message = JSON.stringify({ atuador: atuador, acao: estado ? 'ON' : 'OFF' });
    publishCommand(topic, message);
  };

  return (
    <div className="w-full">
       <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
        Controle Manual
      </h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Controles do Ambiente</CardTitle>
            <CardDescription>Acione os dispositivos principais do seu cultivo.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
              <Label htmlFor="luzes-switch" className="flex items-center gap-3 text-md font-medium"><Lightbulb className="h-6 w-6 text-yellow-400" />Iluminação Principal</Label>
              <Switch id="luzes-switch" checked={actuatorStates['luzes'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('luzes', c)} />
            </div>
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
              <Label htmlFor="bomba-agua-switch" className="flex items-center gap-3 text-md font-medium"><Droplet className="h-6 w-6 text-blue-500" />Bomba de Água</Label>
              <Switch id="bomba-agua-switch" checked={actuatorStates['bombaAgua'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('bombaAgua', c)} />
            </div>
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
              <Label htmlFor="bomba-ar-switch" className="flex items-center gap-3 text-md font-medium"><Wind className="h-6 w-6 text-cyan-400" />Bomba de Ar</Label>
              <Switch id="bomba-ar-switch" checked={actuatorStates['bombaAr'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('bombaAr', c)} />
            </div>
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
              <Label htmlFor="ventilador-switch" className="flex items-center gap-3 text-md font-medium"><Fan className="h-6 w-6 text-gray-400" />Ventilador</Label>
              <Switch id="ventilador-switch" checked={actuatorStates['ventilador'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('ventilador', c)} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bombas Dosadoras</CardTitle>
            <CardDescription>Acione as bombas de correção e nutrientes.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg"><Label htmlFor="ph-up-switch" className="flex items-center gap-3 text-md font-medium"><TestTube className="h-6 w-6 text-purple-500" />Bomba pH Up</Label><Switch id="ph-up-switch" checked={actuatorStates['PUMP_PH_UP'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('PUMP_PH_UP', c)} /></div>
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg"><Label htmlFor="ph-down-switch" className="flex items-center gap-3 text-md font-medium"><TestTube2 className="h-6 w-6 text-purple-500" />Bomba pH Down</Label><Switch id="ph-down-switch" checked={actuatorStates['PUMP_PH_DOWN'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('PUMP_PH_DOWN', c)} /></div>
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg"><Label htmlFor="nutri-a-switch" className="flex items-center gap-3 text-md font-medium"><NutriIcon className="h-6 w-6 text-orange-500" />Bomba Nutriente A</Label><Switch id="nutri-a-switch" checked={actuatorStates['PUMP_NUTRI_A'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('PUMP_NUTRI_A', c)} /></div>
            <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg"><Label htmlFor="nutri-b-switch" className="flex items-center gap-3 text-md font-medium"><NutriIcon className="h-6 w-6 text-green-500" />Bomba Nutriente B</Label><Switch id="nutri-b-switch" checked={actuatorStates['PUMP_NUTRI_B'] === 'ON'} onCheckedChange={(c) => handleSwitchChange('PUMP_NUTRI_B', c)} /></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}