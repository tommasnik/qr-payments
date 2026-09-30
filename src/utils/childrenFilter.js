const normalize = (name) => name.trim().toLocaleLowerCase('cs')

export function filterChildrenByNames(children, namesParam) {
  const names = (namesParam ?? '').split(',').map((name) => name.trim()).filter(Boolean)
  const childNames = children.map((child) => normalize(child.name))
  const unmatchedNames = names.filter((name) => !childNames.includes(normalize(name)))

  if (names.length === 0 || unmatchedNames.length > 0) {
    return { children, unmatchedNames }
  }

  const wanted = names.map(normalize)
  return { children: children.filter((child) => wanted.includes(normalize(child.name))), unmatchedNames }
}
