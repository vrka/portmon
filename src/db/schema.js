export const schema = {
  persons: '++id, forename, surname, email, phone',
  events: '++id, name, description, opened',
  members: '[project_id+person_id], event_id, person_id',
  entries: '++id, project_id, amount, currency, *payers, *receivers'
};
