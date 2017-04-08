var Helpers = require('../src/helpers');
var expect    = require('chai').expect;

describe('getUrlObj', function() {
  it('should return valid domain object', function() {
    var anchor = Helpers.getUrlObj('http://sathish.me/#hello');
    expect(anchor.hostname).to.equal('sathish.me');
  });
});

describe('setCookie', function() {
  it('should set valid cookie', function() {
    Helpers.setCookie('hello','world');
    expect(document.cookie).to.contain('hello=world');
  });
});

describe('getCookie', function() {
  it('should get value of a cookie by name', function() {
    // Set a cookie for testing
    Helpers.setCookie('testcookie1','testval1');
    var value = Helpers.getCookie('testcookie1');
    expect(value[0]).to.equal('testval1');
  });
});

describe('getValuesFromUrl', function() {
  it('should return valid object with key values of query string', function() {
    var path = Helpers.getValuesFromUrl('https://www.sathish.me/?id=123&key=user');
    expect(path).to.be.an('object');
    expect(path).to.eql({
      id: '123',
      key: 'user'
    });
  });
  it('should return empty object for no query string', function() {
    var path = Helpers.getValuesFromUrl('https://www.sathish.me/');
    expect(path).to.eql({});
  });
  it('should return empty object for query string with ?', function() {
    var path = Helpers.getValuesFromUrl('https://www.sathish.me/?');
    expect(path).to.eql({});
  });
});


describe('getPlainText', function() {
  before(function () {
    var div = document.createElement('DIV');
    div.appendChild(document.createTextNode('Hello world\n This is new \t'));
    div.id = 'testin';
    document.body.appendChild(div);
  });
  it('should return text value of given Dom node', function() {
    var value = Helpers.getPlainText(document.getElementById('testin'));
    expect(value).to.equal('Hello worldThis is new');
  });
});
