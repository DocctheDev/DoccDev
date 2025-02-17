import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Analytics } from "@shared/schema";

export function AnalyticsChart({ botId }: { botId?: number }) {
  const { data: analytics } = useQuery<Analytics[]>({
    queryKey: ["/api/analytics", botId],
    enabled: !!botId,
  });

  if (!analytics) return null;

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Command Usage</CardTitle>
        <CardDescription>
          Number of times each command has been used
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={analytics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="commandName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="usageCount" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}