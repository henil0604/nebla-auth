
class EnhanceTemplate {

    constructor(template, data = {}) {
        this.templateName = template;
        this.template = EnhanceTemplate.get(template);
        this.data = data;
    }

    generate() {
        let GeneratedTemplate = this.template;

        for (let key in this.data) {
            GeneratedTemplate = GeneratedTemplate.replace(`{${key}}`, this.data[key]);
        }

        return GeneratedTemplate;

    }

    static get(template) {
        const path = $path.join($ROOT, "app", "templates", template);

        return $fs.readFileSync(path, "utf8");
    }
}

module.exports = EnhanceTemplate;