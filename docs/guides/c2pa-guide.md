---
title: C2PA PKI Configuration Guide
section: guides
sidebar_position: 4
description: Configure OTPKI to issue X.509 signing credentials that conform to the C2PA 2.x specification for content provenance and authenticity.
toc_min_heading_level: 2
toc_max_heading_level: 4
---

This guide provides a step-by-step procedure for configuring OTPKI to issue certificates that
conform to the **Coalition for Content Provenance and Authenticity (C2PA)** specification,
version 2.x.  C2PA is an open technical standard for attaching tamper-evident provenance
metadata to digital media — images, video, audio, and documents.  Every piece of C2PA-signed
content is signed by a signer credential: an end-entity X.509 certificate that must meet the
requirements described below.

## X.509 Certificate Requirements for C2PA

C2PA defines strict requirements for all certificates in a signing chain ([spec §14.5](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#x509_certificates)).  End-entity signer certificates must additionally carry the `c2pa-kp-claimSigning` EKU ([spec §14.4.1](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_c2pa_signers)).

### C2PA Root CA

| x509 Field / Extension | Requirement |
| ---------------------- | ----------- |
| version | `v3` |
| signatureAlgorithm | ECDSA (SHA2 variants), RSA (PSS or SHA2 variants) |
| subjectName | Requires C, O, CN attributes |
| issuerName | Matches subject name |
| validityPeriod | Long-term, e.g. 20y |
| subjectPublicKeyInfo | ECDSA P-384/P-521, RSA ≥ 3072-bit |
| basicConstraints | **MUST** be present and **MUST** be critical; cA=TRUE, pathLenConstraint=2 or less |
| authorityKeyIdentifier | **MUST** be present (RFC 5280 Method 1 - SHA1) |
| subjectKeyIdentifier | **MUST** be present (RFC 5280 Method 1 - SHA1) |
| keyUsage | **MUST** be present and **MUST** be critical; `keyCertSign`, `cRLSign` |
| certificatePolicies | _optional_; critical=false |
| AIA | **MUST NOT** be present |
| CDP |**MUST NOT** be present|

### C2PA Claim Signing Issuing CA

| x509 Field / Extension | Requirement |
| ---------------------- | ----------- |
| version | `v3` |
| signatureAlgorithm | ECDSA (SHA2 variants), RSA (PSS or SHA2 variants) |
| subjectName | Requires C, O, CN attributes |
| issuerName | Matches subject name of Root CA |
| validityPeriod | Max 1827 days |
| subjectPublicKeyInfo | ECDSA P-384/P-521, RSA ≥ 3072-bit |
| basicConstraints | **MUST** be present and **MUST** be critical; cA=TRUE, pathLenConstraint=0 |
| authorityKeyIdentifier | **MUST** be present (RFC 5280 Method 1 - SHA1) |
| subjectKeyIdentifier | **MUST** be present (RFC 5280 Method 1 - SHA1) |
| keyUsage | **MUST** be present and **MUST** be critical; `keyCertSign`, `cRLSign` |
| extendedKeyUsage | **MUST NOT** be critical; **MUST** contain `c2pa-kp-claimSigning` in addition to at least one of `id-kp-emailProtection`, `id-kp-documentSigning` |
| certificatePolicies | **MUST** contain `c2pa-certificate-policy` OID (1.3.6.1.4.1.62558.1.1). Qualifiers optional; critical=false |
| AIA | **MUST** be present (if CDP is not present); critical=false |
| CDP | **MUST** be present (if AIA is not present); critical=false |

### C2PA TSA Issuing CA

| x509 Field / Extension | Requirement |
| ---------------------- | ----------- |
| version | `v3` |
| signatureAlgorithm | ECDSA (SHA2 variants), RSA (PSS or SHA2 variants) |
| subjectName | Requires C, O, CN attributes |
| issuerName | Matches subject name of Root CA |
| validityPeriod | Max 5479 days |
| subjectPublicKeyInfo | ECDSA P-384/P-521, RSA ≥ 3072-bit |
| basicConstraints | **MUST** be present and **MUST** be critical; cA=TRUE, pathLenConstraint=0 |
| authorityKeyIdentifier | **MUST** be present (RFC 5280 Method 1 - SHA1) |
| subjectKeyIdentifier | **MUST** be present (RFC 5280 Method 1 - SHA1) |
| keyUsage | **MUST** be present and **MUST** be critical; `keyCertSign`, `cRLSign` |
| extendedKeyUsage | **MUST NOT** be critical; **MUST** contain `id-kp-timeStamping` |
| certificatePolicies | **MUST** contain `c2pa-certificate-policy` OID (1.3.6.1.4.1.62558.1.1). Qualifiers optional; critical=false |
| AIA | **MUST** be present (if CDP is not present); critical=false |
| CDP | **MUST** be present (if AIA is not present); critical=false |


### C2PA OCSP Responder

| x509 Field / Extension | Requirement |
| -------------- | ------------------- |
| version | `v3` |
| signatureAlgorithm | ECDSA (SHA2 variants), RSA (PSS or SHA2 variants) |
| subjectName | Requires C, O, CN attributes |
| issuerName | Matches subject name of signing ICA |
| validityPeriod | Specific dates set at generation (Max duration not specified by C2PA profile) |
| subjectPublicKeyInfo | ECDSA P-256/P-384/P-521, RSA ≥ 2048-bit |
| basicConstraints | **MUST** be present and **MUST** be critical; cA=FALSE |
| keyUsage | **MUST** be present and **MUST** be critical; `digitalSignature` |
| extendedKeyUsage | **MUST NOT** be critical; **MUST** contain `id-kp-OCSPSigning` |
| subjectKeyIdentifier | **MUST** be present |
| authorityKeyIdentifier | **MUST** be present |
| AIA | **MUST NOT** be present |
| CDP | **MUST NOT** be present |

### C2PA Claim Signing Leaf Certificates - Assurance Level 1

| x509 Field / Extension | Requirement |
| -------------- | ------------------- |
| version | `v3` |
| signatureAlgorithm | ECDSA (SHA2 variants), RSA (PSS or SHA2 variants), Ed25519 |
| subjectName | Must match C2PA Conforming Products List (CPL) entry. Requires C, O, CN attributes. |
| issuerName | Matches subject name of Claim Signing ICA |
| validityPeriod | Max 366 days ⚠️ |
| subjectPublicKeyInfo | ECDSA P-256/P-384/P-521, RSA ≥ 2048-bit, Ed25519 |
| basicConstraints | **MUST** be present and **MUST** be critical; cA=FALSE |
| keyUsage | **MUST** be present and **MUST** be critical; `digitalSignature`, `nonRepudiation` |
| extendedKeyUsage | **MUST NOT** be critical; **MUST** contain `c2pa-kp-claimSigning`, **SHOULD** contain one of `id-kp-emailProtection`, `id-kp-documentSigning` for backwards compatibility |
| subjectKeyIdentifier | **MUST** be present |
| authorityKeyIdentifier | **MUST** be present |
| certificatePolicies | **MUST** contain `c2pa-certificate-policy` OID (1.3.6.1.4.1.62558.1.1). Qualifiers optional; critical=false |
| AIA | **MUST** be present; accessMethod=id-ad-caIssuers. accessLocation must be HTTP URI |
| CDP | **SHOULD NOT** be present |
| C2PA Assurance Level (`id-c2pa-al`) | OID: 1.3.6.1.4.1.62558.3, <br/>Value: 1.3.6.1.4.1.62558.3.10 (`c2pa-assuranceLevel-1`) ⚠️  |
| C2PA CPL Record ID (`c2pa-cpl-record`) | OID: 1.3.6.1.4.1.62558.4, Value: UTF8String (SIZE 36) containing UUID from CPL |

### C2PA Claim Signing Leaf Certificates - Assurance Level 2

| x509 Field / Extension | Requirement |
| -------------- | ------------------- |
| version | `v3` |
| signatureAlgorithm | ECDSA (SHA2 variants), RSA (PSS or SHA2 variants), Ed25519 |
| subjectName | Must match C2PA Conforming Products List (CPL) entry. Requires C, O, CN attributes. |
| issuerName | Matches subject name of Claim Signing ICA |
| validityPeriod | Max 90 days ⚠️ |
| subjectPublicKeyInfo | ECDSA P-256/P-384/P-521, RSA ≥ 2048-bit, Ed25519 |
| basicConstraints | **MUST** be present and **MUST** be critical; cA=FALSE |
| keyUsage | **MUST** be present and **MUST** be critical; `digitalSignature`, `nonRepudiation` |
| extendedKeyUsage | **MUST NOT** be critical; **MUST** contain `c2pa-kp-claimSigning`, **SHOULD** contain one of `id-kp-emailProtection`, `id-kp-documentSigning` for backwards compatibility |
| subjectKeyIdentifier | **MUST** be present |
| authorityKeyIdentifier | **MUST** be present |
| certificatePolicies | **MUST** contain `c2pa-certificate-policy` OID (1.3.6.1.4.1.62558.1.1). Qualifiers optional; critical=false |
| AIA | **MUST** be present; accessMethod=id-ad-caIssuers. accessLocation must be HTTP URI |
| CDP | **SHOULD NOT** be present |
| C2PA Assurance Level (`id-c2pa-al`) | OID: 1.3.6.1.4.1.62558.3, <br/>Value: 1.3.6.1.4.1.62558.3.20 (`c2pa-assuranceLevel-2`) ⚠️  |
| C2PA CPL Record ID (`c2pa-cpl-record`) | OID: 1.3.6.1.4.1.62558.4, Value: UTF8String (SIZE 36) containing UUID from CPL |

:::tip Revocation
C2PA requires OCSP-based revocation status — CRLs **are not permitted** by the specification
(§14.5.2).  Your Issuing CA should publish an OCSP responder and include the AIA extension in
all issued signer certificates.  Configure the AIA extension in the certificate profile and your
CA's OCSP publishing settings.
:::

---

## Create an Issuance CA

Follow the [3-Tier PKI Tree Guide](../three-tier-pki-guide) to build a Root CA, Claim Signing Issuing 
CA, and TSA CA.  This is technically a 2-tier PKI, but both ICA and TSA CA will be issued by the 
Root CA for C2PA deployments:

```
Root CA  (Tier 1 — self-signed)
  └── C2PA Timestamp Authority CA  (Tier 2 — issues TimeStamp Signing certificates)
  └── C2PA Claim Signing Issuing CA  (Tier 2 — issues Claim Signing certificates)
```

Use **ECDSA P-384** keys for all CAs.  P-384 is recommended for the Root and
Issuing CAs given their balance of cryptographic strength and performance. 

---

## Create the C2PA Signer Certificate Profile

Navigate to **Profiles** → **Certificate Profiles** and click **Create**.  Configure
a profile for the OCSP Responder and the two Assurance Levels for Claim Signers, as 
described above.  Refer to the
[Certificate Profiles](../operations/issuance-and-revocation/certificate-profiles/index.mdx) 
page for a full description of every profile field.

---

## Next Steps

Once the profile is saved and the Issuing CA is active, signer credentials can be issued
against this profile.  The resulting certificate chain (end-entity + intermediate CA certs,
excluding the Root CA) should be included in the `x5chain` COSE header of each C2PA Manifest
that the signer produces, as required by §14.5 of the specification.

- [3-Tier PKI Tree Guide](../three-tier-pki-guide) — build the full CA hierarchy
- [Certificate Profiles Reference](../operations/issuance-and-revocation/certificate-profiles/index.mdx) — full description of every profile field
- [C2PA 2.4 Specification §14.5](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#x509_certificates) — X.509 certificate requirements
- [C2PA 2.4 Specification §14.4.1](https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html#_c2pa_signers) — C2PA Signers and EKU requirements
