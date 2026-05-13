---
title: Identity
hide_table_of_contents: true
---

This section covers how OTPKI represents and manages the people and external systems that authenticate to it.

OTPKI's identity model has four building blocks:

- **Users** sign in to OTPKI and take actions. A user can authenticate through an external identity provider, a client certificate, or both.
- **Roles** are reusable bundles of permissions. Permissions live on roles, and users get their access by holding one or more roles. See [Permissions](../permissions/permissions) for how to edit a role's permissions.
- **Groups** are reusable collections of users. Groups do not grant permissions. They are used by features that key off membership, such as [Approval Profiles](../approval-workflows/approval-profiles).
- **Identity Providers** are external OIDC providers that authenticate users into OTPKI. They control single sign-on, claim mapping, and session lifetime.

## Identity Areas

- [Users](./users) - manage individual user accounts.
- [Roles](./roles) - manage roles and the System role indicator.
- [Groups](./groups) - manage groups used by approval workflows.
- [Identity Providers](./identity-providers) - configure OIDC providers, single sign-on, and session settings.
