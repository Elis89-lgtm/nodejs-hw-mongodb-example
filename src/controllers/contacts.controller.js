import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  updateContact,
  upsertContact,
} from '../services/contacts.js';

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const payload = req.body;
  const newContact = await createContact(payload);

  return res.status(201).json({
    status: 201,
    message: 'Successfully created contact!',
    data: newContact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await updateContact(contactId, req.body);
  return res.json({
    message: `Successfully updated contact with id ${contactId}`,
    status: 200,
    data: contact,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const { contact, isNew } = await upsertContact(contactId, req.body);
  const status = isNew ? 201 : 200;
  return res.status(status).json({
    message: `Successfully updated contact with id ${contactId}`,
    status,
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  await deleteContactById(contactId);

  res.status(204).send();
};
