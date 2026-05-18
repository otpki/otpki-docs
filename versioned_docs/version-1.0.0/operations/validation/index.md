---
title: Validation
toc_min_heading_level: 2
toc_max_heading_level: 2
---

# Validation Service

The OTPKI system features a Validation Service which is responsible for serving CRLs and responding to OCSP requests`*`

This is typically configured with a VS Publisher for the required artifacts but is not required. It will act as a pull-through cache for any CRL or OCSP response it does not have until it is configured to be pushed to via the VS publisher.

## Validation Areas

- [OCSP](./ocsp) `*`
- [CRL](./crl)

`*` _Coming soon_
