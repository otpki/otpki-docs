---
title: Introduction
hide_title: true
sidebar_position: 1
toc_min_heading_level: 2
toc_max_heading_level: 4
---

## What is OTPKI?

OTPKI is a modern, enterprise-grade Public Key Infrastructure (PKI) service built by **OmniTrust Security LLC**
for managing certificate authorities, certificate issuance, enrollment workflows, revocation, validation, key 
management, and other related operational services. It provides a complete certificate lifecycle management 
platform designed for the demands of contemporary enterprise environments: cloud-native, API-first, and built to
scale.

OTPKI is purpose-built to replace aging legacy PKI solutions with a modern, container-native platform that 
integrates naturally with DevOps workflows, cloud infrastructure, and zero-trust network architectures.

## Core Capabilities

- **Certificate Lifecycle Management**: Issue, renew, and revoke X.509 certificates with full audit trails.
- **CA Hierarchy Management**: Create and manage multi-tier CA hierarchies with support for offline root CAs.
- **Multiple Key Storage Backends**: Software database KMS, HSMs via PKCS#11, or AWS KMS.
- **Modern API**: Full REST and gRPC API via ConnectRPC, with auto-generated OpenAPI 3.x specifications.
- **Multi-Tenant Support**: Logical tenancy model allowing multiple PKI namespaces.
- **Enrollment Protocols**: Native support for ACME, SCEP, CMP, and EST enrollment protocols.
- **OIDC-Based Authentication**: Integrates with Keycloak, EntraID, and other providers for authentication and RBAC.

## Who Is OTPKI For?

OTPKI is designed for enterprise teams that need a scalable, secure, easy-to-use-and-maintain private PKI:

- **DevOps and Platform Engineers**: Automate TLS certificate issuance using ACME or the REST API.
- **Security Engineers**: Manage CA hierarchies, define issuance policies, and maintain audit logs.
- **Compliance Teams**: Meet regulatory requirements with HSM-backed key storage and comprehensive audit logging.
- **Infrastructure Teams**: Deploy using Docker Compose or on Kubernetes with customizable Helm Charts.

## Cloud-Native Architecture

OTPKI is developed as a cloud-native application, designed to be deployed on a Kubernetes cluster as a container. In its
simplest form, it runs as a single container as a combination of our Enrollment Service (ES), Issuance Service (IS), and
Validation Service (VS).  In more complicated deployment architectures, where one must balance scalability, resource usage,
and network separation, the same container is run in specific modes and communication between clusters is maintained via 
an internal pub-sub control plane.  No matter the security scale requirements, OTPKI remains easy to maintain, audit, and
operate.


## What You Will Find Here

This documentation site is intended for administrators, operators, integrators, and developers who need to deploy, 
configure, operate, or integrate with OTPKI.

- Getting started guidance for new deployments
- Reference material for configuration and platform behavior
- Links to API documentation exposed by the OTPKI UI

## Start Here

- Go to [Getting Started](./getting-started.md) for initial setup and onboarding content
- Go to [Reference](./reference) for technical details and deeper documentation
- Use the References link in the navigation to open technical reference material, including the API documentation

## Documentation Scope

This site will grow to cover the major OTPKI domains, including issuance, enrollment, validation, authentication, and
platform administration.
