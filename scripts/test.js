import Jasmine from 'jasmine';
import {JUnitXmlReporter, TapReporter} from 'jasmine-reporters';

const jasmine = new Jasmine();

jasmine.env.clearReporters();
jasmine.addReporter(new JUnitXmlReporter());
jasmine.addReporter(new TapReporter());

jasmine.loadConfigFile('test/support/jasmine.json');
jasmine.execute();
