import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
// Note: Prism theme CSS (prism-okaidia.css) is loaded in index.html

interface PythonEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  isReadOnly: boolean;
}

const PythonEditor: React.FC<PythonEditorProps> = ({ code, onCodeChange, isReadOnly }) => {
  return (
    <div className="react-simple-code-editor-container rounded-lg overflow-hidden border border-gray-700 bg-[#282a36]">
      <Editor
        value={code}
        onValueChange={onCodeChange}
        highlight={code => Prism.highlight(code, Prism.languages.python, 'python')}
        padding={16}
        className="h-full w-full outline-none text-gray-200"
        textareaClassName="outline-none"
        readOnly={isReadOnly}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          caretColor: 'white',
          backgroundColor: '#282a36'
        }}
      />
    </div>
  );
};

export default PythonEditor;