const path = require('path');

class Settings {
    constructor() {
        this.ROOT_PATH = path.join(__dirname, '..', '..');
        this.PUBLIC_PATH = path.join(this.ROOT_PATH, 'public');
        console.log(this.PUBLIC_PATH);
    }
}

module.exports = new Settings();