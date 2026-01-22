import SummaryCards from "@/features/incidents/components/SummaryCards";
import IncidentsTable from "@/features/incidents/components/IncidentsTable";
import FilterControls from "@/features/filter/components/FilterControls";
import { Card } from "@heroui/react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background px-6 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <SummaryCards />
        <Card className="bg-content1 border-divider">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Active Incidents
            </h3>
            <div className="mb-6">
              <FilterControls />
            </div>
            <IncidentsTable />
          </div>
        </Card>

      </div>
    </div>
  );
}
