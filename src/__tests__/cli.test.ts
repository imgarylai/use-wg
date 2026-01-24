import { execSync } from "child_process";
import { resolve } from "path";

const CLI_PATH = resolve(__dirname, "../../dist/cli.mjs");

function runCli(args: string): string {
  try {
    return execSync(`node ${CLI_PATH} ${args}`, {
      encoding: "utf8",
      env: { ...process.env, FORCE_COLOR: "0" },
    }).trim();
  } catch (error) {
    const execError = error as { stdout?: string; stderr?: string };
    if (execError.stdout) return execError.stdout.trim();
    throw error;
  }
}

function runCliWithStdin(input: string, args = ""): string {
  return execSync(`echo "${input}" | node ${CLI_PATH} ${args}`, {
    encoding: "utf8",
    shell: "/bin/bash",
    env: { ...process.env, FORCE_COLOR: "0" },
  }).trim();
}

describe("CLI", () => {
  describe("basic usage", () => {
    it("should convert Chinese text to Wade-Giles", () => {
      const result = runCli('"台灣"');
      expect(result).toBe("t'ai²-wan¹");
    });

    it("should convert multiple characters", () => {
      const result = runCli('"台北"');
      expect(result).toBe("t'ai²-pei³");
    });

    it("should handle 高雄", () => {
      const result = runCli('"高雄"');
      expect(result).toBe("kao¹-hsiung²");
    });
  });

  describe("--url-safe flag", () => {
    it("should produce URL-safe output", () => {
      const result = runCli('"台灣" --url-safe');
      expect(result).toBe("tai-wan");
    });

    it("should remove apostrophes in URL-safe mode", () => {
      const result = runCli('"氣功" -u');
      expect(result).toBe("chi-kung");
    });
  });

  describe("--tone flag", () => {
    it("should support number tone format", () => {
      const result = runCli('"高雄" --tone number');
      expect(result).toBe("kao1-hsiung2");
    });

    it("should support no tone format", () => {
      const result = runCli('"高雄" --tone none');
      expect(result).toBe("kao-hsiung");
    });

    it("should support superscript tone format by default", () => {
      const result = runCli('"高雄"');
      expect(result).toBe("kao¹-hsiung²");
    });
  });

  describe("--separator flag", () => {
    it("should use custom separator", () => {
      const result = runCli('"台北" --separator " "');
      expect(result).toBe("t'ai² pei³");
    });
  });

  describe("--capitalize flag", () => {
    it("should capitalize first letter", () => {
      const result = runCli('"台北" --capitalize');
      expect(result).toBe("T'ai²-pei³");
    });
  });

  describe("--json flag", () => {
    it("should output JSON with segments", () => {
      const result = runCli('"台灣" --json');
      const parsed = JSON.parse(result);
      expect(parsed.text).toBe("t'ai²-wan¹");
      expect(parsed.segments).toHaveLength(2);
      expect(parsed.segments[0].original).toBe("台");
      expect(parsed.segments[1].original).toBe("灣");
    });
  });

  describe("--pinyin flag", () => {
    it("should convert pinyin to Wade-Giles", () => {
      const result = runCli('"zhong1" --pinyin');
      expect(result).toBe("chung¹");
    });

    it("should support tone format with pinyin mode", () => {
      const result = runCli('"zhong1" --pinyin --tone number');
      expect(result).toBe("chung1");
    });
  });

  describe("stdin input", () => {
    it("should read from stdin", () => {
      const result = runCliWithStdin("台灣");
      expect(result).toBe("t'ai²-wan¹");
    });

    it("should apply options with stdin input", () => {
      const result = runCliWithStdin("台灣", "--url-safe");
      expect(result).toBe("tai-wan");
    });
  });

  describe("--version flag", () => {
    it("should display version", () => {
      const result = runCli("--version");
      expect(result).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });
});
