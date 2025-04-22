'use client';

interface SketchCheckProps {
  content: any;
  onClick: () => void;
}

export const SketchCheck = ({ content, onClick }: SketchCheckProps) => {
  try {
    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
    return parsedContent.sketch ? (
      <div className='tx-lx pointer'
      onClick={onClick}
      >🎨</div>
    ) : '❌';
  } catch (e) {
    return '❌';
  }
}; 