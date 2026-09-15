# Google AI Studio upload order

The full handoff exceeded a 30 MiB per-file upload limit. These archives are
logical source groups, not arbitrary byte splits. Upload them all to the same
Studio workspace in this order.

1. `agamagizh-studio-source-part-01-context-and-clinic.zip`
   - all handoff documents, frontend references, original Studio source,
     hospital-platform owned source/config, generated environment templates,
     and WACRM reference source.
2. `agamagizh-studio-source-part-02-crm-backend.zip`
   - Rails backend and database/configuration source for the real Chatwoot CRM,
     excluding dashboard JavaScript and test trees supplied later.
3. `agamagizh-studio-source-part-03-crm-frontend.zip`
   - Chatwoot dashboard Vue source and relevant static presentation assets.
4. `agamagizh-studio-source-part-04-crm-tests.zip`
   - CRM RSpec, Vitest, Playwright source, fixtures, and test configuration.
5. `agamagizh-studio-source-part-05-crm-supporting-source.zip`
   - CRM enterprise source, root manifests/configuration, scripts, public
     non-generated assets, and remaining source required to restore the tree.

Each archive uses the same top-level `agamagizh-studio-full-source/` path.
If you extract all five archives into one directory, their contents compose the
same logical tree as the original full archive.

Read `START_HERE_FOR_GOOGLE_AI_STUDIO.md` from Part 01 before using any source.
