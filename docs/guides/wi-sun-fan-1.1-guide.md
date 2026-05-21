---
title: Wi-SUN FAN Configuration Guide
section: guides
sidebar_position: 4
source: guides/wi-sun-fan-1.1-guide
description: Configure OTPKI to issue X.509 device certificates that conform to the Wi-SUN FAN 1.1 standard for IoT mesh network identity.
toc_min_heading_level: 2
toc_max_heading_level: 4
---

This guide provides a step-by-step procedure for configuring OTPKI to issue certificates that
conform to the **Wi-SUN (Wireless Smart Utility Network) FAN (Field Area Network)** 1.1
open standard.  Wi-SUN FAN is an IPv6-based wireless mesh technology designed for massive scale
IoT networks, smart cities, and utilities.

Configuring OTPKI to support the Wi-SUN FAN 1.1 profile requires strict adherence to specific
cryptographic standards and X.509 v3 extension requirements. Wi-SUN relies heavily on IEEE 802.1AR
Secure Device Identifiers (**DevID**), typically **IDevID** (Initial Device Identity) or **LDevID**
(Local Device Identity), authenticated via **EAP-TLS** over 802.1X.

## Cryptographic Key Requirements for Wi-SUN FAN

Each Wi-SUN device requires a unique per-device x509v3 certificate, and these certificates must abide 
by the following constraints:

| x509 Extension | Value / Constraint |
| -------------- | ------------------ |
| version | v3 |
| serialNumber | must be unique, prefeably at least 16 hex bytes |
| issuer | subject copied from the issuer's CA certificate | 
| notBefore | issuance date and time in UTC using GeneralizedTime |
| notAfter | 99991232235959Z in GeneralizedTime |
| subject | subject _MAY_ be empty, as the device identity is contained in the SAN extension |
| subjectPublicKeyInfo | id-ecPublicKey, namedCurve secp256r1 |
| signatureAlgorithm | ecdsa-with-SHA256 |
| keyUsage | digitalSignature (**MUST**), keyAgreement (_MAY_) |
| extendedKeyUsage | clientAuth, id-kp-wisun-fan-device |
| authorityIdentifier | solely the keyIdentifier of the issuer |
| subjectAltName | id-on-hardwareModuleName |


## Create an Issuance CA

For the purposes of this guide, follow the [3-Tier PKI Tree Guide](../three-tier-pki-guide) to
create a Root CA, Policy CA, and Issuing CA.  This is the recommended starting point for a
Wi-SUN FAN deployment.  If you already have a PKI hierarchy in place, you can use that as
an alternative.  Either approach results in an active Issuing CA that can be associated with the
End-Entity profile created in the next step.

## Create the Wi-SUN FAN End-Entity Certificate Profile

Navigate to **Profiles** → **Certificate Profiles** and click **Create**.  Configure each
section below to produce certificates that conform to the Wi-SUN FAN 1.1 requirements shown in
the table at the top of this guide.

### Basic Settings

| Field | Value |
|---|---|
| Name | `Wi-SUN FAN 1.1 Device Profile` |
| Description | `End-entity profile for Wi-SUN FAN 1.1 IDevID / LDevID certificates` |
| Certificate Type | `End Entity` |
| Available CAs | *(select your Issuing CA, or leave blank to allow any CA)* |

### Basic Constraints

Leave the **Include** checkbox **unchecked**.  End-entity certificates must not assert the CA
basic constraint.

### Validity Settings

Wi-SUN FAN 1.1 requires that device certificates carry a `notAfter` value of
`99991231235959Z` — effectively "no expiry".

| Field | Value |
|---|---|
| No Expiry | ✅ Checked |

:::warning
The `99991231235959Z` value is a Wi-SUN FAN 1.1 specification requirement (Section 6.3.2).
Do not use a standard duration for this profile.  According to RFC5280, to indicate that a
certificate has no well-defined expiration date, the notAfter SHOULD be assigned the
GeneralizedTime value of 99991231235959Z.  OTPKI achieves this with the **No Expiry** checkbox.
:::

### Signature & Key Settings

The standard mandates **ECDSA with SHA-256** over the **secp256r1** (P-256) curve.

| Field | Value |
|---|---|
| Available Key Algorithm | `ECDSA_P256` |
| Signature Algorithm | `ECDSA_WITH_SHA256` |

### Key Identifiers

| Field | Value |
|---|---|
| Include SKI | ✅ Checked |
| Include AKI | ✅ Checked |

:::tip
The Wi-SUN FAN specification requires the AKI to contain **solely the keyIdentifier** of the
issuer, with no `authorityCertIssuer` or `authorityCertSerialNumber` fields.  Ensure your AKI
configuration does not include those optional fields.
:::

### Key Usage

| Field | Value |
|---|---|
| Digital Signature | ✅ Checked (**MUST**) |
| Key Agreement | ☐ Optional — check if the device also performs ECDH key exchange |
| Critical | ✅ Checked |

### Extended Key Usage

Wi-SUN FAN requires two EKU OIDs:

| OID | Description |
|---|---|
| `1.3.6.1.5.5.7.3.2` | `id-kp-clientAuth` |
| `1.3.6.1.4.1.45605.1` | `id-kp-wisun-fan-device` |

In OTPKI, select `clientAuth` from the standard EKU list.  For the Wi-SUN-specific OID, use the
**Custom Certificate Extensions** section to add `1.3.6.1.4.1.45605.1` if it is not listed as
a built-in EKU option.

### Alternative Names (SAN)

Wi-SUN FAN devices carry their identity in the SAN rather than the Subject DN.

| Field | Value |
|---|---|
| SAN Type | `OtherName` |
| OtherName OID | `1.3.6.1.5.5.7.8.4` (`id-on-hardwareModuleName`) |

The `id-on-hardwareModuleName` structure encodes the device's hardware module type OID and
serial number.  Consult your device manufacturer's documentation for the exact values.

:::note
Because the device identity is carried in the SAN, the **Subject DN may be empty** per the
Wi-SUN FAN 1.1 specification.  If your enrollment flow produces an empty subject, ensure your
issuance request does not require a non-empty Common Name.
:::

### Revocation Settings

Configure the **CDP (CRL Distribution Point)** to point to the published CRL endpoint for your
Issuing CA.  This is required for devices and network infrastructure to perform certificate
status checking.

### Summary of Profile Settings

| Profile Section | Configuration |
|---|---|
| Certificate Type | End Entity |
| Basic Constraints | Not included |
| Validity | `99991231235959Z` |
| Subject | MAY be empty |
| Subject Public Key | ECDSA secp256r1 |
| Signature Algorithm | ecdsa-with-SHA256 |
| Key Usage | `digitalSignature` (MUST), `keyAgreement` (MAY); Critical |
| Extended Key Usage | `clientAuth`, `id-kp-wisun-fan-device` |
| AKI | keyIdentifier only |
| SKI | Included |
| SAN | `id-on-hardwareModuleName` (OtherName) |

Click **Create Certificate Profile** to create the profile. 