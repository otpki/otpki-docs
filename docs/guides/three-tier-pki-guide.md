---
title: 3-Tier PKI Tree Guide
section: guides
sidebar_position: 2
description: Build a Root CA, Policy CA, and Issuing CA hierarchy in OTPKI using the admin web interface.
toc_min_heading_level: 2
toc_max_heading_level: 3
---

This guide walks through building a basic 3-tier PKI hierarchy in OTPKI using the admin web
interface.  The resulting tree will have the following structure:

```
Root CA  (Tier 1 — self-signed, offline)
  └── Policy CA  (Tier 2 — signed by Root CA)
        └── Issuing CA  (Tier 3 — signed by Policy CA, issues end-entity certificates)
```

## Prerequisites

- OTPKI is running and accessible (see [Getting Started](../getting-started.md)).
- You are logged in as an administrator.

---

## Step 1: Create a Key Storage Configuration

Before creating any keys, OTPKI needs at least one key storage configuration that tells it
where and how to store private key material.  For this guide we will use the built-in
**Soft DB KMS** backend, which stores encrypted key material in the OTPKI database.

1. Navigate to **Keys** → **Key Configurations** in the left navigation.
2. Click **Create**.
3. Fill in the basic settings:
   - **Name** — e.g., `Soft DB KMS - Default`
   - **Description** — e.g., `Software key storage for PKI hierarchy keys`
   - **Driver** — select `Soft DB KMS`
4. Optionally select an **Encryption Key** to encrypt stored private key material at rest.
5. Set the configuration to **Active**.
6. Click **Save**.

---

## Step 2: Create Certificate Profiles

Certificate profiles define the X.509 extensions and constraints that will be applied to
each CA certificate.  We need three profiles, one per tier.

Navigate to **Profiles** → **Certificate Profiles** and click **Create** for each profile below.

### 2a. Root CA Profile

| Section | Field | Value |
|---|---|---|
| Basic Settings | Name | `Root CA Profile` |
| Basic Settings | Certificate Type | `Root CA` |
| Basic Constraints | Include | ✅ Checked |
| Basic Constraints | Max Path Length | `2` |
| Validity Settings | Duration | `20 years` |
| Key Identifiers | Include SKI | ✅ Checked |
| Key Identifiers | Include AKI | ☐ Unchecked (self-signed) |
| Key Usage | Enable Key Usage Extension | ✅ Checked |
| Key Usage | Key Cert Sign | ✅ Checked |
| Key Usage | CRL Sign | ✅ Checked |
| Key Usage | Critical | ✅ Checked |

:::tip
Setting the **Max Path Length** to `2` on the Root CA allows two levels of subordinate CAs
(the Policy CA and the Issuing CA) beneath it, conforming to RFC 5280.
:::

Click **Save**.

### 2b. Policy CA Profile

| Section | Field | Value |
|---|---|---|
| Basic Settings | Name | `Policy CA Profile` |
| Basic Settings | Certificate Type | `Sub CA` |
| Basic Constraints | Include | ✅ Checked |
| Basic Constraints | Max Path Length | `1` |
| Validity Settings | Duration | `10 years` |
| Key Identifiers | Include SKI | ✅ Checked |
| Key Identifiers | Include AKI | ✅ Checked |
| Key Usage | Enable Key Usage Extension | ✅ Checked |
| Key Usage | Key Cert Sign | ✅ Checked |
| Key Usage | CRL Sign | ✅ Checked |
| Key Usage | Critical | ✅ Checked |

Click **Save**.

### 2c. Issuing CA Profile

| Section | Field | Value |
|---|---|---|
| Basic Settings | Name | `Issuing CA Profile` |
| Basic Settings | Certificate Type | `Sub CA` |
| Basic Constraints | Include | ✅ Checked |
| Basic Constraints | Max Path Length | `0` |
| Basic Constraints | Set Max Path Length to Zero | ✅ Checked |
| Validity Settings | Duration | `5 years` |
| Key Identifiers | Include SKI | ✅ Checked |
| Key Identifiers | Include AKI | ✅ Checked |
| Key Usage | Enable Key Usage Extension | ✅ Checked |
| Key Usage | Key Cert Sign | ✅ Checked |
| Key Usage | CRL Sign | ✅ Checked |
| Key Usage | Critical | ✅ Checked |

:::tip
Setting the **Max Path Length** to `0` on the Issuing CA ensures that no further CAs can be
created below it, only end-entity certificates.
:::

