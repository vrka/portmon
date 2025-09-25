export const schema = {
  persons: '++id, forename, surname, email, phone, account',
  events: '++id, name, description, opened, *members, currencies',
  entries: '++id, event_id, date, description, amount, currency, *payers, *receivers'
};
