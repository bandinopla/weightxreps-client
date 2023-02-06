import FormatQuoteIcon from '@material-ui/icons/FormatQuote';


export default function TextQuote ({children}) { 
    
    return (<div>
                <FormatQuoteIcon/> <span className={"userText sent"}>{children}</span>
            </div>)
};

