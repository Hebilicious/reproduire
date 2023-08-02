import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import * as core from "@actions/core"

const actionName = "reproduire" as const

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const coreLog = (message: string) => core.info(`[${actionName}] : ${message}`)

export const reproductionLabel = core.getInput("label") ?? "needs-reproduction"

export function getMessage() {
  const userPath = join(process.env.GITHUB_WORKSPACE ?? "", ".github", actionName, "needs-reproduction.md")
  const defaultPath = join(__dirname, "./messages/needs-reproductions.md")
  if (existsSync(userPath)) return readFileSync(userPath, "utf8")
  return readFileSync(defaultPath, "utf8")
}
