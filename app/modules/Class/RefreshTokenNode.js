const $RefreshToken = get.models("RefreshToken");

class RefreshTokenNode {

    constructor(token) {
        this.token = token;

    }

    get data() {
        return new Promise(async (resolve) => {

            const node = await $RefreshToken.findOne({
                token: this.token
            });

            return resolve(node);

        })
    }

    static async create(data) {
        const node = new $RefreshToken(data);

        await node.save()

        return node;
    }

    static async get(data) {
        const node = await $RefreshToken.findOne(data);
        return node;
    }

    static async getMany(data) {
        const nodes = await $RefreshToken.find(data);
        return nodes;
    }

    static async delete(data) {
        const node = await $RefreshToken.findOneAndDelete(data);
        return node;
    }

    static async update(find, data) {
        const node = await $RefreshToken.findOneAndUpdate(find, {
            $set: data
        });
        return node;
    }

    static isExpired(node) {
        const expiresAt = node.expiresAt;
        const now = new Date();

        if (expiresAt.getTime() > now.getTime()) {
            return false;
        };

        return true;
    }


}

module.exports = RefreshTokenNode;