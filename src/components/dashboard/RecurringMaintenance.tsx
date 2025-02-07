
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export const RecurringMaintenance = () => {
  return (
    <Card className="hover-scale">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Recurring Maintenance</CardTitle>
        <Calendar className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
          Coming soon...
        </div>
      </CardContent>
    </Card>
  );
};
