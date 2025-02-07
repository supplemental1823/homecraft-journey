
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { House } from "lucide-react";

// This would typically come from your database
const homeData = {
  address: "123 Main Street",
  city: "Springfield",
  state: "IL",
  zipCode: "62701",
  bedrooms: 3,
  bathrooms: 2,
  squareFootage: 2000
};

export const HomeDetails = () => {
  return (
    <Card className="hover-scale">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Home Details</CardTitle>
        <House className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-lg font-medium">{homeData.address}</p>
            <p className="text-muted-foreground">
              {homeData.city}, {homeData.state} {homeData.zipCode}
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Bedrooms</p>
              <p className="text-lg font-medium">{homeData.bedrooms}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Bathrooms</p>
              <p className="text-lg font-medium">{homeData.bathrooms}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Square Feet</p>
              <p className="text-lg font-medium">{homeData.squareFootage.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
