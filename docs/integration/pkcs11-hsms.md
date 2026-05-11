---
title: PKCS#11 HSMs
hide_title: true
hide_table_of_contents: true
---

## Introduction

OTPKI integrates with your HSM via the **OTPKI PKCS#11 Proxy**, a gRPC server that loads the PKCS#11 shared library (`.so`) and exposes it to OTPKI. The following documentation will discuss the setup procedures and configuration requirements on the proxy/hsm host. For documentation relating to connecting to this proxy from OTPKI, see [PKCS#11 Proxy Key Configurations](../operations/issuance-and-revocation/key-management/key-configurations/pkcs11-proxy/key-configurations).

The proxy is composed of pluggable **modules**. Every deployment registers `pkcs11.base`, which handles the standard PKCS#11 RPCs. Vendor specific modules may also be required for full HSM features, like `pkcs11.utimaco.pqc` for Utimaco Quantum Protect's post-quantum features.

## Supported HSMs

| HSM | `module_path` (vendor default) | Required `modules` |
| --- | --- | --- |
| SoftHSM v2 | `/usr/lib/softhsm/libsofthsm2.so` | `pkcs11.base` |
| Utimaco | `/opt/utimaco/lib/libcs_pkcs11_R3.so` | `pkcs11.base` |
| Utimaco QuantumProtect | `/opt/utimaco/lib/libcs_pkcs11_R3.so` | `pkcs11.base`, `pkcs11.utimaco.pqc` |
| Entrust nShield | `/opt/nfast/toolkits/pkcs11/libcknfast.so` | `pkcs11.base` |
| Securosys Primus | `/usr/local/primus/lib/libprimusP11.so` | `pkcs11.base` |
| Thales Luna | `/usr/local/luna/lib/libCryptoki2.so` | `pkcs11.base` |

`module_path` is the absolute path on the proxy host to the vendor's PKCS#11 `.so` / `.dylib`. It *must* exist on the machine running the proxy.

### Other HSMs

If your HSM model is not in the table above, the proxy may still work with it using only `pkcs11.base`, since that module exercises the standard PKCS#11 interface that all PKCS#11 compliant devices implement. Vendor-specific mechanisms (post-quantum algorithms, custom key types, and any other non-standard extensions) will not be available without a dedicated module.

To request official support for a specific HSM model not listed, [contact us](https://omnitrust.com/contact-us/) directly to begin the integration process.

## Defining modules in the proxy config

Modules are declared as keys under the top-level `modules:` map in the proxy's config file. The value is a per-module config subtree, and may be empty. Listing a module both registers it and enables it for incoming RPCs from OTPKI.

### SoftHSM v2

```yaml
module_path: /usr/lib/softhsm/libsofthsm2.so
listen_address: ":8051"

modules:
  pkcs11.base:

hsm_configs:
  - id: softhsm-cfg
    label: "SoftHSMToken"
    default: true
```

### Utimaco

```yaml
module_path: /opt/utimaco/lib/libcs_pkcs11_R3.so
listen_address: ":8051"

modules:
  pkcs11.base:
  pkcs11.utimaco.pqc:

hsm_configs:
  - id: pqc-cfg
    label: "PqcHSMToken"
    default: true
```

> Adding `pkcs11.utimaco.pqc` alongside `pkcs11.base` enables ML-DSA, ML-KEM, and HBS (LMS / HSS / XMSS) operations, which rely on Utimaco vendor-defined mechanisms not understood by `pkcs11.base`.


## HSM slot configuration

Each entry in `hsm_configs` defines a slot that clients reference by `id`. A slot is identified by either `slot_id` (numeric) or `label` (resolved against the token label at startup). At least one hsm configuration/slot is required. Marking an entry `default: true` makes it the slot used when a client does not specify a config ID.

```yaml
hsm_configs:
  - id: prod
    label: "Production HSM"
    default: true
  - id: secondary
    slot_id: 1415299864
    label: "IOPKI-TOKEN-01"
```

## Deploying the proxy

Run the proxy on a host that has network reachability to OTPKI and access to the HSM (or its client library `.so`).

> The following deployment procedures will assume you have access to either an evaluation, enterprise, or other otpki distributed binary for `pkcs11-proxy-server`. 

1. Place the `pkcs11-proxy-server` binary somewhere on the host (e.g. `/usr/local/bin/pkcs11-proxy-server`) and make it executable.
2. Install the HSM vendor's PKCS#11 library on the same host and confirm the file referenced by `module_path` exists and is readable by the user that will run the proxy.
3. Write the proxy config file (see examples above) to a known location, e.g. `/etc/otpki/pkcs11-proxy/config.yaml`.
4. Start the server, pointing it at the config:

   ```bash
   pkcs11-proxy-server --config /etc/otpki/pkcs11-proxy/config.yaml
   ```

5. Confirm the server is listening on the configured `listen_address` and that OTPKI can reach it over the network. The address you provide here is the same address you enter in the [PKCS#11 Proxy Key Configurations](../operations/issuance-and-revocation/key-management/key-configurations/pkcs11-proxy/key-configurations) page.

### Configuration overrides

Settings resolve in the following priority order (high to low):

1. Command-line flags: `--module`, `--listen`, `--config`
2. Environment variables prefixed with `PKCS11_PROXY_` (ex: `PKCS11_PROXY_MODULE_PATH`, `PKCS11_PROXY_LISTEN_ADDRESS`, ...)
3. The config file passed via `--config`
4. Built-in defaults

This lets you keep a single config file under version control and override host-specific values (module path, listen address) via environment variables or flags at startup.

### Running as a service

For production deployments, run the proxy under a process supervisor (systemd, init.d, etc.) so it restarts on failure and starts on boot. A minimal systemd unit looks like:

```ini
[Unit]
Description=OTPKI PKCS11 PROXY
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/pkcs11-proxy-server --config /etc/otpki/pkcs11-proxy/config.yaml
Restart=on-failure
RestartSec=5s
User=otpki

[Install]
WantedBy=multi-user.target
```

The service user must have read access to the config file and to the vendor PKCS#11 library, plus any device or socket permissions required by that vendor library to reach the HSM.
