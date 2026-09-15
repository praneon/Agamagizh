# Domain authority and safety boundaries

| Domain | Current authority | Safety and integration constraint |
|---|---|---|
| CRM contacts, companies, agents, teams | Chatwoot Rails/PostgreSQL | do not create a shadow CRM database |
| Conversations and messages | Chatwoot | preserve permissions, realtime, retention and channel behavior |
| WhatsApp channel, Meta webhook and dispatch | Chatwoot | one sender/webhook owner; no second client or bypass path |
| Campaign eligibility and recipients | Chatwoot `Campaign`, `CampaignRecipient`, preflight services | candidates are not eligible recipients; consent/suppression/dedupe must remain server enforced |
| Templates | Chatwoot template sync/drafts and provider | provider approval remains provider-authoritative; do not submit from this task |
| Pipelines | Chatwoot `ClinicPipeline*` | operational only: no diagnoses, notes, prescriptions, or clinical documents |
| Rules and chatbots | Chatwoot `AutomationFlow*` | preserve graph validation, run history, waits, handoff, and execution safety gates |
| CRM analytics | Chatwoot operational analytics/recipient data | do not fabricate metrics or reconstruct canonical counts in browsers |
| Hospital identity | Keycloak | role and permission checks remain server-side; no client-only entitlement |
| Patient / EMR / encounters / appointments | Bahmni/OpenMRS | no duplicate patient/EMR records; current console writes are disabled |
| Laboratory | OpenELIS | integration/read boundary only until an authorized contract is implemented |
| Billing / ERP | Odoo | preserve accounting authority; do not recreate billing in CRM |
| Content / membership | Payload content application | keep content/member concerns separate from EMR and CRM data |
| Patient portal | separate patient application | patient-to-source mapping must be server-linked and audited |

## Explicit current safety gates

- The clinical console source explicitly disables clinical writes.
- Bridge Bahmni readiness requires configuration and has a separate clinical
  write flag; no configuration values are supplied in this handoff.
- Chatwoot campaign and automation paths re-check server-side constraints.
- WhatsApp consent, suppression, provider window/template requirements, and
  recipient lifecycle must not be moved to client-only logic.
- Keycloak provisioning scripts may require bootstrap credentials, which are
  deliberately absent from this bundle.
- No private keys, tokens, passwords, database URLs, session secrets, or real
  patient/conversation data are included.
