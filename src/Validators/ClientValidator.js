'use strict';

const _ = require('lodash');
const Validator = require('@crowdanalyzer/validator').RuleValidator;

const rules = {
    determineByName: [
        {
            field: 'name',
            rules: 'required|string',
        },
    ],
    supports: [
        {
            field: 'method',
            rules: 'required|string',
        },
    ],
};

class ClientValidator {

    static validate(obj, func, args) {
        if(_.isNil(rules[func])) {
            return Promise.resolve(true);
        }

        const argumentsNames = ClientValidator._getArgs(obj[func]);
        const argObj = _.zipObjectDeep(argumentsNames, args);
        const validator = new Validator(rules[func]);

        return validator.validate(argObj);
    }

    static _getArgs(func) {
        const args = func.toString().match(/\w+\(([a-zA-Z]+[a-zA-Z, ?]*)\) ?{/)[1];
        return args.split(',').map(arg => arg.trim());
    }

}

module.exports = ClientValidator;
