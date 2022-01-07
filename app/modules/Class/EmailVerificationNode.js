const $EmailVerification = get.models("EmailVerification");

class EmailVerificationNode {

    constructor(token) {
        this.token = token;

    }

    get data() {
        return new Promise(async (resolve) => {

            const node = await $EmailVerification.findOne({
                token: this.token
            });

            return resolve(node);

        })
    }

    static async create(data) {
        const node = new $EmailVerification(data);

        await node.save()

        return node;
    }

    static async get(data) {
        const node = await $EmailVerification.findOne(data);
        return node;
    }

    static async getMany(data) {
        const nodes = await $EmailVerification.find(data);
        return nodes;
    }

    static async getPendings(data) {
        const nodes = await EmailVerificationNode.getMany(data);
        let pendings = [];

        nodes.forEach(node => {
            if (node.status == "pending") {
                pendings.push(node);
            }
        });

        return pendings;
    }

    static async delete(data) {
        const node = await $EmailVerification.findOneAndDelete(data);
        return node;
    }

    static isExpired(node) {
        const expiresAt = node.expiresAt;

        if (expiresAt.getTime() < new Date().getTime()) {
            return true;
        }
        return false;
    }

    static async update(find, data) {
        const node = await $EmailVerification.findOneAndUpdate(find, {
            $set: data
        });
        return node;
    }

}

module.exports = EmailVerificationNode;