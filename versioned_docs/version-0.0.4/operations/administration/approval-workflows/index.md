---
title: Approval Workflows
toc_min_heading_level: 2
toc_max_heading_level: 2
---

Approval workflows let OTPKI hold sensitive operations until one or more authorized users have signed off. When an operation is associated with an approval profile, OTPKI parks the request and creates a **work item** that designated approvers review and either approve or reject.

OTPKI currently routes two kinds of operations through approval workflows:

- **Enrollment requests** - gated by the approval profile assigned to the end entity profile.
- **Issuance requests** - gated by the approval profile assigned to the certificate profile and/or the issuing certificate authority.

The pieces work together as follows:

1. An administrator defines an [Approval Profile](./approval-profiles) listing the users, groups, or roles authorized to approve, and the number of approvals required.
2. The approval profile is referenced from one or more of: an end entity profile, a certificate profile, or a certificate authority.
3. When a request targets a resource with an approval profile attached, OTPKI marks the request as **Waiting for Approval** and creates a [Work Item](./work-items) for the configured approvers.
4. Approvers review the work item. Once the configured number of approvals is reached, the gated operation continues automatically. If any approver rejects, the request is failed/rejected.

## Approval Workflow Areas

- [Approval Profiles](./approval-profiles)
- [Work Items](./work-items)
- [Enrollment Requests](./enrollment-requests)
- [Issuance Requests](./issuance-requests)
