import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Link,
  Image,
  Table,
  Code,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  EyeOff,
  Palette,
  Type,
  Minus,
  Plus,
  Trash2,
  Edit3,
  FileText,
  ExternalLink,
  Unlink,
  Settings,
  Save,
  X,
  Maximize2,
  Minimize2,
  Move,
  RotateCw,
  Download,
  Tag
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
}

interface LinkData {
  url: string;
  text: string;
  target?: string;
}

interface ImageData {
  src: string;
  alt: string;
  width: string;
  height: string;
  style: string;
}

interface MetaData {
  title: string;
  description: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter content here...",
  className = "",
  rows = 20,
  defaultMetaTitle = "SaarkariResult.com : Sarkari Result 2025",
  defaultMetaDescription = "SaarkariResult.com for Sarkari Result, Sarkari Result jobs,"
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCustomHTML, setShowCustomHTML] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showHTMLDialog, setShowHTMLDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [customHTML, setCustomHTML] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [linkData, setLinkData] = useState<LinkData>({ url: '', text: '' });
  const [imageData, setImageData] = useState<ImageData>({ 
    src: '', 
    alt: '', 
    width: '300', 
    height: '200', 
    style: 'max-width: 100%; height: auto;' 
  });
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [selectedLink, setSelectedLink] = useState<HTMLAnchorElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [selectedTable, setSelectedTable] = useState<HTMLTableElement | null>(null);
  const [tableData, setTableData] = useState({ rows: 3, cols: 3 });
  const [showAdvancedLinkDialog, setShowAdvancedLinkDialog] = useState(false);
  const [advancedLinkData, setAdvancedLinkData] = useState({
    url: '',
    text: '',
    target: '',
    rel: '',
    title: '',
    className: ''
  });
  const [showTableContextMenu, setShowTableContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedCell, setSelectedCell] = useState<HTMLTableCellElement | null>(null);
  const [showFullHTMLDialog, setShowFullHTMLDialog] = useState(false);
  const [fullHTMLContent, setFullHTMLContent] = useState('');
  const [showMetaDialog, setShowMetaDialog] = useState(false);
  const [showMetaNotification, setShowMetaNotification] = useState(false);
  const [metaData, setMetaData] = useState<MetaData>({
    title: defaultMetaTitle,
    description: defaultMetaDescription
  });
  const editorRef = useRef<HTMLDivElement>(null);
  const lastSelectionRef = useRef<Range | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  type ToolbarButton = {
    icon?: React.ComponentType<any>;
    command?: string;
    value?: string;
    customAction?: () => void;
    title?: string;
    separator?: boolean;
    dropdown?: boolean;
  };

  // Save selection before any operation
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      lastSelectionRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  // Restore selection after operation
  const restoreSelection = () => {
    if (lastSelectionRef.current && editorRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(lastSelectionRef.current);
        editorRef.current.focus();
      }
    }
  };

  const execCommand = (command: string, value?: string) => {
    saveSelection();
    document.execCommand(command, false, value);
    restoreSelection();
    handleEditorChange();
  };

  const insertHTML = (html: string) => {
    saveSelection();
    document.execCommand('insertHTML', false, html);
    restoreSelection();
    handleEditorChange();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      setIsPreview(!isPreview);
    }
  };

  const applyTextColor = () => {
    execCommand('foreColor', textColor);
    setShowColorPicker(false);
  };

  const applyBgColor = () => {
    execCommand('hiliteColor', bgColor);
    setShowColorPicker(false);
  };

  const insertTable = (rows: number, cols: number) => {
    let tableHTML = '<table class="editor-table" style="width: 100%; border-collapse: collapse; border: 2px solid #ddd; margin: 10px 0; border-radius: 4px; overflow: hidden; background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">';
    
    for (let i = 0; i < rows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < cols; j++) {
        const isHeader = i === 0;
        const tag = isHeader ? 'th' : 'td';
        const style = isHeader 
          ? 'padding: 12px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold; text-align: center; cursor: pointer;'
          : 'padding: 12px; border: 1px solid #ddd; text-align: left; cursor: pointer;';
        tableHTML += `<${tag} class="editor-cell" style="${style}" contenteditable="true" data-editable="true">${isHeader ? `Header ${j + 1}` : `Content ${j + 1}`}</${tag}>`;
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    
    insertHTML(tableHTML);
  };

  // Enhanced table functions with context menu support
  const handleTableClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    
    // Check if clicked element is a table or table cell
    const tableElement = target.closest('table');
    const cellElement = target.closest('td, th');
    
    if (tableElement) {
      setSelectedTable(tableElement as HTMLTableElement);
      setShowTableEditor(true);
    } else if (cellElement) {
      setSelectedCell(cellElement as HTMLTableCellElement);
      setContextMenuPosition({ x: event.clientX, y: event.clientY });
      setShowTableContextMenu(true);
    }
  };

  const addTableRow = () => {
    if (selectedTable) {
      const tbody = selectedTable.querySelector('tbody') || selectedTable;
        const newRow = document.createElement('tr');
      const colCount = selectedTable.rows[0]?.cells.length || 3;
        
        for (let i = 0; i < colCount; i++) {
          const cell = document.createElement('td');
        cell.style.cssText = 'padding: 12px; border: 1px solid #ddd; text-align: left;';
        cell.className = 'editor-cell';
        cell.contentEditable = 'true';
          cell.textContent = `New Content ${i + 1}`;
          newRow.appendChild(cell);
        }
        
        tbody.appendChild(newRow);
        handleEditorChange();
    }
  };

  const addTableColumn = () => {
    if (selectedTable) {
      const rows = selectedTable.rows;
        for (let i = 0; i < rows.length; i++) {
          const cell = document.createElement(i === 0 ? 'th' : 'td');
          cell.style.cssText = i === 0 
          ? 'padding: 12px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold; text-align: center;'
          : 'padding: 12px; border: 1px solid #ddd; text-align: left;';
        cell.className = 'editor-cell';
        cell.contentEditable = 'true';
          cell.textContent = i === 0 ? `Header ${rows[i].cells.length + 1}` : `Content ${rows[i].cells.length + 1}`;
          rows[i].appendChild(cell);
        }
      handleEditorChange();
    }
  };

  const deleteTableRow = () => {
    if (selectedCell) {
      const row = selectedCell.parentElement;
      if (row && row.parentElement) {
        row.remove();
        setSelectedCell(null);
        setShowTableContextMenu(false);
        handleEditorChange();
      }
    }
  };

  const deleteTableColumn = () => {
    if (selectedCell) {
      const cellIndex = Array.from(selectedCell.parentElement?.children || []).indexOf(selectedCell);
      const table = selectedCell.closest('table');
      if (table) {
        const rows = table.rows;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].cells[cellIndex]) {
            rows[i].cells[cellIndex].remove();
          }
        }
        setSelectedCell(null);
        setShowTableContextMenu(false);
        handleEditorChange();
      }
    }
  };

  const mergeCells = () => {
    if (selectedCell) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const startCell = range.startContainer.parentElement?.closest('td, th') as HTMLTableCellElement;
        const endCell = range.endContainer.parentElement?.closest('td, th') as HTMLTableCellElement;
        
        if (startCell && endCell && startCell !== endCell) {
          const startRow = (startCell.parentElement as HTMLTableRowElement)?.rowIndex || 0;
          const endRow = (endCell.parentElement as HTMLTableRowElement)?.rowIndex || 0;
          const startCol = startCell.cellIndex;
          const endCol = endCell.cellIndex;
          
          const rowspan = Math.abs(endRow - startRow) + 1;
          const colspan = Math.abs(endCol - startCol) + 1;
          
          startCell.rowSpan = rowspan;
          startCell.colSpan = colspan;
          startCell.textContent = 'Merged Content';
          
          // Remove other cells
          const table = startCell.closest('table') as HTMLTableElement;
          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              if (i === startRow && j === startCol) continue;
              const cell = table?.rows[i]?.cells[j];
              if (cell) cell.remove();
            }
          }
          
          handleEditorChange();
        }
      }
    }
  };

  const splitCell = () => {
    if (selectedCell && (selectedCell.rowSpan > 1 || selectedCell.colSpan > 1)) {
      const rowspan = selectedCell.rowSpan;
      const colspan = selectedCell.colSpan;
      const rowIndex = (selectedCell.parentElement as HTMLTableRowElement)?.rowIndex || 0;
      const colIndex = selectedCell.cellIndex;
      
      // Reset spans
      selectedCell.rowSpan = 1;
      selectedCell.colSpan = 1;
      
      // Add new cells
      const table = selectedCell.closest('table') as HTMLTableElement;
      if (table) {
        for (let i = 0; i < rowspan; i++) {
          for (let j = 0; j < colspan; j++) {
            if (i === 0 && j === 0) continue;
            const newCell = document.createElement(selectedCell.tagName.toLowerCase() as 'td' | 'th');
            newCell.style.cssText = selectedCell.style.cssText;
            newCell.className = 'editor-cell';
            newCell.contentEditable = 'true';
            newCell.textContent = `Cell ${i + 1}-${j + 1}`;
            
            if (i === 0) {
              // Insert in same row
              selectedCell.parentElement?.insertBefore(newCell, selectedCell.nextSibling);
            } else {
              // Insert in new row
              const newRow = document.createElement('tr');
              newRow.appendChild(newCell);
              table.rows[rowIndex + i]?.appendChild(newRow);
            }
          }
        }
        handleEditorChange();
      }
    }
  };



  const deleteTable = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const table = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE 
        ? (range.commonAncestorContainer as Element).closest('table')
        : (range.commonAncestorContainer.parentElement as Element)?.closest('table');
      
      if (table) {
        table.remove();
        handleEditorChange();
      }
    }
  };

  const insertCustomHTML = () => {
    if (customHTML.trim()) {
      insertHTML(customHTML);
      setCustomHTML('');
      setShowCustomHTML(false);
    }
  };

  // Enhanced image management
  const handleImageAction = () => {
    setShowImageDialog(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageData({ ...imageData, src: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const insertImage = () => {
    if (imageData.src.trim()) {
      const imageHTML = `<img src="${imageData.src}" alt="${imageData.alt}" style="${imageData.style}" width="${imageData.width}" height="${imageData.height}" class="editor-image" />`;
      insertHTML(imageHTML);
      setShowImageDialog(false);
      setImageData({ src: '', alt: '', width: '300', height: '200', style: 'max-width: 100%; height: auto;' });
    }
  };

  const handleImageClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLImageElement;
    if (target.tagName === 'IMG') {
      setSelectedImage(target);
      setImageData({
        src: target.src,
        alt: target.alt || '',
        width: target.width?.toString() || '300',
        height: target.height?.toString() || '200',
        style: target.style.cssText || 'max-width: 100%; height: auto;'
      });
      setShowImageEditor(true);
    }
  };

  const updateImage = () => {
    if (selectedImage) {
      selectedImage.src = imageData.src;
      selectedImage.alt = imageData.alt;
      selectedImage.width = parseInt(imageData.width);
      selectedImage.height = parseInt(imageData.height);
      selectedImage.style.cssText = imageData.style;
      setSelectedImage(null);
      setShowImageEditor(false);
      handleEditorChange();
    }
  };

  const deleteImage = () => {
    if (selectedImage) {
      selectedImage.remove();
      setSelectedImage(null);
      setShowImageEditor(false);
      handleEditorChange();
    }
  };

  const expandImage = () => {
    if (selectedImage) {
      if (isImageExpanded) {
        selectedImage.style.maxWidth = '100%';
        selectedImage.style.height = 'auto';
        selectedImage.style.cursor = 'pointer';
      } else {
        selectedImage.style.maxWidth = 'none';
        selectedImage.style.width = '100%';
        selectedImage.style.height = 'auto';
        selectedImage.style.cursor = 'zoom-out';
      }
      setIsImageExpanded(!isImageExpanded);
      handleEditorChange();
    }
  };

  // Enhanced link management
  const handleLinkAction = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const linkElement = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE 
        ? (range.commonAncestorContainer as Element).closest('a')
        : (range.commonAncestorContainer.parentElement as Element)?.closest('a');
      
      if (linkElement) {
        // Editing existing link
        setSelectedLink(linkElement as HTMLAnchorElement);
        setLinkData({
          url: linkElement.getAttribute('href') || '',
          text: linkElement.textContent || '',
          target: linkElement.getAttribute('target') || ''
        });
        setIsEditingLink(true);
      } else {
        // Creating new link
        setLinkData({ url: '', text: selection.toString() });
        setIsEditingLink(false);
      }
      setShowLinkDialog(true);
    }
  };

  const handleLinkSubmit = () => {
    if (linkData.url.trim()) {
      if (isEditingLink && selectedLink) {
        // Update existing link
        selectedLink.href = linkData.url;
        selectedLink.textContent = linkData.text;
        if (linkData.target) {
          selectedLink.target = linkData.target;
        }
        setSelectedLink(null);
      } else {
        // Create new link
        const linkHTML = `<a href="${linkData.url}"${linkData.target ? ` target="${linkData.target}"` : ''}>${linkData.text}</a>`;
        insertHTML(linkHTML);
      }
      setShowLinkDialog(false);
      setLinkData({ url: '', text: '' });
    }
  };

  // Enhanced link functionality with advanced options
  const handleAdvancedLinkAction = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const linkElement = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE 
        ? (range.commonAncestorContainer as Element).closest('a')
        : (range.commonAncestorContainer.parentElement as Element)?.closest('a');
      
      if (linkElement) {
        // Editing existing link
        setSelectedLink(linkElement as HTMLAnchorElement);
        setAdvancedLinkData({
          url: linkElement.getAttribute('href') || '',
          text: linkElement.textContent || '',
          target: linkElement.getAttribute('target') || '',
          rel: linkElement.getAttribute('rel') || '',
          title: linkElement.getAttribute('title') || '',
          className: linkElement.getAttribute('class') || ''
        });
        setIsEditingLink(true);
      } else {
        // Creating new link
        setAdvancedLinkData({
          url: '',
          text: selection.toString(),
          target: '',
          rel: '',
          title: '',
          className: ''
        });
        setIsEditingLink(false);
      }
      setShowAdvancedLinkDialog(true);
    }
  };

  const handleAdvancedLinkSubmit = () => {
    if (advancedLinkData.url.trim()) {
      if (isEditingLink && selectedLink) {
        // Update existing link
        selectedLink.href = advancedLinkData.url;
        selectedLink.textContent = advancedLinkData.text;
        if (advancedLinkData.target) selectedLink.target = advancedLinkData.target;
        if (advancedLinkData.rel) selectedLink.rel = advancedLinkData.rel;
        if (advancedLinkData.title) selectedLink.title = advancedLinkData.title;
        if (advancedLinkData.className) selectedLink.className = advancedLinkData.className;
        setSelectedLink(null);
      } else {
        // Create new link with advanced attributes
        let linkHTML = `<a href="${advancedLinkData.url}"`;
        if (advancedLinkData.target) linkHTML += ` target="${advancedLinkData.target}"`;
        if (advancedLinkData.rel) linkHTML += ` rel="${advancedLinkData.rel}"`;
        if (advancedLinkData.title) linkHTML += ` title="${advancedLinkData.title}"`;
        if (advancedLinkData.className) linkHTML += ` class="${advancedLinkData.className}"`;
        linkHTML += `>${advancedLinkData.text}</a>`;
        insertHTML(linkHTML);
      }
      setShowAdvancedLinkDialog(false);
      setAdvancedLinkData({ url: '', text: '', target: '', rel: '', title: '', className: '' });
    }
  };

  // Auto-format URLs to proper hyperlinks
  const formatURLs = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerHTML;
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const formattedText = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
      if (formattedText !== text) {
        editorRef.current.innerHTML = formattedText;
        handleEditorChange();
      }
    }
  };

  // Auto-format email addresses
  const formatEmails = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerHTML;
      const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
      const formattedText = text.replace(emailRegex, '<a href="mailto:$1">$1</a>');
      if (formattedText !== text) {
        editorRef.current.innerHTML = formattedText;
        handleEditorChange();
      }
    }
  };

  const removeLink = () => {
    if (selectedLink) {
      const textContent = selectedLink.textContent;
      selectedLink.replaceWith(document.createTextNode(textContent || ''));
      setSelectedLink(null);
      setShowLinkDialog(false);
      setLinkData({ url: '', text: '' });
      handleEditorChange();
    }
  };

  const openHTMLDialog = () => {
    setHtmlContent(value);
    setShowHTMLDialog(true);
  };

  const saveHTMLContent = () => {
    onChange(htmlContent);
    setShowHTMLDialog(false);
  };

  const openFullHTMLDialog = () => {
    setFullHTMLContent(value);
    setShowFullHTMLDialog(true);
  };

  const saveFullHTMLContent = () => {
    const extractedContent = extractContentFromFullHTML(fullHTMLContent);
    
    // Apply meta tags to the extracted content
    const contentWithMeta = insertMetaTags(extractedContent);
    onChange(contentWithMeta);
    setShowFullHTMLDialog(false);
    
    // Update meta data from the full HTML if present
    const extractedMeta = extractMetaTags(fullHTMLContent);
    setMetaData(extractedMeta);
    
    // Enhance tables after content is applied
    setTimeout(() => {
      enhanceExistingTables();
    }, 100);
  };

  const handleFullHTMLPaste = () => {
    // Create a temporary textarea to get clipboard content
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();
    
    // Request clipboard content
    navigator.clipboard.readText().then((clipboardText) => {
      if (clipboardText.includes('<!DOCTYPE html>') || clipboardText.includes('<html')) {
        setFullHTMLContent(clipboardText);
        setShowFullHTMLDialog(true);
      } else {
        // If not full HTML, just paste normally
        insertHTML(clipboardText);
      }
      document.body.removeChild(textarea);
    }).catch(() => {
      document.body.removeChild(textarea);
    });
  };

  // Function to insert meta tags into HTML content
  const insertMetaTags = (htmlContent: string): string => {
    // Check if it's a full HTML document
    if (htmlContent.includes('<!DOCTYPE html>') || htmlContent.includes('<html')) {
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Find or create head element
      let headElement = tempDiv.querySelector('head');
      if (!headElement) {
        headElement = document.createElement('head');
        const htmlElement = tempDiv.querySelector('html');
        if (htmlElement) {
          htmlElement.insertBefore(headElement, htmlElement.firstChild);
        }
      }
      
      // Update or create title tag
      let titleElement = headElement.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        headElement.appendChild(titleElement);
      }
      titleElement.textContent = metaData.title;
      
      // Update or create meta description
      let metaDescription = headElement.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        headElement.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', metaData.description);
      
      return tempDiv.innerHTML;
    }
    
    // If not a full HTML document, wrap it with meta tags
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metaData.title}</title>
    <meta name="description" content="${metaData.description}" />
