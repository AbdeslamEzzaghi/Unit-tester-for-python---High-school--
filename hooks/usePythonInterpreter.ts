import { useState, useCallback } from 'react';
import { runPythonCode, runPythonCodeWithTests, TestCase as ITestCase, TestResult } from '../services/geminiService';

const defaultCode = `# A simple script that doubles the input number or string
# Try testing it with an input of '5' (expected '10')
# and an input of 'abc' (expected 'abcabc')
try:
    line = input()
    try:
        # Try to treat it as a number
        num = int(line)
        print(num * 2)
    except ValueError:
        # If it's not a number, treat it as a string
        print(line * 2)
except EOFError:
    print("No input provided.")
`;

export interface TestCase extends ITestCase {}

export const usePythonInterpreter = () => {
    const [code, setCode] = useState<string>(defaultCode);
    const [output, setOutput] = useState<string[]>(['Welcome to the Python IDE! Click "Run" to execute the code or add tests in the "Unit Tests" tab.']);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isTestsLoading, setIsTestsLoading] = useState<boolean>(false);
    const [testCases, setTestCases] = useState<TestCase[]>([]);

    const executeCode = useCallback(async () => {
        if (!code.trim()) {
            setOutput(prev => [...prev, '>>>', '(No code to execute)']);
            return;
        }
        setIsLoading(true);
        setOutput(prev => [...prev, `>>> Running...`]);
        try {
            const result = await runPythonCode(code);
            setOutput(prev => [...prev, result || '(No output)']);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setOutput(prev => [...prev, `Error: ${errorMessage}`]);
        } finally {
            setIsLoading(false);
        }
    }, [code]);

    const runAllTests = useCallback(async () => {
        if (testCases.length === 0) return;
        
        setIsTestsLoading(true);
        const startMessage = `>>> Running ${testCases.length} test case(s)...`;
        setOutput(prev => [...prev, startMessage]);
        
        try {
            const testsToRun = testCases.map(({ input, expectedOutput }) => ({ input, expectedOutput }));
            const results = await runPythonCodeWithTests(code, testsToRun);

            const resultLines = results.map((result, index) => {
                const status = result.passed ? '[PASS]' : '[FAIL]';
                return `${status} Test ${index + 1}: input="${result.input}"\n  Expected: "${result.expected}"\n  Actual:   "${result.actual}"`;
            });

            const summaryPassed = results.filter(r => r.passed).length;
            const summaryFailed = results.length - summaryPassed;
            const summaryMessage = `>>> Test run finished: ${summaryPassed} passed, ${summaryFailed} failed.`;

            setOutput(prev => [...prev, ...resultLines, summaryMessage]);

        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during testing.';
             setOutput(prev => [...prev, `Error: ${errorMessage}`]);
        } finally {
            setIsTestsLoading(false);
        }
    }, [code, testCases]);

    const clearConsole = useCallback(() => {
        setOutput(['Console cleared.']);
    }, []);

    const addTestCase = useCallback(() => {
        setTestCases(prev => [...prev, { id: Date.now().toString(), input: '', expectedOutput: '' }]);
    }, []);

    const updateTestCase = useCallback((id: string, field: 'input' | 'expectedOutput', value: string) => {
        setTestCases(prev => prev.map(tc => tc.id === id ? { ...tc, [field]: value } : tc));
    }, []);

    const removeTestCase = useCallback((id: string) => {
        setTestCases(prev => prev.filter(tc => tc.id !== id));
    }, []);

    return {
        code,
        setCode,
        output,
        isLoading,
        isTestsLoading,
        executeCode,
        clearConsole,
        testCases,
        addTestCase,
        updateTestCase,
        removeTestCase,
        runAllTests,
    };
};