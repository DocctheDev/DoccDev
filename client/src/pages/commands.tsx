import { useQuery } from "@tanstack/react-query";
import { CommandEditor } from "@/components/bot/command-editor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Command } from "@shared/schema";

export default function Commands() {
  const { data: commands } = useQuery<Command[]>({
    queryKey: ["/api/commands"],
  });

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Commands</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-4">Create Command</h2>
          <CommandEditor />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Existing Commands</h2>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commands?.map((command) => (
                  <TableRow key={command.id}>
                    <TableCell className="font-medium">
                      {command.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={command.enabled ? "default" : "secondary"}
                      >
                        {command.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {command.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
