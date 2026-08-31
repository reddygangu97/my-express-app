import { Router } from "express";

import { ApiError } from "../errors/api-error";
import { requireTenant } from "../middleware/tenant";
import { contactIdSchema, createContactSchema } from "../schemas/contact";
import {
  createContact,
  enrichContact,
  listContacts,
} from "../services/contact-service";

export const contactsRouter = Router();

contactsRouter.use(requireTenant);

contactsRouter.post("/", async (request, response) => {
  const input = createContactSchema.parse(request.body);
  const contact = await createContact(response.locals.tenantId as string, input);

  response.status(201).json({ data: contact });
});

contactsRouter.get("/", async (_request, response) => {
  const contacts = await listContacts(response.locals.tenantId as string);

  response.status(200).json({ data: contacts, count: contacts.length });
});

contactsRouter.post("/:id/enrich", async (request, response) => {
  const contactId = contactIdSchema.parse(request.params.id);
  const contact = await enrichContact(
    response.locals.tenantId as string,
    contactId,
  );

  if (!contact) {
    throw new ApiError(404, "CONTACT_NOT_FOUND", "Contact not found");
  }

  response.status(200).json({ data: contact });
});
