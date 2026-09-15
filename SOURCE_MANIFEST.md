# Source manifest

This manifest describes the source included in this sanitized handoff. Paths
are relative to the handoff root.

| Project | Source path | Framework | Authority / responsibility | Important entry points and interfaces |
|---|---|---|---|---|
| Chatwoot CRM fork | `crm/chatwoot-phase1` | Ruby on Rails, Vue 3, PostgreSQL, Redis, Sidekiq, Vite | CRM, contacts, inboxes, conversations, messages, staff permissions, WhatsApp, campaigns, automations, pipeline, analytics | `config/routes.rb`, `app/models`, `app/controllers`, `app/services`, `app/jobs`, `app/policies`, `app/javascript/dashboard`, `db`, `spec`, `tests/playwright` |
| Approved Vue reference | `frontend-reference` | Vue 3, TypeScript, Vite, Vue Flow | approved presentation reference only | `src`, `README.md`, adapter/integration docs, screenshots |
| Original Studio source | `studio-original` | React, TypeScript, Vite | original Studio-generated presentation/source reference | `src`, assets, route/component documentation, package manifest |
| Hospital platform | `hospital-platform` | Compose, React/Vite, Next.js/Payload, Express, Keycloak config | owned application/infrastructure source for clinic ecosystem | `compose.yaml`, `apps`, `svc`, `infra`, `bahmni`, `docs` |
| Clinical console | `hospital-platform/apps/console` | React, TypeScript, Vite | evaluation clinical console, role-aware UI; writes disabled | `src/services/index.ts`, `src/security`, `src/views`, OIDC configuration |
| Admin portal | `hospital-platform/apps/admin` | React, TypeScript, Vite, OIDC | administrative portal source | `src`, OIDC config, Docker/Vite manifests |
| Patient portal | `hospital-platform/apps/patient` | React, TypeScript, Vite | patient-facing source | `src`, manifests and Docker configuration |
| Public website | `hospital-platform/apps/web` | React, TypeScript, Vite/Express | web/enquiry surface | `src`, server/build config, environment template |
| Content application | `hospital-platform/apps/content` | Next.js, Payload CMS, PostgreSQL | content and membership-adjacent source | `src`, `tests`, Payload/Next config, Compose template |
| Operational bridge | `hospital-platform/svc/bridge` | Express | website inquiry and appointment bridge, Chatwoot integration, Bahmni readiness | `src/routes`, `src/chatwoot.js`, `src/bahmni.js`, environment template |
| Identity administration | `hospital-platform/svc/identity-admin` | Node/Express-style service | Keycloak management adapter | `src/index.js`, Docker and package manifest |
| Keycloak configuration | `hospital-platform/infra/keycloak` | Keycloak realm/theme/shell scripts | hospital identity realm, themes and roles | `realm/agamagizh-realm.json`, `themes`, provisioning scripts |
| Bahmni ownership layer | `hospital-platform/bahmni` | Compose/configuration/branding scripts | owned configuration and branding for Bahmni/OpenMRS/OpenELIS/Odoo boundaries | `compose.agamagizh.yaml`, `branding`, `config`, `manage`, `env.example` |
| WACRM reference | `references/agamagizh-wacrm` | Next.js, TypeScript, Supabase, React Flow | behavioral/design reference only; not authority | `src`, `supabase`, docs, MCP source, tests/config |

## CRM implementation map

The complete CRM tree is included rather than reduced to a feature extract.
For orientation, the custom domain source is concentrated in:

- Campaigns: `app/models/campaign.rb`, `campaign_recipient.rb`, campaign
  controllers/policies/services/jobs, migrations, dashboard campaign pages and
  store/API clients.
- Automations/chatbots: `app/models/automation_flow*.rb`,
  `app/services/automation_flows`, listeners/jobs/policies, Rails routes and
  Vue dashboard flows/chatbots pages.
- Pipelines: `app/models/clinic_pipeline*.rb`, `app/services/clinic_pipelines`,
  controllers/policies, Vue board/API clients.
- WhatsApp: channel source, template drafts, contacts/conversations APIs,
  WhatsApp dashboard routes/pages, provider integration and webhooks.
- Analytics: `OperationalAnalytics` services/controllers/API clients and
  CampaignRecipient-backed detail source.

## Data and database material

Rails migrations and `db/schema.rb` are included. Source-level fixtures and
tests are included when they are part of the application test tree; runtime
databases, dumps, Docker volumes, uploads, and real account data are excluded.

## Restore and build metadata

Package manifests, lockfiles, Gemfile/Gemfile.lock, Compose/Docker files, Vite,
TypeScript, lint, test, route, schema, configuration-template, and relevant
scripts are retained. `node_modules`, `vendor/bundle`, compiled output, caches,
and browser binaries are excluded because dependencies and builds can be
restored from included manifests.
