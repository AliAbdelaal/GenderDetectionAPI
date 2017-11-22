'use strict';

const SRC_PATH = '../../../src';

const _ = require('lodash');

const BaseClient = require(`${SRC_PATH}/Platforms/BaseClient`);
const Genderapi = require(`${SRC_PATH}/Platforms/Clients/Genderapi`);

const config = require('../../Resources/config');
const genderConfig = _.find(config, { name: 'genderapi' }).config;
const sampleMaleGender = require('../../Resources/Examples/GenderMale');
const sampleFemaleGender = require('../../Resources/Examples/GenderFemale');
const expect = require('../../Resources/chai').expect;

describe('Platforms/Genderapi', () => {
    let genderapiClient;

    beforeEach(() => {
        genderapiClient = new Genderapi(genderConfig.key);
    });

    describe('constructor', () => {
        it('should extends BaseClient', () => {
            expect(genderapiClient).to.be.an.instanceOf(BaseClient);
        });

        it('should throw error if no key', () => {
            const fn = () => new Genderapi();
            expect(fn).to.throw(Error)
                .that.is.an.instanceOf(BaseClient.Errors.ClientIllegalArgumentError)
                .and.to.have.property('message').equals(
                    'missing or invalid config'
                );
        });

        it('should return error if key not string', () => {
            const fn = () => new Genderapi(123);
            expect(fn).to.throw(Error)
                .that.is.an.instanceOf(BaseClient.Errors.ClientIllegalArgumentError)
                .and.to.have.property('message').equals(
                    'missing or invalid config'
                );
        });
    });

    describe('getPlatformName', () => {
        it('should return genderapi', () => {
            expect(genderapiClient.getPlatformName()).to.equal('genderapi');
        });
    });

    describe('supports', () => {
        it('should return true if method is supported', () => {
            expect(genderapiClient.supports('determineByName')).to.be.true;
        });

        it('should return false if method isn\'t supported', () => {
            expect(genderapiClient.supports('notSupportedMethod')).to.be.false;
        });
    });

    describe('determineByName',() => {
        it('should return male',() => {
            genderapiClient.determineByName(sampleMaleGender.name).then(gender => {
                expect(gender).to.equal(sampleMaleGender.gender);
            });
        });

        it('should return female',() => {
            genderapiClient.determineByName(sampleFemaleGender.name).then(gender => {
                expect(gender).to.equal(sampleFemaleGender.gender);
            });
        });

        it('should return unknown', () => {
            genderapiClient.determineByName('123456').then(gender => {
                expect(gender).to.equal('unknown');
            });
        });
    });
});