Click **Save**.

---

## Step 3: Create Keys

Each CA requires its own private key.  Navigate to **Keys** → **Keys** and click **Create** for
each key below.

### 3a. Root CA Key

| Field | Value |
|---|---|
| Name | `Root CA Key` |
| Description | `Private key for the Root CA` |
| Key Type | `ECDSA P-384` |
| Key Usage | `Signing and Verification` |
| Key Storage Config | `Soft DB KMS - Default` *(created in Step 1)* |

Click **Save**.

### 3b. Policy CA Key

| Field | Value |
|---|---|
| Name | `Policy CA Key` |
| Description | `Private key for the Policy CA` |
| Key Type | `ECDSA P-384` |
| Key Usage | `Signing and Verification` |
| Key Storage Config | `Soft DB KMS - Default` |

Click **Save**.

### 3c. Issuing CA Key

| Field | Value |
|---|---|
| Name | `Issuing CA Key` |
| Description | `Private key for the Issuing CA` |
| Key Type | `ECDSA P-384` |
| Key Usage | `Signing and Verification` |
| Key Storage Config | `Soft DB KMS - Default` |

Click **Save**.

---

## Step 4: Create the Root CA

Navigate to **Certificate Authorities** → **Certificate Authorities** and click **Create**.

| Field | Value |
|---|---|
| Name | `My Root CA` |
| Description | `Tier 1 — self-signed root of trust` |
| Certificate Profile | `Root CA Profile` *(created in Step 2a)* |
| Key | `Root CA Key` *(created in Step 3a)* |
| Subject — Common Name | `My Root CA` |
| Subject — Organization | *(your organization name)* |
| Issuer | *(leave blank — this creates a self-signed certificate)* |

Configure the **CRL** settings as appropriate for your environment, then click **Save**.

The Root CA certificate is now self-signed and active.

---

## Step 5: Create the Policy CA

Click **Create** again on the Certificate Authorities page.

| Field | Value |
|---|---|
| Name | `My Policy CA` |
| Description | `Tier 2 — Policy CA signed by Root CA` |
| Certificate Profile | `Policy CA Profile` *(created in Step 2b)* |
| Key | `Policy CA Key` *(created in Step 3b)* |
| Subject — Common Name | `My Policy CA` |
| Subject — Organization | *(your organization name)* |
| Issuer | `My Root CA` *(created in Step 4)* |

Click **Save**.

OTPKI uses the Root CA to sign the Policy CA certificate.  The chain is now:
`Root CA → Policy CA`.

---

## Step 6: Create the Issuing CA

Click **Create** one more time on the Certificate Authorities page.

| Field | Value |
|---|---|
| Name | `My Issuing CA` |
| Description | `Tier 3 — Issuing CA signed by Policy CA` |
| Certificate Profile | `Issuing CA Profile` *(created in Step 2c)* |
| Key | `Issuing CA Key` *(created in Step 3c)* |
| Subject — Common Name | `My Issuing CA` |
| Subject — Organization | *(your organization name)* |
| Issuer | `My Policy CA` *(created in Step 5)* |

Click **Save**.

The full 3-tier chain is now established:
`Root CA → Policy CA → Issuing CA`.

---

## Step 7: Verify the Hierarchy

On the **Certificate Authorities** page you should see all three CAs listed.  
Click each CA to inspect its certificate and confirm the chain of trust:

- **My Root CA** — self-signed, `pathLen:2`
- **My Policy CA** — issued by `My Root CA`, `pathLen:1`
- **My Issuing CA** — issued by `My Policy CA`, `pathLen:0`

The **Issuing CA** is now ready to issue end-entity certificates.  Create an
[End-Entity Certificate Profile](../operations/issuance-and-revocation/certificate-profiles/index.mdx)
and associate it with **My Issuing CA** to begin issuing certificates.

---

## Summary

| Step | What Was Created |
|---|---|
| 1 | Soft DB KMS key storage configuration |
| 2 | Three certificate profiles (Root CA, Policy CA, Issuing CA) |
| 3 | Three ECDSA P-384 keys |
| 4 | Self-signed Root CA |
| 5 | Policy CA signed by Root CA |
| 6 | Issuing CA signed by Policy CA |

## Next Steps

- [Certificate Profiles Reference](../operations/issuance-and-revocation/certificate-profiles/index.mdx) — full description of every profile setting.
- [Key Management Reference](../operations/issuance-and-revocation/key-management/index.md) — HSM and AWS KMS backend options.
