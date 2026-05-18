import { DashboardLayout } from "../layouts/DashboardLayout";
import {LeadsDashboard} from "../features/leads/LeadsDashboard"

export const DashboardPage = () => {
  return (
    <DashboardLayout>
      <LeadsDashboard />
    </DashboardLayout>
  );
};