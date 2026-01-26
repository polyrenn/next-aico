const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

function fixRefs(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return;
    }

    if (Array.isArray(obj)) {
        obj.forEach(fixRefs);
        return;
    }

    for (const key in obj) {
        if (key === '$ref') {
            obj[key] = obj[key].replace('#/definitions/', '#/components/schemas/');
        } else {
            fixRefs(obj[key]);
        }
    }
}

function getSchemas() {
    const schemaDir = path.join(__dirname, 'prisma', 'json-schema');
    const schemaFilePath = path.join(schemaDir, 'json-schema.json');
    const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf-8'));
    const definitions = schema.definitions;
    fixRefs(definitions);
    return definitions;
}

const prismaSchemas = getSchemas();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Next.js API',
      version: '1.0.0',
    },
    components: {
        schemas: prismaSchemas
    }
  },
  apis: ['./pages/api/**/*.tsx', './pages/api/**/*.ts'],
};

const openapiSpecification = swaggerJsdoc(options);

fs.writeFileSync('./openapi.yaml', yaml.dump(openapiSpecification));

console.log('OpenAPI specification generated successfully!');
