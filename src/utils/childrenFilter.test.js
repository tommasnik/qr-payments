import { filterChildrenByNames } from './childrenFilter'

const children = [
  { id: '1', name: 'Anna', variableSymbol: '111' },
  { id: '2', name: ' Petr Novák ', variableSymbol: '222' },
  { id: '3', name: 'Eva', variableSymbol: '333' }
]

describe('filterChildrenByNames', () => {
  it('should return all children when the parameter is missing', () => {
    expect(filterChildrenByNames(children, null)).toEqual({ children, unmatchedNames: [] })
  })

  it('should return all children when the parameter is empty', () => {
    expect(filterChildrenByNames(children, ' , ')).toEqual({ children, unmatchedNames: [] })
  })

  it('should return only the named child', () => {
    expect(filterChildrenByNames(children, 'Anna')).toEqual({ children: [children[0]], unmatchedNames: [] })
  })

  it('should trim names in the parameter and in the settings', () => {
    expect(filterChildrenByNames(children, ' Eva ,  Petr Novák')).toEqual({
      children: [children[1], children[2]],
      unmatchedNames: []
    })
  })

  it('should ignore letter case', () => {
    expect(filterChildrenByNames(children, 'anna')).toEqual({ children: [children[0]], unmatchedNames: [] })
  })

  it('should return all children when no name matches', () => {
    expect(filterChildrenByNames(children, 'Karel')).toEqual({ children, unmatchedNames: ['Karel'] })
  })

  it('should return all children when only some names match', () => {
    expect(filterChildrenByNames(children, 'Anna, Karel ')).toEqual({ children, unmatchedNames: ['Karel'] })
  })
})
