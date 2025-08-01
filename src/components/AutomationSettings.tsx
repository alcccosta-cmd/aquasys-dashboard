// Em src/components/AutomationSettings.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useMqtt from "@/hooks/useMqtt";
import { toast } from "sonner";

// Estrutura para guardar as regras de um estágio
interface RuleSet {
  luzOn: string;
  luzOff: string;
  ecMin: number;
}

export function AutomationSettings() {
  const { publishCommand } = useMqtt();

  // Estados para guardar os valores do formulário
  const [vegetativoRules, setVegetativoRules] = useState<RuleSet>({ luzOn: "04:00", luzOff: "23:59", ecMin: 1000 });
  const [floracaoRules, setFloracaoRules] = useState<RuleSet>({ luzOn: "06:00", luzOff: "18:00", ecMin: 1200 });
  const [commonRules, setCommonRules] = useState({ tempMax: 28, umidadeMin: 60, phMin: 5.70, phMax: 6.39 });
  const [plantStage, setPlantStage] = useState<"vegetativo" | "floracao">("vegetativo");
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(true);

  // --- LÓGICA DE ENVIO PARA O MQTT ---
  const handleSaveSettings = () => {
    const topic = 'aquasys/commands/config';
    
    // Divide as horas e minutos para enviar como números
    const [vegOnH, vegOnM] = vegetativoRules.luzOn.split(':').map(Number);
    const [vegOffH, vegOffM] = vegetativoRules.luzOff.split(':').map(Number);
    const [floOnH, floOnM] = floracaoRules.luzOn.split(':').map(Number);
    const [floOffH, floOffM] = floracaoRules.luzOff.split(':').map(Number);

    const payload = {
      automation_enabled: isAutomationEnabled ? 1 : 0, // 1 para ON, 0 para OFF
      plant_stage: plantStage === "vegetativo" ? 0 : 1, // 0 para Veg, 1 para Flo
      
      // Regras comuns
      com_temp_max: commonRules.tempMax,
      com_umid_min: commonRules.umidadeMin,
      com_ph_min: commonRules.phMin,
      com_ph_max: commonRules.phMax,
      
      // Regras do estágio vegetativo
      veg_luz_on_h: vegOnH,
      veg_luz_on_m: vegOnM,
      veg_luz_off_h: vegOffH,
      veg_luz_off_m: vegOffM,
      veg_ec_min: vegetativoRules.ecMin,
      
      // Regras do estágio de floração
      flo_luz_on_h: floOnH,
      flo_luz_on_m: floOnM,
      flo_luz_off_h: floOffH,
      flo_luz_off_m: floOffM,
      flo_ec_min: floracaoRules.ecMin,
    };

    const message = JSON.stringify(payload);
    publishCommand(topic, message);

    toast.success("Configurações salvas e enviadas com sucesso!");
  };

  // Funções para atualizar os estados do formulário
  const handleCommonRuleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setCommonRules({ ...commonRules, [e.target.name]: parseFloat(e.target.value) }); };
  const handleVegRuleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setVegetativoRules({ ...vegetativoRules, [e.target.name]: e.target.name === 'ecMin' ? parseFloat(e.target.value) : e.target.value }); };
  const handleFloRuleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFloracaoRules({ ...floracaoRules, [e.target.name]: e.target.name === 'ecMin' ? parseFloat(e.target.value) : e.target.value }); };
  
  return (
    <>
      <header className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Configurações de Automação
        </h1>
        <p className="mt-1 text-md text-gray-600 dark:text-gray-400">
          Defina as regras que o sistema usará para operar de forma autónoma.
        </p>
      </header>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Controle Geral da Automação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
            <Label htmlFor="automation-switch" className="flex flex-col space-y-1">
              <span className="text-lg">Modo Automático</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Quando ativo, o sistema controlará os atuadores com base nas regras.
              </span>
            </Label>
            <Switch
              id="automation-switch"
              checked={isAutomationEnabled}
              onCheckedChange={setIsAutomationEnabled}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader><CardTitle>Estágio Atual da Planta</CardTitle></CardHeader>
        <CardContent>
          <Select value={plantStage} onValueChange={(value: "vegetativo" | "floracao") => setPlantStage(value)}>
            <SelectTrigger><SelectValue placeholder="Selecione o estágio..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="vegetativo">Vegetativo</SelectItem>
              <SelectItem value="floracao">Floração</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs defaultValue="comum" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comum">Parâmetros Comuns</TabsTrigger>
          <TabsTrigger value="vegetativo">Estágio Vegetativo</TabsTrigger>
          <TabsTrigger value="floracao">Estágio de Floração</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comum">
          <Card>
            <CardHeader><CardTitle>Regras Comuns</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="tempMax">Temperatura Máxima (°C)</Label><Input id="tempMax" name="tempMax" type="number" value={commonRules.tempMax} onChange={handleCommonRuleChange} /></div>
              <div className="space-y-2"><Label htmlFor="umidadeMin">Umidade Mínima (%)</Label><Input id="umidadeMin" name="umidadeMin" type="number" value={commonRules.umidadeMin} onChange={handleCommonRuleChange} /></div>
              <div className="space-y-2"><Label htmlFor="phMin">pH Mínimo</Label><Input id="phMin" name="phMin" type="number" step="0.01" value={commonRules.phMin} onChange={handleCommonRuleChange} /></div>
              <div className="space-y-2"><Label htmlFor="phMax">pH Máximo</Label><Input id="phMax" name="phMax" type="number" step="0.01" value={commonRules.phMax} onChange={handleCommonRuleChange} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vegetativo">
          <Card>
            <CardHeader><CardTitle>Regras para o Período Vegetativo</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="veg-luzOn">Ligar Iluminação (HH:MM)</Label><Input id="veg-luzOn" name="luzOn" type="time" value={vegetativoRules.luzOn} onChange={handleVegRuleChange} /></div>
              <div className="space-y-2"><Label htmlFor="veg-luzOff">Desligar Iluminação (HH:MM)</Label><Input id="veg-luzOff" name="luzOff" type="time" value={floracaoRules.luzOff} onChange={handleFloRuleChange} /></div>
              <div className="space-y-2"><Label htmlFor="veg-ecMin">EC Mínimo (µS/cm)</Label><Input id="veg-ecMin" name="ecMin" type="number" value={vegetativoRules.ecMin} onChange={(e) => setVegetativoRules({...vegetativoRules, ecMin: parseFloat(e.target.value)})} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="floracao">
          <Card>
            <CardHeader><CardTitle>Regras para o Período de Floração</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="flo-luzOn">Ligar Iluminação (HH:MM)</Label><Input id="flo-luzOn" name="luzOn" type="time" value={floracaoRules.luzOn} onChange={handleFloRuleChange} /></div>
              <div className="space-y-2"><Label htmlFor="flo-luzOff">Desligar Iluminação (HH:MM)</Label><Input id="flo-luzOff" name="luzOff" type="time" value={floracaoRules.luzOff} onChange={handleFloRuleChange} /></div>
              <div className="space-y-2"><Label htmlFor="flo-ecMin">EC Mínimo (µS/cm)</Label><Input id="flo-ecMin" name="ecMin" type="number" value={floracaoRules.ecMin} onChange={(e) => setFloracaoRules({...floracaoRules, ecMin: parseFloat(e.target.value)})} /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings}>Salvar Todas as Configurações</Button>
      </div>
    </>
  );
}