</head>
<body>
    ${htmlContent}
</body>
</html>`;
  };

  // Function to extract meta tags from HTML content
  const extractMetaTags = (htmlContent: string): MetaData => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const titleElement = tempDiv.querySelector('title');
    const metaDescription = tempDiv.querySelector('meta[name="description"]');
    
    return {
      title: titleElement?.textContent || defaultMetaTitle,
      description: metaDescription?.getAttribute('content') || defaultMetaDescription
    };
  };

  const handleMetaSubmit = () => {
    // Apply meta tags to current content
    const contentWithMeta = insertMetaTags(value);
    onChange(contentWithMeta);
    setShowMetaDialog(false);
  };

  // Function to apply default meta tags to content
  const applyDefaultMetaTags = () => {
    // Reset meta data to defaults
    setMetaData({
      title: defaultMetaTitle,
      description: defaultMetaDescription
    });
    
    // Apply meta tags to current content
    const contentWithMeta = insertMetaTags(value);
    onChange(contentWithMeta);
    
    // Show notification
    setShowMetaNotification(true);
    setTimeout(() => setShowMetaNotification(false), 3000);
  };

  // Function to generate complete HTML document
  const generateCompleteHTML = () => {
    const completeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metaData.title}</title>
    <meta name="description" content="${metaData.description}" />
    <meta name="keywords" content="Sarkari Result, Sarkari Results, Government Jobs, Sarkari Naukri, Sarkari Result 2025" />
    <meta name="author" content="SaarkariResult.com" />
    <meta name="robots" content="index, follow" />
    <meta property="og:title" content="${metaData.title}" />
    <meta property="og:description" content="${metaData.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://saarkariresult.com" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${metaData.title}" />
    <meta name="twitter:description" content="${metaData.description}" />
</head>
<body>
    ${value}
</body>
</html>`;
    
    // Create a blob and download the complete HTML
    const blob = new Blob([completeHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sarkari-result-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toolbarButtons: ToolbarButton[] = [
    { icon: Bold, command: 'bold', title: 'Bold (Ctrl+B)' },
    { icon: Italic, command: 'italic', title: 'Italic (Ctrl+I)' },
    { icon: Underline, command: 'underline', title: 'Underline (Ctrl+U)' },
    { separator: true },
    { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Heading 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Heading 2' },
    { icon: Heading3, command: 'formatBlock', value: 'h3', title: 'Heading 3' },
    { separator: true },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    { separator: true },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { separator: true },
    { icon: Palette, customAction: () => setShowColorPicker(!showColorPicker), title: 'Text Color' },
    { icon: Type, customAction: () => setShowColorPicker(!showColorPicker), title: 'Background Color' },
    { separator: true },
    { icon: Table, customAction: () => setShowTableDialog(true), title: 'Insert Table' },
    { icon: Plus, customAction: addTableRow, title: 'Add Table Row' },
    { icon: Edit3, customAction: addTableColumn, title: 'Add Table Column' },
    { icon: Trash2, customAction: deleteTable, title: 'Delete Table' },
    { separator: true },
    { icon: Image, customAction: handleImageAction, title: 'Insert Image' },
    { icon: Link, customAction: handleAdvancedLinkAction, title: 'Advanced Link' },
    { icon: ExternalLink, customAction: formatURLs, title: 'Auto-format URLs' },
    { icon: Unlink, customAction: () => execCommand('unlink'), title: 'Remove Link' },
    { separator: true },
    { icon: Quote, customAction: () => insertHTML('<blockquote style="border-left: 4px solid #ccc; padding-left: 15px; margin: 15px 0; font-style: italic;">Quote text here...</blockquote>'), title: 'Insert Quote' },
    { icon: Code, customAction: () => insertHTML('<code style="background: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: monospace;">Code here...</code>'), title: 'Insert Code' },
    { separator: true },
    { icon: FileText, customAction: () => setShowCustomHTML(!showCustomHTML), title: 'Insert Custom HTML' },
    { icon: Settings, customAction: openHTMLDialog, title: 'Edit Full HTML' },
    { icon: Download, customAction: openFullHTMLDialog, title: 'Handle Full HTML Document' },
    { icon: ExternalLink, customAction: handleFullHTMLPaste, title: 'Paste Full HTML Document' },
    { separator: true },
    { icon: Tag, customAction: () => setShowMetaDialog(true), title: 'Manage Meta Tags' },
    { icon: Save, customAction: applyDefaultMetaTags, title: 'Apply Default Meta Tags' },
    { icon: Download, customAction: generateCompleteHTML, title: 'Download Complete HTML with Meta Tags' },
  ];

  const handleEditorChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Function to extract content from full HTML documents
  const extractContentFromFullHTML = (htmlContent: string): string => {
    // Check if it's a full HTML document
    if (htmlContent.includes('<!DOCTYPE html>') || htmlContent.includes('<html')) {
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Extract content from body
      const bodyContent = tempDiv.querySelector('body');
      if (bodyContent) {
        return bodyContent.innerHTML;
      } else {
        // If no body tag, try to extract content after head
        const headEnd = htmlContent.indexOf('</head>');
        if (headEnd !== -1) {
          const bodyStart = htmlContent.indexOf('<body');
          if (bodyStart !== -1) {
            const bodyEnd = htmlContent.indexOf('</body>');
            if (bodyEnd !== -1) {
              return htmlContent.substring(bodyStart + 6, bodyEnd);
            }
          } else {
            // No body tag, extract everything after head
            return htmlContent.substring(headEnd + 7);
          }
        }
      }
    }
    
    // Return original content if not a full HTML document
    return htmlContent;
  };

  // Function to enhance existing tables for better editing
  const enhanceExistingTables = () => {
    if (!editorRef.current) return;
    
    const tables = editorRef.current.querySelectorAll('table');
    tables.forEach((table) => {
      const tableElement = table as HTMLTableElement;
      
      // Add editor-table class if not present
      if (!tableElement.classList.contains('editor-table')) {
        tableElement.classList.add('editor-table');
      }
      
      // Enhance table styling with better visibility
      tableElement.style.cssText += '; width: 100%; border-collapse: collapse; border: 3px solid #2563eb; margin: 15px 0; border-radius: 8px; overflow: hidden; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;';
      
      // Add table indicator
      if (!tableElement.querySelector('.table-indicator')) {
        const indicator = document.createElement('div');
        indicator.className = 'table-indicator';
        indicator.style.cssText = 'position: absolute; top: -8px; left: 10px; background: #2563eb; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; z-index: 10;';
        indicator.textContent = '📊 TABLE - Click to Edit';
        tableElement.style.position = 'relative';
        tableElement.appendChild(indicator);
      }
      
      // Enhance all cells
      const cells = tableElement.querySelectorAll('td, th');
      cells.forEach((cell) => {
        const cellElement = cell as HTMLTableCellElement;
        
        // Add editor-cell class if not present
        if (!cellElement.classList.contains('editor-cell')) {
          cellElement.classList.add('editor-cell');
        }
        
        // Make cells contenteditable
        cellElement.setAttribute('contenteditable', 'true');
        cellElement.setAttribute('data-editable', 'true');
        
        // Add cursor pointer and hover effect
        cellElement.style.cursor = 'pointer';
        cellElement.style.transition = 'background-color 0.2s ease';
        
        // Add hover effect
        cellElement.addEventListener('mouseenter', () => {
          cellElement.style.backgroundColor = cellElement.tagName === 'TH' ? '#e0e7ff' : '#f8fafc';
        });
        
        cellElement.addEventListener('mouseleave', () => {
          cellElement.style.backgroundColor = cellElement.tagName === 'TH' ? '#f8f9fa' : 'white';
        });
        
        // Enhance cell styling
        const isHeader = cellElement.tagName === 'TH';
        const baseStyle = isHeader 
          ? 'padding: 12px; border: 1px solid #ddd; background-color: #f8f9fa; font-weight: bold; text-align: center;'
          : 'padding: 12px; border: 1px solid #ddd; text-align: left;';
        
        cellElement.style.cssText = baseStyle + '; cursor: pointer; transition: background-color 0.2s ease;';
      });
    });
  };

  const handleButtonClick = (button: any) => {
    if (button.customAction) {
      button.customAction();
    } else if (button.command) {
      execCommand(button.command, button.value);
    }
  };

  const toggleToolbar = () => {
    setShowToolbar(!showToolbar);
  };

  // Fix cursor position issue by using a different approach
  useEffect(() => {
    if (editorRef.current && !isPreview) {
      // Handle full HTML documents by extracting body content
      let contentToSet = value;
      
      // Check if it's a full HTML document
      if (value.includes('<!DOCTYPE html>') || value.includes('<html')) {
        // Extract meta tags from the full HTML
        const extractedMeta = extractMetaTags(value);
        setMetaData(extractedMeta);
        
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = value;
        
        // Extract content from body
        const bodyContent = tempDiv.querySelector('body');
        if (bodyContent) {
          contentToSet = bodyContent.innerHTML;
        } else {
          // If no body tag, try to extract content after head
          const headEnd = value.indexOf('</head>');
          if (headEnd !== -1) {
            const bodyStart = value.indexOf('<body');
            if (bodyStart !== -1) {
              const bodyEnd = value.indexOf('</body>');
              if (bodyEnd !== -1) {
                contentToSet = value.substring(bodyStart + 6, bodyEnd);
              }
            } else {
              // No body tag, extract everything after head
              contentToSet = value.substring(headEnd + 7);
            }
          }
        }
      }
      
      // Only update innerHTML if it's different to prevent cursor jumping
      if (editorRef.current.innerHTML !== contentToSet) {
        editorRef.current.innerHTML = contentToSet;
        
        // Enhance existing tables after content is loaded
        setTimeout(() => {
          enhanceExistingTables();
        }, 100);
      }
    }
  }, [value, isPreview]);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowTableContextMenu(false);
    };

    if (showTableContextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showTableContextMenu]);

  // Initialize with default meta tags if content is empty
  useEffect(() => {
    // Always set default meta tags on component mount
    setMetaData({
      title: defaultMetaTitle,
      description: defaultMetaDescription
    });
    
    // If content is empty, apply default meta tags
    if (!value || value.trim() === '') {
      const contentWithMeta = insertMetaTags('');
      onChange(contentWithMeta);
    }
  }, []); // Only run once on component mount

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden w-full max-w-6xl shadow-sm ${className}`} style={{ minHeight: '600px' }}>
      {/* Meta Tags Notification */}
      {showMetaNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>Default meta tags applied successfully!</span>
          </div>
        </div>
      )}
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {showToolbar && (
              <>
                {toolbarButtons.map((button, index) => (
                  <React.Fragment key={index}>
                    {button.separator ? (
                      <div className="w-px h-6 bg-gray-300 mx-1" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleButtonClick(button)}
                        title={button.title}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
                      >
                        {button.icon && <button.icon className="w-4 h-4" />}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={applyDefaultMetaTags}
              className="p-2 bg-purple-600 text-white hover:bg-purple-700 rounded transition-colors"
              title="Apply Default Meta Tags"
            >
              <Tag className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleToolbar}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Toggle Toolbar"
            >
              {showToolbar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className={`p-2 rounded transition-colors ${
                isPreview 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Toggle Preview (Ctrl+Enter)"
            >
              {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Color Picker */}
        {showColorPicker && (
          <div className="mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-8 border border-gray-300 rounded"
                  />
                  <button
                    onClick={applyTextColor}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-8 border border-gray-300 rounded"
                  />
                  <button
                    onClick={applyBgColor}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowColorPicker(false)}
              className="mt-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        )}

        {/* Custom HTML Input */}
        {showCustomHTML && (
          <div className="mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom HTML Code</label>
            <textarea
              value={customHTML}
              onChange={(e) => setCustomHTML(e.target.value)}
              placeholder="Enter your custom HTML code here..."
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={insertCustomHTML}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
              >
                Insert HTML
              </button>
              <button
                onClick={() => setShowCustomHTML(false)}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Image Dialog */}
        {showImageDialog && (
          <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Insert Image</h3>
              <button
                onClick={() => setShowImageDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageData.src}
                  onChange={(e) => setImageData({ ...imageData, src: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={imageData.alt}
                  onChange={(e) => setImageData({ ...imageData, alt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Image description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={imageData.width}
                    onChange={(e) => setImageData({ ...imageData, width: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={imageData.height}
                    onChange={(e) => setImageData({ ...imageData, height: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="200"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Style</label>
                <input
                  type="text"
                  value={imageData.style}
                  onChange={(e) => setImageData({ ...imageData, style: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="max-width: 100%; height: auto;"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={insertImage}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  disabled={!imageData.src.trim()}
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  Insert Image
                </button>
                <button
                  onClick={() => setShowImageDialog(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Editor Dialog */}
        {showImageEditor && (
          <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Edit Image</h3>
              <button
                onClick={() => setShowImageEditor(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageData.src}
                  onChange={(e) => setImageData({ ...imageData, src: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={imageData.alt}
                  onChange={(e) => setImageData({ ...imageData, alt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={imageData.width}
                    onChange={(e) => setImageData({ ...imageData, width: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={imageData.height}
                    onChange={(e) => setImageData({ ...imageData, height: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Style</label>
                <input
                  type="text"
                  value={imageData.style}
                  onChange={(e) => setImageData({ ...imageData, style: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={updateImage}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  Update Image
                </button>
                <button
                  onClick={expandImage}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  {isImageExpanded ? <Minimize2 className="w-4 h-4 mr-2 inline" /> : <Maximize2 className="w-4 h-4 mr-2 inline" />}
                  {isImageExpanded ? 'Minimize' : 'Expand'}
                </button>
                <button
                  onClick={deleteImage}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2 inline" />
                  Delete Image
                </button>
                <button
                  onClick={() => setShowImageEditor(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Link Dialog */}
        {showLinkDialog && (
          <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditingLink ? 'Edit Link' : 'Insert Link'}
              </h3>
              <button
                onClick={() => setShowLinkDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
                <input
                  type="text"
                  value={linkData.text}
                  onChange={(e) => setLinkData({ ...linkData, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Link text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={linkData.url}
                  onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                <select
                  value={linkData.target || ''}
                  onChange={(e) => setLinkData({ ...linkData, target: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Same window</option>
                  <option value="_blank">New window</option>
                  <option value="_parent">Parent frame</option>
                  <option value="_top">Top frame</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleLinkSubmit}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  disabled={!linkData.url.trim()}
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  {isEditingLink ? 'Update Link' : 'Insert Link'}
                </button>
                {isEditingLink && (
                  <button
                    onClick={removeLink}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                  >
                    <Unlink className="w-4 h-4 mr-2 inline" />
                    Remove Link
                  </button>
                )}
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full HTML Editor Dialog */}
        {showHTMLDialog && (
          <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Edit Full HTML</h3>
              <button
                onClick={() => setShowHTMLDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HTML Content</label>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Enter your HTML content here..."
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={saveHTMLContent}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  Save HTML
                </button>
                <button
                  onClick={() => setShowHTMLDialog(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full HTML Document Handler Dialog */}
        {showFullHTMLDialog && (
          <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg max-w-4xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Handle Full HTML Document</h3>
              <button
                onClick={() => setShowFullHTMLDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This tool extracts content from full HTML documents (with DOCTYPE, html, head, body tags) 
                  and converts them to editor-friendly content. Tables and other elements will be properly recognized.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full HTML Document</label>
                <textarea
                  value={fullHTMLContent}
                  onChange={(e) => setFullHTMLContent(e.target.value)}
                  className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Paste your full HTML document here (with DOCTYPE, html, head, body tags)..."
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={saveFullHTMLContent}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  Extract & Apply Content
                </button>
                <button
                  onClick={() => setShowFullHTMLDialog(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table Dialog */}
        {showTableDialog && (
          <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Insert Table</h3>
              <button
                onClick={() => setShowTableDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
                  <input
                    type="number"
                    value={tableData.rows}
                    onChange={(e) => setTableData({ ...tableData, rows: parseInt(e.target.value) || 3 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
                  <input
                    type="number"
                    value={tableData.cols}
                    onChange={(e) => setTableData({ ...tableData, cols: parseInt(e.target.value) || 3 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="20"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    insertTable(tableData.rows, tableData.cols);
                    setShowTableDialog(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  Insert Table
                </button>
                <button
                  onClick={() => setShowTableDialog(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table Editor Dialog */}
        {showTableEditor && (
          <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Table Editor</h3>
              <button
                onClick={() => setShowTableEditor(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={addTableRow}
                  className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Add Row
                </button>
                <button
                  onClick={addTableColumn}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  <Edit3 className="w-4 h-4 mr-2 inline" />
                  Add Column
                </button>
                <button
                  onClick={deleteTable}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2 inline" />
                  Delete Table
                </button>
                <button
                  onClick={() => setShowTableEditor(false)}
                  className="px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Link Dialog */}
        {showAdvancedLinkDialog && (
          <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditingLink ? 'Edit Advanced Link' : 'Insert Advanced Link'}
              </h3>
              <button
                onClick={() => setShowAdvancedLinkDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
                <input
                  type="text"
                  value={advancedLinkData.text}
                  onChange={(e) => setAdvancedLinkData({ ...advancedLinkData, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Link text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={advancedLinkData.url}
                  onChange={(e) => setAdvancedLinkData({ ...advancedLinkData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                  <select
                    value={advancedLinkData.target}
                    onChange={(e) => setAdvancedLinkData({ ...advancedLinkData, target: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Same window</option>
                    <option value="_blank">New window</option>
                    <option value="_parent">Parent frame</option>
                    <option value="_top">Top frame</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rel</label>
                  <select
                    value={advancedLinkData.rel}
                    onChange={(e) => setAdvancedLinkData({ ...advancedLinkData, rel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">None</option>
                    <option value="noopener noreferrer">No opener noreferrer</option>
                    <option value="nofollow">No follow</option>
                    <option value="noopener">No opener</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (Tooltip)</label>
                <input
                  type="text"
                  value={advancedLinkData.title}
                  onChange={(e) => setAdvancedLinkData({ ...advancedLinkData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Link tooltip"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CSS Class</label>
                <input
                  type="text"
                  value={advancedLinkData.className}
                  onChange={(e) => setAdvancedLinkData({ ...advancedLinkData, className: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="custom-link-class"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleAdvancedLinkSubmit}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  disabled={!advancedLinkData.url.trim()}
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  {isEditingLink ? 'Update Link' : 'Insert Link'}
                </button>
                {isEditingLink && (
                  <button
                    onClick={removeLink}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                  >
                    <Unlink className="w-4 h-4 mr-2 inline" />
                    Remove Link
                  </button>
                )}
                <button
                  onClick={() => setShowAdvancedLinkDialog(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Meta Tags Dialog */}
        {showMetaDialog && (
          <div className="mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg max-w-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">Manage Meta Tags</h3>
              <button
                onClick={() => setShowMetaDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Default Meta Tags Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-700 mb-2">Default Meta Tags for Sarkari Result:</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong>Default Title:</strong> 
                    <div className="text-blue-600 truncate">{defaultMetaTitle}</div>
                  </div>
                  <div>
                    <strong>Default Description:</strong> 
                    <div className="text-blue-600 line-clamp-2">{defaultMetaDescription}</div>
                  </div>
                </div>
              </div>
              
              {/* Meta Tags Preview */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Meta Tags Preview:</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong>Title:</strong> 
                    <div className="text-blue-600 truncate">{metaData.title}</div>
                  </div>
                  <div>
                    <strong>Description:</strong> 
                    <div className="text-gray-600 line-clamp-2">{metaData.description}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={metaData.title}
                  onChange={(e) => setMetaData({ ...metaData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter meta title for SEO"
                  maxLength={60}
                />
                <div className="text-xs text-gray-500 mt-1">{metaData.title.length}/60 characters</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={metaData.description}
                  onChange={(e) => setMetaData({ ...metaData, description: e.target.value })}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter meta description for SEO"
                  maxLength={160}
                />
                <div className="text-xs text-gray-500 mt-1">{metaData.description.length}/160 characters</div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleMetaSubmit}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  Apply Meta Tags
                </button>
                <button
                  onClick={() => {
                    setMetaData({
                      title: defaultMetaTitle,
                      description: defaultMetaDescription
                    });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  <RotateCw className="w-4 h-4 mr-2 inline" />
                  Reset to Default
                </button>
                <button
                  onClick={applyDefaultMetaTags}
                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  Force Apply Defaults
                </button>
                <button
                  onClick={() => setShowMetaDialog(false)}
                  className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table Context Menu */}
        {showTableContextMenu && (
          <div 
            className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-lg py-2"
            style={{ 
              left: contextMenuPosition.x, 
              top: contextMenuPosition.y 
            }}
          >
            <button
              onClick={() => {
                deleteTableRow();
                setShowTableContextMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Row
            </button>
            <button
              onClick={() => {
                deleteTableColumn();
                setShowTableContextMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Delete Column
            </button>
            <button
              onClick={() => {
                mergeCells();
                setShowTableContextMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
            >
              <Move className="w-4 h-4 mr-2" />
              Merge Cells
            </button>
            <button
              onClick={() => {
                splitCell();
                setShowTableContextMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Split Cell
            </button>
          </div>
        )}
      </div>

      {/* Editor/Preview Area */}
      <div className="relative bg-white">
        {isPreview ? (
          <div className="p-6 bg-white min-h-[400px]">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorChange}
            onKeyDown={handleKeyDown}
            onClick={(e) => {
              handleImageClick(e);
              handleTableClick(e);
            }}
            className="p-4 min-h-[400px] focus:outline-none"
            style={{ minHeight: `${rows * 1.5}rem` }}
            data-placeholder={placeholder}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-500">
        {isPreview ? (
          <span>Preview Mode - Press Ctrl+Enter to edit</span>
        ) : (
          <div className="flex justify-between items-center">
            <span>Edit Mode - Press Ctrl+Enter for preview | Advanced Features: Tables, Links, Images, Meta Tags</span>
            <div className="flex items-center gap-4">
              <span className="text-blue-600">
                <strong>Meta:</strong> {metaData.title.substring(0, 30)}...
              </span>
              <span className="text-green-600">
                <strong>Desc:</strong> {metaData.description.substring(0, 40)}...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor; 