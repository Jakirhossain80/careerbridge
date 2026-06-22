import CompanyProfileOverview from "@/components/employer-company-profile/CompanyProfileOverview";
import { employerCompanyProfile } from "@/lib/employer-company-profile-data";

export default function EmployerCompanyProfilePage() {
  return <CompanyProfileOverview company={employerCompanyProfile} />;
}
