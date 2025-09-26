import {db} from "src/db"

export function usePersons() {
  const persons = db.query(db.persons)

  function getPerson(id) {
    return persons.value.find(x => x.id === id)
  }

  function getName(id) {
    const p = getPerson(id)
    return p ? p.forename : '?'

  }

  function getMembers(memberIds) {
    if (!persons.value) return '';
    if (!memberIds) return 'Všichni';
    return memberIds.map(getName).join(', ')
  }

  return {persons, getMembers, getName, getPerson}
}
