import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBotSettingsSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus } from "lucide-react";
import type { BotSettings } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

type SettingsFormData = {
  token: string;
  prefix: string;
  name: string;
  status: string;
};

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: botSettings, isLoading } = useQuery<BotSettings[]>({
    queryKey: ["/api/settings"],
  });

  const createBot = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      const res = await apiRequest("POST", "/api/settings", {
        ...data,
        userId: user?.id,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Bot Added",
        description: "Your bot has been successfully added.",
      });
      form.reset();
    },
  });

  const updateBot = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: SettingsFormData }) => {
      const res = await apiRequest("PATCH", `/api/settings/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Bot Updated",
        description: "Your bot settings have been successfully updated.",
      });
    },
  });

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(insertBotSettingsSchema),
    defaultValues: {
      token: "",
      prefix: "!",
      name: "",
      status: "online",
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">Bot Settings</h1>

      <Tabs defaultValue="add-bot">
        <TabsList>
          <TabsTrigger value="add-bot">Add New Bot</TabsTrigger>
          {botSettings?.map((bot) => (
            <TabsTrigger key={bot.id} value={`bot-${bot.id}`}>
              {bot.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="add-bot">
          <Card>
            <CardHeader>
              <CardTitle>Add New Bot</CardTitle>
              <CardDescription>
                Add a new Discord bot to your DoccDev dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => createBot.mutate(data))}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bot Token</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your bot token"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Command Prefix</FormLabel>
                        <FormControl>
                          <Input placeholder="!" maxLength={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bot Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Awesome Bot" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Message</FormLabel>
                        <FormControl>
                          <Input placeholder="Playing games" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createBot.isPending}
                  >
                    {createBot.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Bot...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Bot
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {botSettings?.map((bot) => (
          <TabsContent key={bot.id} value={`bot-${bot.id}`}>
            <Card>
              <CardHeader>
                <CardTitle>Edit {bot.name}</CardTitle>
                <CardDescription>
                  Modify your bot's settings and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) =>
                      updateBot.mutate({ id: bot.id, data })
                    )}
                    className="space-y-6"
                  >
                    {/* Same form fields as above */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={updateBot.isPending}
                    >
                      {updateBot.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}