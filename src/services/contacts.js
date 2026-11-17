import createHttpError from 'http-errors';
import { Contact } from '../db/models/contact.js';
import { createPaginationData } from '../utils/createPaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder,
  sortBy,
  type,
  isFavourite,
  userId,
  filters = {},
}) => {
  console.log('FILTERS:', filters);
  const offset = (page - 1) * perPage;
  const contactFiltersConditions = Contact.find({ userId });

  if (filters.name) {
    contactFiltersConditions.where('name').regex(new RegExp(filters.name, 'i'));
  }
  if (filters.phoneNumber) {
    const escapedPhone = filters.phoneNumber.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );

    contactFiltersConditions
      .where('phoneNumber')
      .regex(new RegExp(escapedPhone, 'i'));
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
export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const createContact = async (payload) => {
  const newContact = await Contact.create(payload);
  return newContact;
};

export const updateContact = async (
  contactId,
  payload,
  { userId, upsert = false } = {},
) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    { $set: payload },
    {
      new: true,
      upsert,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  const isNew =
    upsert && contact.createdAt?.getTime() === contact.updatedAt?.getTime();

  return { contact, isNew };
};

export const upsertContact = async (contactId, payload, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (contact) {
    contact.set(payload);
    return { isNew: false, contact: await contact.save() };
  } else {
    return {
      isNew: true,
      contact: await Contact.create({ ...payload, userId }),
    };
  }
};

export const deleteContactById = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};
