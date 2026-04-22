import * as fs from "fs/promises";
import * as path from "path";
import Ajv from "ajv";

const SCHEMA_BASE_PATH = "./schema-responses";
const ajv = new Ajv({ allErrors: true });

export async function validateSchema(
  dirName: string,
  fileName: string,
  responseBody: object,
) {
  const schemaPath = path.join(
    SCHEMA_BASE_PATH,
    dirName,
    `${fileName}_schema.json`,
  );
  const schema = await loadSchema(schemaPath);
  const validate = ajv.compile(schema);

  const valid = validate(responseBody);
  if (!valid) {
    console.log(validate.errors);
  }

  async function loadSchema(schemaPath: string) {
    try {
      const schemaContent = await fs.readFile(schemaPath, "utf-8");
      return JSON.parse(schemaContent);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(
        `Failed to load schema from ${schemaPath}: ${errorMessage}`,
      );
    }
  }
}
