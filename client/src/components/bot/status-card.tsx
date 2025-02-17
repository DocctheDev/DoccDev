import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WifiIcon } from "lucide-react";

type Status = {
  online: boolean;
  latency: number;
};

export function StatusCard() {
  const [status, setStatus] = useState<Status>({ online: false, latency: 0 });

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "status") {
        setStatus(data.data);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
        <WifiIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Badge
            variant={status.online ? "default" : "destructive"}
            className="h-4"
          >
            {status.online ? "Online" : "Offline"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Latency: {Math.round(status.latency)}ms
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
