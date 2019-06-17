import JsonSchema from 'jsonschema'
import projectSchema from './schemas/project-schema'
import areaSchemaFactory from './schemas/area-schema'

const validator = new JsonSchema.Validator()

export default function (project) {
  validator.addSchema(areaSchema, '/area-feature')
  validator.addSchema(settingsSchema, '/settings-schema')

  return validator.validate(project, projectSchema)
}
