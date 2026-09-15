# Current architecture: verified source baseline

## CRM and WhatsApp

The real CRM implementation is the Chatwoot fork in `crm/chatwoot-phase1`.
It is a Rails/Vue/PostgreSQL application with Chatwoot accounts, agents, teams,
contacts, conversations, messages, inboxes, permissions, ActionCable/realtime
behavior, and a WhatsApp channel.

Custom Agamagizh source extends rather than replaces those domains:

- `Campaign` and `CampaignRecipient` support recipient lifecycle, scheduling,
  dispatch, retries, cancellation, preflight, consent, suppression, and
  campaign analytics.
- `ClinicPipeline*` stores operational enquiry/follow-up state, not clinical
  records.
- `AutomationFlow*` stores graph versions, runs, events, waits, validation,
  capability registries, safe handoff, and chatbot execution.
- Account-scoped Rails APIs serve WhatsApp conversations, contacts, templates,
  template drafts, pipelines, automations, chatbots, campaign details, and
  analytics.

The current frontend contains native Studio-style pages and custom routes, but
the package must be treated as source to study rather than as a claim that the
entire intended unified product is complete. The Vue reference remains a
presentation reference with isolated demo data.

## Hospital platform

The local hospital source is a multi-application Compose environment, not a
single unified database.

- `apps/console` is a React clinical-console evaluation application. Its
  `CLINICAL_WRITES_ENABLED` constant is `false`; write methods deliberately
  raise `ClinicalWriteDisabledError`. Its current data store includes mock/evaluation
  data and must not be presented as live EMR integration.
- `apps/admin`, `apps/patient`, and `apps/web` are separate React/Vite portal
  sources.
- `apps/content` is a Next.js/Payload content application with its own database
  service in Compose.
- `svc/bridge` is a small Express bridge for website inquiries/appointments
  and operational integration. It is not an EMR.
- `infra/keycloak` provides owned realm/theme/role provisioning material.
- `bahmni` contains Agamagizh-owned configuration and branding around a stock
  Bahmni/OpenMRS upstream submodule.

## Current authority and connection status

| Area | Current source state |
|---|---|
| CRM / WhatsApp | mature local application source with custom extension source |
| Campaign safety | source includes consent, suppression, canonical preflight, recipient ledger |
| Templates | provider-synced/template-draft architecture; provider approval is external |
| Automations / chatbots | graph engine and UI/source are present; execution safety is source-defined |
| Clinical console | evaluation/read-oriented surface with writes disabled |
| Bahmni/OpenMRS | external clinical authority with custom local config/branding wrapper |
| OpenELIS / Odoo | external authority boundaries configured/documented, not bundled vendor systems |
| Keycloak | owned identity realm/theme/provisioning source; separate from Chatwoot auth |
| Patient identity mapping | documented as a future server-side integration requirement, not a unified record |

## Provider and deployment status

This handoff is local source only. It does not include or authorize production
credentials, provider actions, migrations against real data, clinical writes,
or deployment state. Existing docs may describe production topology as context;
they are not deployment instructions.
