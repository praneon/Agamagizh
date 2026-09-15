# Handoff dependency map

This map is derived from the local source manifests, Compose wiring, route
definitions, and integration code in this handoff. It describes current source
relationships; it does not claim all services are running or connected.

```text
Agamagizh product experience
|
|-- CRM / communications authority
|   `-- crm/chatwoot-phase1 (Rails, Vue, PostgreSQL, Redis, Sidekiq)
|       |-- Chatwoot contacts, conversations, agents, teams, accounts
|       |-- WhatsApp channel, provider webhook, templates and realtime inbox
|       |-- Campaign + CampaignRecipient + consent/suppression/preflight
|       |-- ClinicPipeline and AutomationFlow graph/version/run services
|       `-- Operational analytics and account-scoped APIs
|
|-- Approved presentation references
|   |-- frontend-reference (Vue 3 / Vite / Vue Flow; mock adapter isolated)
|   `-- studio-original (restored Studio React source)
|
|-- Hospital / clinic platform
|   |-- hospital-platform/infra/keycloak
|   |   `-- Keycloak realm, theme, role-provisioning scripts
|   |-- hospital-platform/apps/console
|   |   `-- React clinical-console evaluation UI; write lock is explicit
|   |-- hospital-platform/apps/admin
|   |   `-- React administration portal, OIDC client
|   |-- hospital-platform/apps/patient
|   |   `-- patient portal source
|   |-- hospital-platform/apps/content
|   |   `-- Next.js / Payload content and membership-adjacent application
|   |-- hospital-platform/apps/web
|   |   `-- public web / enquiry source
|   |-- hospital-platform/svc/bridge
|   |   `-- website inquiry/appointment bridge to Chatwoot; Bahmni readiness
|   |-- hospital-platform/svc/identity-admin
|   |   `-- Keycloak administration API adapter
|   `-- hospital-platform/bahmni
|       |-- owned branding, gateway rewrite, config and lifecycle wrapper
|       `-- stock Bahmni upstream referenced by exact commit, not bundled
|
`-- Reference-only application
    `-- references/agamagizh-wacrm (Next.js/Supabase/React Flow reference)
```

## Runtime wiring observed locally

`hospital-platform/compose.yaml` composes the content service/database, bridge,
web, console, admin, identity-admin, OAuth2-proxy edges, Redis gateway session,
patient portal, and Keycloak. It declares local ports and mounts Keycloak realm
and theme material. Bahmni is separately wrapped under `hospital-platform/bahmni`.

The bridge contains routes for inquiries, appointments, hospital/readiness,
integrations, and status. It uses Chatwoot as the communications system of
record and has an explicit Bahmni readiness/write configuration boundary.

## External service references

| System | Evidence in owned source | Handoff treatment |
|---|---|---|
| Bahmni/OpenMRS | `bahmni/compose.agamagizh.yaml`, `branding/`, `config/`, `manage` | owned config included; stock upstream remote/commit documented |
| OpenELIS | Bahmni branding/gateway and hospital docs | integration configuration/docs included; no vendor runtime bundled |
| Odoo | Compose access policy, gateway rewrite, hospital docs | boundary/config/docs included; no vendor runtime bundled |
| Keycloak | Compose, `infra/keycloak`, OIDC client code | owned realm/theme/scripts/source included |
| Meta/WhatsApp | Chatwoot channel/services/controller routes | source included; no tokens, provider activation, or requests |
