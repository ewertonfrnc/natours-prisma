export function getFields(fields: string[]) {
  let selectedFields = {};
  fields.forEach((field) => {
    selectedFields = { ...selectedFields, [field]: true };
  });

  return selectedFields;
}
