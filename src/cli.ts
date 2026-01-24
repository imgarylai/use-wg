#!/usr/bin/env node
/* eslint-disable no-console */
import { Command } from "commander";
import { toWadeGiles, pinyinToWadeGiles } from "./converter.js";
import type { ToneFormat } from "./types.js";

const program = new Command();

program
  .name("use-wg")
  .description("Convert Chinese characters to Wade-Giles romanization")
  .version("1.0.1")
  .argument("[text]", "Chinese text to convert")
  .option("-u, --url-safe", "Produce URL-safe ASCII output", false)
  .option(
    "-t, --tone <format>",
    "Tone format: superscript, number, or none",
    "superscript",
  )
  .option("-s, --separator <sep>", "Separator between syllables", "-")
  .option("-c, --capitalize", "Capitalize first letter", false)
  .option("-j, --json", "Output JSON with segments", false)
  .option("-p, --pinyin", "Convert pinyin to Wade-Giles instead", false)
  .action(async (text: string | undefined, options) => {
    const inputText = text ?? (await readStdin());

    if (!inputText) {
      program.help();
      return;
    }

    const toneFormat = options.tone as ToneFormat;

    if (options.pinyin) {
      const result = pinyinToWadeGiles(inputText, { toneFormat });
      console.log(result);
      return;
    }

    const result = toWadeGiles(inputText, {
      urlSafe: options.urlSafe,
      toneFormat,
      separator: options.separator,
      capitalize: options.capitalize,
    });

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(result.text);
    }
  });

async function readStdin(): Promise<string> {
  const stdin = process.stdin;

  if (stdin.isTTY) {
    return "";
  }

  return new Promise((resolve) => {
    let data = "";
    stdin.setEncoding("utf8");
    stdin.on("data", (chunk) => {
      data += chunk;
    });
    stdin.on("end", () => {
      resolve(data.trim());
    });
  });
}

program.parse();
