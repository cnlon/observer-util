import { expect } from 'chai'
import { observable, isObservable, raw } from '@nx-js/observer-util'

describe('observable', () => {
  it('should throw TypeError on invalid arguments', () => {
    expect(() => observable(12)).to.throw(TypeError)
    expect(() => observable('string')).to.throw(TypeError)
    expect(() => observable({})).to.not.throw(TypeError)
    expect(() => observable()).to.not.throw(TypeError)
  })

  it('should return a new observable when no argument is provided', () => {
    const obs = observable()
    expect(isObservable(obs)).to.equal(true)
  })

  it('should return an observable wrapping of an object argument', () => {
    const obj = { prop: 'value' }
    const obs = observable(obj)
    expect(obs).to.not.equal(obj)
    expect(isObservable(obs)).to.equal(true)
  })

  it('should return the argument if it is already an observable', () => {
    const obs1 = observable()
    const obs2 = observable(obs1)
    expect(obs1).to.equal(obs2)
  })

  it('should return the same observable wrapper when called repeatedly with the same argument', () => {
    const obj = { prop: 'value' }
    const obs1 = observable(obj)
    const obs2 = observable(obj)
    expect(obs1).to.equal(obs2)
  })

  it('should never let observables leak into the underlying raw object', () => {
    const obj = {}
    const obs = observable(obj)
    obs.nested1 = {}
    obs.nested2 = observable()
    expect(isObservable(obj.nested1)).to.equal(false)
    expect(isObservable(obj.nested2)).to.equal(false)
    expect(isObservable(obs.nested1)).to.equal(false)
    expect(isObservable(obs.nested2)).to.equal(true)
  })
})

describe('isObservable', () => {
  it('should return true if an observable is passed as argument', () => {
    const obs = observable()
    const isObs = isObservable(obs)
    expect(isObs).to.equal(true)
  })

  it('should return false if a non observable is passed as argument', () => {
    const obj1 = { prop: 'value' }
    const obj2 = new Proxy({}, {})
    const isObs1 = isObservable(obj1)
    const isObs2 = isObservable(obj2)
    expect(isObs1).to.equal(false)
    expect(isObs2).to.equal(false)
  })

  it('should return false if a primitive is passed as argument', () => {
    expect(isObservable(12)).to.equal(false)
  })
})

describe('raw', () => {
  it('should return the raw non-reactive object', () => {
    const obj = {}
    const obs = observable(obj)
    expect(raw(obs)).to.eql(obj)
    expect(raw(obj)).to.eql(obj)
  })

  it('should work with plain primitives', () => {
    expect(raw(12)).to.eql(12)
  })
})
