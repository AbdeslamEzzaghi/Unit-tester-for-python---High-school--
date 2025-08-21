import React, { useState } from 'react';
import Header from './components/Header';
import PythonEditor from './components/Editor';
import Console from './components/Console';
import UnitTests from './components/UnitTests';
import { PlayIcon, SpinnerIcon, TrashIcon, BeakerIcon } from './components/icons';
import { usePythonInterpreter } from './hooks/usePythonInterpreter';

type Tab = 'console' | 'tests';

const App: React.FC = () => {
    const { 
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
    } = usePythonInterpreter();

    const [activeTab, setActiveTab] = useState<Tab>('console');

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
            <Header />
            <main className="flex-grow flex flex-col p-4 gap-4 overflow-hidden">
                {/* Top Part: Editor */}
                <div className="flex flex-col flex-grow min-h-0" style={{ flexBasis: '60%' }}>
                     <div className="flex justify-between items-center px-2 mb-2">
                        <h2 className="text-lg font-semibold text-gray-300">Code Editor</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => runAllTests()}
                                disabled={isLoading || isTestsLoading || testCases.length === 0}
                                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
                                title={testCases.length === 0 ? "Add at least one test case to run tests" : "Run all unit tests"}
                            >
                                {isTestsLoading ? <SpinnerIcon /> : <BeakerIcon />}
                                <span>{isTestsLoading ? 'Testing...' : 'Run Tests'}</span>
                            </button>
                            <button
                                onClick={() => executeCode()}
                                disabled={isLoading || isTestsLoading}
                                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/50"
                                title="Run the script without tests"
                            >
                                {isLoading ? <SpinnerIcon /> : <PlayIcon />}
                                <span>{isLoading ? 'Running...' : 'Run'}</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow relative">
                        <PythonEditor code={code} onCodeChange={setCode} isReadOnly={isLoading || isTestsLoading} />
                    </div>
                </div>

                {/* Bottom Part: Tabs for Console and Unit Tests */}
                <div className="flex flex-col flex-shrink-0 min-h-0" style={{ flexBasis: '40%' }}>
                    <div className="flex items-center border-b border-gray-700">
                         {/* Tabs */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab('console')}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'console' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                                aria-current={activeTab === 'console' ? 'page' : undefined}
                            >
                                Console
                            </button>
                            <button
                                onClick={() => setActiveTab('tests')}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'tests' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                                aria-current={activeTab === 'tests' ? 'page' : undefined}
                            >
                                Unit Tests
                            </button>
                        </div>
                        <div className="flex-grow"></div>
                        {/* Clear Console Button (only for console) */}
                        {activeTab === 'console' && (
                             <button
                                onClick={clearConsole}
                                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded-lg transition-colors duration-200 text-sm mr-2"
                                title="Clear Console"
                            >
                                <TrashIcon />
                                <span>Clear</span>
                            </button>
                        )}
                    </div>
                    <div className="flex-grow relative bg-gray-800 rounded-b-lg overflow-hidden">
                       <div className="absolute inset-0">
                            {activeTab === 'console' ? (
                                <Console output={output} />
                            ) : (
                                <UnitTests 
                                    testCases={testCases}
                                    onAdd={addTestCase}
                                    onUpdate={updateTestCase}
                                    onRemove={removeTestCase}
                                />
                            )}
                       </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;