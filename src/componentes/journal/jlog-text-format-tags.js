import { Box, Typography } from "@material-ui/core";

export const TextFormatTagType = Symbol();

export const JLogTextFormatTags = [
    {
        match: /^\*\*(.*?)\*\*/,
        render: (match) => <strong>{match[1]}</strong> // Bold: **text**
    },
    {
        match: /^\*(.*?)\*/,
        render: (match) => <em>{match[1]}</em> // Italic: *text*
    },
    {
        match: /^`{3}([^`]+)`{3}/,
        render: (match) => <Box><code>{match[1]}</code></Box> // Code: `code`
    },
    {
        match: /^`{1}([^`]+)`{1}/,
        render: (match) => <code>{match[1]}</code>// Code: `code`
    },
    {
        onlyStartOfLine:true,
        match: /^\s*#(.*)/,
        render: (match) => <Typography variant="h3">{match[1]}</Typography>
    }
]
.map( tag=>({...tag, block: m=>({ type: TextFormatTagType, render:()=>tag.render(m) }) }) )