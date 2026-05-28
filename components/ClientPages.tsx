"use client";

import { useEffect, useState, type ComponentType } from "react";

function createClientComponent(load: () => Promise<ComponentType>) {
  return function ClientComponent() {
    const [Component, setComponent] = useState<ComponentType | null>(null);

    useEffect(() => {
      let mounted = true;

      load().then((LoadedComponent) => {
        if (mounted) {
          setComponent(() => LoadedComponent);
        }
      });

      return () => {
        mounted = false;
      };
    }, []);

    return Component ? <Component /> : null;
  };
}

export const ClientExperience = createClientComponent(() => import("./Experience").then((mod) => mod.Experience));

export const ClientCareersPage = createClientComponent(() => import("./CareersPage").then((mod) => mod.CareersPage));

export const ClientFulfillmentJobPage = createClientComponent(() =>
  import("./CareersPage").then((mod) => mod.FulfillmentJobPage),
);

export const ClientAboutPage = createClientComponent(() => import("./AboutPage").then((mod) => mod.AboutPage));
