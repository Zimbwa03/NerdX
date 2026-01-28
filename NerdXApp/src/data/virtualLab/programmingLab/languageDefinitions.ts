// Language-specific keyword and operator definitions for syntax highlighting

import type { ProgrammingLanguage } from '../../../types/programmingLabTypes';

export interface LanguageDefinition {
    keywords: string[];
    builtins?: string[];
    types: string[];
    operators: string[];
    comments: string;
    multilineComments: string[];
}

export const LanguageDefinitions: Record<ProgrammingLanguage, LanguageDefinition> = {
    python: {
        keywords: [
            'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from',
            'try', 'except', 'finally', 'with', 'as', 'lambda', 'yield', 'async', 'await',
            'pass', 'break', 'continue', 'global', 'nonlocal',
        ],
        builtins: [
            'print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 'tuple', 'set',
            'input', 'open', 'type', 'isinstance', 'enumerate', 'zip', 'map', 'filter',
        ],
        types: ['str', 'int', 'float', 'bool', 'list', 'dict', 'tuple', 'set', 'None', 'True', 'False'],
        operators: ['+', '-', '*', '/', '//', '%', '**', '==', '!=', '<', '>', '<=', '>=', 'and', 'or', 'not', 'in', 'is'],
        comments: '#',
        multilineComments: ['"""', "'''"],
    },
    vbnet: {
        keywords: [
            'Sub', 'Function', 'If', 'Then', 'Else', 'ElseIf', 'For', 'While', 'Do', 'Loop',
            'End', 'Class', 'Public', 'Private', 'Dim', 'As', 'New', 'Return', 'Exit',
            'Module', 'Namespace', 'Imports', 'Try', 'Catch', 'Finally',
        ],
        types: ['Integer', 'String', 'Double', 'Boolean', 'Date', 'Object', 'Array', 'Decimal', 'Long', 'Short', 'Byte', 'Char'],
        operators: ['+', '-', '*', '/', '=', '<', '>', '<=', '>=', '<>', 'And', 'Or', 'Not', 'Mod', 'Like', '&'],
        comments: "'",
        multilineComments: [],
    },
    java: {
        keywords: [
            'public', 'private', 'protected', 'class', 'interface', 'extends', 'implements',
            'void', 'int', 'String', 'if', 'else', 'for', 'while', 'do', 'return', 'new',
            'static', 'final', 'abstract', 'try', 'catch', 'finally', 'throw', 'throws',
            'import', 'package',
        ],
        types: ['int', 'String', 'double', 'boolean', 'char', 'byte', 'short', 'long', 'float', 'void', 'Integer', 'Double', 'Boolean', 'Character'],
        operators: ['+', '-', '*', '/', '%', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '!', '&', '|', '^', '<<', '>>', '>>>'],
        comments: '//',
        multilineComments: ['/*', '*/'],
    },
};
