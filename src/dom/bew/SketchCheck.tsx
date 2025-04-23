'use client';

interface SketchCheckProps {
  content: any;
  onClick: () => void;
}

export const SketchCheck = ({ content, onClick }: SketchCheckProps) => {
  try {
    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
    if (parsedContent.sketch) {
      return (
        <div className='tx-lx pointer'
        onClick={onClick}
        >🎨</div>
      );
    }
    if (parsedContent.target) {
      return (
        <div className='tx-lx pointer'
        onClick={onClick}
        >🖼️</div>
      );
    }
    return '❌';
  } catch (e) {
    return '❌';
  }
}; 