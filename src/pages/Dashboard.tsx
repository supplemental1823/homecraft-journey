
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeDetails } from "@/components/dashboard/HomeDetails";
import { RecurringMaintenance } from "@/components/dashboard/RecurringMaintenance";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Row A */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Home Details */}
        <HomeDetails />
        
        {/* Recurring Maintenance */}
        <RecurringMaintenance />
      </div>
    </div>
  );
};

export default Dashboard;
