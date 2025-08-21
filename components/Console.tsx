import React, { useEffect, useRef } from 'react';

interface ConsoleProps {
    output: string[];
}

const Console: React.FC<ConsoleProps> = ({ output }) => {
    const endOfConsoleRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        endOfConsoleRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [output]);

    const formatLine = (line: string, key: string | number) => {
        const isPrompt = line.startsWith('>>>');
        const isError = line.toLowerCase().includes('error') || line.toLowerCase().includes('traceback');
        const isPass = line.startsWith('[PASS]');
        const isFail = line.startsWith('[FAIL]');

        let className = '';
        if (isPrompt) className = 'text-gray-500';
        else if (isError || isFail) className = 'text-red-400';
        else if (isPass) className = 'text-green-400';

        return (
            <div key={key}>
                {className ? <span className={className}>{line}</span> : <span>{line}</span>}
            </div>
        );
    };

    return (
        <div className="h-full bg-[#1e1e1e] p-4 font-mono text-sm text-gray-300 overflow-y-auto">
            {output.map((line, index) => {
                // Split multi-line output (like tracebacks or test results) but keep the key stable
                const lines = line.split('\n');
                return (
                    <div key={index} className="whitespace-pre-wrap break-words">
                        {lines.map((subLine, subIndex) => formatLine(subLine, `${index}-${subIndex}`))}
                    </div>
                );
            })}
            <div ref={endOfConsoleRef} />
        </div>
    );
};

export default Console;