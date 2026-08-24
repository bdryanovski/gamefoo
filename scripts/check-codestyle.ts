#!/usr/bin/env tsx

/**
 * CodeStyle Compliance Checker
 *
 * Enforces CodeStyle principles that linters can't easily catch:
 * - Function length (max 70 lines)
 * - Line length (max 100 columns)
 * - Assertion density (min 2 per function)
 *
 * Usage:
 *   pnpm tsx scripts/check-codestyle.ts
 *   pnpm tsx scripts/check-codestyle.ts src/core/engine.ts
 */

import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// ─── CONFIGURATION ───────────────────────────────────────────────────────────

const MAX_LINE_LENGTH = 100;
const MAX_FUNCTION_LENGTH = 70;
const MIN_ASSERTIONS_PER_FUNCTION = 2;

// Patterns to detect function starts
const FUNCTION_PATTERNS = [
  /^\s*(public|private|protected)?\s*(static)?\s*(async)?\s*\w+\s*\([^)]*\)\s*:\s*\w+\s*{/,
  /^\s*(export\s+)?(async\s+)?function\s+\w+/,
  /^\s*const\s+\w+\s*=\s*(async\s+)?\([^)]*\)\s*=>/,
  /^\s*(get|set)\s+\w+\s*\(/,
];

// Patterns to detect assertions
const ASSERTION_PATTERNS = [
  /\bassert\s*\(/,
  /console\.assert\s*\(/,
  /if\s*\([^)]+\)\s*{\s*throw\s+/,
  /if\s*\([^)]+\)\s+throw\s+/,
];

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Violation {
  file: string;
  line: number;
  column?: number;
  rule: string;
  message: string;
  severity: 'error' | 'warning';
}

interface FunctionInfo {
  name: string;
  start_line: number;
  end_line: number;
  length: number;
  assertion_count: number;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function is_function_line(line: string): boolean {
  return FUNCTION_PATTERNS.some((pattern) => pattern.test(line));
}

function is_assertion_line(line: string): boolean {
  return ASSERTION_PATTERNS.some((pattern) => pattern.test(line));
}

function extract_function_name(line: string): string {
  // Try to extract function name from various patterns
  let match = line.match(/function\s+(\w+)/);
  if (match) return match[1];

  match = line.match(/const\s+(\w+)\s*=/);
  if (match) return match[1];

  match = line.match(/^\s*(\w+)\s*\(/);
  if (match) return match[1];

  match = line.match(/(get|set)\s+(\w+)/);
  if (match) return `${match[1]} ${match[2]}`;

  return '<anonymous>';
}

// ─── ANALYSIS ────────────────────────────────────────────────────────────────

function analyze_file(file_path: string): Violation[] {
  const violations: Violation[] = [];
  const content = readFileSync(file_path, 'utf-8');
  const lines = content.split('\n');

  // Track current function
  let current_function: FunctionInfo | null = null;
  const brace_stack: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const line_number = i + 1;

    // Check line length
    if (line.length > MAX_LINE_LENGTH) {
      violations.push({
        file: file_path,
        line: line_number,
        column: MAX_LINE_LENGTH,
        rule: 'max-line-length',
        message: `Line exceeds ${MAX_LINE_LENGTH} columns (${line.length} columns)`,
        severity: 'error',
      });
    }

    // Track braces for function boundaries
    const open_braces = (line.match(/{/g) || []).length;
    const close_braces = (line.match(/}/g) || []).length;

    // Detect function start
    if (is_function_line(line) && open_braces > 0) {
      const function_name = extract_function_name(line);
      current_function = {
        name: function_name,
        start_line: line_number,
        end_line: line_number,
        length: 1,
        assertion_count: 0,
      };
      brace_stack.push(open_braces - close_braces);
    } else if (current_function) {
      // Inside a function
      current_function.length++;
      current_function.end_line = line_number;

      // Count assertions
      if (is_assertion_line(line)) {
        current_function.assertion_count++;
      }

      // Track brace depth
      if (brace_stack.length > 0) {
        brace_stack[brace_stack.length - 1] += open_braces - close_braces;

        // Function ended
        if (brace_stack[brace_stack.length - 1] === 0) {
          brace_stack.pop();

          // Check function length
          const non_blank_length = lines
            .slice(current_function.start_line - 1, current_function.end_line)
            .filter((l) => l.trim().length > 0).length;

          if (non_blank_length > MAX_FUNCTION_LENGTH) {
            violations.push({
              file: file_path,
              line: current_function.start_line,
              rule: 'max-function-length',
              message: `Function '${current_function.name}' is ${non_blank_length} lines (max ${MAX_FUNCTION_LENGTH})`,
              severity: 'error',
            });
          }

          // Check assertion density
          if (
            current_function.assertion_count < MIN_ASSERTIONS_PER_FUNCTION &&
            non_blank_length > 10
          ) {
            violations.push({
              file: file_path,
              line: current_function.start_line,
              rule: 'min-assertions',
              message: `Function '${current_function.name}' has only ${current_function.assertion_count} assertion(s) (min ${MIN_ASSERTIONS_PER_FUNCTION})`,
              severity: 'warning',
            });
          }

          current_function = null;
        }
      }
    }
  }

  return violations;
}

function find_typescript_files(dir: string): string[] {
  const files: string[] = [];

  function walk(current_dir: string): void {
    const entries = readdirSync(current_dir);

    for (const entry of entries) {
      const full_path = join(current_dir, entry);
      const stat = statSync(full_path);

      if (stat.isDirectory()) {
        // Skip node_modules, dist, etc.
        if (!['node_modules', 'dist', '.git', 'coverage'].includes(entry)) {
          walk(full_path);
        }
      } else if (stat.isFile() && /\.tsx?$/.test(entry)) {
        files.push(full_path);
      }
    }
  }

  walk(dir);
  return files;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

function main(): void {
  const args = process.argv.slice(2);
  const target = args[0] || 'src';

  console.log('🐯 CodeStyle Compliance Checker\n');
  console.log(`Checking: ${target}\n`);

  let files: string[] = [];

  try {
    const stat = statSync(target);
    if (stat.isDirectory()) {
      files = find_typescript_files(target);
    } else if (stat.isFile()) {
      files = [target];
    }
  } catch (error) {
    console.error(`Error: Cannot access ${target}`);
    process.exit(1);
  }

  console.log(`Found ${files.length} TypeScript files\n`);

  const all_violations: Violation[] = [];

  for (const file of files) {
    const violations = analyze_file(file);
    all_violations.push(...violations);
  }

  // Group and display violations
  const errors = all_violations.filter((v) => v.severity === 'error');
  const warnings = all_violations.filter((v) => v.severity === 'warning');

  if (errors.length > 0) {
    console.log('❌ ERRORS:\n');
    for (const violation of errors) {
      const location = violation.column
        ? `${violation.file}:${violation.line}:${violation.column}`
        : `${violation.file}:${violation.line}`;
      console.log(`  ${location}`);
      console.log(`    ${violation.rule}: ${violation.message}\n`);
    }
  }

  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    for (const violation of warnings) {
      console.log(`  ${violation.file}:${violation.line}`);
      console.log(`    ${violation.rule}: ${violation.message}\n`);
    }
  }

  // Summary
  console.log('─'.repeat(80));
  console.log(
    `\n${errors.length} error(s), ${warnings.length} warning(s) found.\n`,
  );

  if (errors.length > 0) {
    console.log(
      '💡 CodeStyle principles violated. See STYLE.md for guidance.\n',
    );
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log('✅ No errors, but some warnings to address.\n');
    process.exit(0);
  } else {
    console.log('🎉 All CodeStyle checks passed!\n');
    process.exit(0);
  }
}

main();
