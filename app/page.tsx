import { IpodProvider } from "@/components/IpodContext";
import { IpodExperience } from "@/components/IpodExperience";

export default function Home() {
  return (
    <IpodProvider>
      <IpodExperience />
    </IpodProvider>
  );
}
