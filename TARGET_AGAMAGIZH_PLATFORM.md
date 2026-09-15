# Target Agamagizh platform

The intended destination is one coherent Agamagizh product experience, not one
database or a replacement of mature systems.

The product should make it possible to navigate across CRM, WhatsApp,
conversations, contacts, campaigns, templates, pipelines, automations,
chatbots, and analytics, alongside appropriately authorized clinical,
appointment, laboratory, billing/ERP, content/membership, patient portal,
administration, and reporting surfaces.

Google AI Studio should formulate the integration architecture from the source
in this package. The desired outcomes are:

- a Studio-quality product shell over real CRM and clinic authorities;
- CRM and WhatsApp experiences backed by canonical Chatwoot services;
- a safe patient/clinical experience backed by hospital authorities rather than
  copied CRM records;
- source-labelled operational, clinical, lab, and billing views;
- server-side identity mapping, authorization, auditing, and consent checks;
- a runnable local build and test story before any deployment discussion.

The source does not prescribe whether a gateway/BFF, shared component system,
or modular frontend is the best implementation. It does prescribe that
clinical records, lab data, billing data, provider dispatch, and identity
permissions retain their appropriate authority and safety controls.
