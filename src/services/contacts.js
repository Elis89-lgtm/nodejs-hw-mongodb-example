import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';
import { createPaginationData } from '../utils/createPaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder,
  sortBy,
  filters = {},
}) => {
  const offset = (page - 1) * perPage;
  const contactFiltersConditions = Contact.find();

  if (filters.name) {
    contactFiltersConditions.where('name').regex(new RegExp(filters.name, 'i'));
  }
  if (filters.phoneNumber) {
    contactFiltersConditions
      .where('phoneNumber')
      .regex(new RegExp(filters.phoneNumber, 'i'));
  }
  if (filters.email) {
    contactFiltersConditions
      .where('email')
      .regex(new RegExp(filters.email, 'i'));
  }
  if (typeof filters.isFavourite === 'boolean') {
    contactFiltersConditions.where('isFavourite').equals(filters.isFavourite);
  }
  if (filters.contactType) {
    contactFiltersConditions.where('contactType').equals(filters.contactType);
  }

  const [contacts, contactsCount] = await Promise.all([
    Contact.find()
      .merge(contactFiltersConditions)
      .skip(offset)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),

    Contact.find().merge(contactFiltersConditions).countDocuments().exec(),
  ]);

  const paginationData = createPaginationData(page, perPage, contactsCount);

  return {
    data: contacts,
    ...paginationData,
  };
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
    runValidators: true,
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
  const contact = await Contact.findByIdAndDelete(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};
