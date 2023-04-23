const fs = require('fs');
const path = require('path');
const { huskySHContent, preCommitContent } = require('./config');

const huskyDirName = '.husky';
const rootDirPath = path.resolve(process.cwd(), '../../', huskyDirName); // '../../' because post-install executes inside node_modules
const defaultConfigDirPath = path.join(rootDirPath, '_');

main();

async function main() {
    try {
        await deleteCurrentHuskyConfig();
        await createHuskyDirectory();
        await seedDefaultHuskyConfigs();
        await seedHooks();
    } catch (error) {
        throw Error(error);
    }
}

function deleteCurrentHuskyConfig() {
    return fs.rmSync(rootDirPath, { recursive: true, force: true });
}

function createHuskyDirectory() {
    return createDirectory(rootDirPath)
}

async function seedDefaultHuskyConfigs() {
    await createDirectory(defaultConfigDirPath);
    await createAndWriteToFile(path.join(defaultConfigDirPath, '.gitignore'), '*');
    await createAndWriteToFile(path.join(defaultConfigDirPath, 'husky.sh'), huskySHContent);
}

async function seedHooks() {
    await createAndWriteToFile(path.join(rootDirPath, 'pre-commit'), preCommitContent);
}

async function createAndWriteToFile(filePath, content) {
    if (!fs.existsSync(filePath)) {
        fs.writeFile(filePath, content, {mode: fs.constants.S_IWUSR},(err) => {
            if (err) {
                throw Error(`Failed to create file: ${err.message}`);
            }
        });
    }
}

function createDirectory(name) {
    if(!fs.existsSync(name)) {
        return fs.mkdirSync(name);
    }
}


