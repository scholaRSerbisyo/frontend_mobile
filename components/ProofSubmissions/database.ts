
// Helper functions for database operations
export function escapeValue(value: any): string {
  if (value === null || value === undefined) {
    return "NULL"
  }
  if (typeof value === "number") {
    return value.toString()
  }
  if (typeof value === "boolean") {
    return value ? "1" : "0"
  }
  // Escape single quotes and wrap in quotes
  return `'${value.toString().replace(/'/g, "''")}'`
}

export function buildInsertQuery(tableName: string, data: Record<string, any>): string {
  const columns = Object.keys(data)
  const values = columns.map((col) => escapeValue(data[col]))

  return `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${values.join(", ")})`
}

export function buildUpdateQuery(tableName: string, data: Record<string, any>, whereClause: string): string {
  const setClauses = Object.entries(data)
    .map(([column, value]) => `${column} = ${escapeValue(value)}`)
    .join(", ")

  return `UPDATE ${tableName} SET ${setClauses} WHERE ${whereClause}`
}

