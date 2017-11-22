'use strict';

const SRC_PATH = '../../src';

const expect = require('../Resources/chai').expect;
const Gender = require(`${SRC_PATH}/Gender`);
const config = require('../Resources/config');

const testPromiseRejection = (promise, property, type = 'required') =>
    expect(promise).to.eventually.be.rejected
        .then(err => {
            const errorObj = {};
            errorObj[property] = [{ type }];
            expect(err).to.have.property('name').equals('ValidatorValidation');
            expect(err).to.have.property('details').that.containSubset(errorObj);
        });

describe('ClientValidator', () => {
    const proxy = new Gender(config);
    
    describe('searchByName', () => {
        it('should throw an error if name is not supplied', () =>
            testPromiseRejection(proxy.determineByName(), 'name', 'required')
        );

        it('should throw an error if name is not string', () =>
            testPromiseRejection(proxy.determineByName(['name']), 'name', 'string')
        );
    });
});
