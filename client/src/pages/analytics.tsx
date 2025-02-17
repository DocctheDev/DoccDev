import { AnalyticsChart } from "@/components/bot/analytics";

export default function Analytics() {
  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <AnalyticsChart />
    </div>
  );
}
