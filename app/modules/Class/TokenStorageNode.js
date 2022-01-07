const $TokenStorage = get.models("TokenStorage");

class TokenStorage {

    constructor(token) {
        this.token = token;
    }


    get data() {
        return new Promise(async (resolve) => {

            const node = await $TokenStorage.findOne({
                token: this.token
            });

            return resolve(node);

        })
    }

    static async create(data) {
        const node = new $TokenStorage(data);

        await node.save()

        return node;
    }

    static async get(data) {
        const node = await $TokenStorage.findOne(data);
        return node;
    }

    static async getMany(data) {
        const nodes = await $TokenStorage.find(data);
        return nodes;
    }

    static async delete(data) {
        const node = await $TokenStorage.findOneAndDelete(data);
        return node;
    }

    static async update(find, data) {
        const node = await $TokenStorage.findOneAndUpdate(find, {
            $set: data
        });
        return node;
    }


}

module.exports = TokenStorage;