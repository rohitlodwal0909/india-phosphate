//  Profile Data
interface MiniiconsType {
  id: number;
  icon: string;
  tooltip: string;
}

const Miniicons: MiniiconsType[] = [
  {
    id: 1,
    icon: "solar:layers-line-duotone",
    tooltip: "Dashboards",
  },
  {
    id: 2,
    icon: "material-symbols:inventory-sharp",
    tooltip: "inventory Managment",
  },
  {
    id: 3,
    icon: "hugeicons:master-card",
    // icon: "solar:lock-keyhole-minimalistic-bold-duotone",
    tooltip: "Master",
  },

];

export default Miniicons;
