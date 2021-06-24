module.exports = {
  firstName: "Martin",
  lastName: "Gonzalez",
  get fullName () {
    return `${this.firstName} ${this.lastName}`
  },
  email: "tin@devtin.io"
}
