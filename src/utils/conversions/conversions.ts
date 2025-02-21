import * as inflection from 'inflection';

/**
 * Converts a string to its plural form and then to snake_case.
 *
 * @param str - The string to be converted.
 * @returns The converted and pluralized snake_case string.
 */
export const pluralizeToSnakeCase = (str: string) => {
  const pluralStr = inflection.pluralize(str);
  return inflection.underscore(pluralStr);
};
