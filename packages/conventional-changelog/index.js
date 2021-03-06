'use strict'
const Q = require('q')
const conventionalChangelog = require('./conventional-changelog')
const parserOpts = require('./parser-opts')
const recommendedBumpOpts = require('./conventional-recommended-bump')
const writerOpts = require('./writer-opts')

module.exports = function (config) {
  config = mergeDefaultConfig(config);
  return Q.all([
    conventionalChangelog(config), 
    parserOpts(config), 
    recommendedBumpOpts(config), 
    writerOpts(config)
  ])
  .spread((conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts) => {
    return { conventionalChangelog, parserOpts, recommendedBumpOpts, writerOpts }
  })
}

function mergeDefaultConfig(config) {
  return {
    types: [
      { type: 'feat',     section: 'β¨ Features'},
      { type: 'fix',      section: 'π Bug Fixes'},
      { type: 'docs',     section: 'π Documentation', hidden: true},
      { type: 'refactor', section: 'π¨ Code Refactoring'},
      { type: 'test',     section: 'π¨ Tests', hidden: true },
      { type: 'chore',    section: 'π§ Miscellaneous Chores', hidden: true},
      { type: 'revert',   section: 'βͺ Reverts'},
    ],
    commitsSort: ['subScope', 'subject'],
    scopeSequence: [
      // { 
      //   "scope": "@scope/name", 
      //   "alias": "Display title", 
      //   "mixin": false, // type ζ··εε±η€Ί
      // }
    ],
    typeSequence: ['feat', 'fix', 'refactor'], // δ»η¨ζ₯ζεΊοΌζ―ε¦ζΎη€Ίεε³δΊ types[n].hidden
    ...(config || {})
  };
}