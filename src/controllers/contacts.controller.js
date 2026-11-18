import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactById,
  updateContact,
  upsertContact,
} from '../services/contacts.js';
import {
  parsePaginationParams,
  parseSortParams,
  parseFiltersContacts,
} from '../utils/parse.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { type, isFavourite } = req.query;

  const filters = parseFiltersContacts(req.query);

  const contacts = await getAllContacts({
    userId: req.user._id,
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
    filters,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const payload = { ...req.body, userId: req.user._id };
  const newContact = await createContact(payload);

  return res.status(201).json({
    status: 201,
    message: `Successfully created contact with id ${newContact._id}!`,
    data: newContact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await updateContact(contactId, req.body, {
    upsert: false,
    userId: req.user._id,
  });
  return res.json({
    message: `Successfully updated contact with id ${contactId}`,
    status: 200,
    data: contact,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const { contact, isNew } = await upsertContact(
    contactId,
    req.body,
    req.user._id,
  );
  const status = isNew ? 201 : 200;
  return res.status(status).json({
    message: `Successfully updated contact with id ${contactId}`,
    status,
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  await deleteContactById(contactId, req.user._id);

  res.status(204).send();
};
