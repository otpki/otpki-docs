---
title: Publishing
hide_table_of_contents: true
toc_min_heading_level: 2
toc_max_heading_level: 2
---

## Publishers

Publishers enable automatic upload of PKI artifacts (CRL, Certificates) to external systems when they are generated or on certain events (Issuance, Revocation).

Publishers have different types of configurations that enable integration to different external systems using different connections or protocols.

After a configuration is made, a Certificate or CRL publisher can be assigned to your CA or Certificate Profiles. Then when the artifact is generated and matches the configured criteria it will be published to your desired destinations.

## Publishing Areas

### Publisher Configurations

- [HTTP Publisher](./http-publisher)
- [SCP Publisher](./scp-publisher)
- [VS Publisher](./vs-publisher)

### Publishers

- [Certificate Publishers](./cert-publishers)
- [CRL Publishers](./crl-publishers)
