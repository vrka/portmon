import {db} from "src/db"

export function usePersons() {
  const persons = db.query(db.persons)

  function getName(id) {
    const p = persons.value.find(x => x.id === id)
    return p ? p.forename : '?'
  }

  function getMembers(memberIds) {
    if (!persons.value) return '';
    if (!memberIds) return 'Všichni';
    return memberIds.map(getName).join(', ')
  }

  return {persons, getMembers, getName}
}
