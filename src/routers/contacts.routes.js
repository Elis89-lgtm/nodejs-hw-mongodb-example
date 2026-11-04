import { Router } from 'express';

import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
  upsertContactController,
} from '../controllers/contacts.controller.js';
import { createContactSchema } from '../validation/createContact.js';
import { validateBody } from '../middlewares/validate-body-middleware.js';
import { updateContactSchema } from '../validation/updateContact.js';
import { validateMongoDBId } from '../middlewares/validate-mongo-id.js';

const contactsRouter = Router();
contactsRouter.get('/', getAllContactsController);
contactsRouter.get(
  '/:contactId',
  validateMongoDBId('contactId'),
  getContactByIdController,
);
contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  createContactController,
);
contactsRouter.patch(
  '/:contactId',
  validateBody(updateContactSchema),
  patchContactController,
);
contactsRouter.put(
  '/:contactId',
  validateBody(createContactSchema),
  upsertContactController,
);
contactsRouter.delete('/:contactId', deleteContactController);
export default contactsRouter;
