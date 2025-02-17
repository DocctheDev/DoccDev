import { StatusCard } from "@/components/bot/status-card";
import { AnalyticsChart } from "@/components/bot/analytics";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Command, BotSettings } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: botSettings } = useQuery<BotSettings[]>({
    queryKey: ["/api/settings"],
  });

  const activeBotId = botSettings?.[0]?.id;

  const { data: commands } = useQuery<Command[]>({
    queryKey: ["/api/commands", activeBotId],
    enabled: !!activeBotId,
  });

  return (
    <div className="space-y-4 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commands?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Bots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{botSettings?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <AnalyticsChart botId={activeBotId} />
    </div>
  );
}