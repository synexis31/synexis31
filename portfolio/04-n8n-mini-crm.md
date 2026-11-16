# 04 · n8n Mini CRM: Lead Capture (Starter Template)

**Problem:** Small businesses need a simple, reliable way to collect enquiries, without paying for a full CRM or ending up with duplicate contacts.

**Solution:** A lightweight, self-hosted **n8n** lead-capture system: a branded web form that cleans every submission and stores it in an n8n Data Table, with no duplicates.

## Flow
```
n8n Form ("Work with SA SYNEXIS")
  ► Clean Lead Data: trim fields, lowercase email, add status / source / timestamp
  ► Save Lead (upsert on email): new email = new row · same email = existing lead updated
```

## Engineering highlights
- **Duplicate protection:** an upsert matched on the normalised email keeps one row per contact.
- **Data hygiene:** inputs are trimmed and emails lowercased before they are stored, so matching stays reliable.
- **Source tracking:** test submissions and live website submissions are tagged separately.
- **Bot filtering:** the built-in form option ignores bots.
- **No external credentials needed:** it runs entirely inside n8n (form + Data Table), so it is easy to deploy and hand over.

## Try it
Import [`workflows/n8n-mini-crm.json`](./workflows/n8n-mini-crm.json) into your n8n, then:
1. Create a Data Table with the columns `name, email, phone, company, service, message, status, source, last_contact`.
2. Select that table in **Save Lead (no duplicates)**.
3. Change the form path and texts to suit your business, then publish.

## Roadmap
- Instant new-lead email alerts (SMTP / Gmail)
- An auto-reply email to the client
- Lead status pipeline (New → Contacted → Won)

## Stack
n8n (self-hosted, Docker) · n8n Form Trigger · Set · n8n Data Tables

*Make.com version with auto-replies in production: see [01 · CRM Lead Management](./01-crm-lead-management.md).*
