'use client';

interface NotesCheckProps {
  content: any;
}

export const NotesCheck = ({ content }: NotesCheckProps) => {
  return content.notes ? (
    <div className='tx-lx pointer'
    onClick={() => {
      if (content.notes) {
        navigator.clipboard.writeText(content.notes);
        alert('Copied to clipboard: \n' + content.notes);
      }
    }}
    >💬</div>
  ) : '❌';
}; 