"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function ImageSequenceCSSEditor({}) {
  return (
    <Tabs defaultValue="container" className="mx-auto w-full max-w-3xl">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="image">Image CSS</TabsTrigger>
        <TabsTrigger value="container">Container CSS</TabsTrigger>
        <TabsTrigger value="overlay">Overlay CSS</TabsTrigger>
      </TabsList>
      <TabsContent value="image">
        <Card className="h-96">
          <CardContent></CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="container">
        <Card className="h-96">
          <CardContent></CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="overlay">
        <Card className="h-96">
          <CardContent></CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
