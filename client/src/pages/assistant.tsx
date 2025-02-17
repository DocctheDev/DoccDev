import { AIAssistant } from "@/components/bot/ai-assistant";

export default function Assistant() {
  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">AI Assistant</h1>
      <div className="max-w-2xl">
        <AIAssistant />
      </div>
    </div>
  );
}
