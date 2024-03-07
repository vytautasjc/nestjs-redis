import * as nodeConsole from 'console';

const jestConsole = console;

beforeAll(() => {
    global.console = nodeConsole;
});

afterEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    global.console = jestConsole;
});
