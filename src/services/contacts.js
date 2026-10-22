import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};
export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const createContact = async (payload) => {
  const newContact = await Contact.create(payload);
  return newContact;
};

export const updateContact = async (contactId, payload) => {
  const contact = await Contact.findOneAndUpdate({ _id: contactId }, payload, {
    new: true,
  });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const upsertContact = async (contactId, payload) => {
  const contact = await Contact.findById(contactId);
  if (contact) {
    contact.set(payload);
    return { isNew: false, contact: await contact.save() };
  } else {
    return { isNew: true, contact: await Contact.create(payload) };
  }
};
export const deleteContactById = async (contactId) => {
  return await Contact.findOneAndDelete(contactId);
};
