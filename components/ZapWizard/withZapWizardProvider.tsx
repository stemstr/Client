import { type ComponentType } from "react";
import { ZapWizardProvider } from "./ZapWizardProvider";

export function withZapWizardProvider(Component: ComponentType) {
  const ZapWizardProviderHOC = () => (
    <ZapWizardProvider>
      <Component />
    </ZapWizardProvider>
  );

  return ZapWizardProviderHOC;
}
