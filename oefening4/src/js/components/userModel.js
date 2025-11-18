
class User {
    /**
     * @param {string} name
     * @param {number} age
     */
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    /**
     * Genereert een label in het formaat "Naam (X jaar)".
     * @returns {string} Het geformatteerde label.
     */
    getLabel() {
        return `${this.name} (${this.age} jaar)`;
    }
}

export default User;