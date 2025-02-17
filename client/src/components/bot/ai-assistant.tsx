import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Loader2 } from "lucide-react";

export function AIAssistant() {
  const [prompt, setPrompt] = useState("");

  const generateCommand = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await apiRequest("POST", "/api/ai/generate", { prompt });
      return res.json();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Command Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe the command you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
        />
        
        <Button
          className="w-full"
          onClick={() => generateCommand.mutate(prompt)}
          disabled={generateCommand.isPending}
        >
          {generateCommand.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Command"
          )}
        </Button>

        {generateCommand.data && (
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Generated Command:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(generateCommand.data, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
