'use strict'

/* eslint-env mocha */

var should = require('chai').should(); // eslint-disable-line

describe('Sass renderer', function () {
  var ctx = {
    config: {},
    theme: {
      config: {}
    }
  }

  var r = require('../lib/renderer')

  it('default: scss syntax', function () {
    var body = [
      '$color: red;',
      '.foo {',
      '  color: $color;',
      '}'
    ].join('\n')

    var result = r('scss').call(ctx, { text: body }, {})
    result.should.eql(`.foo {
  color: red;
}`)
  })

  it('default: sass syntax', function () {
    var body = [
      '$color: red',
      '.foo',
      '  color: $color'
    ].join('\n')

    var result = r('sass').call(ctx, { text: body }, {})
    result.should.eql(`.foo {
  color: red;
}`);
  })

  it('outputStyle compressed: scss syntax', function () {
    ctx.theme.config = { node_sass: { outputStyle: 'compressed' } }

    var body = [
      '$color: red;',
      '.foo {',
      '  color: $color;',
      '}'
    ].join('\n')

    var result = r('scss').call(ctx, { text: body }, {})
    result.should.eql(`.foo{color:red}`);
  })

  it('outputStyle compressed: sass syntax', function () {
    ctx.theme.config = { node_sass: { outputStyle: 'compressed' } }

    var body = [
      '$color: red',
      '.foo',
      '  color: $color'
    ].join('\n')

    var result = r('sass').call(ctx, { text: body }, {})
    result.should.eql(`.foo{color:red}`)
  })

  it('supports root config: scss syntax', function () {
    ctx.config = { node_sass: { outputStyle: 'compressed' } }
    ctx.theme.config = {}

    var body = [
      '$color: red;',
      '.foo {',
      '  color: $color;',
      '}'
    ].join('\n')

    var result = r('scss').call(ctx, { text: body }, {})
    result.should.eql(`.foo{color:red}`);
  })

  it('supports root config: sass syntax', function () {
    ctx.config = { node_sass: { outputStyle: 'compressed' } }
    ctx.theme.config = {}

    var body = [
      '$color: red',
      '.foo',
      '  color: $color'
    ].join('\n')

    var result = r('sass').call(ctx, { text: body }, {})
    result.should.eql(`.foo{color:red}`);
  })

  it('throw when error occurs: scss syntax', function () {
    ctx.theme.config = { node_sass: { outputStyle: 'compressed' } }
    ctx.config = {}

    var body = [
      '.foo {',
      '  color: $color;',
      '}'
    ].join('\n')

    should.Throw(
      function () {
        return r("scss").call(ctx, { text: body }, {});
      },
      `Undefined variable.
  ╷
2 │   color: $color;
  │          ^^^^^^
  ╵
  stdin 2:10  root stylesheet`
    );
  })

  it('throw when error occurs: sass syntax', function () {
    ctx.theme.config = { node_sass: { outputStyle: 'compressed' } }
    ctx.config = {}

    var body = [
      '.foo',
      '  color: $color'
    ].join('\n')

    should.Throw(
      function () {
        return r("sass").call(ctx, { text: body }, {});
      },
      `Undefined variable.
  ╷
2 │   color: $color
  │          ^^^^^^
  ╵
  stdin 2:10  root stylesheet`
    );
  })
})
