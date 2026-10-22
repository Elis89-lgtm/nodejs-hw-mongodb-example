import { Router } from 'express';

import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
  upsertContactController,
} from '../controllers/contacts.controller.js';

const contactsRouter = Router();
contactsRouter.get('/', getAllContactsController);
contactsRouter.get('/:contactId', getContactByIdController);
contactsRouter.post('/', createContactController);
contactsRouter.patch('/contacts/contactId', patchContactController);
contactsRouter.put('/contacts/contactId', upsertContactController);
contactsRouter.delete('/contactId', deleteContactController);
export default contactsRouter;
