// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { ENV } from "@/services/config.service";
import * as Sentry from "@sentry/nextjs";



Sentry.init({
  dsn: "https://ea74629eb6cabdfc517a48103cb4288c@o4508041828237312.ingest.us.sentry.io/4508058237796352",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: ENV !== "local" ? 1.0 : 0.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  environment: ENV,
  enabled: ENV !== "local",
});
