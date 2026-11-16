# 01 · CRM Lead Management (Make.com)

**Problem:** Website enquiries arrived by form and were copied into a spreadsheet by hand. Leads were missed, duplicated, and not answered quickly.

**Solution:** An instant, event-driven Make.com scenario that captures, validates, de-duplicates, stores and answers every lead within seconds.

## Flow
```
Website form ──► Webhook
                   │
                   ├─► Normalise email (trim + lowercase)
                   ├─► Validate required fields + email regex   (invalid → stop)
                   ├─► Read CRM sheet ─► Aggregate ─► Look up existing email
                   │
                   ├── NEW LEAD ───────► Add row to LEADS (unique CRM-ID)
                   │                     ► Log to ENQUIRY_LOG
                   │                     ► Branded HTML thank-you email to client (retry ×3)
                   │                     ► Internal "🔔 New lead" alert
                   │
                   └── RETURNING LEAD ─► Update existing row (no duplicate)
                                         ► Log to ENQUIRY_LOG
                                         ► Internal "🔁 Returning lead" alert
```

## Engineering highlights
- **Duplicate protection:** an email lookup decides between the *insert* and *update* paths, so the CRM never gets duplicate rows.
- **Data quality gate:** a filter rejects empty fields and invalid emails before anything is written.
- **Full audit trail:** every enquiry is also written to a separate log sheet, including repeat contacts.
- **Error handling:** the client email retries 3 times (Break directive); internal alerts fail silently so a notification problem never blocks the lead.
- **HTML-safe emails:** all user input is escaped before it goes into the email templates.

## Stack
Make.com · Custom Webhook · Make Functions · Google Sheets · Gmail · If/Else router · Error handlers

**Result:** fully hands-off lead intake running in production with **0 errors** to date.
