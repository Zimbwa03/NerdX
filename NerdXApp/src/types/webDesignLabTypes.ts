// Web Design Lab - shared types for HTML/CSS editor

export type WebLanguage = 'html';

export interface WebFileMetadata {
    templateId?: string;
    templateTitle?: string;
    board?: 'zimsec' | 'cambridge';
}

export interface WebFile {
    id: string;
    name: string;
    language: WebLanguage;
    content: string;
    lastModified: Date;
    metadata: WebFileMetadata;
}

export interface WebTemplate {
    id: string;
    title: string;
    description: string;
    language: WebLanguage;
    code: string;
    tags: string[];
    board?: 'zimsec' | 'cambridge' | 'both';
}

