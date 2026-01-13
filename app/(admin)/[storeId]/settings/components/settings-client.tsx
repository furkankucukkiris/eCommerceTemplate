"use client";

import { Store } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Alt bileşenler
import { AttributesClient } from "./attributes-client";
import { SettingsForm } from "./settings-form"; // Mevcut isim/silme formunuz (varsa)
import { ApiAlert } from "@/components/ui/api-alert"; // Varsa API alert bileşeni
import { AttributeColumn } from "./columns";

interface SettingsClientProps {
  initialData: Store;
  attributes: AttributeColumn[];
}

export const SettingsClient: React.FC<SettingsClientProps> = ({
  initialData,
  attributes
}) => {
  return (
    <>
      <div className="mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Ayarlar</h2>
        <p className="text-sm text-muted-foreground">
          Mağaza tercihlerinizi ve genel yapılandırmaları yönetin.
        </p>
      </div>
      
      <Separator className="my-4" />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="attributes">Nitelikler (Varyasyonlar)</TabsTrigger>
          <TabsTrigger value="api">API Bağlantıları</TabsTrigger>
        </TabsList>
        
        {/* 1. TAB: GENEL AYARLAR */}
        <TabsContent value="general" className="space-y-4">
            {/* Mevcut Store Formunuz buraya gelecek */}
            <SettingsForm initialData={initialData} />
        </TabsContent>
        
        {/* 2. TAB: NİTELİKLER */}
        <TabsContent value="attributes" className="space-y-4">
            <AttributesClient data={attributes} />
        </TabsContent>

        {/* 3. TAB: API BİLGİLERİ */}
        <TabsContent value="api" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-4">Public API URL</h3>
                <ApiAlert 
                    title="NEXT_PUBLIC_API_URL" 
                    description={`${origin}/api/${initialData.id}`} 
                    variant="public" 
                />
            </div>
        </TabsContent>
      </Tabs>
    </>
  );
};