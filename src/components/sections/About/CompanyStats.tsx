import "./CompanyStats.css";

import StatCircle from "@/components/ui/StatCircle";

import { companyStats } from "@/data/about/companyStats";

export default function CompanyStats() {
  return (
    <section className="company-stats">

      {companyStats.map((item) => (
        <StatCircle
          key={item.id}
          value={item.value}
          suffix={item.suffix}
          label={item.label}
          progress={item.progress}
        />
      ))}

    </section>
  );
}