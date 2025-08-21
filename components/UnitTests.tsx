import React from 'react';
import { TestCase } from '../hooks/usePythonInterpreter';
import { TrashIcon } from './icons';

interface UnitTestsProps {
    testCases: TestCase[];
    onAdd: () => void;
    onUpdate: (id: string, field: 'input' | 'expectedOutput', value: string) => void;
    onRemove: (id: string) => void;
}

const UnitTests: React.FC<UnitTestsProps> = ({ testCases, onAdd, onUpdate, onRemove }) => {
    return (
        <div className="h-full bg-[#1e1e1e] p-4 font-mono text-sm text-gray-300 overflow-y-auto">
            <div className="space-y-4">
                {testCases.map((tc, index) => (
                    <div key={tc.id} className="bg-gray-700 p-3 rounded-lg border border-gray-600 space-y-2">
                        <div className="flex justify-between items-center">
                            <h3 className="font-sans font-bold text-gray-200">Test Case #{index + 1}</h3>
                            <button 
                                onClick={() => onRemove(tc.id)} 
                                className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full"
                                aria-label="Remove test case"
                                title="Remove test case"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <label htmlFor={`input-${tc.id}`} className="block text-xs font-sans text-gray-400 mb-1">Input (to `input()`)</label>
                                <textarea
                                    id={`input-${tc.id}`}
                                    value={tc.input}
                                    onChange={(e) => onUpdate(tc.id, 'input', e.target.value)}
                                    rows={2}
                                    className="w-full bg-gray-800 border border-gray-600 rounded p-2 font-mono text-sm text-gray-200 resize-y focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="Value passed to input()"
                                />
                            </div>
                            <div>
                                <label htmlFor={`output-${tc.id}`} className="block text-xs font-sans text-gray-400 mb-1">Expected Output (stdout)</label>
                                <textarea
                                    id={`output-${tc.id}`}
                                    value={tc.expectedOutput}
                                    onChange={(e) => onUpdate(tc.id, 'expectedOutput', e.target.value)}
                                    rows={2}
                                    className="w-full bg-gray-800 border border-gray-600 rounded p-2 font-mono text-sm text-gray-200 resize-y focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="Expected print() output"
                                />
                            </div>
                        </div>
                    </div>
                ))}
                
                {testCases.length === 0 && (
                    <div className="text-center text-gray-500 font-sans py-8">
                        <p>No unit tests yet.</p>
                        <p>Click "Add Test Case" to get started.</p>
                    </div>
                )}

                <button
                    onClick={onAdd}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 font-sans"
                >
                    Add Test Case
                </button>
            </div>
        </div>
    );
};

export default UnitTests;
