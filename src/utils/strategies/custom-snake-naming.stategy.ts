import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { pluralizeToSnakeCase } from '../conversions';


export class CustomSnakeNamingStrategy extends SnakeNamingStrategy {
  tableName(targetName: string, userSpecifiedName: string): string {
    return pluralizeToSnakeCase(super.tableName(targetName, userSpecifiedName));
  }
}
