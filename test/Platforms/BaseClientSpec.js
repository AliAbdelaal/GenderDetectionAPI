'use strict';

const SRC_PATH = '../../src';

const expect = require('../Resources/chai').expect;

const BaseClient = require(`${SRC_PATH}/Platforms/BaseClient`);

describe('Platforms/BaseClient', () => {
    let baseClient;

    before(() => {
        baseClient = new BaseClient('');
    });

    describe('constructor', () => {
        it('should be created', () => {
            expect(baseClient).to.be.an.instanceOf(BaseClient);
        });

        it('should throw an error if no config', () => {
            const fn = () => new BaseClient();
            expect(fn).to.throw(Error)
                .that.is.an.instanceOf(BaseClient.Errors.ClientIllegalArgumentError)
                .and.to.have.property('message').that.equals('missing or invalid config');
        });

        it('should throw an error if config is not a string', () => {
            const fn = () => new BaseClient(12354);
            expect(fn).to.throw(Error)
                .that.is.an.instanceOf(BaseClient.Errors.ClientIllegalArgumentError)
                .and.to.have.property('message').that.equals('missing or invalid config');
        });
    });

    describe('getPlatformName', () => {
        it('should throw method not implemented error', () => {
            const fn = () => baseClient.getPlatformName();
            expect(fn).to.throw(Error)
                .that.is.an.instanceOf(BaseClient.Errors.ClientNotImplementedMethodError)
                .and.to.have.property('message').equals(
                    'a platform client must implement a getPlatformName method'
                );
        });
    });

    describe('supports', () => {
        it('should throw method not implemented error', () => {
            const fn = () => baseClient.supports();
            expect(fn).to.throw(Error)
                .that.is.an.instanceOf(BaseClient.Errors.ClientNotImplementedMethodError)
                .and.to.have.property('message').equals(
                    'a platform client must implement a supports method'
                );
        });
    });

    describe('determineByName', () => {
        it('should throw method not supported error', () => {
            const fn = () => baseClient.determineByName()();
            expect(fn).to.throw(Error)
                .that.is.an.instanceOf(BaseClient.Errors.ClientNotImplementedMethodError)
                .and.to.have.property('message').equals(
                    'a platform client must implement a determineByName method'
                );
        });
    });
});
