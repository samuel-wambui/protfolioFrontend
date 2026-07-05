import { getProfile } from "@/lib/portfolio-api";
import { SiteNavigation } from "@/components/site-navigation";
import { resolveProfile } from "@/data/portfolio-fallbacks";

export async function SiteHeader() {
  const profile = resolveProfile(await getProfile());

  return <SiteNavigation fullName={profile.fullName} />;
}
