'use strict';

const SRC_PATH = '../../../src';

const _ = require('lodash');

const BaseClient = require(`${SRC_PATH}/Platforms/BaseClient`);
const Fullcontact = require(`${SRC_PATH}/Platforms/Clients/Fullcontact`);
const Errors = require(`${SRC_PATH}/Platforms/Errors`);

const config = require('../../Resources/config');
const fullcontactConfig = _.find(config, { name: 'fullcontact' }).config;
const sampleMaleGender = require('../../Resources/Examples/GenderMale');
const sampleFemaleGender = require('../../Resources/Examples/GenderFemale');
const expect = require('../../Resources/chai').expect;

describe('Platforms/Fullcontact', () => {
    let fullcontactClient;

    beforeEach(() => {
        fullcontactClient = new Fullcontact(fullcontactConfig.key);
    });

    describe('constructor', () => {
        it('should extends BaseClient', () => {
            expect(fullcontactClient).to.be.an.instanceOf(BaseClient);
        });

        it('should throw error if no key', () => {
            const fn = () => new Fullcontact();
            expect(fn).to.throw(Error)
                .that.is.an.instanceOf(BaseClient.Errors.ClientIllegalArgumentError)
                .and.to.have.property('message').equals(
                    'missing or invalid config'
                );
        });

        it('should return error if key not string', () => {
            const fn = () => new Fullcontact(123);
            expect(fn).to.throw(Error)
                .that.is.an.instanceOf(BaseClient.Errors.ClientIllegalArgumentError)
                .and.to.have.property('message').equals(
                    'missing or invalid config'
                );
        });
    });

    describe('getPlatformName', () => {
        it('should return fullcontact', () => {
            expect(fullcontactClient.getPlatformName()).to.equal('fullcontact');
        });
    });

    describe('supports', () => {
        it('should return true if method is supported', () => {
            expect(fullcontactClient.supports('determineByName')).to.be.true;
        });

        it('should return false if method isn\'t supported', () => {
            expect(fullcontactClient.supports('notSupportedMethod')).to.be.false;
        });
    });

    describe('determineByName',() => {
        it('should return male',() => {
            fullcontactClient.determineByName(sampleMaleGender.name).then(gender => {
                expect(gender).to.equal(sampleMaleGender.gender);
            });
        });

        it('should return female',() => {
            fullcontactClient.determineByName(sampleFemaleGender.name).then(gender => {
                expect(gender).to.equal(sampleFemaleGender.gender);
            });
        });

        it('should return unknown', () => {
            fullcontactClient.determineByName('abdelaal').then(gender => {
                expect(gender).to.equal('unknown');
            });
        });

        it('should throw NotFound exception', () => {
            const promise = fullcontactClient.determineByName('1235') ;
            return expect(promise).to.be.eventually.rejected
                .that.is.instanceOf(Errors.NotFoundError);
        });
    });
});
