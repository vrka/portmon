import {describe, expect, test} from 'vitest'
import {computeBalances} from './balances.js'

describe('balances', () => {
  test.each([
    {
      name: 'simple single payer, all receivers',
      members: ['A', 'B', 'C'],
      entries: [{payers: ['A'], receivers: null, amount: 90, currency: 'USD'}],
      currencies: [],
      expected: {USD: {A: 60, B: -30, C: -30}}
    },
    {
      name: 'all payers, single receiver',
      members: ['A', 'B', 'C'],
      entries: [{payers: null, receivers: ['B'], amount: 60, currency: 'USD'}],
      currencies: [],
      expected: {USD: {A: 20, B: -40, C: 20}}
    },
    {
      name: 'conversion applied',
      members: ['A', 'B', 'C'],
      entries: [{payers: ['A'], receivers: ['B'], amount: 100, currency: 'EUR'}],
      currencies: [{code: 'EUR', base: 'USD', ratio: 2, reverse: false}],
      expected: {USD: {A: 50, B: -50, C: 0}}
    },
    {
      name: 'reality',
      members: ['M', 'P', 'K', 'L'],
      entries: [
        {payers: ['M'], receivers: null, amount: 1500, currency: 'CZK'},
        {payers: ['P'], receivers: null, amount: 1000, currency: 'CZK'},
        {payers: ['P'], receivers: null, amount: 750, currency: 'CZK'},
        {payers: ['P'], receivers: null, amount: 450, currency: 'CZK'},
        {payers: ['M'], receivers: null, amount: 10, currency: 'EUR'},
      ],
      currencies: [
        {code: 'CZK'},
        {code: 'EUR', base: 'CZK', ratio: 25, reverse: false},
      ],
      expected: {CZK: {A: 50, B: -50, C: 0, D:0}}
    },
  ])('$name', ({members, entries, currencies, expected}) => {
    const result = computeBalances(entries, members, currencies)
    expect(result).toEqual(expected)
  })
})
