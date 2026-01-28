"""
Programming Lab - Secure Code Execution Service

Currently supports:
- Python execution in a constrained subprocess (timeout, basic safety checks)

The API is designed to be extended later with VB.NET and Java runners.
"""

import subprocess
import textwrap
import shlex
import tempfile
import os
from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Any


ProgrammingLanguage = str  # 'python' | 'vbnet' | 'java' (for typing hints only)


@dataclass
class TestCase:
    id: str
    name: str
    input: str
    expectedOutput: str
    explanation: Optional[str] = None


@dataclass
class TestResult:
    testCaseId: str
    passed: bool
    actual: str
    expected: str
    executionTime: int
    feedback: Optional[str] = None


@dataclass
class OutputDisplay:
    type: str  # 'text' | 'html' | 'table'
    content: str
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class ExecutionResponse:
    success: bool
    stdout: str
    stderr: str
    exitCode: int
    executionTime: int
    memoryUsed: float
    output: OutputDisplay
    errors: Optional[Dict[str, Any]] = None
    testResults: Optional[List[TestResult]] = None


class ProgrammingLabExecutionService:
    """Service responsible for executing user code safely for the Programming Lab."""

    def __init__(self) -> None:
        # In future we can inject config (timeouts, memory limits, etc.)
        self.default_timeout_seconds = 5

    # ----------------------------
    # Public API
    # ----------------------------
    def execute(
        self,
        *,
        code: str,
        language: ProgrammingLanguage,
        stdin_lines: Optional[List[str]] = None,
        timeout_seconds: Optional[int] = None,
        test_cases: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Execute code and return a serializable ExecutionResponse dict."""
        safe_lang = (language or "python").lower()
        if safe_lang not in ("python", "vbnet", "java"):
            safe_lang = "python"

        timeout = timeout_seconds or self.default_timeout_seconds

        # Basic safety checks
        self._validate_code_safety(code, safe_lang)

        if safe_lang == "python":
            resp = self._execute_python(code=code, stdin_lines=stdin_lines or [], timeout_seconds=timeout)
        else:
            # For now, VB.NET and Java are not wired on this server.
            # We return a friendly error but keep the API consistent.
            message = (
                f"{safe_lang.upper()} execution is not yet enabled on this server. "
                "For now, only Python can be executed inside the Programming Lab."
            )
            resp = ExecutionResponse(
                success=False,
                stdout="",
                stderr=message,
                exitCode=1,
                executionTime=0,
                memoryUsed=0.0,
                output=OutputDisplay(type="text", content="", metadata=None),
                errors={"runtimeError": message},
                testResults=None,
            )

        # Run simple output-based tests if requested (for now we compare full stdout)
        if test_cases and resp.stdout is not None:
            resp.testResults = self._run_test_cases(test_cases, resp.stdout)

        return self._to_dict(resp)

    # ----------------------------
    # Language-specific execution
    # ----------------------------
    def _execute_python(
        self,
        *,
        code: str,
        stdin_lines: List[str],
        timeout_seconds: int,
    ) -> ExecutionResponse:
        """
        Execute Python code using a subprocess.
        This is intentionally simple and defensive:
        - No access to the filesystem arguments
        - No shell=True
        - We write code to a temp file to get clearer tracebacks
        """
        # Wrap code in a small harness file so tracebacks are readable
        with tempfile.TemporaryDirectory() as tmpdir:
            script_path = os.path.join(tmpdir, "main.py")
            # Dedent to avoid indentation issues if code came from an indented block
            safe_code = textwrap.dedent(code)
            with open(script_path, "w", encoding="utf-8") as f:
                f.write(safe_code)

            cmd = ["python", script_path]

            try:
                completed = subprocess.run(
                    cmd,
                    input="\n".join(stdin_lines).encode("utf-8"),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    timeout=timeout_seconds,
                    check=False,
                )
                stdout = completed.stdout.decode("utf-8", errors="replace")
                stderr = completed.stderr.decode("utf-8", errors="replace")
                exit_code = int(completed.returncode or 0)
                # We don't have direct memory measurements here; keep 0.0 and extend later if needed.
                memory_used = 0.0
                execution_time_ms = 0  # subprocess.run doesn't give duration; can be added with time.monotonic

                output = self._parse_output(stdout)
                errors = self._parse_errors(stderr)

                return ExecutionResponse(
                    success=exit_code == 0,
                    stdout=stdout,
                    stderr=stderr,
                    exitCode=exit_code,
                    executionTime=execution_time_ms,
                    memoryUsed=memory_used,
                    output=output,
                    errors=errors,
                    testResults=None,
                )
            except subprocess.TimeoutExpired as e:
                stderr = f"Execution timed out after {timeout_seconds} seconds."
                return ExecutionResponse(
                    success=False,
                    stdout=e.stdout.decode("utf-8", errors="replace") if e.stdout else "",
                    stderr=stderr,
                    exitCode=1,
                    executionTime=timeout_seconds * 1000,
                    memoryUsed=0.0,
                    output=OutputDisplay(type="text", content="", metadata=None),
                    errors={"timeoutError": True, "runtimeError": stderr},
                    testResults=None,
                )

    # ----------------------------
    # Safety & parsing helpers
    # ----------------------------
    def _validate_code_safety(self, code: str, language: ProgrammingLanguage) -> None:
        """Very basic pattern-based checks to block obviously dangerous operations."""
        lang = (language or "python").lower()

        dangerous_patterns = {
            "python": [
                "import os",
                "import sys",
                "import subprocess",
                "import shutil",
                "open(",
                "exec(",
                "eval(",
                "__import__",
            ],
            "vbnet": [
                "CreateObject",
                "GetObject",
                "File.",
                "Directory.",
            ],
            "java": [
                "Runtime.getRuntime()",
                "ProcessBuilder",
                "new File(",
                "FileInputStream",
                "FileOutputStream",
                "System.exit",
            ],
        }

        for pattern in dangerous_patterns.get(lang, []):
            if pattern in code:
                raise ValueError(f"Code contains potentially dangerous operation: {pattern}")

    def _parse_errors(self, stderr: str) -> Dict[str, Any]:
        errors: Dict[str, Any] = {}
        if not stderr:
            return errors

        if "SyntaxError" in stderr or "IndentationError" in stderr:
            errors["compilationError"] = stderr
        elif "Error" in stderr or "Exception" in stderr:
            errors["runtimeError"] = stderr

        if "MemoryError" in stderr:
            errors["memoryError"] = True

        return errors

    def _parse_output(self, raw_output: str) -> OutputDisplay:
        """
        Try to infer richer output types (HTML, table-like) from plain stdout.
        For now, we treat everything as text and attach simple metadata.
        """
        if "```html" in raw_output:
            # Extract first html fence block
            start = raw_output.find("```html")
            end = raw_output.find("```", start + 7)
            if end != -1:
                html_content = raw_output[start + 7 : end].strip()
            else:
                html_content = raw_output
            return OutputDisplay(type="html", content=html_content, metadata=None)

        # Simple heuristic: if there are pipes in multiple lines, treat as table text
        lines = raw_output.splitlines()
        if len(lines) >= 2 and sum(1 for ln in lines if "|" in ln) >= 2:
            return OutputDisplay(type="table", content=raw_output, metadata=None)

        return OutputDisplay(
            type="text",
            content=raw_output,
            metadata={
                "lineCount": len(lines),
                "characterCount": len(raw_output),
            },
        )

    def _run_test_cases(self, test_cases: List[Dict[str, Any]], actual_output: str) -> List[TestResult]:
        """
        Very simple test runner: compare full stdout against expectedOutput for each test.
        Later we can evolve this to re-run the program per test case.
        """
        results: List[TestResult] = []
        actual_trimmed = (actual_output or "").strip()

        for tc in test_cases:
            expected = (tc.get("expectedOutput") or "").strip()
            passed = actual_trimmed == expected
            feedback = "✓ Test passed" if passed else f"Expected: {expected}\nActual: {actual_trimmed}"
            results.append(
                TestResult(
                    testCaseId=str(tc.get("id") or ""),
                    passed=passed,
                    actual=actual_trimmed,
                    expected=expected,
                    executionTime=0,
                    feedback=feedback,
                )
            )

        return results

    # ----------------------------
    # Serialization helper
    # ----------------------------
    def _to_dict(self, resp: ExecutionResponse) -> Dict[str, Any]:
        """Convert dataclass-based response into plain dict for JSON serialization."""
        data = asdict(resp)
        # Coerce OutputDisplay and TestResult dataclasses
        if isinstance(resp.output, OutputDisplay):
            data["output"] = asdict(resp.output)
        if resp.testResults is not None:
            data["testResults"] = [asdict(tr) for tr in resp.testResults]
        return data


# Singleton instance for import
programming_lab_execution_service = ProgrammingLabExecutionService()

