const parseNumber = (value, defaultValue) => {
  if (typeof value !== 'string') {
    return defaultValue;
  }

  const parsed = Number.parseInt(value);
  if (Number.isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
};
export const parseString = (value) => {
  return typeof value === 'string' && value.trim() !== ''
    ? value.trim()
    : undefined;
};

const parseBoolean = (value) => {
  if (['true', 'false'].includes(value)) return JSON.parse(value);
};

export const parsePaginationParams = (query) => {
  return {
    page: parseNumber(query.page, 1),
    perPage: parseNumber(query.perPage, 10),
  };
};

const parseSortOrder = (value) => {
  if (['asc', 'desc'].includes(value)) {
    return value;
  }
  return 'asc';
};

const parseSortBy = (value) => {
  if (
    ['name', 'phoneNumber', 'email', 'isFavourite', 'contactType'].includes(
      value,
    )
  ) {
    return value;
  }
  return '_id';
};
export const parseSortParams = (obj) => {
  return {
    sortOrder: parseSortOrder(obj.sortOrder),
    sortBy: parseSortBy(obj.sortBy),
  };
};
export const parseContactType = (value) => {
  const allowed = ['work', 'home', 'personal'];
  return allowed.includes(value) ? value : undefined;
};
export const parseFiltersContacts = (obj) => {
  return {
    name: parseString(obj.name),
    phoneNumber: parseString(obj.phoneNumber),
    email: parseString(obj.email),
    isFavourite: parseBoolean(obj.isFavourite),
    contactType: parseContactType(obj.contactType),
  };
};
