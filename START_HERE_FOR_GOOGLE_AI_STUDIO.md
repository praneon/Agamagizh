# Start here: Agamagizh source handoff

The frontend currently running in this Google AI Studio project is the approved
design authority. This package contains the real Agamagizh application
ecosystem, including the maintained CRM implementation and the separately
authoritative clinic-platform source.

Study the supplied source before proposing an architecture change. Preserve the
approved Studio frontend and connect or rebuild it around the real business
logic contained in this package. You may restructure application code where it
is needed, but do not blindly preserve the presentation layers of Chatwoot,
Bahmni, OpenELIS, or Odoo.

Preserve mature backend and domain behavior where appropriate. Formulate the
integration architecture after studying the source, then build a coherent
Agamagizh Console covering CRM and the wider clinic platform. Return runnable
source for local validation only; do not deploy or connect production/provider
systems.

## Read in this order

1. `SOURCE_MANIFEST.md` — source trees, entry points, APIs, and ownership.
2. `CURRENT_ARCHITECTURE.md` — current implemented state and known boundaries.
3. `DOMAIN_AUTHORITY_AND_SAFETY.md` — safeguards that must not be casually
   removed.
4. `HANDOFF_DEPENDENCY_MAP.md` — runtime and source dependencies.
5. `TARGET_AGAMAGIZH_PLATFORM.md` — product direction, not a dictated design.
6. `crm/chatwoot-phase1/AGENTS.md` and the relevant CRM documentation before
   changing its source.

## Source layout

- `crm/chatwoot-phase1/`: real Rails/Vue/PostgreSQL CRM and WhatsApp engine.
- `frontend-reference/`: approved standalone Vue design reference. Its adapter
  fixtures are design-only and are not production data.
- `studio-original/`: restored original Studio React source/reference archive,
  extracted for inspection.
- `hospital-platform/`: Agamagizh-owned hospital application source,
  infrastructure, custom Bahmni configuration, and supporting docs.
- `references/agamagizh-wacrm/`: separate WACRM-inspired reference application
  retained for comparison only. It is not the WhatsApp sender or source of
  truth.
- `generated-env-templates/`: variable-name-only configuration guides. They
  contain no copied environment values.

## Non-negotiable boundaries

- Chatwoot is the CRM, conversation, messaging, campaign, WhatsApp sender, and
  Meta webhook authority.
- Bahmni/OpenMRS owns EMR, patient, encounter, and appointment records.
- OpenELIS owns laboratory records and Odoo owns billing/ERP when integrated.
- Keycloak is the hospital-platform identity authority. Do not replace current
  Chatwoot authentication without a separately designed migration.
- The current clinical console is an evaluation workspace with writes disabled.
- No source here authorizes provider sends, template submission, clinical
  writes, credentials, staging, production, DNS, or deployment changes.

## Package sanitation

This bundle intentionally excludes `.git`, live `.env` files, all secret
directories and private keys, dependencies, generated assets, runtime data,
logs, backups, storage, database volumes/dumps, browser data, and test-output
artifacts. See `docs/SANITIZATION_AND_VALIDATION.md`.
