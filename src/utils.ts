import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { getOctokit } from "@actions/github"
import { getInput, info } from "@actions/core"

const actionName = "reproduire" as const

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const coreLog = (message: string) => info(`[${actionName}] : ${message}`)

export const reproductionLabel = getInput("label") ?? "needs-reproduction"

export function getClient() {
  const token = getInput("repo-token") ?? process.env.GITHUB_TOKEN
  return getOctokit(token).rest
}

export function getMessage() {
  const userPath = join(process.env.GITHUB_WORKSPACE ?? "", ".github", actionName, "needs-reproduction.md")
  const defaultPath = join(__dirname, "./messages/needs-reproductions.md")
  if (existsSync(userPath)) return readFileSync(userPath, "utf8")
  return readFileSync(defaultPath, "utf8")
}
