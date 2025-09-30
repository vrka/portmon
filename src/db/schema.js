export const schema = {
  events: '++id', //name, description, opened, *members, currencies',
  persons: '++id', //forename, surname, nickname, email, phone, account',
  entries: '++id, event_id' //date, description, amount, currency, *payers, *receivers'
};
