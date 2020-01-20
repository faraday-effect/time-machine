# Boilerplate

## Null values

By default, both columns (TypeORM) and fields (TypeGraphQL)
are **not** nullable (like properties in TypeScript)

- Columns (`@Column`) are **not** nullable
- Fields (`@Field`) are **not** nullable

Relations, however, default to being nullable.

- Relations (e.g., `@ManyToOne`) **are** nullable
