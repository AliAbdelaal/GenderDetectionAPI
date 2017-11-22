'use strict';

const SRC_PATH = '../../src';
const _ = require('lodash');

const BaseClient = require(`${SRC_PATH}/Platforms/BaseClient`);
const Genderapi = require(`${SRC_PATH}/Platforms/Clients/Genderapi`);
const Fullcontact = require(`${SRC_PATH}/Platforms/Clients/Fullcontact`);
const ClientFactory = require(`${SRC_PATH}/Platforms/ClientFactory`);

const config = require('../Resources/config');
const genderapiConfig = _.find(config, { name: 'genderapi' });
const fullcontactConfig = _.find(config, { name: 'fullcontact' });

const expect = require('../Resources/chai').expect;

describe('Platforms/ClientFactory', () => {
    describe('create', () => {
        it('should return platform client (genderapi)', () => {
            const platformClient = ClientFactory.create(
                genderapiConfig.name,
                genderapiConfig.config.key
            );
            expect(platformClient).to.be.instanceOf(Genderapi);
        });

        it('should return platform client (fullcontact)', () => {
            const platformClient = ClientFactory.create(
                fullcontactConfig.name,
                fullcontactConfig.config.key
            );
            expect(platformClient).to.be.instanceOf(Fullcontact);
        });

        it('should throw illegal argument error if no client name', () => {
            const fn  = () => ClientFactory.create();
            expect(fn).to.throw(Error)
                .that.is.an.instanceOf(BaseClient.Errors.ClientIllegalArgumentError)
                .and.to.have.property('message').equals(
                    'platform name should be string'
                );
        });

        it('should throw illegal argument error if platform isn\'t supported', () => {
            const fn  = () => ClientFactory.create('notAPlatform', {});
            expect(fn).to.throw(Error)
                .that.is.an.instanceOf(BaseClient.Errors.ClientIllegalArgumentError)
                .and.to.have.property('message').equals(
                    'platform "notAPlatform" is not supported'
                );
        });
    });
});
