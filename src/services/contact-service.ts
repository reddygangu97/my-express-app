import { randomUUID } from "node:crypto";

import { db } from "../db";
import type { CreateContactInput } from "../schemas/contact";
import type { Contact } from "../types/contact";

const contactColumns = `
  id,
  tenant_id,
  first_name,
  last_name,
  email,
  company,
  status,
  created_at,
  updated_at
`;

export async function createContact(
  tenantId: string,
  input: CreateContactInput,
): Promise<Contact> {
  const result = await db.query<Contact>(
    `
      INSERT INTO contacts (
        id,
        tenant_id,
        first_name,
        last_name,
        email,
        company
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING ${contactColumns}
    `,
    [
      randomUUID(),
      tenantId,
      input.first_name,
      input.last_name,
      input.email,
      input.company,
    ],
  );

  return result.rows[0]!;
}

export async function listContacts(tenantId: string): Promise<Contact[]> {
  const result = await db.query<Contact>(
    `
      SELECT ${contactColumns}
      FROM contacts
      WHERE tenant_id = $1
      ORDER BY created_at DESC, id DESC
    `,
    [tenantId],
  );

  return result.rows;
}

export async function enrichContact(
  tenantId: string,
  contactId: string,
): Promise<Contact | null> {
  const result = await db.query<Contact>(
    `
      UPDATE contacts
      SET
        status = 'enriched',
        updated_at = NOW()
      WHERE id = $1 AND tenant_id = $2
      RETURNING ${contactColumns}
    `,
    [contactId, tenantId],
  );

  return result.rows[0] ?? null;
}
